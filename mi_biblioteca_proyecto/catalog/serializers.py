from rest_framework import serializers
from .models import Libro

class LibroSerializer(serializers.ModelSerializer):
    # campo virtual de ejemplo: nombre completo del autor
    autor_completo = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Libro
        fields = ['id', 'titulo', 'autor_nombre', 'autor_apellidos', 'autor_completo', 'genero', 'paginas']
        # campos que no se aceptan en POST/PUT (solo lectura).
        read_only_fields = ['id', 'autor_completo']

    def get_autor_completo(self, obj):
        return f"{obj.autor_nombre} {obj.autor_apellidos}"

    # Ejemplo de validación a nivel de campo:
    def validate_paginas(self, value):
        if value <= 0:
            raise serializers.ValidationError("El número de páginas debe ser mayor que 0.")
        return value

    # Ejemplo de validación a nivel de objeto:
    def validate(self, attrs):
        # ejemplo trivial: título no vacío (Model ya lo controla, solo ejemplar)
        if not attrs.get('titulo'):
            raise serializers.ValidationError("El título es obligatorio.")
        return attrs
