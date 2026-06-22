import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../../04.- Templates/MainLayout";
import { Button } from "../../01.- Atoms/Button";
import "./SeguimientoPage.css";

export const SeguimientoPage = () => {
  const [codigo, setCodigo] = useState("");
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuscar = async (e) => {
    e.preventDefault();

    if (!codigo.trim()) {
      setError("Ingrese un código.");
      return;
    }

    setLoading(true);
    setError("");
    setReporte(null);

    try {
      const response = await fetch(
        `http://localhost:1020/api/bff/emergencias/reportes/seguimiento/${codigo.trim()}`
      );
    


      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Código no encontrado."
            : "Error en el servidor."
        );
      }

      const data = await response.json();
      setReporte(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="seguimiento-container">
        <div className="seguimiento-card form-card">
          <Link to="/" className="back-link">
            &larr; Volver
          </Link>

          <h2>Estado de tu Reporte</h2>

          <p className="seguimiento-description">
            Ingresa tu código de 8 caracteres para ver la situación actual.
          </p>

          <form className="seguimiento-form" onSubmit={handleBuscar}>
            <input
              type="text"
              className="form-input seguimiento-input"
              placeholder="Ej: ABC123XY"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              required
            />

            {error && <div className="error-text">{error}</div>}

            <Button type="submit" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {reporte && (
            <div className="resultado-simple">
              <h3>
                Estado:{" "}
                <span className={`badge-estado ${reporte.estado}`}>
                  {reporte.estado || "RECIBIDO"}
                </span>
              </h3>

              <ul>
                <li>
                  <strong>Tipo:</strong> Incendio {reporte.tipoIncendio}
                </li>
                <li>
                  <strong>Fecha:</strong>{" "}
                  {new Date(reporte.fechaReporte).toLocaleDateString("es-CL")}
                </li>
                <li>
                  <strong>Detalle:</strong> {reporte.descripcion}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};