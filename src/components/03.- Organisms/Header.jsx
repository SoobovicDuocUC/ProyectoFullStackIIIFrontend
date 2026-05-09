import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header = ({ variant = 'public' }) => {
  const navigate = useNavigate();

  const navContent = variant === 'auth' ? (
    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
      ← Volver
    </a>
  ) : (
    <a href="/login">
      Acceso Autoridades
    </a>
  );

  return (
    <header className="header-bar">
      <h1 className="header-title">Sistema de Alerta Forestal</h1>
      <nav>
        {navContent}
      </nav>
    </header>
  );
};
