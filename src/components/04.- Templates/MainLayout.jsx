import './../../index.css';
import { Header } from '../03.- Organisms/Header';

export const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};