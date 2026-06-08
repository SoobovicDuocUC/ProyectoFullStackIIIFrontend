import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../01.- Atoms/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Arreglo para el icono por defecto de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente hijo para manejar el clic en el mapa
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

export const ReportFireForm = () => {
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [tipoIncendio, setTipoIncendio] = useState("FORESTAL");
  const [position, setPosition] = useState(null); // Guardar谩 {lat, lng}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mapRef = useRef(null);

  // Coordenadas centrales de Melipilla para iniciar el mapa
  const centroMelipilla = [-33.6891, -71.2146];

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalizaci贸n.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        setError("");
        if (mapRef.current) {
          mapRef.current.flyTo(newPos, 15); // Hace un zoom suave hacia la ubicaci贸n
        }
      },
      () => {
        setError("No se pudo obtener tu ubicaci贸n.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!position) {
      setError("Debes seleccionar una ubicaci贸n en el mapa haciendo clic.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        latitud: position.lat,
        longitud: position.lng,
        descripcion,
        tipoIncendio,
      };

      const response = await fetch(
        "http://localhost:8082/api/bff/emergencias/reportar",
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
      <p>Describa la situaci贸n del incendio para notificar a las brigadas.</p>

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
        <label className="form-label">Ubicaci贸n de la emergencia</label>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
          Haz clic en el mapa para marcar el lugar exacto del incendio.
        </p>
        
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Button type="button" onClick={obtenerUbicacion}>
            馃搷 Usar mi ubicaci贸n actual
          </Button>
        </div>

        {/* CONTENEDOR DEL MAPA DE LEAFLET */}
        <div style={{ height: "300px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid #ccc" }}>
          <MapContainer 
            center={centroMelipilla} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        {position && (
          <p style={{ fontSize: '0.85rem', color: 'green', marginTop: '0.5rem' }}>
            Ubicaci贸n seleccionada: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </p>
        )}
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