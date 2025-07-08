from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.models import Cliente, OrdenServicio
from django.forms.models import model_to_dict
from django.utils.timezone import now
import json

# ------------------- LOGIN -------------------
USUARIOS = [
    {
        "id": 2,
        "usuario": "Karen",
        "contrasena": "Karen1234",
        "name": "Karen",
        "role": "WORKER",
        "permissions": [
            "orders.view_assigned",
            "orders.update_status",
            "config.edit_profile"
        ],
        "email": "kesteves@gmail.com"
    },
    {
        "id": 1,
        "usuario": "Yovani",
        "contrasena": "76522553Yovani",
        "name": "Yovani",
        "role": "ADMIN",
        "permissions": [
            "orders.create",
            "orders.edit",
            "orders.delete",
            "orders.view_all",
            "orders.view_amounts",
            "orders.assign_worker",
            "config.edit_all",
            "config.manage_users",
            "config.system"
        ],
        "email": "ysteves@gmail.com"
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


# ------------------- CLIENTES CON BD -------------------
@csrf_exempt
def clientes_list_create(request):
    if request.method == 'GET':
        clientes = Cliente.objects.all()
        data = [model_to_dict(cliente) for cliente in clientes]
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body)
        cliente = Cliente.objects.create(
            razon_social=data.get("razon_social"),
            ruc_dni=data.get("ruc_dni"),
            nombre_contacto=data.get("nombre_contacto"),
            email=data.get("email"),
            celular=data.get("celular"),
            telefono_fijo=data.get("telefono_fijo"),
            direccion=data.get("direccion"),
            ciudad=data.get("ciudad"),
            codigo_postal=data.get("codigo_postal")
        )
        return JsonResponse(model_to_dict(cliente), status=201)

    return JsonResponse({"error": "Método no permitido"}, status=405)


# ------------------- ORDENES CON BD -------------------
@csrf_exempt
def ordenes_list_create(request):
    if request.method == 'GET':
        ordenes = OrdenServicio.objects.all()
        data = []
        for orden in ordenes:
            d = model_to_dict(orden)
            d['remitente_razon'] = orden.remitente.razon_social
            d['destinatario_razon'] = orden.destinatario.razon_social
            data.append(d)
        return JsonResponse(data, safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body)
        remitente_id = data.get("remitente_id")
        destinatario_id = data.get("destinatario_id")

        orden = OrdenServicio.objects.create(
            remitente_id=remitente_id,
            destinatario_id=destinatario_id,
            lugar_origen=data.get("lugar_origen"),
            lugar_destino=data.get("lugar_destino"),
            detalle_carga=data.get("detalle_carga"),
            forma_pago=data.get("forma_pago"),
            importe_total=data.get("importe_total", 0.0),
            estado="Pendiente"
        )
        result = model_to_dict(orden)
        result['remitente_razon'] = orden.remitente.razon_social
        result['destinatario_razon'] = orden.destinatario.razon_social
        return JsonResponse(result, status=201)

    return JsonResponse({"error": "Método no permitido"}, status=405)
