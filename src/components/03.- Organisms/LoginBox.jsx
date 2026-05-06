import { FormField } from "../02.- Molecules/FormField";
import { Button } from "../01.- Atoms/Button";

export const LoginBox = () => {
  return (
    <form className="form-card" style={{ maxWidth: '400px' }}>
      <h2 style={{ color: 'var(--text-h)', marginBottom: '5px' }}>Iniciar Sesión</h2>
      <p style={{ marginBottom: '2rem' }}>Ingrese sus credenciales institucionales.</p>
      
      <FormField 
        label="Correo o R.U.T." 
        id="username" 
        type="text" 
        placeholder="autoridad@emergencias.cl" 
      />
      <FormField 
        label="Contraseña" 
        id="password" 
        type="password" 
        placeholder="••••••••" 
      />
      
      <div style={{ marginTop: '2rem' }}>
        <Button type="submit">Ingresar al Sistema</Button>
      </div>
    </form>
  );
};