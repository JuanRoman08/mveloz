import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  usuario: string;
  contrasena: string;
};

// Tipos de usuario y permisos
interface AuthUser {
  id: number;
  name: string;
  role: 'ADMIN' | 'WORKER';
  password: string,
  permissions: string[];
}

interface Personal {
  name: string;
  lastname: string;
  rol: string;
  email: string;
  user: AuthUser;
};

const personales : Personal[] = [
  {
    name: "Karen",
    lastname: "Esteves",
    user : {
      id: 2,
      name: "Karen",
      role: 'WORKER',
      password: "Karen1234",
      permissions: ['orders.view_assigned', 'orders.update_status', 'config.edit_profile']
    },
    rol: "Trabajador",
    email: "kesteves@gmail.com"
  },
  {
    name: "Yovani",
    lastname: "Esteves",
    user: {
      id: 1,
      name: 'Yovani',
      role: 'ADMIN',
      password: "76522553Yovani",
      permissions: [
        'orders.create', 'orders.edit', 'orders.delete', 'orders.view_all', 
        'orders.view_amounts', 'orders.assign_worker', 'config.edit_all', 'config.manage_users', 'config.system'
      ]
    },
    rol: "Administrador",
    email: "yesteves@gmail.com"
  }
];

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    usuario: '',
    contrasena: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Aquí se conectará con la API de Django
    console.log('Login attempt:', formData);
    
    // Simular delay de API

    setTimeout(() => {
      const personalLogin = personales.find(
        personal =>
          personal.user.name === formData.usuario &&
          personal.user.password === formData.contrasena
      );

      if (!personalLogin) {
        alert('Usuario o contraseña incorrectos');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      // Redirigir al dashboard después de login exitoso
      localStorage.setItem('mveloz_user', JSON.stringify(personalLogin));
      navigate('/dashboard');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.usuario && formData.contrasena) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center drop-shadow-lg text-5xl font-bold text-white mb-2 tracking-wider">
            M<span className="text-red-600">Veloz</span>
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-4"></div>
          <p className="mt-2 text-center text-gray-300 text-lg font-light">
            Inicia sesión en tu cuenta
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border-2 border-red-600">
            <div className="space-y-6">
              <div>
                <label htmlFor="usuario" className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">

                  Usuario
                </label>
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  value={formData.usuario}
                  onChange={handleInputChange}
                  onKeyUp={handleKeyPress}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"

                  placeholder="Ingresa tu usuario"
                />
              </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                  contrasena
                </label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  onKeyUp={handleKeyPress}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 font-medium"
                  placeholder="Ingresa tu contrasena"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.usuario || !formData.contrasena}
                  className="w-full flex justify-center py-4 px-6 border-2 border-red-600 rounded-lg shadow-lg text-base font-bold text-white bg-red-600 hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 uppercase tracking-wider"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </div>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            ¿Olvidaste tu contrasena? 
            <span className="text-red-500 hover:text-red-400 cursor-pointer font-medium ml-1">
              Recuperar acceso
            </span>
          </p>
        </div>
      </div>
    </div>
  )
};

export default Login;
