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
          <br /> @Bramha
        </p>
      </div>
      <div className="footer-section">
        <h4>Product</h4>
        <p>
          Status{" "}
          <button className="icon-button">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ color: "#ffffff" }}
            />
          </button>
        </p>
        <p>
          Documentation{" "}
          <button className="icon-button">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ color: "#ffffff" }}
            />
          </button>
        </p>
        <p>
          Roadmap{" "}
          <button className="icon-button">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ color: "#ffffff" }}
            />
          </button>
        </p>
        <p>Pricing</p>
      </div>

      <div className="footer-section">
        <h4>Community</h4>
        <p>
          Discord{" "}
          <button className="icon-button">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ color: "#ffffff" }}
            />
          </button>
        </p>
        <p>
          GitHub repository{" "}
          <button className="icon-button">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ color: "#ffffff" }}
            />
          </button>
        </p>
        <p>
          Twitter{" "}
          <button className="icon-button">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ color: "#ffffff" }}
            />
          </button>
        </p>
        <p>
          LinkedIn{" "}
          <button className="icon-button">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              style={{ color: "#ffffff" }}
            />
          </button>
        </p>
        <p>OSS Friends</p>
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
