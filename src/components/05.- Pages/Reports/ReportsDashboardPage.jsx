import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../04.- Templates/DashboardLayout";
import { DashboardHeader } from "../../03.- Organisms/DashboardHeader";
import { ReportsTable } from "../../03.- Organisms/ReportsTable";
import "./ReportsDashboardPage.css";

export const ReportsDashboardPage = () => {
  // TODO: INTEGRACIÓN API - Implementar verificación de token JWT con llamada a GET /api/auth/validate
  // TODO: INTEGRACIÓN API - Agregar manejo de sesión expirada y refresh tokens
  // TODO: INTEGRACIÓN API - Implementar loading states y manejo de errores de red
  const [autoridad, setAutoridad] = useState(null);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay una autoridad logueada
    const autoridadData = localStorage.getItem("autoridad");
    if (!autoridadData) {
      navigate("/login");
      return;
    }
    
    const parsedAutoridad = JSON.parse(autoridadData);
    setAutoridad(parsedAutoridad);

    // TODO: INTEGRACIÓN API - Reemplazar con llamada a GET /api/reportes/incendios
    // TODO: INTEGRACIÓN API - Agregar paginación, filtros y ordenamiento
    // TODO: INTEGRACIÓN API - Implementar polling para actualizaciones en tiempo real
    const mockReports = [
      {
        id: 1,
        fecha: "2024-01-15T10:30:00",
        descripcion: "Incendio estructural en edificio residencial de 5 pisos, se requiere intervención inmediata de bomberos urbanos.",
        coordenadas: { latitud: -33.4489, longitud: -70.6693 },
        prioridad: "CRITICA",
        tipoIncendio: "URBANO",
        equipoAsignado: "BOMBEROS_URBANOS",
        estado: "ACTIVO"
      },
      {
        id: 2,
        fecha: "2024-01-15T09:15:00",
        descripcion: "Incendio forestal en zona montañosa, afectando aproximadamente 2 hectáreas de vegetación nativa.",
        coordenadas: { latitud: -33.1234, longitud: -70.5678 },
        prioridad: "ALTA",
        tipoIncendio: "FORESTAL",
        equipoAsignado: "BOMBEROS_FORESTALES",
        estado: "APAGADO"
      },
      {
        id: 3,
        fecha: "2024-01-14T18:45:00",
        descripcion: "Incendio en industria química con riesgo de materiales peligrosos, se requiere equipo especializado.",
        coordenadas: { latitud: -33.4567, longitud: -70.7890 },
        prioridad: "CRITICA",
        tipoIncendio: "URBANO",
        equipoAsignado: "HAZMAT",
        estado: "PENDIENTE"
      },
      {
        id: 4,
        fecha: "2024-01-14T14:20:00",
        descripcion: "Incendio de pequeña magnitud en vivienda unifamiliar, sin personas atrapadas.",
        coordenadas: { latitud: -33.3456, longitud: -70.6789 },
        prioridad: "MEDIA",
        tipoIncendio: "URBANO",
        equipoAsignado: "BOMBEROS_URBANOS",
        estado: "APAGADO"
      },
      {
        id: 5,
        fecha: "2024-01-13T06:00:00",
        descripcion: "Incendio forestal de grandes proporciones en área protegida, se requiere apoyo aéreo.",
        coordenadas: { latitud: -33.2345, longitud: -70.8901 },
        prioridad: "CRITICA",
        tipoIncendio: "FORESTAL",
        equipoAsignado: "APOYO_AEREO",
        estado: "ACTIVO"
      },
      {
        id: 6,
        fecha: "2024-01-13T16:30:00",
        descripcion: "Incendio en subestación eléctrica, requiere brigada especializada en emergencias eléctricas.",
        coordenadas: { latitud: -33.5678, longitud: -70.5432 },
        prioridad: "ALTA",
        tipoIncendio: "URBANO",
        equipoAsignado: "BRIGADA_ESPECIAL",
        estado: "PENDIENTE"
      },
      {
        id: 7,
        fecha: "2024-01-12T22:15:00",
        descripcion: "Incendio controlado en zona de bosque, monitoreo preventivo de posibles reigniciones.",
        coordenadas: { latitud: -33.6789, longitud: -70.4321 },
        prioridad: "BAJA",
        tipoIncendio: "FORESTAL",
        equipoAsignado: "BOMBEROS_FORESTALES",
        estado: "APAGADO"
      },
      {
        id: 8,
        fecha: "2024-01-12T11:00:00",
        descripcion: "Incendio en centro comercial, evacuación completa del recinto, sin lesionados reportados.",
        coordenadas: { latitud: -33.4321, longitud: -70.7654 },
        prioridad: "ALTA",
        tipoIncendio: "URBANO",
        equipoAsignado: "BOMBEROS_URBANOS",
        estado: "INACTIVO"
      }
    ];

    // TODO: INTEGRACIÓN API - Reemplazar con setReports(response.data) y manejo de errores
    setReports(mockReports);
  }, [navigate]);

  if (!autoridad) {
    return <div>Cargando...</div>;
  }

  return (
    <DashboardLayout>
      <DashboardHeader autoridad={autoridad} />
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#1f2937', 
          fontSize: '1.3rem', 
          marginBottom: '1rem',
          borderBottom: '2px solid var(--accent)',
          paddingBottom: '0.5rem'
        }}>
          Registro de Reportes de Emergencia
        </h2>
        
        <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
          <p>Total de reportes: <strong>{reports.length}</strong></p>
        </div>

        <ReportsTable reports={reports} />
      </div>
    </DashboardLayout>
  );
};
