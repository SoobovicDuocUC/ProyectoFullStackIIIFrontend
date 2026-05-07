import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../01.- Atoms/Button";

export const ReportFireForm = () => {
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [tipoIncendio, setTipoIncendio] = useState("FORESTAL");
  const [anonimo, setAnonimo] = useState(true);
  const [runCiudadano, setRunCiudadano] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude);
        setLongitud(position.coords.longitude);
        setError("");
      },
      () => {
        setError("No se pudo obtener tu ubicación.");
      }
    );
  };

  const handleAnonimoChange = (e) => {
    const value = e.target.checked;
    setAnonimo(value);
    if (value) {
      setRunCiudadano("");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!latitud || !longitud) {
    setError("Debes obtener tu ubicación antes de enviar el reporte.");
    setLoading(false);
    return;
  }

  if (!anonimo && !runCiudadano.trim()) {
    setError("Debes ingresar tu RUN si el reporte no es anónimo.");
    setLoading(false);
    return;
  }

  try {
    const payload = {
  latitud: Number(latitud),
  longitud: Number(longitud),
  descripcion,
  tipoIncendio,
  anonimo,
  runCiudadano: anonimo ? null : runCiudadano
};

    const response = await fetch(
      "http://localhost:8082/api/bff/emergencias/reportar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Error al enviar el reporte");
    }

    navigate("/success");
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
          rows="6"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Ubicación</label>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <Button type="button" onClick={obtenerUbicacion}>
            Obtener ubicación
          </Button>
        </div>

        <input
          className="form-input"
          type="text"
          placeholder="Latitud"
          value={latitud}
          readOnly
        />
        <input
          className="form-input"
          type="text"
          placeholder="Longitud"
          value={longitud}
          readOnly
          style={{ marginTop: "0.5rem" }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={anonimo}
            onChange={handleAnonimoChange}
          />
          {" "}Reportar como anónimo
        </label>
      </div>

      {!anonimo && (
        <div className="form-group">
          <label className="form-label" htmlFor="runCiudadano">
            RUN del ciudadano
          </label>
          <input
            id="runCiudadano"
            className="form-input"
            type="text"
            placeholder="12.345.678-9"
            value={runCiudadano}
            onChange={(e) => setRunCiudadano(e.target.value)}
            required={!anonimo}
          />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar Reporte"}
      </Button>
    </form>
  );
};