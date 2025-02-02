from django.db import models

class usuario(models.Model):
    fullName = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100)
    contrasena = models.CharField(max_length=30)
