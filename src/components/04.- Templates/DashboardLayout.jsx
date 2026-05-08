import './../../index.css';
import { AuthHeader } from '../03.- Organisms/AuthHeader';
import { Footer } from '../03.- Organisms/Footer';
import './DashboardLayout.css';

export const DashboardLayout = ({ children }) => {
  // INTEGRACIÓN API - Implementar verificación de permisos por rol
  // INTEGRACIÓN API - Agregar manejo de estados de carga y errores globales
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
