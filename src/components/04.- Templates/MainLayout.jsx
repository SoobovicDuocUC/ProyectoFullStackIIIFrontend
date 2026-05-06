import './../../index.css';

export const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <header className="header-bar">
        <h1 className="header-title">Sistema de Alerta Forestal</h1>
        <nav>
          <a href="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            Acceso Autoridades
          </a>
        </nav>
      </header>
      
      <main className="main-content">
        {children}
      </main>

      <footer style={{ backgroundColor: 'var(--code-bg)', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text)' }}>
        &copy; {new Date().getFullYear()} Ministerio de Emergencias - Gobierno de Chile.
      </footer>
    </div>
  );
};