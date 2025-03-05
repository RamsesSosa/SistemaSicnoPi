from django.urls import path,include
from rest_framework import routers
from api import views

# Aqui se crea un router predeterminado
router = routers.DefaultRouter()

# Se registra los ViewSets en el router

router.register(r'usuarios', views.UsuarioViewSet) 
router.register(r'clientes', views.ClienteViewSet)
router.register(r'equipos', views.EquipoViewSet)
router.register(r'estados-calibracion', views.EstadoCalibracionViewSet)
router.register(r'historial-equipos', views.HistorialEquipoViewSet)
router.register(r'alertas', views.AlertaViewSet)
router.register(r'reportes', views.ReporteViewSet)
router.register(r'entregas-recolecciones', views.EntregaRecoleccionViewSet)

# Con esto se definen las rutas de la API
urlpatterns = [
    path('', include(router.urls))
]