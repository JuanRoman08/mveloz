from django.contrib import admin
from .models import Cliente, OrdenServicio

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('razon_social', 'direccion', 'celular', 'nombre_contacto', 'fecha_registro')
    search_fields = ('razon_social', 'nombre_contacto')
    list_filter = ('fecha_registro',)

@admin.register(OrdenServicio)
class OrdenServicioAdmin(admin.ModelAdmin):
    list_display = (
        'fecha', 'remitente', 'destinatario', 'estado',
        'importe_total', 'forma_pago', 'facturado', 'cliente'
    )
    search_fields = ('remitente', 'destinatario', 'descripcion')
    list_filter = ('estado', 'forma_pago', 'facturado')
