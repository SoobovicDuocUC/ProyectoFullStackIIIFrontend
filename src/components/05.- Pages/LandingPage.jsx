import { MainLayout } from "../04.- Templates/MainLayout";
import { ReportFireForm } from "../03.- Organisms/ReportFireForm";

export const LandingPage = () => {
  return (
    <MainLayout>
      <div className="max-w-[1100px] mx-auto flex flex-col items-center justify-start pt-10 pb-24 px-4">
        
        <div className="text-center mb-8 w-full">
          <h2 className="text-3xl font-extrabold text-[var(--accent)] mb-2 uppercase tracking-tight">
            Portal de Denuncias
          </h2>
          <p className="text-[var(--text)] max-w-2xl mx-auto text-lg">
            Si avista una columna de humo o un foco de incendio, utilice este formulario de inmediato. La información será enviada directamente a las brigadas de respuesta rápida.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <ReportFireForm />
        </div>

      </div>
    </MainLayout>
  );
};