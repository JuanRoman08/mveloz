import React, { useState } from 'react';
import { Save, User, Lock, Bell, Shield, Database, Building } from 'lucide-react';

interface AuthUser {
  id: number;
  name: string;
  role: 'ADMIN' | 'WORKER';
  permissions: string[];
}

interface PerfilForm {
  nombre: string;
  email: string;
  telefono: string;
  cargo: string;
}

interface EmpresaForm {
  nombreEmpresa: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  sitioWeb: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const getUserFromStorage = (): AuthUser => {
  const stored = localStorage.getItem('mveloz_user');
  if (stored) {
    const parsed = JSON.parse(stored);
    // Si el objeto guardado tiene una propiedad 'user', retorna esa, si no, retorna el objeto completo
    return parsed.user ? parsed.user : parsed;
  }
  
  const defaultUser: AuthUser = {
    id: 1,
    name: 'Administrador',
    role: 'ADMIN',
    permissions: ['config.edit_all', 'config.manage_users', 'config.system']
  };
  
  localStorage.setItem('mveloz_user', JSON.stringify(defaultUser));
  return defaultUser;
};

const Configuracion: React.FC = () => {
  const [user] = useState<AuthUser>(getUserFromStorage());
  const [activeTab, setActiveTab] = useState<'perfil' | 'empresa' | 'seguridad' | 'notificaciones' | 'sistema'>('perfil');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPermission = (permission: string) => user.permissions.includes(permission);

  const [perfilData, setPerfilData] = useState<PerfilForm>({
    nombre: user.name,
    email: user.role === 'ADMIN' ? 'admin@mveloz.com' : 'trabajador@mveloz.com',
    telefono: '+51 999 888 777',
    cargo: user.role === 'ADMIN' ? 'Administrador' : 'Trabajador'
  });

  const [empresaData, setEmpresaData] = useState<EmpresaForm>({
    nombreEmpresa: 'MVeloz Transportes',
    ruc: '20123456789',
    direccion: 'Av. Principal 123, Lima',
    telefono: '+51 01 234 5678',
    email: 'contacto@mveloz.com',
    sitioWeb: 'www.mveloz.com'
  });

  const [passwordData, setPasswordData] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificaciones, setNotificaciones] = useState({
    emailOrdenes: true,
    emailClientes: user.role === 'ADMIN',
    smsAlertas: true,
    pushNotifications: true
  });

  // Tabs filtrados por rol
  const getAllTabs = () => [
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'empresa', label: 'Empresa', icon: Building },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'sistema', label: 'Sistema', icon: Database }
  ];

  const getAvailableTabs = () => {
    const allTabs = getAllTabs();
    if (user.role === 'WORKER') {
      return allTabs.filter(tab => ['perfil', 'empresa', 'seguridad', 'notificaciones'].includes(tab.id));
    }
    return allTabs;
  };

  const tabs = getAvailableTabs();

  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasPermission('config.edit_all')) return;
    const { name, value } = e.target;
    setEmpresaData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificacionChange = (key: string) => {
    if (key === 'emailClientes' && user.role === 'WORKER') return;
    setNotificaciones(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSubmit = async (section: string) => {
    setIsSubmitting(true);
    try {
      console.log(`Guardando ${section}:`, section === 'perfil' ? perfilData : section === 'empresa' ? empresaData : passwordData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`${section} actualizado exitosamente`);
      
      if (section === 'seguridad') {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      alert(`Error al actualizar ${section}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid = () => {
    return passwordData.currentPassword && 
           passwordData.newPassword && 
           passwordData.newPassword === passwordData.confirmPassword &&
           passwordData.newPassword.length >= 6;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">
                <span className="text-red-600">Configuración</span>
              </h1>
              <div className="w-16 h-1 bg-red-600 mt-1"></div>
              <div className="flex items-center mt-2 space-x-4">
                <p className="text-sm text-gray-600">
                  {user.role === 'ADMIN' ? '👨‍💼 Administrador' : '👷‍♂️ Trabajador'} - {user.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de tabs */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-lg font-medium transition-all duration-200 mb-1
                        ${activeTab === tab.id 
                          ? 'bg-red-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <IconComponent size={20} className="mr-3" />
                      <span className="uppercase tracking-wide text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              
              {/* Tab: Mi Perfil */}
              {activeTab === 'perfil' && (
                <div className="p-8">
                  <div className="border-l-4 border-red-600 pl-6 mb-8">
                    <div className="flex items-center mb-6">
                      <User className="text-red-600 mr-3" size={24} />
                      <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Mi Perfil</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={perfilData.nombre}
                          onChange={handlePerfilChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={perfilData.email}
                          onChange={handlePerfilChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={perfilData.telefono}
                          onChange={handlePerfilChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Cargo
                        </label>
                        <input
                          type="text"
                          name="cargo"
                          value={perfilData.cargo}
                          onChange={handlePerfilChange}
                          readOnly={user.role === 'WORKER'}
                          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium ${
                            user.role === 'WORKER' ? 'bg-gray-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={() => handleSubmit('perfil')}
                        disabled={isSubmitting}
                        className="flex items-center px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 uppercase tracking-wide shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save size={20} className="mr-2" />
                            Guardar Cambios
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Empresa - Solo Admin o Solo Lectura */}
              {activeTab === 'empresa' && (
                <div className="p-8">
                  <div className="border-l-4 border-black pl-6 mb-8">
                    <div className="flex items-center mb-6">
                      <Building className="text-black mr-3" size={24} />
                      <h2 className="text-2xl font-bold text-black uppercase tracking-wide">
                        Información de la Empresa
                        {user.role === 'WORKER' && <span className="text-sm text-gray-500 ml-2">(Solo lectura)</span>}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Nombre de la Empresa
                        </label>
                        <input
                          type="text"
                          name="nombreEmpresa"
                          value={empresaData.nombreEmpresa}
                          onChange={handleEmpresaChange}
                          readOnly={user.role === 'WORKER'}
                          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium ${
                            user.role === 'WORKER' ? 'bg-gray-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          RUC
                        </label>
                        <input
                          type="text"
                          name="ruc"
                          value={empresaData.ruc}
                          onChange={handleEmpresaChange}
                          readOnly={user.role === 'WORKER'}
                          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium ${
                            user.role === 'WORKER' ? 'bg-gray-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Dirección
                        </label>
                        <input
                          type="text"
                          name="direccion"
                          value={empresaData.direccion}
                          onChange={handleEmpresaChange}
                          readOnly={user.role === 'WORKER'}
                          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium ${
                            user.role === 'WORKER' ? 'bg-gray-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          value={empresaData.telefono}
                          onChange={handleEmpresaChange}
                          readOnly={user.role === 'WORKER'}
                          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium ${
                            user.role === 'WORKER' ? 'bg-gray-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Email Corporativo
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={empresaData.email}
                          onChange={handleEmpresaChange}
                          readOnly={user.role === 'WORKER'}
                          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium ${
                            user.role === 'WORKER' ? 'bg-gray-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Sitio Web
                        </label>
                        <input
                          type="url"
                          name="sitioWeb"
                          value={empresaData.sitioWeb}
                          onChange={handleEmpresaChange}
                          readOnly={user.role === 'WORKER'}
                          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium ${
                            user.role === 'WORKER' ? 'bg-gray-50 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {hasPermission('config.edit_all') && (
                      <div className="flex justify-end mt-8">
                        <button
                          onClick={() => handleSubmit('empresa')}
                          disabled={isSubmitting}
                          className="flex items-center px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200 uppercase tracking-wide shadow-lg"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save size={20} className="mr-2" />
                              Guardar Cambios
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'seguridad' && (
                <div className="p-8">
                  <div className="border-l-4 border-red-600 pl-6 mb-8">
                    <div className="flex items-center mb-6">
                      <Shield className="text-red-600 mr-3" size={24} />
                      <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Seguridad</h2>
                    </div>
                    
                    <div className="max-w-md space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                          placeholder="Contraseña actual"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                          placeholder="Confirmar contraseña"
                        />
                      </div>
                      
                      {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-red-600 text-sm font-medium">Las contraseñas no coinciden</p>
                      )}
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={() => handleSubmit('seguridad')}
                        disabled={isSubmitting || !isPasswordValid()}
                        className="flex items-center px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 uppercase tracking-wide shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <Lock size={20} className="mr-2" />
                            Cambiar Contraseña
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Notificaciones */}
              {activeTab === 'notificaciones' && (
                <div className="p-8">
                  <div className="border-l-4 border-black pl-6 mb-8">
                    <div className="flex items-center mb-6">
                      <Bell className="text-black mr-3" size={24} />
                      <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Notificaciones</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {Object.entries({
                        emailOrdenes: 'Notificaciones por email para órdenes asignadas',
                        emailClientes: 'Notificaciones por email para nuevos clientes (Solo Admin)',
                        smsAlertas: 'Alertas por SMS para eventos importantes',
                        pushNotifications: 'Notificaciones push del navegador'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-lg">
                          <span className={`font-medium ${
                            key === 'emailClientes' && user.role === 'WORKER' ? 'text-gray-400' : 'text-black'
                          }`}>
                            {label}
                          </span>
                          <button
                            onClick={() => handleNotificacionChange(key)}
                            disabled={key === 'emailClientes' && user.role === 'WORKER'}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notificaciones[key as keyof typeof notificaciones] ? 'bg-red-600' : 'bg-gray-300'
                            } ${key === 'emailClientes' && user.role === 'WORKER' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notificaciones[key as keyof typeof notificaciones] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={() => handleSubmit('notificaciones')}
                        disabled={isSubmitting}
                        className="flex items-center px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors duration-200 uppercase tracking-wide shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save size={20} className="mr-2" />
                            Guardar Preferencias
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Sistema - Solo Admin */}
              {activeTab === 'sistema' && hasPermission('config.system') && (
                <div className="p-8">
                  <div className="border-l-4 border-red-600 pl-6 mb-8">
                    <div className="flex items-center mb-6">
                      <Database className="text-red-600 mr-3" size={24} />
                      <h2 className="text-2xl font-bold text-black uppercase tracking-wide">Información del Sistema</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-black mb-2">Versión del Sistema</h3>
                        <p className="text-gray-600">MVeloz v2.1.0</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-black mb-2">Última Actualización</h3>
                        <p className="text-gray-600">15 de Mayo, 2025</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-black mb-2">Base de Datos</h3>
                        <p className="text-gray-600">SQL Server 2022</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-bold text-black mb-2">Estado del Sistema</h3>
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Operativo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;