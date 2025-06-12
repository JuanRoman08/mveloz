from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Usuarios simulados (deben ser reemplazados por la conexion a la base de datos)
USUARIOS = [
    {
        "usuario": "Yovani",
        "contrasena": "76522553Yovani",
        "role": "ADMIN",
        "permissions": ["orders.create", "orders.edit", "orders.delete"]
    },
    {
        "usuario": "Karen",
        "contrasena": "Karen1234",
        "role": "WORKER",
        "permissions": ["orders.view_assigned", "orders.update_status"]
    }
]

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        usuario = data.get('usuario')
        contrasena = data.get('contrasena')
        for user in USUARIOS:
            if user["usuario"] == usuario and user["contrasena"] == contrasena:
                return JsonResponse({"success": True, "user": user})
        return JsonResponse({"success": False, "error": "Credenciales inválidas"}, status=401)
    return JsonResponse({"error": "Método no permitido"}, status=405)

# ------------------- CLIENTES -------------------
CLIENTES = [
    {
        "id": 1,
        "razon_social": "Empresa Ejemplo",
        "ruc_dni": "12345678901",
        "nombre_contacto": "Juan Pérez",
        "email": "juan@ejemplo.com",
        "celular": "999888777",
        "telefono_fijo": "012345678",
        "direccion": "Calle 123",
        "ciudad": "Lima",
        "codigo_postal": "15000",
        "fecha_registro": "2025-05-26"
    }
]

@csrf_exempt
def clientes_list_create(request):
    if request.method == 'GET':
        return JsonResponse(CLIENTES, safe=False)
    elif request.method == 'POST':
        data = json.loads(request.body)
        nuevo = data.copy()
        nuevo["id"] = len(CLIENTES) + 1
        nuevo["fecha_registro"] = "2025-05-26"
        CLIENTES.append(nuevo)
        return JsonResponse(nuevo, status=201)
    return JsonResponse({"error": "Método no permitido"}, status=405)

# ------------------- ORDENES -------------------
ORDENES = [
    {
        "id": 1,
        "fecha_creacion": "2025-05-26",
        "remitente_razon": "Empresa Ejemplo",
        "destinatario_razon": "Cliente Destino",
        "lugar_origen": "Lima",
        "lugar_destino": "Arequipa",
        "estado": "Pendiente",
        "detalle_carga": "Cajas",
        "forma_pago": "Efectivo",
        "estado_pago": "Pendiente",
        "importe_total": 100.0,
        "trabajador_asignado": "Karen",
        "trabajador_id": 2,
        "notas": ""
    }
]

@csrf_exempt
def ordenes_list_create(request):
    if request.method == 'GET':
        return JsonResponse(ORDENES, safe=False)
    elif request.method == 'POST':
        data = json.loads(request.body)
        nuevo = data.copy()
        nuevo["id"] = len(ORDENES) + 1
        nuevo["fecha_creacion"] = "2025-05-26"
        nuevo["estado"] = "Pendiente"
        nuevo["estado_pago"] = "Pendiente"
        ORDENES.append(nuevo)
        return JsonResponse(nuevo, status=201)
    return JsonResponse({"error": "Método no permitido"}, status=405)