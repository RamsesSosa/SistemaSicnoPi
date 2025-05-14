from django.shortcuts import get_object_or_404
from django.db.models import Max, F
from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.contrib.auth import get_user_model
from datetime import datetime
from rest_framework.pagination import PageNumberPagination

# JWT Auth 
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    Usuario,
    Cliente,
    Equipo,
    EstadoCalibracion,
    HistorialEquipo,
    Alerta,
    Reporte,
    EntregaRecoleccion,
)

from .serializer import (
    UsuarioSerializer,
    ClienteSerializer,
    EquipoSerializer,
    EstadoCalibracionSerializer,
    HistorialEquipoSerializer,
    AlertaSerializer,
    ReporteSerializer,
    EntregaRecoleccionSerializer,
    EquipoInfoBasicaSerializer,
    ClienteConEquiposSerializer,
    EquipoPorClienteSerializer,
    
)

# Authentication

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

# ViewSets

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class StandardPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by('-fecha_entrada')
    serializer_class = ClienteSerializer
    pagination_class = StandardPagination 
    
    @action(detail=True, methods=['get'])
    def equipos(self, request, pk=None):
        cliente = self.get_object()
        equipos = cliente.equipo_set.all().order_by('-fecha_entrada')
        
        paginator = PageNumberPagination()
        paginator.page_size = 15
        result_page = paginator.paginate_queryset(equipos, request)
        
        serializer = EquipoPorClienteSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
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
                return Response({'status': 'error', 'message': 'Error interno del servidor'}, 
                              status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print("Error al crear cliente:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        equipo = self.get_object()
        estado_id = request.data.get('estado_id')
        observaciones = request.data.get('observaciones', '')

        try:
            nuevo_estado = EstadoCalibracion.objects.get(pk=estado_id)
        except EstadoCalibracion.DoesNotExist:
            return Response({'error': 'Estado no válido'}, status=status.HTTP_400_BAD_REQUEST)

        if equipo.cambiar_estado(nuevo_estado, request.user, observaciones):
            return Response({'status': 'Estado actualizado'})
        return Response({'status': 'El equipo ya está en este estado'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False)
    def por_estado(self, request):
        estados = EstadoCalibracion.objects.all().order_by('orden')
        data = []

        for estado in estados:
            equipos = Equipo.objects.filter(
                historialequipo__estado=estado
            ).annotate(
                ultima_fecha=Max('historialequipo__fecha_cambio')
            ).filter(
                historialequipo__fecha_cambio=F('ultima_fecha')
            ).distinct()

            serializer = self.get_serializer(equipos, many=True)
            data.append({
                'estado': EstadoCalibracionSerializer(estado).data,
                'equipos': serializer.data,
                'total': equipos.count()
            })

        return Response(data)

class EstadoCalibracionViewSet(viewsets.ModelViewSet):
    queryset = EstadoCalibracion.objects.all().order_by('orden')
    serializer_class = EstadoCalibracionSerializer

class HistorialEquipoViewSet(viewsets.ModelViewSet):
    serializer_class = HistorialEquipoSerializer

    def get_queryset(self):
        queryset = HistorialEquipo.objects.all()
        equipo_id = self.request.query_params.get('equipo_id')
        if equipo_id:
            queryset = queryset.filter(equipo_id=equipo_id)
        return queryset.order_by('-fecha_cambio')

    def perform_create(self, serializer):
        serializer.save(responsable=self.request.user)

class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all()
    serializer_class = AlertaSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer

class EntregaRecoleccionViewSet(viewsets.ModelViewSet):
    queryset = EntregaRecoleccion.objects.all()
    serializer_class = EntregaRecoleccionSerializer

# APIviews

class EquiposPorEstadoView(APIView):
    def get(self, request):
        estados = EstadoCalibracion.objects.all().order_by('orden')
        resultado = []

        for estado in estados:
            equipos = Equipo.objects.filter(
                historialequipo__estado=estado
            ).annotate(
                ultima_fecha=Max('historialequipo__fecha_cambio')
            ).filter(
                historialequipo__fecha_cambio=F('ultima_fecha')
            ).distinct()

            serializer = EquipoSerializer(equipos, many=True)
            resultado.append({
                'estado': EstadoCalibracionSerializer(estado).data,
                'equipos': serializer.data,
                'total': equipos.count()
            })

        return Response(resultado)

class CambiarEstadoEquipoAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        equipo = get_object_or_404(Equipo, pk=pk)
        nuevo_estado_id = request.data.get("estado_id")
        observaciones = request.data.get("observaciones", "")

        if not nuevo_estado_id:
            return Response({"error": "Debe proporcionar un 'estado_id'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            nuevo_estado = EstadoCalibracion.objects.get(pk=nuevo_estado_id)
        except EstadoCalibracion.DoesNotExist:
            return Response({"error": "El estado proporcionado no existe"}, status=status.HTTP_404_NOT_FOUND)

        estado_actual = equipo.estado_actual
        if estado_actual:
            if abs(nuevo_estado.orden - estado_actual.orden) > 1:
                return Response({"error": "No se puede saltar estados. Solo avanzar o retroceder uno a la vez."}, status=status.HTTP_400_BAD_REQUEST)
            if nuevo_estado == estado_actual:
                return Response({"error": "El equipo ya está en ese estado."}, status=status.HTTP_400_BAD_REQUEST)

        HistorialEquipo.objects.create(
            equipo=equipo,
            estado=nuevo_estado,
            responsable=request.user,
            observaciones=observaciones
        )

        return Response({
            "mensaje": "Estado actualizado correctamente",
            "nuevo_estado": nuevo_estado.nombre_estado
        }, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
def metricas_volumen(request):
    hoy = datetime.now()
    mes = request.query_params.get('mes', hoy.month)
    año = request.query_params.get('año', hoy.year)
    
    try:
        volumen = Equipo.volumen_trabajo_mes(int(mes), int(año))
        
        conteo_estados = Equipo.contar_equipos_por_estado()
        
        return Response({
            'volumen_trabajo': volumen,
            'estados': conteo_estados,
            'status': 'success',
            'mes': mes,
            'año': año
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e),
            'mes': mes,
            'año': año
        }, status=400)

class InfoEquipoView(APIView):
    pagination_class = StandardPagination
    
    def get(self, request):
        equipos = Equipo.objects.all().order_by('-fecha_entrada')
        
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(equipos, request)
        
        if page is not None:
            serializer = EquipoInfoBasicaSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = EquipoInfoBasicaSerializer(equipos, many=True)
        return Response(serializer.data)
