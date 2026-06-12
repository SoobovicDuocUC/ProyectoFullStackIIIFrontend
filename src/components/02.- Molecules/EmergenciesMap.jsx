import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Badge } from "../01.- Atoms/Badge";

// Componente interno: mueve el mapa al centroide del polígono de riesgo
const MapFlyTo = ({ center, zoom = 14 }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { animate: true, duration: 1.2 });
  }, [center]);
  return null;
};

export const EmergenciesMap = ({ reports, riesgoData, onClearRiesgo }) => {
  const defaultCenter = [-33.6891, -71.2146];

  const validReports = reports?.filter(
    r => r.coordenadas?.latitud && r.coordenadas?.longitud
  ) || [];

  // Convertir los puntos del DTO a formato Leaflet [[lat, lng], ...]
  const evacuationZone = riesgoData?.zona?.perimetro
  ?.map(p => [p.latitud, p.longitud]) || null;

const safeRoute = riesgoData?.ruta?.puntosRuta
  ?.map(p => [p.latitud, p.longitud]) || null;

  // Calcular centroide del polígono para hacer flyTo ahí
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
    <div style={{ marginBottom: "2rem" }}>

      {/* ── Banner superior de análisis activo ── */}
      {hasRiesgo && (
        <div style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fca5a5",
          borderRadius: "8px 8px 0 0",
          padding: "0.65rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <div>
            <span style={{ color: "#dc2626", fontWeight: "bold", fontSize: "0.92rem" }}>
              🔥 Análisis de Riesgo — Reporte #{riesgoData.reportId}
            </span>
            {riesgoData.zona?.descripcion && (
              <span style={{ color: "#7f1d1d", fontSize: "0.8rem", marginLeft: "1rem" }}>
                {riesgoData.zona.descripcion}
              </span>
            )}
          </div>
          <button
            onClick={onClearRiesgo}
            style={{
              backgroundColor: "#dc2626", color: "white",
              border: "none", borderRadius: "4px",
              padding: "0.3rem 0.75rem", cursor: "pointer",
              fontSize: "0.8rem", fontWeight: "600"
            }}
          >
            ✕ Limpiar mapa
          </button>
        </div>
      )}

      {/* ── Contenedor del mapa ── */}
      <div style={{
        position: "relative",
        height: "420px",
        width: "100%",
        borderRadius: hasRiesgo ? "0 0 8px 8px" : "8px",
        overflow: "hidden",
        border: hasRiesgo ? "2px solid #fca5a5" : "1px solid #e5e7eb",
        borderTop: hasRiesgo ? "none" : undefined,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <MapContainer
          center={initialCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Volar al área de riesgo cuando cambian los datos */}
          {flyCenter && <MapFlyTo center={flyCenter} zoom={14} />}

          {/* Marcadores de reportes */}
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

          {/* Zona de evacuación — polígono rojo semi-transparente */}
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

          {/* Ruta segura — línea verde */}
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

        {/* ── Leyenda flotante (solo cuando hay riesgo activo) ── */}
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
    </div>
  );
};