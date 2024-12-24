import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoBack = () => {
    navigate("/home");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password
      });
  
      if (response.data.hasFormCreated) {
        navigate("/yourCustomFormPage");
      } else {
        navigate("/createFormPage");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during login. Please try again.");
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
