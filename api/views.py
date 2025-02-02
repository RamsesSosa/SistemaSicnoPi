from rest_framework import viewsets
from .serializer import usuarioSerializer
from .models import usuario

# Create your views here.

class usuarioViewSet(viewsets.ModelViewSet):
    queryset = usuario.objects.all()
    serializer_class = usuarioSerializer
print("Cargando api/views.py")  