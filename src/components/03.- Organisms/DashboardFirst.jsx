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
        <p className="user-welcome">
          <span className="welcome-label">Bienvenido:</span>
          <span>{autoridad?.email}</span>
        </p>
      </div>

      
      <div className="logout-button-container">
        <Button onClick={handleLogout} className="btn-logout-small">
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};