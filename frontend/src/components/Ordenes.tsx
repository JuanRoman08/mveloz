import React, { useState } from 'react';
import { Plus, Save, MapPin, User, FileText, X, Search, Edit2, Trash2, Eye, Calendar, Package, CheckCircle, Clock, AlertCircle, CreditCard, DollarSign } from 'lucide-react';

// Tipos de usuario y permisos
interface AuthUser {
  id: number;
  name: string;
  role: 'ADMIN' | 'WORKER';
  permissions: string[];
}

// Modelo actualizado de Orden
interface Orden {
  id: number;
  fechaCreacion: string;
  remitenteRazon: string;
  destinatarioRazon: string;
  lugarOrigen: string;
  lugarDestino: string;
  estado: 'Pendiente' | 'En Tránsito' | 'Completada' | 'Cancelada';
  detalleCarga: string;
  formaPago: string;
  estadoPago: string;
  importeTotal: number;
  trabajadorAsignado?: string;
  trabajadorId?: number;
  notas?: string;
}

interface OrdenForm {
  remitenteRuc: string;
  remitenteRazon: string;
  remitenteCelular: string;
  destinatarioRuc: string;
  destinatarioRazon: string;
  destinatarioCelular: string;
  lugarOrigen: string;
  lugarDestino: string;
  detalleCarga: string;
  formaPago: string;
  importeTotal: number;
}

// Gestión de usuario con localStorage
const getUserFromStorage = (): AuthUser => {
  const stored = localStorage.getItem('mveloz_user');
  if (stored) {
    const parsed = JSON.parse(stored);
    // Si el objeto guardado tiene una propiedad 'user', retorna esa, si no, retorna el objeto completo
    return parsed.user ? parsed.user : parsed;
  }
  
  // Usuario por defecto (Admin)
  const defaultUser: AuthUser = {
    id: 1,
    name: 'Administrador',
    role: 'ADMIN',
    permissions: [
      'orders.create', 'orders.edit', 'orders.delete', 'orders.view_all', 
      'orders.view_amounts', 'orders.assign_worker', 'orders.generate_invoice'
    ]
  };
  
  localStorage.setItem('mveloz_user', JSON.stringify(defaultUser));
  return defaultUser;
};

const Ordenes: React.FC = () => {
  const [user] = useState<AuthUser>(getUserFromStorage());
  const hasPermission = (permission: string) => user.permissions.includes(permission);

  const [activeView, setActiveView] = useState<'lista' | 'nueva'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<OrdenForm>({
    remitenteRuc: '',
    remitenteRazon: '',
    remitenteCelular: '',
    destinatarioRuc: '',
    destinatarioRazon: '',
    destinatarioCelular: '',
    lugarOrigen: '',
    lugarDestino: '',
    detalleCarga: '',
    formaPago: 'Efectivo',
    importeTotal: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos de ejemplo actualizados
  const todasLasOrdenes: Orden[] = [
    {
      id: 1001,
      fechaCreacion: '2025-06-02',
      remitenteRazon: 'Empresa Ejemplo',
      destinatarioRazon: 'Tecnología Avanzada S.A.',
      lugarOrigen: 'Lima',
      lugarDestino: 'Arequipa',
      estado: 'En Tránsito',
      detalleCarga: 'Equipos de computación',
      formaPago: 'Transferencia',
      estadoPago: 'Pagado',
      importeTotal: 1250.00,
      trabajadorAsignado: 'Carlos Mendoza',
      trabajadorId: 2,
      notas: 'Entrega antes de las 3 PM'
    },
    {
      id: 1002,
      fechaCreacion: '2025-06-01',
      remitenteRazon: 'Servicios Integrales LTDA',
      destinatarioRazon: 'Construcción del Norte',
      lugarOrigen: 'Trujillo',
      lugarDestino: 'Chiclayo',
      estado: 'Completada',
      detalleCarga: 'Materiales de construcción',
      formaPago: 'Efectivo',
      estadoPago: 'Pendiente',
      importeTotal: 890.50,
      trabajadorAsignado: 'Ana García',
      trabajadorId: 3
    },
    {
      id: 1003,
      fechaCreacion: '2025-06-01',
      remitenteRazon: 'Comercial del Sur',
      destinatarioRazon: 'Distribuidora Central',
      lugarOrigen: 'Cusco',
      lugarDestino: 'Lima',
      estado: 'Pendiente',
      detalleCarga: 'Productos textiles',
      formaPago: 'Cheque',
      estadoPago: 'Pendiente',
      importeTotal: 2100.00,
      trabajadorAsignado: 'Carlos Mendoza',
      trabajadorId: 2
    }
  ];

  // Filtrar órdenes según el rol
  const ordenes = user.role === 'ADMIN' 
    ? todasLasOrdenes 
    : todasLasOrdenes.filter(orden => orden.trabajadorId === user.id);

  // Filtrar órdenes por búsqueda
  const filteredOrdenes = ordenes.filter(orden =>
    orden.remitenteRazon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.destinatarioRazon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.lugarOrigen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.lugarDestino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.id.toString().includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importeTotal' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('orders.create')) {
      alert('No tienes permisos para crear órdenes');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Nueva orden:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Orden creada exitosamente');
      handleReset();
      setActiveView('lista');
    } catch (error) {
      alert('Error al crear la orden');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      remitenteRuc: '',
      remitenteRazon: '',
      remitenteCelular: '',
      destinatarioRuc: '',
      destinatarioRazon: '',
      destinatarioCelular: '',
      lugarOrigen: '',
      lugarDestino: '',
      detalleCarga: '',
      formaPago: 'Efectivo',
      importeTotal: 0
    });
  };

  const isFormValid = () => {
    const requiredFields = ['remitenteRazon', 'destinatarioRazon', 'lugarOrigen', 'lugarDestino', 'detalleCarga'];
    return requiredFields.every(field => formData[field as keyof OrdenForm].toString().trim() !== '') 
           && formData.importeTotal > 0;
  };

  const handleEdit = (id: number) => {
    if (!hasPermission('orders.edit')) {
      alert('No tienes permisos para editar órdenes');
      return;
    }
    console.log('Edit orden:', id);
  };

  const handleDelete = (id: number) => {
    if (!hasPermission('orders.delete')) {
      alert('No tienes permisos para eliminar órdenes');
      return;
    }
    if (window.confirm('¿Eliminar esta orden?')) {
      console.log('Delete orden:', id);
    }
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    if (!hasPermission('orders.update_status')) {
      alert('No tienes permisos para actualizar el estado');
      return;
    }
    console.log(`Actualizando orden ${id} a: ${newStatus}`);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En Tránsito': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completada': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelada': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case 'Pagado': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Estadísticas
  const estadisticas = {
    total: ordenes.length,
    pendientes: ordenes.filter(o => o.estado === 'Pendiente').length,
    enTransito: ordenes.filter(o => o.estado === 'En Tránsito').length,
    completadas: ordenes.filter(o => o.estado === 'Completada').length,
    ingresos: hasPermission('orders.view_amounts') 
      ? ordenes.reduce((sum, orden) => sum + orden.importeTotal, 0)
      : 0,
    pendientesPago: hasPermission('orders.view_amounts')
      ? ordenes.filter(o => o.estadoPago === 'Pendiente').length
      : 0
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">
              <span className="text-red-600">
                {user.role === 'WORKER' ? 'Mis Órdenes' : 'Órdenes'}
              </span>
            </h1>
            <div className="w-16 h-1 bg-red-600 mt-1"></div>
            <div className="flex items-center mt-2 space-x-4">
              <p className="text-sm text-gray-600">
                {user.role === 'ADMIN' ? '👨‍💼 Administrador' : '👷‍♂️ Trabajador'} - {user.name}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {hasPermission('orders.create') && (
              <button
                onClick={() => setActiveView(activeView === 'lista' ? 'nueva' : 'lista')}
                className="flex items-center px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-200 uppercase tracking-wide shadow-lg"
              >
                {activeView === 'lista' ? (
                  <>
                    <Plus size={20} className="mr-2" />
                    Nueva Orden
                  </>
                ) : (
                  <>
                    <FileText size={20} className="mr-2" />
                    Ver Lista
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Vista de Lista */}
        {activeView === 'lista' && (
          <>
            {/* Búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar órdenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Remitente</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Destinatario</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Ruta</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Estado</th>
                      {hasPermission('orders.view_amounts') && (
                        <>
                          <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Importe</th>
                          <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Forma Pago</th>
                          <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Estado Pago</th>
                        </>
                      )}
                      {user.role === 'WORKER' && (
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Mis Notas</th>
                      )}
                      <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrdenes.map((orden, index) => (
                      <tr key={orden.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">#{orden.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{orden.fechaCreacion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">{orden.remitenteRazon}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">{orden.destinatarioRazon}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex items-center">
                            <MapPin size={14} className="text-red-600 mr-1" />
                            {orden.lugarOrigen} → {orden.lugarDestino}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(orden.estado)}`}>
                            {orden.estado}
                          </span>
                        </td>
                        {hasPermission('orders.view_amounts') && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                              S/. {orden.importeTotal.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{orden.formaPago}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getEstadoPagoColor(orden.estadoPago)}`}>
                                {orden.estadoPago}
                              </span>
                            </td>
                          </>
                        )}
                        {user.role === 'WORKER' && (
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                            {orden.notas || 'Sin notas'}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => console.log('View:', orden.id)}
                              className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
                              title="Ver detalles"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {user.role === 'WORKER' && orden.estado !== 'Completada' && (
                              <button
                                onClick={() => handleUpdateStatus(orden.id, 'Completada')}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                                title="Marcar completada"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            
                            {hasPermission('orders.edit') && (
                              <button
                                onClick={() => handleEdit(orden.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}
                            
                            {hasPermission('orders.delete') && (
                              <button
                                onClick={() => handleDelete(orden.id)}
                                className="p-2 text-black hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Formulario Nueva Orden */}
        {activeView === 'nueva' && hasPermission('orders.create') && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Remitente */}
                <div className="border-l-4 border-red-600 pl-6">
                  <div className="flex items-center mb-6">
                    <User className="text-red-600 mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Remitente</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">RUC / DNI *</label>
                      <input
                        type="text"
                        name="remitenteRuc"
                        value={formData.remitenteRuc}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Ingrese RUC o DNI"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Razón Social *</label>
                      <input
                        type="text"
                        name="remitenteRazon"
                        value={formData.remitenteRazon}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Razón social"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Celular *</label>
                      <input
                        type="tel"
                        name="remitenteCelular"
                        value={formData.remitenteCelular}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Celular"
                      />
                    </div>
                  </div>
                </div>

                {/* Destinatario */}
                <div className="border-l-4 border-black pl-6">
                  <div className="flex items-center mb-6">
                    <User className="text-black mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Destinatario</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">RUC / DNI *</label>
                      <input
                        type="text"
                        name="destinatarioRuc"
                        value={formData.destinatarioRuc}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="RUC o DNI"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Razón Social *</label>
                      <input
                        type="text"
                        name="destinatarioRazon"
                        value={formData.destinatarioRazon}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Razón social"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Celular *</label>
                      <input
                        type="tel"
                        name="destinatarioCelular"
                        value={formData.destinatarioCelular}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Celular"
                      />
                    </div>
                  </div>
                </div>

                {/* Ubicaciones y Detalles */}
                <div className="border-l-4 border-red-600 pl-6">
                  <div className="flex items-center mb-6">
                    <MapPin className="text-red-600 mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Detalles del Envío</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Lugar Origen *</label>
                      <input
                        type="text"
                        name="lugarOrigen"
                        value={formData.lugarOrigen}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Lugar de origen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Lugar Destino *</label>
                      <input
                        type="text"
                        name="lugarDestino"
                        value={formData.lugarDestino}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Lugar de destino"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Detalle de Carga *</label>
                    <textarea
                      name="detalleCarga"
                      value={formData.detalleCarga}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium resize-vertical"
                      placeholder="Descripción de la carga"
                    />
                  </div>
                </div>

                {/* Información de Pago */}
                <div className="border-l-4 border-black pl-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="text-black mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Información de Pago</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Forma de Pago *</label>
                      <select
                        name="formaPago"
                        value={formData.formaPago}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Credito">Crédito</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">Importe Total *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">S/.</span>
                        <input
                          type="number"
                          name="importeTotal"
                          value={formData.importeTotal}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveView('lista')}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200 uppercase tracking-wide"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200 uppercase tracking-wide"
                  >
                    <X size={20} className="mr-2 inline" />
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="flex items-center px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={20} className="mr-2" />
                        Guardar Orden
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Mensaje de acceso restringido para trabajadores */}
        {activeView === 'nueva' && !hasPermission('orders.create') && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <AlertCircle size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Acceso Restringido</h3>
            <p className="text-gray-600 mb-4">
              Solo los administradores pueden crear nuevas órdenes.
            </p>
            <button
              onClick={() => setActiveView('lista')}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-200 uppercase tracking-wide"
            >
              Volver a Mis Órdenes
            </button>
          </div>
        )}

        {/* Estadísticas diferenciadas por rol */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {user.role === 'ADMIN' ? 'Total Órdenes' : 'Mis Órdenes'}
                </p>
                <p className="text-3xl font-bold text-black">{estadisticas.total}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FileText className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-yellow-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pendientes</p>
                <p className="text-3xl font-bold text-black">{estadisticas.pendientes}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">En Tránsito</p>
                <p className="text-3xl font-bold text-black">{estadisticas.enTransito}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completadas</p>
                <p className="text-3xl font-bold text-black">{estadisticas.completadas}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Solo admin ve información financiera */}
          {hasPermission('orders.view_amounts') ? (
            <>
              <div className="bg-white rounded-xl shadow-lg border-l-4 border-emerald-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Ingresos</p>
                    <p className="text-2xl font-bold text-emerald-600">S/. {estadisticas.ingresos.toFixed(2)}</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <DollarSign className="text-emerald-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border-l-4 border-orange-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pago Pendiente</p>
                    <p className="text-3xl font-bold text-black">{estadisticas.pendientesPago}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <CreditCard className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border-l-4 border-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Asignadas Hoy</p>
                  <p className="text-3xl font-bold text-black">
                    {ordenes.filter(o => o.fechaCreacion === '2025-06-02').length}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <Calendar className="text-black" size={24} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ordenes;