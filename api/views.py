from rest_framework import viewsets
from .serializer import *
from .models import *

# Create your views here.

class usuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class clienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.all()
    serializer_class = ClienteSerializer

class equipoSerializer(viewsets.ModelViewSet):
    queryset = Equipo.all()
    serializer_class = EquipoSerializer

class 
    