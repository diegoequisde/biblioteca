from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Libro
from .serializers import LibroSerializer

# Enlazar la vista Django que sirva el frontend y "libros" para recorrerlo con for-each en el html
def frontend(request):
    libros = Libro.objects.all()
    return render(request, "catalog/index.html", {"libros": libros})

# Creamos el ViewSet del modelo Libro
class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
