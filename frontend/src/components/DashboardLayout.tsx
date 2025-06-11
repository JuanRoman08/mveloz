import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Settings, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeSection 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const personalLogin = JSON.parse(localStorage.getItem('mveloz_user') || '{}');

  console.log(personalLogin);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { id: 'clientes', label: 'Clientes', icon: Users, route: '/dashboard/clientes' },
    { id: 'ordenes', label: 'Órdenes', icon: FileText, route: '/dashboard/ordenes' },
    { id: 'configuracion', label: 'Configuración', icon: Settings, route: '/dashboard/configuracion' },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
    navigate('/');
  };

  const handleNavigation = (route: string) => {
    navigate(route);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-red-600">
            <h1 className="text-2xl font-bold text-white tracking-wider">
              M<span className="text-red-600">Veloz</span>
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.route)}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg font-medium transition-all duration-200
                    ${activeSection === item.id 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <IconComponent size={20} className="mr-3" />
                  <span className="uppercase tracking-wide text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Botón de logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg font-medium transition-all duration-200"
            >
              <LogOut size={20} className="mr-3" />
              <span className="uppercase tracking-wide text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header superior */}
        <header className="bg-white shadow-lg border-b-2 border-red-600">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-black hover:text-red-600 transition-colors mr-4"
              >
                <Menu size={24} />
              </button>
              {/* Espacio para título o breadcrumbs si se necesita en el futuro */}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Usuario Activo</p>
                <p className="text-lg font-bold text-black">{personalLogin.rol}</p>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {personalLogin.name ? personalLogin.name.charAt(0).toUpperCase() : ''}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido dinámico */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;