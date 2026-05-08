import { FormField } from "../02.- Molecules/FormField";
import { Button } from "../01.- Atoms/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Armamos el payload exacto que espera tu UsuarioRequestDTO
      const payload = {
        email: email.trim(),
        password: password.trim(),
      };

      // 2. Hacemos la petición al BFF
      const response = await fetch("http://localhost:8082/api/bff/emergencias/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas. Verifica tu correo y contraseña.");
      }

      // 3. Obtenemos el AuthResponseDTO (que trae el token y los datos del usuario)
      const data = await response.json();

      // 4. Guardamos el Token y los datos del usuario en el navegador (Local Storage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // 5. Redirigimos al panel de reportes
      navigate("/reportes");

    } catch (err) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
      <h2>Acceso de Funcionarios</h2>
      <p>Acceda utilizando su correo institucional y contraseña.</p>
      
      <FormField 
        label="Correo Electrónico" 
        id="email" 
        type="email" 
        placeholder="Ej: admin@innovatech.cl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormField 
        label="Contraseña" 
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
          {loading ? "Validando credenciales..." : "Iniciar Sesión"}
        </Button>
      </div>
    </form>
  );
};