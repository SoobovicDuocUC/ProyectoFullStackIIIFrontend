import { Link } from 'react-router-dom';
import { MainLayout } from "../../04.- Templates/MainLayout";
import "./SuccessPage.css";

export const SuccessPage = () => {
  return (
    <MainLayout>
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Reporte Enviado</h2>
        <p>El reporte ha sido procesado exitosamente. Los organismos de emergencia locales han sido alertados.</p>
        
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