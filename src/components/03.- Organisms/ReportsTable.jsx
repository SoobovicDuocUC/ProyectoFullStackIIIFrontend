import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../02.- Molecules/Table";
import { Badge } from "../01.- Atoms/Badge";
import "./ReportsTable.css";

export const ReportsTable = ({ reports, rolUsuario, onStatusChange, onVerRiesgo }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'apagado':  return 'success';
      case 'activo':   return 'warning';
      case 'pendiente': return 'danger';
      case 'inactivo': return 'default';
      default:         return 'default';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critica': return 'critica';
      case 'alta':    return 'alta';
      case 'media':   return 'media';
      case 'baja':    return 'baja';
      default:        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCoordinates = (coordenadas) => {
    if (!coordenadas || coordenadas.latitud == null || coordenadas.longitud == null) return "N/A";
    return `${coordenadas.latitud.toFixed(4)}, ${coordenadas.longitud.toFixed(4)}`;
  };

  const formatEquipo = (equipo) => {
    if (!equipo) return "SIN ASIGNAR";
    return equipo.replace(/_/g, ' ');
  };

  return (
    <Table className="reports-table">
      <TableHead>
        <TableRow>
          <TableHeader>ID</TableHeader>
          <TableHeader>Fecha</TableHeader>
          <TableHeader>Descripción</TableHeader>
          <TableHeader>Coordenadas</TableHeader>
          <TableHeader>Prioridad</TableHeader>
          <TableHeader>Tipo Incendio</TableHeader>
          <TableHeader>Equipo Asignado</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader>Acciones</TableHeader>  
        </TableRow>
      </TableHead>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>
              <span className="report-id">#{report.id}</span>
            </TableCell>
            <TableCell>{formatDate(report.fecha)}</TableCell>
            <TableCell>
              <span className="description" title={report.descripcion}>
                {report.descripcion?.substring(0, 60)}...
              </span>
            </TableCell>
            <TableCell>
              <span className="coordinates">
                {formatCoordinates(report.coordenadas)}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={getPriorityVariant(report.prioridad)}>
                {report.prioridad}
              </Badge>
            </TableCell>
            <TableCell>{report.tipoIncendio}</TableCell>
            <TableCell>{formatEquipo(report.equipoAsignado)}</TableCell>
            <TableCell>
              {rolUsuario === 'BRIGADISTA' ? (
                <select
                  value={report.estado}
                  onChange={(e) => onStatusChange(report.id, e.target.value)}
                  style={{
                    padding: '0.25rem', borderRadius: '4px',
                    border: '1px solid #d1d5db', fontSize: '0.85rem',
                    outline: 'none', cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="APAGADO">APAGADO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              ) : (
                <Badge variant={getStatusVariant(report.estado)}>
                  {report.estado}
                </Badge>
              )}
            </TableCell>

            {/* ── Botón Ver Riesgo ── */}
            <TableCell>
              <button
                onClick={() => onVerRiesgo(report)}
                title="Ver zona de evacuación y ruta segura"
                style={{
                  backgroundColor: "#1d4ed8",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "0.3rem 0.65rem",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  transition: "background-color 0.15s"
                }}
                onMouseEnter={e => e.target.style.backgroundColor = "#1e40af"}
                onMouseLeave={e => e.target.style.backgroundColor = "#1d4ed8"}
              >
                🗺️ Ver Riesgo
              </button>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};