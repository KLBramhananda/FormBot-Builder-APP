import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const maskPassword = (password) => {
    return password.replace(/./g, "*");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);

    if (event.target.value !== password) {
      setError("Enter the same password in both fields");
    } else {
      setError("");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSignUp = () => {
    if (!email.includes("@") || !email.includes(".com")) {
      alert("Invalid mail");
      return;
    }
    alert("Registration successful!");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="register-page">
      <div className="left-arrow" onClick={handleGoBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className="body-container">
        <div className="left-images">
          <img src="./assets/images/Polygon-1.png" alt="Decorate1" className="polly1" />
          <img src="./assets/images/Polygon-2.png" alt="Decorate2" className="polly2" />
        </div>
        <div className="register-container">
          <label>Username</label>
          <input type="email" placeholder="Enter a username" required />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
          <label>Password</label>
          <input
            type="text"
            value={maskPassword(password)}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
          />
          <label
            style={{
              color: error ? "red" : "inherit",
            }}
          >
            Confirm Password
          </label>
          <input
            type="text"
            value={maskPassword(confirmPassword)}
            onChange={handleConfirmPasswordChange}
            placeholder="Enter your password"
            style={{
              borderColor: error ? "red" : "inherit",
            }}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleSignUp}>Sign Up</button>
          <p>OR</p>
          <button className="google-btn">
            <img src="./assets/logos/google-icon.jpeg" alt="" />
            <span>Sign Up with Google</span>
          </button>
          <p>
            Already have an account{" "}?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#007bff", cursor: "pointer" }}
            >
              Login
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

export default RegisterPage;
