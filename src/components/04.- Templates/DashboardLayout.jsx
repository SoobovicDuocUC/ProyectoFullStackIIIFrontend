import { Navigate } from 'react-router-dom'; // 🔴 Importamos Navigate
import './../../index.css';
import { Header } from '../03.- Organisms/Header';
import { Footer } from '../03.- Organisms/Footer';
import './DashboardLayout.css';

export const DashboardLayout = ({ children }) => {
  
  const token = localStorage.getItem("token");


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container dashboard-layout">
      <Header variant="auth" />
      <div className="dashboard-layout-content">
        <div className="dashboard-layout-container">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};