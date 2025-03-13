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
        return super().validate(credentials)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


# vista para manejar la creación de clientes
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer




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