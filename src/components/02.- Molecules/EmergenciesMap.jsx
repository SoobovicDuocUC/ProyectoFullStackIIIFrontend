import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from "../01.- Atoms/Badge";


const MapFlyTo = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { animate: true, duration: 1.2 });
  }, [center]);
  return null;
};

export const EmergenciesMap = ({ reports, riesgoData }) => {
  const defaultCenter = [-33.6891, -71.2146];

  const validReports = reports?.filter(
    r => r.coordenadas?.latitud && r.coordenadas?.longitud
  ) || [];


  const evacuationZone = riesgoData?.zona?.perimetro
    ?.map(p => [p.latitud, p.longitud]) || null;

  const safeRoute = riesgoData?.ruta?.puntosRuta
    ?.map(p => [p.latitud, p.longitud]) || null;


  const flyCenter = (() => {
    if (!riesgoData) return null;
    const poly = riesgoData.zona?.perimetro;
    if (poly?.length) {
      return [
        poly.reduce((s, p) => s + p.latitud, 0) / poly.length,
        poly.reduce((s, p) => s + p.longitud, 0) / poly.length,
      ];
    }
    return riesgoData.reportCenter || null;
  })();

  const initialCenter = validReports.length > 0
    ? [validReports[0].coordenadas.latitud, validReports[0].coordenadas.longitud]
    : defaultCenter;

  const hasRiesgo = !!riesgoData;

  return (
    
    <div style={{ position: "relative", height: "100%", minHeight: "450px", width: "100%", borderRadius: "8px", overflow: "hidden", zIndex: 1 }}>
      <MapContainer
        center={initialCenter}
        zoom={12}
        
        style={{ height: "100%", minHeight: "450px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {flyCenter && <MapFlyTo center={flyCenter} zoom={14} />}
        
        {validReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.coordenadas.latitud, report.coordenadas.longitud]}
          >
            <Popup>
              <div style={{ minWidth: "150px" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}>
                  Reporte #{report.id}
                </h4>
                <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.88rem" }}>
                  {report.tipoIncendio}
                </p>
                <Badge variant={report.prioridad?.toLowerCase()}>
                  {report.prioridad}
                </Badge>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.78rem", color: "#666" }}>
                  {report.descripcion?.substring(0, 55)}...
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        
        {evacuationZone && (
          <Polygon
            positions={evacuationZone}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#ef4444",
              fillOpacity: 0.18,
              weight: 2.5,
              dashArray: "8, 5"
            }}
          />
        )}

        {safeRoute && (
          <Polyline
            positions={safeRoute}
            pathOptions={{
              color: "#16a34a",
              weight: 4,
              dashArray: "14, 6",
              lineCap: "round"
            }}
          />
        )}
      </MapContainer>

      {hasRiesgo && (
        <div style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "0.75rem",
          zIndex: 1000,
          backgroundColor: "white",
          padding: "0.6rem 0.85rem",
          borderRadius: "6px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          fontSize: "0.78rem",
          pointerEvents: "none"
        }}>
          <p style={{ margin: "0 0 0.45rem", fontWeight: "700", color: "#1f2937" }}>
            Leyenda
          </p>
          {evacuationZone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <div style={{
                width: 18, height: 13,
                backgroundColor: "rgba(239,68,68,0.18)",
                border: "2px dashed #dc2626",
                borderRadius: "2px"
              }} />
              <span style={{ color: "#374151" }}>Zona de evacuación</span>
            </div>
          )}
          {safeRoute && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: 22, height: 4,
                backgroundColor: "#16a34a",
                borderRadius: "2px"
              }} />
              <span style={{ color: "#374151" }}>Ruta segura</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};