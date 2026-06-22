import { useNavigate } from "react-router-dom";
import { Button } from "../01.- Atoms/Button";
import "./DashboardFirst.css";

export const DashboardFirst = ({ autoridad }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    
    navigate("/login");
  };

  return (
    <div className="dashboard-first">
      <div className="dashboard-first-content">
        <h1>Panel de Reportes</h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f5f5f5' }}>Bienvenido:</span>
          <span>{autoridad?.email}</span>
        </p>
      </div>
      <Button onClick={handleLogout} className="dashboard-first-button">
        Cerrar Sesión
      </Button>
    </div>
  );
};