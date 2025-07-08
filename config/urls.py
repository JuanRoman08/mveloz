"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from core.views import login_view, clientes_list_create, ordenes_list_create

urlpatterns = [
    path('', lambda request: JsonResponse({'message': 'Bienvenido a la API MVeloz'})),
    path('admin/', admin.site.urls),
    path('api/login/', login_view, name='api-login'),
    path('api/clientes/', clientes_list_create, name='api-clientes'),
    path('api/ordenes/', ordenes_list_create, name='api-ordenes'),
]
