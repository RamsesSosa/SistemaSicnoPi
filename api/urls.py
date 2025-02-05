from django.urls import path,include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()

#Esto generará automáticamente las rutas para cada ViewSet en la API

router.register(r'usuarios', views.UsuarioViewSet) 
router.register(r'clientes', views.ClienteViewSet)
router.register(r'equipos', views.EquipoViewSet)
router.register(r'estados-calibracion', views.EstadoCalibracionViewSet)
router.register(r'historial-equipos', views.HistorialEquipoViewSet)
router.register(r'alertas', views.AlertaViewSet)
router.register(r'reportes', views.ReporteViewSet)
router.register(r'entregas-recolecciones', views.EntregaRecoleccionViewSet)

urlpatterns = [
    path('', include(router.urls))
]