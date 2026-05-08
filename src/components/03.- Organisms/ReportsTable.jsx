import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../01.- Atoms/Table";
import { Badge } from "../01.- Atoms/Badge";
import "./ReportsTable.css";

export const ReportsTable = ({ reports }) => {
  // TODO: INTEGRACIÓN API - Agregar manejo de estados vacíos y loading states
  // TODO: INTEGRACIÓN API - Implementar ordenamiento por columnas
  // TODO: INTEGRACIÓN API - Agregar filtros por estado, prioridad y tipo de incendio
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'APAGADO':
        return 'success';
      case 'ACTIVO':
        return 'warning';
      case 'PENDIENTE':
        return 'danger';
      case 'INACTIVO':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critica':
        return 'critica';
      case 'alta':
        return 'alta';
      case 'media':
        return 'media';
      case 'baja':
        return 'baja';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCoordinates = (coordenadas) => {
    return `${coordenadas.latitud.toFixed(4)}, ${coordenadas.longitud.toFixed(4)}`;
  };

  const formatEquipo = (equipo) => {
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
        </TableRow>
      </TableHead>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell><span className="report-id">#{report.id}</span></TableCell>
            <TableCell>{formatDate(report.fecha)}</TableCell>
            <TableCell><span className="description" title={report.descripcion}>{report.descripcion.substring(0, 60)}...</span></TableCell>
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
              <Badge variant={getStatusVariant(report.estado)}>
                {report.estado}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
