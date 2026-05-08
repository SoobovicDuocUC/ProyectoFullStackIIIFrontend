import { Link, useLocation } from 'react-router-dom';
import { MainLayout } from "../../04.- Templates/MainLayout";
import "./SuccessPage.css";

export const SuccessPage = () => {
  const location = useLocation();
  // Rescatamos el código que viene desde ReportFireForm
  const codigo = location.state?.codigoSeguimiento;

  return (
    <MainLayout>
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Reporte Enviado</h2>
        <p>El reporte ha sido procesado exitosamente. Los organismos de emergencia locales han sido alertados.</p>
        
        {/* NUEVA SECCIÓN: Mostrar el código de seguimiento si existe */}
        {codigo && (
          <div className="tracking-code-container">
            <p>Tu código de seguimiento anónimo es:</p>
            <h3 className="tracking-code">{codigo}</h3>
            <p className="tracking-hint">Por favor, guarda o anota este código para consultar el estado de tu reporte más adelante.</p>
          </div>
        )}
        
        <hr className="success-divider" />
        
        <div className="login-prompt-section">
          <p className="login-text">¿Eres personal institucional u organismo estatal?</p>
          <Link to="/login" className="success-login-button">
            Acceso Autoridades
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};