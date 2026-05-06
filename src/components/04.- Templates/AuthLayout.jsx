import './../../index.css';
import { AuthHeader } from '../../components/03.- Organisms/AuthHeader';
import { Footer } from '../../components/03.- Organisms/Footer';

export const AuthLayout = ({ children }) => {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <AuthHeader />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ color: 'var(--accent)', fontSize: '2.2rem', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Acceso Restringido
            </h1>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '1.1rem' }}>
              Portal exclusivo para autoridades y equipos de emergencia
            </p>
          </div>
          {children}

        </div>
      </div>
      <Footer />
    </div>
  );
};