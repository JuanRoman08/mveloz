import os
import django
import pandas as pd

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.models import Cliente, OrdenServicio

def importar_clientes():
    df = pd.read_excel('Tbl_Cliente.xlsx')

    clientes = []
    for _, row in df.iterrows():
        cliente = Cliente(
            dni=row['DNI'],
            nombres=row['Nombres'],
            direccion=row['Dirección'],
            telefono=row['Teléfono'],
            correo=row.get('Correo', '')
        )
        clientes.append(cliente)

    Cliente.objects.bulk_create(clientes)
    print(f"{len(clientes)} clientes importados con éxito.")

def importar_ordenes_servicio():
    df = pd.read_excel('Tbl_Orden_Servicio.xlsx')

    ordenes = []
    for _, row in df.iterrows():
        try:
            cliente = Cliente.objects.get(dni=row['DNI_Cliente'])
            orden = OrdenServicio(
                cliente=cliente,
                fecha=row['Fecha'],
                descripcion=row['Descripción'],
                estado=row.get('Estado', 'Pendiente')
            )
            ordenes.append(orden)
        except Cliente.DoesNotExist:
            print(f"Cliente con DNI {row['DNI_Cliente']} no encontrado.")

    OrdenServicio.objects.bulk_create(ordenes)
    print(f"{len(ordenes)} órdenes de servicio importadas con éxito.")

if __name__ == '__main__':
    importar_clientes()
    importar_ordenes_servicio()
