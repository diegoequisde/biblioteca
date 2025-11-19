from django.db import models

# Create your models here.
class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor_nombre = models.CharField("Nombre del autor", max_length=100)
    autor_apellidos = models.CharField("Apellidos del autor", max_length=150)
    genero = models.CharField(max_length=100)
    paginas = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.titulo} ({self.autor_nombre} {self.autor_apellidos})"