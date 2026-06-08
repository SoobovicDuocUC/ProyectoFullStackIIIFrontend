import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../04.- Templates/DashboardLayout";
import { DashboardFirst } from "../../03.- Organisms/DashboardFirst";
import { ReportsTable } from "../../03.- Organisms/ReportsTable";
import { EmergenciesMap } from "../../02.- Molecules/EmergenciesMap";

import "./ReportsDashboardPage.css";

export const ReportsDashboardPage = () => {
  const [autoridad] = useState(() => {
    const usuarioData = localStorage.getItem("usuario");
    return usuarioData ? JSON.parse(usuarioData) : null;
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !autoridad) {
      navigate("/login");
      return;
    }

    const cargarReportes = async () => {
      try {
        const response = await fetch("http://localhost:8082/api/bff/emergencias/reportes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          throw new Error("Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión nuevamente.");
        }

        if (!response.ok) {
          throw new Error("Error al intentar obtener los reportes del servidor.");
        }

        const data = await response.json();

        const mappedReports = data.map((rep) => ({
          id: rep.id,
          codigoSeguimiento: rep.codigoSeguimiento,
          fecha: rep.fechaReporte,
          descripcion: rep.descripcion,
          coordenadas: { latitud: rep.latitud, longitud: rep.longitud },
          prioridad: rep.nivelPrioridad || "NO ASIGNADA",
          tipoIncendio: rep.tipoIncendio,
          equipoAsignado: rep.equipoAsignado || "SIN ASIGNAR",
          estado: rep.estado || "PENDIENTE"
        }));

        setReports(mappedReports);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("sesión")) {
            setTimeout(() => navigate("/login"), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarReportes();
  }, [navigate, autoridad]);

  const handleStatusChange = async (reportId, nuevoEstado) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8082/api/bff/emergencias/reportes/${reportId}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado");
      }

      setReports(reports.map(report => 
        report.id === reportId ? { ...report, estado: nuevoEstado } : report
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!autoridad) {
    return <div>Cargando sesión...</div>;
  }

  return (
    <DashboardLayout>
      <DashboardFirst autoridad={autoridad} />
      
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
        
        {loading && <p style={{ color: '#0056b3' }}>Conectando con el servidor...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
              <p>Total de reportes recibidos: <strong>{reports.length}</strong></p>
            </div>

            {/* 🟢 NUEVO: Aquí insertamos el mapa. Le pasamos los reportes para que dibuje los pines */}
            <EmergenciesMap reports={reports} />
            
            <ReportsTable 
              reports={reports} 
              rolUsuario={autoridad.rol || autoridad.role} 
              onStatusChange={handleStatusChange} 
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};