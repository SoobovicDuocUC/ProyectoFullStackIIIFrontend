import './AuthHeader.css';
import { useNavigate } from 'react-router-dom';

export const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="header-bar">
      <h1 className="header-title">Sistema de Alerta Forestal</h1>
      <nav>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          ← Volver
        </a>
      </nav>
    </header>
  );
};
