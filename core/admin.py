from django.contrib import admin
from .models import Cliente, OrdenServicio

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'dni', 'direccion', 'telefono')
    search_fields = ('nombre', 'dni')
    list_filter = ('direccion',)

@admin.register(OrdenServicio)
class OrdenServicioAdmin(admin.ModelAdmin):
    list_display = ('cliente', 'descripcion', 'fecha_ingreso', 'estado')
    search_fields = ('cliente__nombre', 'descripcion')
    list_filter = ('estado',)
