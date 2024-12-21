import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CreateFormPage from "./pages/CreateFormPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-form" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
