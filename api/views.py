from rest_framework import status
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import (
    Usuario, 
    Cliente, 
    Equipo, 
    EstadoCalibracion, 
    HistorialEquipo, 
    Alerta, 
    Reporte, 
    EntregaRecoleccion)

from .serializer import (
    UsuarioSerializer,
    ClienteSerializer,
    EquipoSerializer,
    EstadoCalibracionSerializer,
    HistorialEquipoSerializer,
    AlertaSerializer,
    ReporteSerializer,
    EntregaRecoleccionSerializer,
)

# ViewSet para cada modelo

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['correo'] = user.correo
        return token

    def validate(self, attrs):
        credentials = {
            'correo': attrs.get('correo'),
            'password': attrs.get('password')
        }
        user_model = get_user_model()
        try:
            user = user_model.objects.get(correo=credentials['correo'])
            if not user.check_password(credentials['password']):
                raise Exception("Contraseña incorrecta")
        except user_model.DoesNotExist:
            raise Exception("Usuario no encontrado")
        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

# vista para manejar la creación de clientes
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


    def create(self, request, *args, **kwargs):
        print("Datos recibidos:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                print("Cliente creado:", serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("Error después de guardar:", str(e))
                return Response({'status': 'error', 'message': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print("Error al crear cliente:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer

class EstadoCalibracionViewSet(viewsets.ModelViewSet):
    queryset = EstadoCalibracion.objects.all()
    serializer_class = EstadoCalibracionSerializer

class HistorialEquipoViewSet(viewsets.ModelViewSet):
    queryset = HistorialEquipo.objects.all()
    serializer_class = HistorialEquipoSerializer

class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all()
    serializer_class = AlertaSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer

class EntregaRecoleccionViewSet(viewsets.ModelViewSet):
    queryset = EntregaRecoleccion.objects.all()
    serializer_class = EntregaRecoleccionSerializer