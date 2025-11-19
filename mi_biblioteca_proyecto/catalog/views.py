from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Libro
from .serializers import LibroSerializer

from django.shortcuts import render


# Create your views here.
def index(request):
    return HttpResponse("Página principal del catálogo funcionando")

# Enlazar la vista Django que sirva el frontend
def frontend(request):
    return render(request, "catalog/index.html")


class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
