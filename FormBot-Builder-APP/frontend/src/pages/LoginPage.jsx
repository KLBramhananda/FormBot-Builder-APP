import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoBack = () => {
    navigate("/home");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
       // alert(data.message);
        if (data.hasFormCreated) {
          navigate("/yourCustomFormPage"); // Navigate to user's existing form
        } else {
          navigate("/createFormPage"); // Navigate to form creation page
        }
      } else {
        alert(data.message); // Show error for invalid credentials
      }
    } catch (error) {
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="left-arrow" onClick={handleGoBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className="body-container">
        <div className="left-images">
          <img src="./assets/images/Polygon-1.png" alt="Decoration 1" className="polly1" />
          <img src="./assets/images/Polygon-2.png" alt="Decoration 2" className="polly2" />
        </div>
        <div className="login-container">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <label>Password</label>
          <input
            type="text"
            value={password.replace(/./g, "*")}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
          />
          <button onClick={handleLogin}>Log In</button>
          <p>OR</p>
          <button className="google-btn">
            <img src="./assets/logos/google-icon.jpeg" alt="" />
            <span>Sign in with Google</span>
          </button>
          <p>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#007bff", cursor: "pointer" }}
            >
              Register now
            </span>
          </p>
        </div>
        <div className="bottom-elli">
          <img src="./assets/images/Ellipse-1.png" alt="Decoration 3" className="elli1" />
        </div>
        <div className="right-images">
          <img src="./assets/images/Ellipse-2.png" alt="Decoration 4" className="elli2" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
