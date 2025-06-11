import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNewClient = () => {
    navigate('/dashboard/clientes');
    // Trigger para mostrar el formulario - esto se puede hacer con query params o estado global
    // Por ahora navegamos a la página de clientes donde el usuario puede hacer clic en "Nuevo Cliente"
  };

  const handleNewOrder = () => {
    navigate('/dashboard/ordenes');
    // Trigger para mostrar el formulario - esto se puede hacer con query params o estado global
    // Por ahora navegamos a la página de órdenes donde el usuario puede hacer clic en "Nueva Orden"
  };

  return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Bienvenido al <span className="text-red-600">Dashboard</span>
          </h1>
          <div className="w-24 h-1 bg-red-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Selecciona una opción del menú lateral para comenzar.
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Clientes</p>
                <p className="text-3xl font-bold text-black">124</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Users className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-black p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Órdenes Activas</p>
                <p className="text-3xl font-bold text-black">47</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <FileText className="text-black" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pendientes Hoy</p>
                <p className="text-3xl font-bold text-black">12</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Settings className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

       {/* Área de acciones rápidas */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleNewClient}
              className="flex items-center justify-center px-6 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 uppercase tracking-wide"
            >
              <Users className="mr-2" size={20} />
              Nuevo Cliente
            </button>
            <button 
              onClick={handleNewOrder}
              className="flex items-center justify-center px-6 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 uppercase tracking-wide"
            >
              <FileText className="mr-2" size={20} />
              Nueva Orden
            </button>
          </div>
        </div>

        {/* Resumen de actividades recientes */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Actividad Reciente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 border-l-4 border-red-600 bg-red-50">
              <div className="flex items-center">
                <Users className="text-red-600 mr-3" size={20} />
                <div>
                  <p className="font-semibold text-black">Nuevo cliente registrado</p>
                  <p className="text-sm text-gray-600">Empresa Tecnológica S.A.</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-500">Hace 2 horas</span>
            </div>

            <div className="flex items-center justify-between py-3 px-4 border-l-4 border-black bg-gray-50">
              <div className="flex items-center">
                <FileText className="text-black mr-3" size={20} />
                <div>
                  <p className="font-semibold text-black">Orden completada</p>
                  <p className="text-sm text-gray-600">Envío Lima - Arequipa</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-500">Hace 4 horas</span>
            </div>

            <div className="flex items-center justify-between py-3 px-4 border-l-4 border-red-600 bg-red-50">
              <div className="flex items-center">
                <Settings className="text-red-600 mr-3" size={20} />
                <div>
                  <p className="font-semibold text-black">Sistema actualizado</p>
                  <p className="text-sm text-gray-600">Nuevas funcionalidades disponibles</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-500">Ayer</span>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default Dashboard;
