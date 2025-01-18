import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoBack = () => {
    navigate("/");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (!email || email.trim() === "") {
      setError("Email is required");
      return;
    }

    if (!email.includes("@") || !email.includes(".com")) {
      setError("Invalid email format");
      return;
    }

    if (!password || password.trim() === "") {
      setError("Password is required");
      return;
    }

    try {
      const response = await axios.post(
        "https://form-bot-builder-app-backrun.vercel.app/api/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: response.data.username,
          email: email,
        })
      );

      const existingFolders = localStorage.getItem(`folders_${email}`);
      const existingContents = localStorage.getItem(`folderContents_${email}`);

      if (!existingFolders) {
        localStorage.setItem(`folders_${email}`, JSON.stringify([]));
      }
      if (!existingContents) {
        localStorage.setItem(
          `folderContents_${email}`,
          JSON.stringify({
            mainPage: [],
          })
        );
      }
      const pendingShareToken = localStorage.getItem("pendingShareToken");
      if (pendingShareToken) {
        try {
          const shareData = JSON.parse(atob(pendingShareToken));
          localStorage.setItem("activeShare", JSON.stringify(shareData));
          localStorage.removeItem("pendingShareToken");
        } catch (error) {
          console.error("Invalid share token:", error);
        }
      }
      navigate("/Dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="left-arrow" onClick={handleGoBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className="body-container">
        <div className="left-images">
          <img
            src="./assets/images/Polygon-1.png"
            alt="Decoration 1"
            className="polly1"
          />
          <img
            src="./assets/images/Polygon-2.png"
            alt="Decoration 2"
            className="polly2"
          />
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
          {error && <p className="error-message">{error}</p>}
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
          <img
            src="./assets/images/Ellipse-1.png"
            alt="Decoration 3"
            className="elli1"
          />
        </div>
        <div className="right-images">
          <img
            src="./assets/images/Ellipse-2.png"
            alt="Decoration 4"
            className="elli2"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
