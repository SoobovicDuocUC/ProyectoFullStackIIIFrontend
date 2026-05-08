import { FormField } from "../02.- Molecules/FormField";
import { Button } from "../01.- Atoms/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginBox = () => {
  // TODO: INTEGRACIÓN API - Reemplazar validación hardcoded con llamada a endpoint de autenticación
  // TODO: INTEGRACIÓN API - Implementar manejo de tokens JWT y refresh tokens
  // TODO: INTEGRACIÓN API - Agregar manejo de errores de autenticación específicos
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const rut = e.target.rut.value.trim();
    const password = e.target.password.value.trim();

    // TODO: INTEGRACIÓN API - Reemplazar array hardcoded con llamada a GET /api/autoridades/validar
    const autoridades = [
      { rut: "11.111.111-1", password: "autoridad123", nombre: "Juan Pérez" },
      { rut: "22.222.222-2", password: "autoridad456", nombre: "María González" },
      { rut: "33.333.333-3", password: "admin789", nombre: "Carlos Rodríguez" }
    ];

    const autoridad = autoridades.find(
      auth => auth.rut === rut && auth.password === password
    );

    if (autoridad) {
      // TODO: INTEGRACIÓN API - Reemplazar con respuesta del endpoint de autenticación
      localStorage.setItem("autoridad", JSON.stringify(autoridad));
      navigate("/reportes");
    } else {
      setError("Credenciales incorrectas. Solo autoridades pueden acceder.");
    }
  };

  return (
    <form className="form-card" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
      <h2>Acceso de Autoridades</h2>
      <p>Acceda de manera segura utilizando su credencial institucional del Estado.</p>
      
      <FormField 
        label="RUN o Pasaporte" 
        id="rut" 
        type="text" 
        placeholder="Ej: 12.345.678-9 o AA123456" 
      />
      <FormField 
        label="ClaveÚnica" 
        id="password" 
        type="password" 
        placeholder="••••••••" 
      />
      
      {error && (
        <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <Button type="submit">Ingresar con ClaveÚnica</Button>
      </div>
    </form>
  );
};