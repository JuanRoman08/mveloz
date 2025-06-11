
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Users, Save, X, Phone, MapPin, User, Calendar } from 'lucide-react';

interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  celular: string;
  nombreContacto: string;
  fechaRegistro: string;
}

interface ClienteForm {
  razonSocial: string;
  direccion: string;
  celular: string;
  nombreContacto: string;
  ruc: string;
  email: string;
  telefono: string;
  ciudad: string;
  codigoPostal: string;
}

const Clientes: React.FC = () => {
  const [activeView, setActiveView] = useState<'lista' | 'nuevo'>('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClienteForm>({
    razonSocial: '',
    direccion: '',
    celular: '',
    nombreContacto: '',
    ruc: '',
    email: '',
    telefono: '',
    ciudad: '',
    codigoPostal: ''
  });

  // Datos de ejemplo - En producción vendrían de una API
  const clientes: Cliente[] = [
    {
      id: 1,
      razonSocial: 'Empresa Ejemplo',
      direccion: 'Calle 123',
      celular: '123456789',
      nombreContacto: 'Juan Pérez',
      fechaRegistro: '2025-05-26'
    },
    {
      id: 2,
      razonSocial: 'Tecnología Avanzada S.A.',
      direccion: 'Av. Principal 456',
      celular: '987654321',
      nombreContacto: 'María García',
      fechaRegistro: '2025-05-25'
    },
    {
      id: 3,
      razonSocial: 'Servicios Integrales LTDA',
      direccion: 'Jr. Comercio 789',
      celular: '456789123',
      nombreContacto: 'Carlos López',
      fechaRegistro: '2025-05-24'
    },
    {
      id: 4,
      razonSocial: 'Construcción y Desarrollo SAC',
      direccion: 'Av. Industrial 321',
      celular: '321654987',
      nombreContacto: 'Ana Torres',
      fechaRegistro: '2025-05-23'
    },
    {
      id: 5,
      razonSocial: 'Comercial del Norte EIRL',
      direccion: 'Jr. Los Andes 654',
      celular: '654321789',
      nombreContacto: 'Pedro Mendoza',
      fechaRegistro: '2025-05-22'
    }
  ];

  // Filtrar clientes basado en el término de búsqueda
  const filteredClientes = clientes.filter(cliente =>
    cliente.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nombreContacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.celular.includes(searchTerm)
  );

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Nuevo cliente:', formData);
      // Aquí iría la lógica para enviar a la API
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      alert('Cliente creado exitosamente');
      
      // Limpiar formulario y volver a la lista
      handleReset();
      setActiveView('lista');
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert('Error al crear el cliente. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpiar formulario
  const handleReset = () => {
    setFormData({
      razonSocial: '',
      direccion: '',
      celular: '',
      nombreContacto: '',
      ruc: '',
      email: '',
      telefono: '',
      ciudad: '',
      codigoPostal: ''
    });
  };

  // Validar si el formulario está completo (solo campos obligatorios)
  const isFormValid = () => {
    const requiredFields = ['razonSocial', 'nombreContacto', 'celular', 'direccion'];
    return requiredFields.every(field => formData[field as keyof ClienteForm].trim() !== '');
  };

  // Handlers para las acciones de la tabla
  const handleEdit = (id: number) => {
    console.log('Edit client:', id);
    // Aquí iría la lógica para editar cliente
  };

  const handleDelete = (id: number) => {
    console.log('Delete client:', id);
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      // Lógica de eliminación
    }
  };

  const handleView = (id: number) => {
    console.log('View client:', id);
    // Aquí iría la lógica para ver detalles del cliente
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de la página */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">
              <span className="text-red-600">Clientes</span>
            </h1>
            <div className="w-16 h-1 bg-red-600 mt-1"></div>
          </div>
          
          <button
            onClick={() => setActiveView(activeView === 'lista' ? 'nuevo' : 'lista')}
            className="flex items-center px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-200 uppercase tracking-wide shadow-lg"
          >
            {activeView === 'lista' ? (
              <>
                <Plus size={20} className="mr-2" />
                Nuevo Cliente
              </>
            ) : (
              <>
                <Users size={20} className="mr-2" />
                Ver Lista
              </>
            )}
          </button>
        </div>

        {/* Vista de Lista */}
        {activeView === 'lista' && (
          <>
            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por razón social, nombre de contacto o celular..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                />
              </div>
            </div>

            {/* Tabla de clientes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Razón Social</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Dirección</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Celular</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Nombre Contacto</th>
                      <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Fecha Registro</th>
                      <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClientes.length > 0 ? (
                      filteredClientes.map((cliente, index) => (
                        <tr key={cliente.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{cliente.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">{cliente.razonSocial}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cliente.direccion}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cliente.celular}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{cliente.nombreContacto}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cliente.fechaRegistro}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleView(cliente.id)}
                                className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-full transition-colors"
                                title="Ver detalles"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEdit(cliente.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(cliente.id)}
                                className="p-2 text-black hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <Users className="text-gray-300 mb-2" size={48} />
                            <p className="text-lg font-medium">No se encontraron clientes</p>
                            <p className="text-sm">Intenta con otros términos de búsqueda</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Vista de Nuevo Cliente */}
        {activeView === 'nuevo' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-8">
                {/* Sección Información Básica */}
                <div className="border-l-4 border-red-600 pl-6">
                  <div className="flex items-center mb-6">
                    <User className="text-red-600 mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Información Básica</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Razón Social *
                      </label>
                      <input
                        type="text"
                        name="razonSocial"
                        value={formData.razonSocial}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Ingrese la razón social"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        RUC / DNI
                      </label>
                      <input
                        type="text"
                        name="ruc"
                        value={formData.ruc}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Ingrese RUC o DNI"
                      />
                    </div>
                  </div>
                </div>

                {/* Línea separadora */}
                <div className="border-t border-gray-200"></div>

                {/* Sección Información de Contacto */}
                <div className="border-l-4 border-black pl-6">
                  <div className="flex items-center mb-6">
                    <Phone className="text-black mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Información de Contacto</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Nombre del Contacto *
                      </label>
                      <input
                        type="text"
                        name="nombreContacto"
                        value={formData.nombreContacto}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Nombre de la persona de contacto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Celular *
                      </label>
                      <input
                        type="tel"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Número de celular"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Teléfono Fijo
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Teléfono fijo (opcional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Línea separadora */}
                <div className="border-t border-gray-200"></div>

                {/* Sección Ubicación */}
                <div className="border-l-4 border-red-600 pl-6">
                  <div className="flex items-center mb-6">
                    <MapPin className="text-red-600 mr-3" size={24} />
                    <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Ubicación</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Dirección completa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        placeholder="Código postal"
                      />
                    </div>
                  </div>
                </div>

                {/* Información de campos requeridos */}
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Nota:</span> Los campos marcados con (*) son obligatorios: Razón Social, Nombre del Contacto, Celular y Dirección.
                  </p>
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
                        Guardar Cliente
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Clientes</p>
                <p className="text-3xl font-bold text-black">{clientes.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Users className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-black p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Nuevos Este Mes</p>
                <p className="text-3xl font-bold text-black">{clientes.filter(c => c.fechaRegistro.startsWith('2025-05')).length}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <Calendar className="text-black" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resultados</p>
                <p className="text-3xl font-bold text-black">{filteredClientes.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Search className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-black p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Activos</p>
                <p className="text-3xl font-bold text-black">{clientes.length}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <Users className="text-black" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;