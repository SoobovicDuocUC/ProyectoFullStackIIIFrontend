import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-bar">
      <div className="footer-emergency">
        Emergencia | Bomberos de Chile - 132
      </div>
      <div className="footer-content">
        &copy; {new Date().getFullYear()} Ministerio de Emergencias - Gobierno de Chile.
      </div>
    </footer>
  );
};
