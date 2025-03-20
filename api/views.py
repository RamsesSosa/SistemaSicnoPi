from django.shortcuts import get_object_or_404
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

    def create(self, request, *args, **kwargs):
        print("Datos recibidos:", request.data)

        # Verificar si el cliente_id existe
        cliente_id = request.data.get('cliente')
        if not cliente_id:
            return Response(
                {'status': 'error', 'message': 'El campo cliente_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verificar si el cliente existe
            cliente = get_object_or_404(Cliente, id=cliente_id)
        except Cliente.DoesNotExist:
            return Response(
                {'status': 'error', 'message': 'El cliente_id no existe'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar y guardar el equipo
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Error al crear equipo:", serializer.errors)
            return Response(
                {'status': 'error', 'message': 'Datos inválidos', 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            serializer.save()
            print("Equipo creado:", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error después de guardar:", str(e))
            return Response(
                {'status': 'error', 'message': 'Error interno del servidor', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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