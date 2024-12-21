import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4 className="footer-logo">
          <img
            src="./assets/logos/logo.png"
            alt="FormCraft Logo"
            className="footer-logo-img"
          />{" "}
          FormCraft
        </h4>
        <p className="footer-text">
          Made with{" "}
          <FontAwesomeIcon icon={faHeart} style={{ color: "#fd0820" }} /> by{" "}
          <br /> @Cuvette
        </p>
      </div>
      <div className="footer-section">
        <h4>Product</h4>
        <p>
          Status{" "}
          <a href="#"><FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: "#ffffff" }} /></a>
        </p>
        <p>
          Documentation{" "}
          <a href="#"><FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: "#ffffff" }} /></a>
        </p>
        <p>
          Roadmap{" "}
          <a href="#"><FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: "#ffffff" }} /></a>
        </p>
        <p>
          Pricing
        </p>
      </div>

      <div className="footer-section">
        <h4>Community</h4>
        <p>
          Discord{" "}
          <a href="#"><FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: "#ffffff" }} /></a>
        </p>
        <p>
          GitHub repository{" "}
          <a href="#"><FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: "#ffffff" }} /></a>
        </p>
        <p>
          Twitter{" "}
          <a href="#"><FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: "#ffffff" }} /></a>
        </p>
        <p>
          LinkedIn{" "}
          <a href="#"><FontAwesomeIcon icon={faUpRightFromSquare} style={{ color: "#ffffff" }} /></a>
        </p>
        <p>
          OSS Friends
        </p>
      </div>

      <div className="footer-section">
        <h4>Company</h4>
        <p>About</p>
        <p>Contact</p>
        <p>Terms of Service</p>
        <p>Privacy Policy</p>
      </div>
    </footer>
  );
};

export default Footer;
