from django.urls import path
from . import views

from .views import index, frontend

urlpatterns = [
    path('', index, name='catalog_index'),
    path('app/', frontend, name='catalog_frontend'),
]