from django.contrib import admin
from .models import Usuario, Cliente, Equipo, EstadoCalibracion, HistorialEquipo, Alerta, Reporte, EntregaRecoleccion

@admin.register(EstadoCalibracion)
class EstadoCalibracionAdmin(admin.ModelAdmin):
    list_display = ('nombre_estado', 'orden')
    ordering = ('orden',)

@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ('nombre_equipo', 'numero_serie', 'cliente', 'estado_actual_admin')
    list_filter = ('cliente',)
    search_fields = ('nombre_equipo', 'numero_serie')
    actions = ['cambiar_estado']
    
    def estado_actual_admin(self, obj):
        return obj.estado_actual or "Sin estado"
    estado_actual_admin.short_description = 'Estado Actual'
    
    def cambiar_estado(self, request, queryset):
        from django import forms
        from django.http import JsonResponse
        
        class EstadoForm(forms.Form):
            estado = forms.ModelChoiceField(queryset=EstadoCalibracion.objects.all())
            observaciones = forms.CharField(required=False)
        
        if request.method == 'POST':
            form = EstadoForm(request.POST)
            if form.is_valid():
                estado = form.cleaned_data['estado']
                for equipo in queryset:
                    equipo.cambiar_estado(estado, request.user, form.cleaned_data['observaciones'])
                return JsonResponse({'status': 'success'})
        else:
            form = EstadoForm()
        
        return JsonResponse({
            'action': 'cambiar_estado',
            'form': {
                'estado': [(e.id, str(e)) for e in EstadoCalibracion.objects.all()],
                'observaciones': ''
            }
        })
    cambiar_estado.short_description = "Cambiar estado seleccionado"

@admin.register(HistorialEquipo)  
class HistorialEquipoAdmin(admin.ModelAdmin):
    list_display = ('equipo', 'estado', 'responsable', 'fecha_cambio')
    readonly_fields = ('fecha_cambio',)
    list_filter = ('estado', 'responsable')  
    
# Aqui se registran los modelos en el panel de administración
admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Alerta)
admin.site.register(Reporte)
admin.site.register(EntregaRecoleccion)