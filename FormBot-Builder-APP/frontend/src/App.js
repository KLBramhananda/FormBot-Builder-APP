import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Settings from "./pages/dashboard/Settings";
import Dashboard from "./pages/dashboard/Dashboard";
import SharedDashboardRedirect from './components/SharedDashboardRedirect';
import Workspace from "./components/Workspace";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/workspace" element={<Workspace/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/shared/:token" element={<SharedDashboardRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
