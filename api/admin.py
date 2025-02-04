from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Equipo)
admin.site.register(EstadoCalibracion)
admin.site.register(HistorialEquipo)
admin.site.register(Alerta)
admin.site.register(Reporte)
admin.site.register(EntregaRecoleccion)