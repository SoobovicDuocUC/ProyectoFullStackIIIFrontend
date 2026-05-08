import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../04.- Templates/DashboardLayout";
import { DashboardHeader } from "../../03.- Organisms/DashboardHeader";
import { ReportsTable } from "../../03.- Organisms/ReportsTable";
import "./ReportsDashboardPage.css";

export const ReportsDashboardPage = () => {
  const [autoridad, setAutoridad] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Verificamos el token y los datos del usuario usando las claves correctas
    const token = localStorage.getItem("token");
    const usuarioData = localStorage.getItem("usuario");

    if (!token || !usuarioData) {
      navigate("/login");
      return;
    }
    
    setAutoridad(JSON.parse(usuarioData));

    // 2. Función asíncrona para obtener los reportes del backend
    const fetchReportes = async () => {
      try {
        const response = await fetch("http://localhost:8082/api/bff/emergencias/reportes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Aquí enviamos el pase VIP
          }
        });

        // Manejo de token expirado o inválido
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          throw new Error("Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión nuevamente.");
        }

        if (!response.ok) {
          throw new Error("Error al intentar obtener los reportes del servidor.");
        }

        const data = await response.json();

        // 3. Adaptamos los datos del backend para que la tabla de tu compañero no se rompa
        const mappedReports = data.map((rep) => ({
          id: rep.id,
          codigoSeguimiento: rep.codigoSeguimiento,
          fecha: rep.fechaReporte, // El backend manda fechaReporte, el front espera fecha
          descripcion: rep.descripcion,
          coordenadas: { latitud: rep.latitud, longitud: rep.longitud }, // Agrupamos las coordenadas
          prioridad: rep.nivelPrioridad || "NO ASIGNADA",
          tipoIncendio: rep.tipoIncendio,
          equipoAsignado: rep.equipoAsignado || "SIN ASIGNAR",
          estado: rep.estado || "PENDIENTE"
        }));

        setReports(mappedReports);
      } catch (err) {
        setError(err.message);
        // Si el error fue por sesión, redirigimos tras unos segundos
        if (err.message.includes("sesión")) {
            setTimeout(() => navigate("/login"), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [navigate]);

  if (!autoridad) {
    return <div>Cargando sesión...</div>;
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
        
        {/* Manejo visual de estados de Carga y Error */}
        {loading && <p style={{ color: '#0056b3' }}>Conectando con el servidor...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
              <p>Total de reportes recibidos: <strong>{reports.length}</strong></p>
            </div>
            {/* Le pasamos los datos reales mapeados a la tabla de tu compañero */}
            <ReportsTable reports={reports} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};