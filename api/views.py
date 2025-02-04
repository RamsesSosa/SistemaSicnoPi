from rest_framework import viewsets
from .serializer import *
from .models import *

# ViewSet para cada modelo

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

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
    