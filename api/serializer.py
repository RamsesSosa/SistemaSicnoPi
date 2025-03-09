from rest_framework import serializers
from .models import Usuario, Cliente, Equipo, EstadoCalibracion, HistorialEquipo, Alerta, Reporte, EntregaRecoleccion

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = '__all__'
class EstadoCalibracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCalibracion
        
        fields = '__all__'

class HistorialEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialEquipo
        fields = '__all__'

class AlertaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alerta
        fields = '__all__'
        

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'

class EntregaRecoleccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntregaRecoleccion
        fields = '__all__'