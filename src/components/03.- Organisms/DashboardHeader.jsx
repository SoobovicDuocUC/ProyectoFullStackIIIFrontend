import { useNavigate } from "react-router-dom";
import { Button } from "../01.- Atoms/Button";
import "./DashboardHeader.css";

export const DashboardHeader = ({ autoridad }) => {
  // TODO: INTEGRACIÓN API - Implementar logout con llamada a POST /api/auth/logout
  // TODO: INTEGRACIÓN API - Limpiar tokens de autenticación del servidor
  // TODO: INTEGRACIÓN API - Agregar validación de sesión expirada
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: INTEGRACIÓN API - Reemplazar con llamada a endpoint de logout
    localStorage.removeItem("autoridad");
    navigate("/login");
  };

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <h1>Panel de Reportes</h1>
        <p>
          Bienvenido, <strong>{autoridad?.nombre}</strong> <br /> RUT: {autoridad?.rut}
        </p>
      </div>
      <Button onClick={handleLogout} className="dashboard-header-button">
        Cerrar Sesión
      </Button>
    </div>
  );
};
