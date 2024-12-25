import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from './pages/dashboard/Dashboard';
import YourCustomFormPage from "./pages/yourCustomFormPage";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/DashBoard" element={<Dashboard />} />
        <Route path="/yourCustomFormPage" element={<YourCustomFormPage />} />

      </Routes>
    </Router>
  );
}

export default App;
