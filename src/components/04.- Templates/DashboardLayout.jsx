import { Navigate } from 'react-router-dom'; // 🔴 Importamos Navigate
import './../../index.css';
import { AuthHeader } from '../03.- Organisms/AuthHeader';
import { Footer } from '../03.- Organisms/Footer';
import './DashboardLayout.css';

export const DashboardLayout = ({ children }) => {
  
  // 🔴 NUEVO: Buscamos el token en el navegador
  const token = localStorage.getItem("token");

  // Si no hay token, lo redirigimos inmediatamente a la pantalla de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container dashboard-layout">
      <AuthHeader />
      <div className="dashboard-layout-content">
        <div className="dashboard-layout-container">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};