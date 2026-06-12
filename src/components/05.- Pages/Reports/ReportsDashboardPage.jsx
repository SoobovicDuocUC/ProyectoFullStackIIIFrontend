import { useEffect, useState, useRef } from "react";   // ← añadir useRef
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../04.- Templates/DashboardLayout";
import { DashboardFirst } from "../../03.- Organisms/DashboardFirst";
import { ReportsTable } from "../../03.- Organisms/ReportsTable";
import { EmergenciesMap } from "../../02.- Molecules/EmergenciesMap";
import "./ReportsDashboardPage.css";

const BFF_BASE = "http://192.168.1.9:1019";

export const ReportsDashboardPage = () => {
  const [autoridad] = useState(() => {
    const usuarioData = localStorage.getItem("usuario");
    return usuarioData ? JSON.parse(usuarioData) : null;
  });

  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Estado de riesgo ──
  const [riesgoData, setRiesgoData] = useState(null);
  const [loadingRiesgo, setLoadingRiesgo] = useState(false);
  const mapRef = useRef(null);   // para hacer scroll al mapa

  const navigate = useNavigate();

  // ── Carga inicial de reportes ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !autoridad) { navigate("/login"); return; }

    const cargarReportes = async () => {
      try {
        const response = await fetch(`${BFF_BASE}/api/bff/emergencias/reportes`, {
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
        if (!response.ok) throw new Error("Error al intentar obtener los reportes del servidor.");

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
        if (err.message.includes("sesión")) setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    cargarReportes();
  }, [navigate, autoridad]);

  // ── Cambio de estado de un reporte ──
  const handleStatusChange = async (reportId, nuevoEstado) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${BFF_BASE}/api/bff/emergencias/reportes/${reportId}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ estado: nuevoEstado })
        }
      );
      if (!response.ok) throw new Error("Error al actualizar el estado");
      setReports(reports.map(r => r.id === reportId ? { ...r, estado: nuevoEstado } : r));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Cargar y mostrar riesgo de un reporte ──
  const handleVerRiesgo = async (report) => {
  if (report.coordenadas?.latitud == null || report.coordenadas?.longitud == null) {
    alert("Este reporte no tiene coordenadas válidas para analizar.");
    return;
  }

  const token = localStorage.getItem("token");
  setLoadingRiesgo(true);
  setRiesgoData(null);

  try {
    const lat = report.coordenadas.latitud;
    const lng = report.coordenadas.longitud;

    const [zonaRes, rutaRes] = await Promise.all([
      fetch(
        `${BFF_BASE}/api/bff/emergencias/riesgos/${report.id}/zona-evacuacion?lat=${lat}&lng=${lng}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      ),
      fetch(
        `${BFF_BASE}/api/bff/emergencias/riesgos/${report.id}/ruta-segura?lat=${lat}&lng=${lng}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
    ]);

    if (!zonaRes.ok || !rutaRes.ok) {
      throw new Error("El servicio de riesgo no está disponible en este momento.");
    }

    const zona = await zonaRes.json();
    const ruta = await rutaRes.json();

    console.log("ZONA:", JSON.stringify(zona, null, 2));
    console.log("RUTA:", JSON.stringify(ruta, null, 2));

    setRiesgoData({
      zona,
      ruta,
      reportId: report.id,
      reportCenter: [lat, lng]
    });

    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    alert(`Error al cargar el análisis de riesgo: ${err.message}`);
  } finally {
    setLoadingRiesgo(false);
  }
};

  const handleClearRiesgo = () => setRiesgoData(null);

  if (!autoridad) return <div>Cargando sesión...</div>;

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

            {/* ── Mapa (con ref para scroll automático) ── */}
            <div ref={mapRef}>
              <EmergenciesMap
                reports={reports}
                riesgoData={riesgoData}
                onClearRiesgo={handleClearRiesgo}
              />
            </div>

            {/* Indicador de carga de riesgo */}
            {loadingRiesgo && (
              <p style={{
                color: '#1d4ed8',
                fontWeight: '600',
                fontSize: '0.9rem',
                marginBottom: '0.75rem'
              }}>
                ⏳ Cargando análisis de riesgo...
              </p>
            )}

            <ReportsTable
              reports={reports}
              rolUsuario={autoridad.rol || autoridad.role}
              onStatusChange={handleStatusChange}
              onVerRiesgo={handleVerRiesgo}       // ← NUEVO
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};