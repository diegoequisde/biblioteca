from django.urls import path
from . import views

# from .views import index, frontend

urlpatterns = [
    path('', views.frontend, name='catalog_frontend'), 
]