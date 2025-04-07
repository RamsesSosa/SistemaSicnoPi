from rest_framework import serializers
from .models import Usuario, Cliente, Equipo, EstadoCalibracion, HistorialEquipo, Alerta, Reporte, EntregaRecoleccion
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'fullName', 'correo', 'is_active', 'is_staff']


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'


class EquipoSerializer(serializers.ModelSerializer):
    estado_actual = serializers.SerializerMethodField()
    historial = serializers.SerializerMethodField()
    
    class Meta:
        model = Equipo
        fields = '__all__'
    
    def get_estado_actual(self, obj):
        if obj.estado_actual:
            return {
                'id': obj.estado_actual.id,
                'nombre': obj.estado_actual.nombre_estado,
                'fecha': obj.historialequipo_set.last().fecha_cambio
            }
        return None
    
    def get_historial(self, obj):
        historial = obj.historialequipo_set.all().order_by('-fecha_cambio')[:10]
        return HistorialEquipoSerializer(historial, many=True).data

class EstadoCalibracionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCalibracion
        fields = '__all__'

class EstadoEquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCalibracion
        fields = ['id', 'nombre_estado', 'orden']
        
class HistorialEstadoSerializer(serializers.ModelSerializer):
    estado = EstadoCalibracionSerializer()
    usuario = serializers.StringRelatedField()
    
    class Meta:
        model = HistorialEquipo
        fields = '__all__'

class HistorialEquipoSerializer(serializers.ModelSerializer):
    estado = EstadoCalibracionSerializer()
    responsable = serializers.StringRelatedField()
    
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