from django.core.management.base import BaseCommand
from api.models import EstadoCalibracion

ESTADOS = [
    (1, "Ingreso", "El equipo llega al laboratorio"),
    (2, "En espera", "Está en cola para ser calibrado"),
    (3, "Calibrando", "En proceso de calibración"),
    (4, "Calibrado", "Calibración terminada (pero aún no certificada)"),
    (5, "Etiquetado", "Se le coloca identificación física"),
    (6, "Certificado emitido", "Documentación lista"),
    (7, "Listo para entrega", "Esperando al cliente"),
    (8, "Entregado", "El cliente lo recoge"),
]

class Command(BaseCommand):
    help = 'Crea los estados iniciales del sistema'
    
    def handle(self, *args, **options):
        for orden, nombre, descripcion in ESTADOS:
            EstadoCalibracion.objects.get_or_create(
                nombre_estado=nombre,
                defaults={
                    'orden': orden,
                    'descripcion': descripcion
                }
            )
        self.stdout.write(self.style.SUCCESS('Estados de calibración creados exitosamente'))