import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import Ordenes from './components/Ordenes';
import Configuracion from './components/Configuracion';

// Componente wrapper para manejar el layout del dashboard
const DashboardWrapper: React.FC = () => {
  const location = useLocation();
  
  // Determinar la sección activa basada en la ruta
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/dashboard/clientes') return 'clientes';
    if (path === '/dashboard/ordenes') return 'ordenes';
    if (path === '/dashboard/configuracion') return 'configuracion';
    return 'dashboard';
  };

  // Función para manejar cambio de sección (navegación programática)
  const handleSectionChange = (section: string) => {
    // Esta función se puede usar si quieres navegación programática
    // Por ahora, la navegación se maneja via rutas de React Router
    console.log('Cambio a sección:', section);
  };

  // Renderizar el contenido apropiado basado en la ruta
  const renderContent = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/dashboard':
        return <Dashboard />;
      case '/dashboard/clientes':
        return <Clientes />;
      case '/dashboard/ordenes':
        return <Ordenes />;
      case '/dashboard/configuracion':
        return <Configuracion />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout
      activeSection={getActiveSection()}
      onSectionChange={handleSectionChange}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<DashboardWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;