import { useNavigate } from 'react-router-dom';
import { Button } from "../01.- Atoms/Button";

export const ReportFireForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would process the backend submission in the future
    navigate('/success'); // Redirects to Success page
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Enviar Reporte de Emergencia</h2>
      <p>Describa la situación del incendio forestal para notificar a las brigadas.</p>

      <div className="form-group">
        <label className="form-label" htmlFor="reporte">Detalle de la Emergencia</label>
        <textarea 
          id="reporte" 
          name="reporte" 
          placeholder="Ej: Se observa foco de humo denso en la quebrada..." 
          className="form-input form-textarea"
          rows="6"
          required
        />
      </div>

      <Button type="submit">Enviar Reporte</Button>
    </form>
  );
};