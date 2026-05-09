import { FormField } from "../02.- Molecules/FormField";
import { Button } from "../01.- Atoms/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginBox = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        rut: rut.trim(),
        password: password.trim(),
      };

      const response = await fetch("http://localhost:8082/api/bff/emergencias/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas. Verifica tu RUT y ClaveÚnica.");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/reportes");

    } catch (err) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <p>Acceda de manera segura utilizando su credencial institucional del Estado.</p>
      
      <FormField 
        label="R.U.T. (Ej: 12.345.678-9)" 
        id="rut" 
        type="text" 
        placeholder="Ingrese su R.U.T."
        value={rut}
        onChange={(e) => setRut(e.target.value)}
        required
      />
      <FormField 
        label="ClaveÚnica" 
        id="password" 
        type="password" 
        placeholder="••••••••" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {error && (
        <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <Button type="submit" disabled={loading}>
          {loading ? "Validando credenciales..." : "Ingresar con ClaveÚnica"}
        </Button>
      </div>
    </form>
  );
};