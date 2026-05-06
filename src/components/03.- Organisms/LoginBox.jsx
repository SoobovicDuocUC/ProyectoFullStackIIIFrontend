import { FormField } from "../02.- Molecules/FormField";
import { Button } from "../01.- Atoms/Button";

export const LoginBox = () => {
  return (
    <form className="form-card" style={{ maxWidth: '400px' }}>
      <h2>Iniciar Sesión</h2>
      <p>Acceda de manera segura utilizando su credencial institucional del Estado.</p>
      
      <FormField 
        label="R.U.T. (Ej: 12.345.678-9)" 
        id="rut" 
        type="text" 
        placeholder="Ingrese su R.U.T." 
      />
      <FormField 
        label="ClaveÚnica" 
        id="password" 
        type="password" 
        placeholder="••••••••" 
      />
      
      <div style={{ marginTop: '2rem' }}>
        <Button type="submit">Ingresar con ClaveÚnica</Button>
      </div>
    </form>
  );
};