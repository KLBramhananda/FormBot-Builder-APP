import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const maskPassword = (password) => {
    return password.replace(/./g, "*");
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);

    if (event.target.value !== password) {
      setError("enter the same password in both fields");
    } else {
      setError("");
    }
  };

  const handleSignUp = async () => {
    // Validation checks remain the same
    if (!user || user.trim() === "") {
      setError("Username is required");
      return;
    }

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

    if (!confirmPassword || confirmPassword.trim() === "") {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
        {
          username: user,
          email,
          password,
        }
      );

      if (response.status === 201) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            username: user,
            email: email,
          })
        );

        localStorage.setItem(`folders_${email}`, JSON.stringify([]));
        localStorage.setItem(
          `folderContents_${email}`,
          JSON.stringify({
            mainPage: [],
          })
        );

        navigate("/Dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred during signup. Please try again."
      );
    }
  };

  return (
    <div className="Signup-page">
      <div className="left-arrow" onClick={handleGoBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className="body-container">
        <div className="left-images">
          <img
            src="./assets/images/Polygon-1.png"
            alt="Decorate1"
            className="polly1"
          />
          <img
            src="./assets/images/Polygon-2.png"
            alt="Decorate2"
            className="polly2"
          />
        </div>

        <div className="Signup-container">
          <label>Username</label>
          <input
            type="text"
            value={user}
            onChange={handleUserChange}
            placeholder="Enter a username"
            required
          />

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
            style={{
              borderColor: !password && error ? "red" : "inherit",
              color: "grey",
            }}
          />

          <label
            style={{
              color:
                (!confirmPassword || password !== confirmPassword) && error
                  ? "red"
                  : "inherit",
            }}
          >
            Confirm Password
          </label>
          <input
            type="text"
            value={maskPassword(confirmPassword)}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            style={{
              borderColor:
                (!confirmPassword || password !== confirmPassword) && error
                  ? "red"
                  : "inherit",
              color: "grey", 
            }}
            required
          />

          {error && <p className="error-message">{error}</p>}
          <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>

          <p>OR</p>
          <button className="google-btn">
            <a href="https://www.google.com/">
              <img src="./assets/logos/google-icon.jpeg" alt="" />
            </a>
            <span>Sign Up with Google</span>
          </button>
          <p>
            Already have an account ?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#007bff", cursor: "pointer" }}
            >
              Login
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

export default SignupPage;
