import { FormField } from "../02.- Molecules/FormField";
import { Button } from "../01.- Atoms/Button";
// 🟢 NUEVO: Importamos useEffect
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";

export const LoginBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 NUEVO: Efecto para redirigir si ya hay una sesión activa
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/reportes");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        email: email.trim(),
        password: password.trim(),
      };

      const response = await fetch("http://10.24.130.46:1020/api/bff/emergencias/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas. Verifica tu correo y contraseña.");
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