from django.contrib import admin
from .models import Cliente, OrdenServicio

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('razon_social', 'ruc_dni', 'nombre_contacto', 'direccion', 'celular', 'telefono_fijo')
    search_fields = ('razon_social', 'ruc_dni', 'nombre_contacto', 'celular')
    list_filter = ('ciudad', 'direccion')

@admin.register(OrdenServicio)
class OrdenServicioAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'remitente',
        'destinatario',
        'lugar_origen',
        'lugar_destino',
        'estado',
        'fecha_ingreso',
        'importe_total'
    )
    search_fields = ('remitente__razon_social', 'destinatario__razon_social', 'lugar_origen', 'lugar_destino')
    list_filter = ('estado', 'forma_pago')