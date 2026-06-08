import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../01.- Atoms/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix necesario en Vite para que el ícono azul del marcador aparezca correctamente
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🟢 NUEVO: Componente unificado que maneja los clics y el movimiento de la cámara
const MapInteraction = ({ latitud, longitud, setLatitud, setLongitud, centerTrigger, setCenterTrigger }) => {
  const map = useMapEvents({
    // 1. Escuchar los clics del usuario en el mapa
    click(e) {
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
    },
  });

  // 2. Mover la cámara SOLO cuando se usa el botón "Obtener mi ubicación"
  useEffect(() => {
    if (centerTrigger && latitud && longitud) {
      map.flyTo([latitud, longitud], 15); // Vuela a las coordenadas con zoom 15
      setCenterTrigger(false); // Apagamos el trigger
    }
  }, [centerTrigger, latitud, longitud, map, setCenterTrigger]);

  // Si existen coordenadas, dibuja el pin
  return latitud && longitud ? <Marker position={[latitud, longitud]} /> : null;
};

export const ReportFireForm = () => {
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [tipoIncendio, setTipoIncendio] = useState("FORESTAL");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 🟢 NUEVO: Estado para avisarle al mapa que debe volar a la ubicación del GPS
  const [centerTrigger, setCenterTrigger] = useState(false);

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude);
        setLongitud(position.coords.longitude);
        setCenterTrigger(true); // 🟢 Dispara el movimiento de la cámara
        setError("");
      },
      () => {
        setError("No se pudo obtener tu ubicación.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!latitud || !longitud) {
      setError("Debes indicar la ubicación en el mapa antes de enviar el reporte.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        latitud: Number(latitud),
        longitud: Number(longitud),
        descripcion,
        tipoIncendio,
      };

      const response = await fetch(
        "http://localhost:1018/api/bff/emergencias/reportar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Error al enviar el reporte");
      }

      const data = await response.json(); 

      navigate("/success", { 
        state: { codigoSeguimiento: data.codigoSeguimiento } 
      }); 

    } catch (err) {
      setError(err.message || "Error al enviar el reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Enviar Reporte de Emergencia</h2>
      <p>Describa la situación del incendio para notificar a las brigadas.</p>

      <div className="form-group">
        <label className="form-label" htmlFor="tipoIncendio">
          Tipo de incendio
        </label>
        <select
          id="tipoIncendio"
          className="form-input"
          value={tipoIncendio}
          onChange={(e) => setTipoIncendio(e.target.value)}
          required
        >
          <option value="FORESTAL">Forestal</option>
          <option value="URBANO">Urbano</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reporte">
          Detalle de la Emergencia
        </label>
        <textarea
          id="reporte"
          name="reporte"
          placeholder="Ej: Se observa foco de humo denso en la quebrada..."
          className="form-input form-textarea"
          rows="4"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Ubicación</label>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
          Haz clic en el mapa para marcar el punto, o usa tu ubicación actual.
        </p>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <Button type="button" onClick={obtenerUbicacion}>
            📍 Obtener mi ubicación actual
          </Button>
        </div>

        {/* MAPA DE LEAFLET */}
        <div style={{ height: "300px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid #ccc", marginBottom: "1rem", position: "relative" }}>
          <MapContainer 
            center={[-33.6891, -71.2146]} // Centro en Melipilla
            zoom={11} 
            style={{ height: "100%", width: "100%", zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* 🟢 NUEVO: Inyectamos nuestro componente que escucha los clics */}
            <MapInteraction 
              latitud={latitud} 
              longitud={longitud} 
              setLatitud={setLatitud} 
              setLongitud={setLongitud}
              centerTrigger={centerTrigger}
              setCenterTrigger={setCenterTrigger}
            />
          </MapContainer>
        </div>

        {/* Coordenadas en texto */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            className="form-input"
            type="text"
            placeholder="Latitud"
            value={latitud ? Number(latitud).toFixed(5) : ""}
            readOnly
          />
          <input
            className="form-input"
            type="text"
            placeholder="Longitud"
            value={longitud ? Number(longitud).toFixed(5) : ""}
            readOnly
          />
        </div>
      </div>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <div style={{ marginTop: "1.5rem" }}>
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Reporte"}
        </Button>
      </div>
    </form>
  );
};