import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import YourCustomFormPage from "./pages/yourCustomFormPage";
import Settings from "./pages/dashboard/Settings";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/yourCustomFormPage" element={<YourCustomFormPage />} />

      </Routes>
    </Router>
  );
}

export default App;
