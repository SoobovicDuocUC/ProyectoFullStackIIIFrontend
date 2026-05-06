import './Header.css';

export const Header = () => {
  return (
    <header className="header-bar">
      <h1 className="header-title">Sistema de Alerta Forestal</h1>
      <nav>
        <a href="/login">
          Acceso Autoridades
        </a>
      </nav>
    </header>
  );
};
