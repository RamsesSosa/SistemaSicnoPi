from django.contrib import admin
from .models import Usuario, Cliente, Equipo, EstadoCalibracion, HistorialEquipo, Alerta, Reporte, EntregaRecoleccion

# Aqui se registran los modelos en el panel de administración
admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Equipo)
admin.site.register(EstadoCalibracion)
admin.site.register(HistorialEquipo)
admin.site.register(Alerta)
admin.site.register(Reporte)
admin.site.register(EntregaRecoleccion)
