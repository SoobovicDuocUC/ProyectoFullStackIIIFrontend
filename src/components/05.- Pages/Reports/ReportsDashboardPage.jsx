import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../04.- Templates/DashboardLayout";
import { DashboardFirst } from "../../03.- Organisms/DashboardFirst";
import { ReportsTable } from "../../03.- Organisms/ReportsTable";
import { EmergenciesMap } from "../../02.- Molecules/EmergenciesMap";
import "./ReportsDashboardPage.css";

const BFF_BASE = "http://localhost:1020";

export const ReportsDashboardPage = () => {
  const [autoridad] = useState(() => {
    const usuarioData = localStorage.getItem("usuario");
    return usuarioData ? JSON.parse(usuarioData) : null;
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroActual, setFiltroActual] = useState("TODOS");

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [riesgoData, setRiesgoData] = useState(null);
  const [loadingRiesgo, setLoadingRiesgo] = useState(false);
  const mapRef = useRef(null);

  const navigate = useNavigate();

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

  const handleVerRiesgo = async (report) => {
    if (report.coordenadas?.latitud == null || report.coordenadas?.longitud == null) {
      alert("Este reporte no tiene coordenadas válidas para analizar.");
      return;
    }

    const token = localStorage.getItem("token");
    setReporteSeleccionado(report);
    setLoadingRiesgo(true);
    setRiesgoData(null);

    try {
      const lat = report.coordenadas.latitud;
      const lng = report.coordenadas.longitud;

      const [zonaRes, rutaRes] = await Promise.all([
        fetch(
          `${BFF_BASE}/api/bff/emergencias/riesgos/${report.id}/zona-evacuacion?lat=${lat}&lng=${lng}`,
          { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
        ),
        fetch(
          `${BFF_BASE}/api/bff/emergencias/riesgos/${report.id}/ruta-segura?lat=${lat}&lng=${lng}`,
          { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } }
        )
      ]);

      if (!zonaRes.ok || !rutaRes.ok) {
        throw new Error("El servicio de riesgo no está disponible en este momento.");
      }

      const zona = await zonaRes.json();
      const ruta = await rutaRes.json();

      setRiesgoData({
        zona,
        ruta,
        reportId: report.id,
        reportCenter: [lat, lng]
      });
    } catch (err) {
      alert(`Error al cargar el análisis de riesgo: ${err.message}`);
    } finally {
      setLoadingRiesgo(false);
    }
  };

  const cerrarModal = () => {
    setReporteSeleccionado(null);
    setRiesgoData(null);
  };

  const reportesFiltrados = reports.filter((rep) => {
    if (filtroActual === "ACTIVOS") return rep.estado === "ACTIVO";
    if (filtroActual === "ALTA_PRIORIDAD") return rep.prioridad === "ALTA" || rep.prioridad === "CRÍTICA";
    return true; 
  });

  if (!autoridad) return <div>Cargando sesión...</div>;

  const renderContenido = () => {
    if (loading) {
      return <p className="loading-message">Conectando con el servidor...</p>;
    }

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    return (
      <>
        <div className="filters-container">
          <button 
            className={`filter-btn ${filtroActual === "TODOS" ? "active" : ""}`}
            onClick={() => setFiltroActual("TODOS")}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${filtroActual === "ACTIVOS" ? "active" : ""}`}
            onClick={() => setFiltroActual("ACTIVOS")}
          >
            🔥 Solo Activos
          </button>
          <button 
            className={`filter-btn ${filtroActual === "ALTA_PRIORIDAD" ? "active" : ""}`}
            onClick={() => setFiltroActual("ALTA_PRIORIDAD")}
          >
            🚨 Prioridad Alta
          </button>
        </div>

        <div className="reports-summary">
          <p>
            Total de reportes mostrados: <strong>{reportesFiltrados.length}</strong> de {reports.length}
          </p>
        </div>

        <div className="dashboard-split-layout">
          
          <div className="dashboard-map-column" ref={mapRef}>
            <EmergenciesMap
              reports={reportesFiltrados}
            />
          </div>

          <div className="dashboard-table-column">
            <ReportsTable
              reports={reportesFiltrados}
              rolUsuario={autoridad.rol || autoridad.role}
              onStatusChange={handleStatusChange}
              onVerRiesgo={handleVerRiesgo}
            />
          </div>
          
        </div>

        {/* MODAL MANTENIDO EXACTAMENTE IGUAL QUE ANTES */}
        {reporteSeleccionado && (
          <div className="modal-overlay">
            <div className="risk-modal">
              <div className="risk-modal-header">
                <h2>Zona de Riesgo y Evacuación</h2>
                <button className="close-btn-small" onClick={cerrarModal} title="Cerrar ventana">
                  ✕
                </button>
              </div>

              <div className="risk-modal-body">
                <div className="risk-modal-map">
                  {loadingRiesgo ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#1d4ed8', fontWeight: 'bold' }}>
                      ⏳ Cargando mapa y zona de riesgo...
                    </div>
                  ) : (
                    <EmergenciesMap
                      reports={[reporteSeleccionado]}
                      riesgoData={riesgoData}
                    />
                  )}
                </div>

                <div className="risk-modal-info">
                  <h3>Detalles del Reporte #{reporteSeleccionado.id}</h3>
                  <div className="risk-info-item">
                    <strong>Prioridad</strong>
                    <span>{reporteSeleccionado.prioridad}</span>
                  </div>
                  <div className="risk-info-item">
                    <strong>Estado Actual</strong>
                    <span>{reporteSeleccionado.estado}</span>
                  </div>
                  <div className="risk-info-item">
                    <strong>Tipo de Incendio</strong>
                    <span>{reporteSeleccionado.tipoIncendio}</span>
                  </div>
                  <div className="risk-info-item">
                    <strong>Equipo Asignado</strong>
                    <span>
                      {reporteSeleccionado.equipoAsignado 
                        ? reporteSeleccionado.equipoAsignado.replace(/_/g, ' ') 
                        : 'SIN ASIGNAR'}
                    </span>
                  </div>
                  <div className="risk-info-item">
                    <strong>Descripción</strong>
                    <p style={{ marginTop: '5px', lineHeight: '1.4' }}>
                      {reporteSeleccionado.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <DashboardLayout>
      <DashboardFirst autoridad={autoridad} />
      <div className="reports-container">
        <h2 className="reports-title">Registro de Reportes de Emergencia</h2>
        {renderContenido()}
      </div>
    </DashboardLayout>
  );
};