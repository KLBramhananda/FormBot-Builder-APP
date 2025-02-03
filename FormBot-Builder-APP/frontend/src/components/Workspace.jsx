import React, { useState, useEffect } from "react";
import "./Workspace.css";
import { useNavigate } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faBars, faTimes);

const Workspace = ({ typebot }) => {
  console.log("Workspace received typebot:", typebot);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flow");
  const [formName, setFormName] = useState(() => {
    const savedFormName = localStorage.getItem(`formName_${typebot?.id}`);
    return savedFormName || (typebot ? typebot.name : "");
  });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    if (typebot) {
      setFormName(typebot.name);
    }
  }, [typebot]);

  useEffect(() => {
    if (typebot?.id) {
      localStorage.setItem(`formName_${typebot.id}`, formName);
    }
  }, [formName, typebot?.id]);

  const [flowElements, setFlowElements] = useState(() => {
    const savedElements = localStorage.getItem(`flowElements_${typebot?.id}`);
    return savedElements
      ? JSON.parse(savedElements)
      : [{ id: "start", type: "start", content: "Start" }];
  });

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementLink, setElementLink] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  useEffect(() => {
    if (typebot?.id) {
      localStorage.setItem(
        `flowElements_${typebot.id}`,
        JSON.stringify(flowElements)
      );
    }
  }, [flowElements, typebot?.id]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  const handleElementClick = (elementType) => {
    const elementCount = flowElements.filter(
      (el) => el.type === elementType
    ).length;
    const sequentialId = elementCount + 1;

    let newElement = {
      id: Date.now(),
      type: elementType,
      sequentialId: sequentialId,
      content: "",
      isEditing: true,
    };

    switch (elementType) {
      case "text":
        newElement = {
          ...newElement,
          heading: `Text ${sequentialId}`,
          textContent: "",
          placeholder: "Enter your message",
        };
        break;
      case "image":
        newElement = {
          ...newElement,
          heading: `Image ${sequentialId}`,
          imageUrl: "",
          showLinkInput: false,
        };
        break;
      case "video":
        newElement = {
          ...newElement,
          heading: `Video ${sequentialId}`,
          videoUrl: "",
          showLinkInput: false,
        };
        break;
      case "gif":
        newElement = {
          ...newElement,
          heading: `GIF ${sequentialId}`,
          gifUrl: "",
          showLinkInput: false,
        };
        break;
      default:
        break;
    }

    setFlowElements((prev) => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem(
        `flowElements_${typebot?.id}`,
        JSON.stringify(flowElements)
      );

      // Prepare data for API
      const saveData = {
        id: typebot?.id,
        name: formName,
        elements: flowElements,
        theme: theme,
        lastModified: new Date().toISOString(),
      };

      // Make API call (replace with your actual API endpoint)
      const response = await fetch("/api/typebots/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      // Show success message
      showNotification("Changes saved successfully!", "success");

      // Allow navigation after successful save
      return true;
    } catch (error) {
      console.error("Save error:", error);
      showNotification("Failed to save changes. Please try again.", "error");
      return false;
    }
  };

  const styles = `
  .save-alert {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    animation: fadeInOut 3s ease-in-out;
    z-index: 1000;
  }

  .save-alert.success {
    background-color: #28a745;
  }

  .save-alert.error {
    background-color: #dc3545;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
    85% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }

  .save-button1 {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .save-button1.saving::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    margin-left: 8px;
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

  // Share functionality
  const handleShare = () => {
    const formUrl = `${window.location.origin}/form/${typebot?.id}`;
    navigator.clipboard.writeText(formUrl);

    // Show alert
    const alert = document.createElement("div");
    alert.className = "copy-alert";
    alert.textContent = "Link Copied!";
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  };

  // Add the styles to the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleLinkSubmit = () => {
    if (selectedElement && elementLink) {
      const newElement = { ...selectedElement, link: elementLink };
      setFlowElements((prevElements) =>
        prevElements.map((el) =>
          el.id === selectedElement.id ? newElement : el
        )
      );
      setShowLinkModal(false);
      setElementLink("");
      setSelectedElement(null);
    }
  };

  const ElementModal = ({ element }) => {
    switch (element.type) {
      case "image":
      case "video":
      case "gif":
        return (
          <div className="modal-content">
            <h3>Add {element.type} Link</h3>
            <input
              type="text"
              value={elementLink}
              onChange={(e) => setElementLink(e.target.value)}
              placeholder={`Enter ${element.type} URL`}
            />
            <div className="modal-buttons">
              <button onClick={handleLinkSubmit}>Add</button>
              <button onClick={() => setShowLinkModal(false)}>Cancel</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const openResponseFile = () => {
    setActiveTab("response");
  };

  const openFlowFile = () => {
    setActiveTab("flow");
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`workspace-container ${theme}`}>
      <nav className="workspace-navbar">
        <div className="navbar-left">
          <div className="mobile-menu-icon" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </div>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="form-name-input"
          />
          <img
            src="/assets/images/close.png"
            alt="Close"
            className="mobile-cross-icon"
            onClick={handleClose}
          />
        </div>
        <div className="navbar-center">
          <button
            className={activeTab === "flow" ? "active" : ""}
            onClick={() => setActiveTab("flow")}
          >
            Flow
          </button>
          <button
            className={activeTab === "response" ? "active" : ""}
            onClick={() => setActiveTab("response")}
          >
            Response
          </button>
        </div>
        <div className="navbar-right1">
          <p className={`light ${theme === "dark" ? "theme-active" : ""}`}>
            Light
          </p>
          <label className="toggle-switch1">
            <input
              type="checkbox"
              checked={theme === "light"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <p className={`dark ${theme === "dark" ? "theme-active" : ""}`}>
            Dark
          </p>
          <button className="share-button1" onClick={handleShare}>
            Share
          </button>
          <button
            className="save-button1"
            onClick={handleSave}
            disabled={!unsavedChanges}
          >
            Save
          </button>
          <img
            src="/assets/images/close.png"
            alt="Close"
            className="cross-icon"
            onClick={handleClose}
          />
        </div>
      </nav>

      <div
        className={`menu-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>

      <div className="flowpage-container">
        {activeTab === "flow" && (
          <>
            <aside className={`left-section ${isMenuOpen ? "open" : ""}`}>
              {isMenuOpen && (
                <img
                  src="/assets/images/close.png"
                  alt="Close"
                  className="menu-close-icon"
                  onClick={toggleMenu}
                />
              )}
              <div className="left-box">
                <p>Bubbles</p>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("text")}
                >
                  <img src="/assets/workspace-logos/msg.png" alt="" />
                  <span className="button-text">Text</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("image")}
                >
                  <img src="/assets/workspace-logos/image.png" alt="" />
                  <span className="button-text">Image</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("video")}
                >
                  <img src="/assets/workspace-logos/video.png" alt="" />
                  <span className="button-text">Video</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("gif")}
                >
                  <img src="/assets/workspace-logos/gif.png" alt="" />
                  <span className="button-text">GIF</span>
                </button>
                <p>Inputs</p>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("input-text")}
                >
                  <img src="/assets/workspace-logos/text.png" alt="" />
                  <span className="button-text">Text</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("input-number")}
                >
                  <img src="/assets/workspace-logos/number.png" alt="" />
                  <span className="button-text">Number</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("input-email")}
                >
                  <img src="/assets/workspace-logos/email.png" alt="" />
                  <span className="button-text">Email</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("input-phone")}
                >
                  <img src="/assets/workspace-logos/phone.png" alt="" />
                  <span className="button-text">Phone</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("input-date")}
                >
                  <img src="/assets/workspace-logos/date.png" alt="" />
                  <span className="button-text">Date</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("input-rating")}
                >
                  <img src="/assets/workspace-logos/rating.png" alt="" />
                  <span className="button-text">Rating</span>
                </button>
                <button
                  className="custom-button"
                  onClick={() => handleElementClick("input-buttons")}
                >
                  <img src="/assets/workspace-logos/buttons.png" alt="" />
                  <span className="button-text">Buttons</span>
                </button>
              </div>
            </aside>

            <section id="workspace" className="right-section">
              <p>
                <img src="/assets/workspace-logos/flag.png" alt="" />
                <span>Start</span>
              </p>
              <div className="flow-elements-container">
                {flowElements.map((element) => (
                  <div
                    key={element.id}
                    className={`flow-element ${element.type}`}
                  >
                    {element.type === "start" ? (
                      <div className="start-element"></div>
                    ) : (
                      <>
                        <span>{element.type}</span>
                        {element.link && (
                          <div className="element-link">{element.link}</div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "response" && (
          <div className="response-container">
            {flowElements.length > 0 ? (
              <div className="analytics-dashboard">
                <div className="stats-container">
                  <div className="stat-box">
                    <h3>Views</h3>
                    <p>6</p>
                  </div>
                  <div className="stat-box">
                    <h3>Starts</h3>
                    <p>100</p>
                  </div>
                </div>
                <div className="completion-chart">
                  <h3>Completion Rate: 33%</h3>
                  <div className="chart-circle">
                    <div
                      className="circle-fill"
                      style={{ transform: "rotate(120deg)" }}
                    ></div>
                  </div>
                </div>
                <div className="responses-table-wrapper">
                  <table className="responses-table">
                    <thead>
                      <tr>
                        <th>Submitted at</th>
                        <th>Button 1</th>
                        <th>Email 1</th>
                        <th>Text 1</th>
                        <th>Button 2</th>
                        <th>Rating 1</th>
                      </tr>
                    </thead>
                    <tbody>{/* Add your response data here */}</tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="no-response">
                <h2>No Response yet collected</h2>
              </div>
            )}
          </div>
        )}
      </div>

      {showLinkModal && (
        <div className="modal-overlay">
          {selectedElement && <ElementModal element={selectedElement} />}
        </div>
      )}
    </div>
  );
};

export default Workspace;
