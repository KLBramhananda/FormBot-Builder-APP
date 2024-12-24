import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreateFormPage from "./pages/CreateFormPage";
import YourCustomFormPage from "./pages/yourCustomFormPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>

        <Route path="/home" element={<LandingPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/createFormPage" element={<CreateFormPage />} />
        <Route path="/yourCustomFormPage" element={<YourCustomFormPage />} />

      </Routes>
    </Router>
  );
}

export default App;
