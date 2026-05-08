import { Routes, Route } from 'react-router-dom';
import { LandingPage } from "./components/05.- Pages/Landing/LandingPage";
import { LoginPage } from "./components/05.- Pages/Login/LoginPage";
import { SuccessPage } from "./components/05.- Pages/Success/SuccessPage"; // <-- New Route
import { ReportsDashboardPage } from "./components/05.- Pages/Reports/ReportsDashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reportes" element={<ReportsDashboardPage />} />
    </Routes>
  );
}

export default App;