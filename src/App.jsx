import { Routes, Route } from 'react-router-dom';
import { LandingPage } from "./Components/05.- Pages/LandingPage";
import { LoginPage } from "./Components/05.- Pages/LoginPage";

function App() {
  return (
    <Routes>
      {/* Route for the main public reporting page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Route for the restricted authorities portal */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;