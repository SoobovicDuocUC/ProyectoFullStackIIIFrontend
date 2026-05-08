import { MainLayout } from "../../04.- Templates/MainLayout";
import { ReportFireForm } from "../../03.- Organisms/ReportFireForm";
import "./LandingPage.css"; 

export const LandingPage = () => {
  return (
    <MainLayout>
      <div className="landing-hero-section">
        <div className="landing-text-block">
          <h2>Portal de Reportes</h2>
          <p>
            Si avista una columna de humo o un foco de incendio, utilice este formulario de inmediato. 
            La información será enviada directamente a las brigadas de respuesta rápida.
          </p>
        </div>

        <div className="landing-form-wrapper">
          <ReportFireForm />
        </div>
      </div>
    </MainLayout>
  );
};