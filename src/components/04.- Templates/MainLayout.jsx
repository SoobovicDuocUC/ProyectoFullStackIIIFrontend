import './../../index.css';

export const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};