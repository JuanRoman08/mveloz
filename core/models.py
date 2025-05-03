from django.db import models

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    dni = models.CharField(max_length=8, unique=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.nombre


class OrdenServicio(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    descripcion = models.TextField()
    fecha_ingreso = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.cliente.nombre} - {self.fecha_ingreso}"
