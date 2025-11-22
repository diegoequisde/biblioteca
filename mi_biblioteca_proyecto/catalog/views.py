from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from .models import Libro
from .serializers import LibroSerializer
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend


# Enlazar la vista Django que sirva el frontend y "libros" para recorrerlo con for-each en el html
def frontend(request):
    libros = Libro.objects.all()
    return render(request, "catalog/index.html", {"libros": libros})

# Creamos el ViewSet del modelo Libro
class LibroViewSet(ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['autor_nombre', 'autor_apellidos', 'titulo']
    filterset_fields = {
        'genero': ['exact'],
        'paginas': ['gte', 'lte'],
    }
    ordering_fields = ['titulo', 'autor_nombre', 'autor_apellidos', 'genero', 'paginas']
    ordering = ['titulo']  # orden por defecto
