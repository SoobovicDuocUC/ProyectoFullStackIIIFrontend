import './../../index.css';
import { Header } from '../03.- Organisms/Header';
import { Footer } from '../03.- Organisms/Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};