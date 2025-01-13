import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="./assets/logos/logo.png" alt="FormBot Logo" className="navbar-logo" />
        <h1 className="navbar-title">FormBot</h1>
      </div>
      <div className="navbar-right">
        <Link to="/login" className="btn btn-transparent">
          Sign In
        </Link>
        <Link to="/login" className="btn btn-blue">
           <span>Create a FormBot</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;