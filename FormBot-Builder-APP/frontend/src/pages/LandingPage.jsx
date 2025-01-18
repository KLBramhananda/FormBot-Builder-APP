import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./LandingPage.css";
import axios from "axios";

const LandingPage = () => {
  const fetchData = async () => {
    try {
      const response = await axios(`https://form-bot-builder-app-backrun.vercel.app/api/endpoint`);
      console.log("Fetched Data:", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <div className="body-top">
          <img src="./assets/logos/triangle-logo.png" alt="" />
          <div className="header-text">
            <h1>Build advanced chatbots</h1>
            <span>
              <h1>visually</h1>
            </span>
            <p>
              Typebot gives you powerful blocks to create unique chat
              experiences. Embed them <br />
              anywhere on your web/mobile apps and start collecting results like
              magic.
            </p>
            <button className="create-formbot-btn">
              Create a Formbot for free
            </button>
          </div>
          <img src="./assets/logos/half-circle-logo.png" alt="" />
        </div>

        <div className="image-container">
          <img
            src="./assets/images/yellow.png"
            alt="Blue Background"
            className="left-image"
          />
          <img
            src="./assets/images/blue.png"
            alt="Yellow Background"
            className="right-image"
          />
          <img
            src="./assets/images/landingpage-image.png"
            alt="Formbot preview"
            className="main-image"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
