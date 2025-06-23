from django.urls import path
from django.http import JsonResponse
from .views import login_view, clientes_list_create, ordenes_list_create

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "Bienvenido a la API MVeloz"})),
    path('api/login/', login_view, name='api-login'),
    path('api/clientes/', clientes_list_create, name='api-clientes'),
    path('api/ordenes/', ordenes_list_create, name='api-ordenes'),
]
