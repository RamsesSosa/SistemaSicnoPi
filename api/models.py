from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

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

        return self.create_user(correo, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    fullName = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['fullName']

    def __str__(self):
        return self.fullName

class Cliente(models.Model):
    nombre_cliente = models.CharField(max_length=255)
    
    def __str__(self):
        return self.nombre_cliente

class Equipo(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE) 
    nombre_equipo = models.CharField(max_length=50)
    numero_serie = models.CharField(max_length=50, unique=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    consecutivo = models.CharField(max_length=20, unique=True)
<<<<<<< HEAD
    fecha_entrada = models.DateTimeField(auto_now_add=True)
    accesorios = models.TextField(blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)
=======
    accesorios = models.TextField(null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)
    fecha_entrada = models.DateTimeField(auto_now_add=True)  # Fecha automática
>>>>>>> 29faebdf3c81ef89890164ccb62da1a59fb0eb96

    def __str__(self):
        return self.nombre_equipo
    

    
class EstadoCalibracion(models.Model):
    nombre_estado = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_estado

class HistorialEquipo(models.Model):
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)  # FK a Equipo
    estado = models.ForeignKey(EstadoCalibracion, on_delete=models.SET_NULL, null=True)  # FK a EstadoCalibracion
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    responsable = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)  # FK a Usuario

    def __str__(self):
        return f"Historial de {self.equipo.nombre_equipo}"
class Alerta(models.Model):
    TIPOS_ALERTA = (
        ('retraso', 'Retraso en calibración'),
        ('listo', 'Equipo listo para entrega'),
    )
    tipo_alerta = models.CharField(max_length=20, choices=TIPOS_ALERTA)
    descripcion = models.TextField()
    fecha_generada = models.DateTimeField(auto_now_add=True)
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)  # FK a Equipo

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
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE)  # FK a Equipo
    fecha_hora = models.DateTimeField(auto_now_add=True)
    responsable_entrega = models.CharField(max_length=100)

    def __str__(self):
        return f"Entrega de {self.equipo.nombre_equipo}"