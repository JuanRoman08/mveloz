import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


interface AuthUser {
  usuario: string;
  role: 'ADMIN' | 'WORKER';
  permissions: string[];
}

interface LoginForm {
  usuario: string;
  contrasena: string;
}

interface UserContextProps {
  user: AuthUser | null;
  login: (form: LoginForm) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (form: LoginForm): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) return false;

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('mveloz_user', JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mveloz_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
