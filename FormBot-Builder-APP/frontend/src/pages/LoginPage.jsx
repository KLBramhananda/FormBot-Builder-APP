import React from "react";
import "./LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <input type="email" placeholder="Enter your email" />
        <input type="password" placeholder="Enter your password" />
        <button>Log In</button>
        <p>OR</p>
        <button className="google-btn">Sign in with Google</button>
        <p>
          Don’t have an account? <span style={{ color: "#007bff" }}>Register now</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
