from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo electrónico debe ser proporcionado')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(correo, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    fullName = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['fullName']

    def __str__(self):
        return self.fullName

    def get_full_name(self):
        return self.fullName

    def get_short_name(self):
        return self.fullName

class Cliente(models.Model):
    nombre_cliente = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre_cliente


class EstadoCalibracion(models.Model):
    nombre_estado = models.CharField(max_length=50, unique=True)
    orden = models.IntegerField(unique=True)
    descripcion = models.TextField(blank=True)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.nombre_estado


class Equipo(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    nombre_equipo = models.CharField(max_length=50)
    numero_serie = models.CharField(max_length=50, unique=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    consecutivo = models.CharField(max_length=20, unique=True)
    accesorios = models.TextField(null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)
    fecha_entrada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre_equipo} ({self.numero_serie})"

    @property
    def estado_actual(self):
        ultimo_historial = self.historialequipo_set.order_by('-fecha_cambio').first()
        return ultimo_historial.estado if ultimo_historial else None

    def cambiar_estado(self, nuevo_estado, usuario, observaciones=''):
        if self.estado_actual == nuevo_estado:
            return False
        HistorialEquipo.objects.create(
            equipo=self,
            estado=nuevo_estado,
            responsable=usuario,
            observaciones=observaciones
        )
        return True

    def save(self, *args, **kwargs):
        is_new = not self.pk
        super().save(*args, **kwargs)
        if is_new:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            estado_ingreso = EstadoCalibracion.objects.get(orden=1)
            admin_user = User.objects.filter(is_superuser=True).first()
            HistorialEquipo.objects.create(
                equipo=self,
                estado=estado_ingreso,
                responsable=admin_user,
                observaciones="Registro inicial automático"
            )
    @classmethod
    def volumen_trabajo_mes(cls, mes, año):
        
        filtro_fecha = Q(fecha_entrada__month=mes, fecha_entrada__year=año)
        
        equipos_recibidos = cls.objects.filter(filtro_fecha).count()
        
        equipos_calibrados = cls.objects.filter(
        filtro_fecha,
        historialequipo__estado__nombre_estado='Calibrado' 
        ).distinct().count()
        
        equipos_entregados = cls.objects.filter(
        filtro_fecha,
        historialequipo__estado__nombre_estado='Entregado'
    ).distinct().count()
        
        equipos_pendientes = cls.objects.filter(
            filtro_fecha,
            historialequipo__estado__nombre_estado__in=['En espera', 'Calibrando', 'Listo para entrega']
        ).distinct().count()
        
        return {
            'equipos_recibidos': equipos_recibidos,
            'equipos_calibrados': equipos_calibrados,
            'equipos_entregados': equipos_entregados,
            'equipos_pendientes': equipos_pendientes
        }


class HistorialEquipo(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)
    estado = models.ForeignKey(EstadoCalibracion, on_delete=models.PROTECT)
    responsable = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    observaciones = models.TextField(blank=True)

    class Meta:
        ordering = ['-fecha_cambio']
        get_latest_by = 'fecha_cambio'

    def __str__(self):
        return f"{self.equipo} → {self.estado} ({self.fecha_cambio})"

    #Esto todavia no lo vamos a usar, se va a implementar si nos queda tiempo
    @classmethod
    def tiempo_promedio_calibracion(cls, mes, año):
        
        resultados = cls.objects.filter(
            equipo__historial_estados__estado__nombre_estado='Entregado',
            fecha_cambio__month=mes,
            fecha_cambio__year=año
        ).annotate(
            fecha_ingreso=models.Subquery(
                HistorialEstado.objects.filter(
                    equipo=models.OuterRef('equipo'),
                    estado__nombre_estado='Ingreso'
                ).order_by('fecha_cambio').values('fecha_cambio')[:1]
            ),
            tiempo_total=ExpressionWrapper(
                models.F('fecha_cambio') - models.F('fecha_ingreso'),
                output_field=DurationField()
            )
        ).aggregate(
            promedio=Avg('tiempo_total')
        )
        
        return resultados['promedio'] or timedelta(0)
    
    @classmethod
    def tiempo_promedio_por_estado(cls, mes, año):
        cambios = cls.objects.filter(
            fecha_cambio__month=mes,
            fecha_cambio__year=año
        ).order_by('equipo', 'fecha_cambio')
        
        tiempos = {}
        
        equipo_actual = None
        historial_equipo = []
        
        for cambio in cambios:
            if cambio.equipo != equipo_actual:
                if equipo_actual and historial_equipo:
                    for i in range(len(historial_equipo)-1):
                        estado = historial_equipo[i].estado.nombre_estado
                        tiempo = historial_equipo[i+1].fecha_cambio - historial_equipo[i].fecha_cambio
                        
                        if estado not in tiempos:
                            tiempos[estado] = []
                        tiempos[estado].append(tiempo)
                
                equipo_actual = cambio.equipo
                historial_equipo = []
            
            historial_equipo.append(cambio)

        promedios = {}
        for estado, lista_tiempos in tiempos.items():
            total = sum(lista_tiempos, timedelta(0))
            promedios[estado] = total / len(lista_tiempos)
        
        return promedios

class Alerta(models.Model):
    TIPOS_ALERTA = (
        ('retraso', 'Retraso en calibración'),
        ('listo', 'Equipo listo para entrega'),
    )
    tipo_alerta = models.CharField(max_length=20, choices=TIPOS_ALERTA)
    descripcion = models.TextField()
    fecha_generada = models.DateTimeField(auto_now_add=True)
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)

    def __str__(self):
        return f"Alerta: {self.tipo_alerta}"


class Reporte(models.Model):
    TIPOS_REPORTE = (
        ('tiempo', 'Tiempo promedio de calibración'),
        ('pendientes', 'Equipos pendientes'),
    )
    tipo_reporte = models.CharField(max_length=20, choices=TIPOS_REPORTE)
    fecha_generado = models.DateTimeField(auto_now_add=True)
    datos_reporte = models.TextField()

    def __str__(self):
        return f"Reporte: {self.tipo_reporte}"


class EntregaRecoleccion(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    responsable_entrega = models.CharField(max_length=100)

    def __str__(self):
        return f"Entrega de {self.equipo.nombre_equipo}"