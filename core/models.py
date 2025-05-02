from django.db import models

class Cliente(models.Model):
    razon_social = models.CharField(max_length=255)
    direccion = models.TextField()
    celular = models.CharField(max_length=20)
    nombre_contacto = models.CharField(max_length=255)
    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre_contacto


class OrdenServicio(models.Model):
    fecha = models.DateField()
    origen = models.CharField(max_length=100)
    destino = models.CharField(max_length=100)
    remitente = models.CharField(max_length=255)
    destinatario = models.CharField(max_length=255)
    descripcion = models.TextField()
    estado = models.CharField(max_length=20)
    importe_total = models.DecimalField(max_digits=10, decimal_places=2)
    forma_pago = models.CharField(max_length=100)
    facturado = models.BooleanField(default=False)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.fecha} - {self.remitente} → {self.destinatario}"
