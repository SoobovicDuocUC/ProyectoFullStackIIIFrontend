import { FormField } from "../02.- Molecules/FormField";
import { Button } from "../01.- Atoms/Button";

export const ReportFireForm = () => {
  return (
    <form className="form-card">
      <h2>Portal de Denuncias</h2>
      <p>Ingrese los datos de la emergencia. Las brigadas serán notificadas de inmediato.</p>

      <FormField 
        label="R.U.T. (Ej: 12.345.678-9)" 
        id="rut" 
        type="text" 
        placeholder="Ingrese su RUT" 
      />
      <FormField 
        label="Número de Teléfono" 
        id="telefono" 
        type="tel" 
        placeholder="+56 9 XXXX XXXX" 
      />
      
      <Button type="submit">Enviar Reporte Urgente</Button>
    </form>
  );
};