import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import { Badge } from "../01.- Atoms/Badge"; // Ajusta la ruta si es necesario

export const EmergenciesMap = ({ reports }) => {
  // Centro por defecto: Melipilla
  const defaultCenter = [-33.6891, -71.2146];

  // Filtramos los reportes que realmente tengan coordenadas vÃ¡lidas
  const validReports = reports?.filter(r => r.coordenadas && r.coordenadas.latitud && r.coordenadas.longitud) || [];

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "8px", overflow: "hidden", marginBottom: "2rem", border: "1px solid #e5e7eb", boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <MapContainer 
        center={validReports.length > 0 ? [validReports[0].coordenadas.latitud, validReports[0].coordenadas.longitud] : defaultCenter} 
        zoom={12} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validReports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.coordenadas.latitud, report.coordenadas.longitud]}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Reporte #{report.id}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{report.tipoIncendio}</p>
                <div style={{ marginBottom: '0.5rem' }}>
                  <Badge variant={report.prioridad?.toLowerCase()}>{report.prioridad}</Badge>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                  {report.descripcion?.substring(0, 50)}...
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};