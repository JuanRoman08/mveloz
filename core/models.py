from django.db import models

class Cliente(models.Model):
    razon_social = models.CharField(max_length=100)
    ruc_dni = models.CharField(max_length=20, unique=True)
    nombre_contacto = models.CharField(max_length=100)
    email = models.EmailField()
    celular = models.CharField(max_length=20)
    telefono_fijo = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=200)
    ciudad = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=10, blank=True, null=True)
    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.razon_social

class OrdenServicio(models.Model):
    remitente = models.ForeignKey(Cliente, related_name='ordenes_remitente', on_delete=models.CASCADE)
    destinatario = models.ForeignKey(Cliente, related_name='ordenes_destinatario', on_delete=models.CASCADE)
    lugar_origen = models.CharField(max_length=100)
    lugar_destino = models.CharField(max_length=100)
    detalle_carga = models.TextField()
    forma_pago = models.CharField(max_length=50)
    importe_total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_ingreso = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='Pendiente')

    def __str__(self):
        return f"Orden #{self.id} - {self.remitente.razon_social} a {self.destinatario.razon_social}"