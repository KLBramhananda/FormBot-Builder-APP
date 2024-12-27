import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModal";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // State for theme toggle
  const [theme, setTheme] = useState("light");

  // State for showing share modal
  const [showShareModal, setShowShareModal] = useState(false);

  // Replace the folders state
  const [folders, setFolders] = useState(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) return [];

    const { email } = JSON.parse(userData);
    const savedFolders = localStorage.getItem(`folders_${email}`);
    return savedFolders ? JSON.parse(savedFolders) : [];
  });

  // State for tracking the selected folder
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Replace the folderContents state
  const [folderContents, setFolderContents] = useState(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) return { mainPage: [] };

    const { email } = JSON.parse(userData);
    const savedContents = localStorage.getItem(`folderContents_${email}`);
    return savedContents ? JSON.parse(savedContents) : { mainPage: [] };
  });

  // State for controlling modals and prompts
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [showTypebotPrompt, setShowTypebotPrompt] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  // State for storing new folder and Typebot names
  const [newFolderName, setNewFolderName] = useState("");
  const [newTypebotName, setNewTypebotName] = useState("");

  // State for tracking items marked for deletion
  const [itemToDelete, setItemToDelete] = useState(null);

  // State for managing current user details
  // Replace the currentUser state
  const [currentUser, setCurrentUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData
      ? JSON.parse(userData)
      : {
          username: "",
          email: "",
        };
  });

  // Update the useEffect for saving data
  useEffect(() => {
    if (currentUser.email) {
      localStorage.setItem(
        `folders_${currentUser.email}`,
        JSON.stringify(folders)
      );
      localStorage.setItem(
        `folderContents_${currentUser.email}`,
        JSON.stringify(folderContents)
      );
    }
  }, [folders, folderContents, currentUser.email]);

  // Load user data and saved state from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  // Handle creating a new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const folderExists = folders.some(
        (folder) => folder.name === newFolderName
      );
      if (folderExists) {
        alert(
          "This folder name already exists. Please choose a different name."
        );
        return;
      }

      const newFolder = { id: Date.now(), name: newFolderName };
      setFolders([...folders, newFolder]);
      setFolderContents({ ...folderContents, [newFolder.id]: [] });
      setNewFolderName("");
      setShowFolderPrompt(false);
    }
  };

  // Handle creating a new Typebot
  const handleCreateTypebot = () => {
    if (newTypebotName.trim()) {
      const existingTypebots = selectedFolder
        ? folderContents[selectedFolder] || []
        : folderContents["mainPage"] || [];

      const typebotExists = existingTypebots.some(
        (typebot) => typebot.name === newTypebotName
      );

      if (typebotExists) {
        alert(
          selectedFolder
            ? "This Typebot name already exists in the folder. Please choose a different name."
            : "This Typebot name already exists. Please choose a different name."
        );
        return;
      }

      const newTypebot = { id: Date.now(), name: newTypebotName };
      if (selectedFolder) {
        setFolderContents({
          ...folderContents,
          [selectedFolder]: [...existingTypebots, newTypebot],
        });
      } else {
        setFolderContents({
          ...folderContents,
          mainPage: [...existingTypebots, newTypebot],
        });
      }

      setNewTypebotName("");
      setShowTypebotPrompt(false);
    }
  };

  // Confirm delete action for folders or Typebots
  const handleDeleteConfirmation = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeletePrompt(true);
  };

  // Handle deleting folders or Typebots
  const handleDelete = () => {
    if (itemToDelete.type === "folder") {
      setFolders(folders.filter((folder) => folder.id !== itemToDelete.id));
      const { [itemToDelete.id]: deleted, ...rest } = folderContents;
      setFolderContents(rest);
    } else if (itemToDelete.type === "typebot") {
      if (selectedFolder) {
        // Delete from selected folder
        setFolderContents({
          ...folderContents,
          [selectedFolder]: folderContents[selectedFolder].filter(
            (typebot) => typebot.id !== itemToDelete.id
          ),
        });
      } else {
        // Delete from main page
        setFolderContents({
          ...folderContents,
          mainPage: folderContents["mainPage"].filter(
            (typebot) => typebot.id !== itemToDelete.id
          ),
        });
      }
    }

    setShowDeletePrompt(false);
    setItemToDelete(null);
  };

  // Handle navigation dropdown options
  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value === "settings") {
      navigate("/settings");
    } else if (value === "logout") {
      handleLogout();
    }
  };

  // Update the logout handler
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Navbar for user and theme controls */}
      <div className="dashboard-navbar">
        <div className="dropdown-container">
          <select
            className="workspace-dropdown"
            onChange={handleDropdownChange}
            value="dashboard"
          >
            <option value="dashboard" disabled hidden>
              {currentUser.username}
            </option>
            <option value="settings">Settings</option>
            <option value="logout">Logout</option>
          </select>
        </div>
        <div className="navbar-right">
          <p className={`light ${theme === "dark" ? "theme-active" : ""}`}>
            Light
          </p>
          <label className="toggle-switch">
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
          <button
            className="share-button"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </button>
        </div>
      </div>

      {/* Actions and content management */}
      <div className="dashboard-actions">
        <button
          className="action-button"
          onClick={() => setShowFolderPrompt(true)}
        >
          <img src="/assets/images/folder.png" alt="" /> Create a folder
        </button>
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`tab ${
              selectedFolder === folder.id ? "active-tab" : ""
            }`}
            onClick={() =>
              setSelectedFolder((prevSelectedFolder) =>
                prevSelectedFolder === folder.id ? null : folder.id
              )
            }
          >
            {folder.name}
            <img
              src="/assets/images/delete.png"
              alt="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConfirmation("folder", folder.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* Folder creation modal */}
      {showFolderPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Folder</h3>
            <input
              type="text"
              placeholder="Enter folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleCreateFolder}>Create</button>
              <button onClick={() => setShowFolderPrompt(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Typebot creation modal */}
      {showTypebotPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Typebot</h3>
            <input
              type="text"
              placeholder="Enter typebot name"
              value={newTypebotName}
              onChange={(e) => setNewTypebotName(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleCreateTypebot}>Create</button>
              <button onClick={() => setShowTypebotPrompt(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeletePrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Confirmation</h3>
            <p>Are you sure you want to delete this {itemToDelete?.type}?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleDelete}>
                Confirm
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeletePrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Displaying typebots */}
      <div className="dashboard-cards">
        <div
          className="card create-card"
          onClick={() => setShowTypebotPrompt(true)}
        >
          <img src="/assets/images/plus.png" alt="create" />
          <div className="typebot-name">Create a typebot</div>
        </div>
        {selectedFolder
          ? folderContents[selectedFolder]?.map((typebot) => (
              <div key={typebot.id} className="card typebot-card">
                <span
                  className="delete-icon"
                  onClick={() =>
                    handleDeleteConfirmation("typebot", typebot.id)
                  }
                >
                  <img src="/assets/images/delete.png" alt="delete" />
                </span>
                <div className="typebot-name">{typebot.name}</div>
              </div>
            ))
          : folderContents["mainPage"]?.map((typebot) => (
              <div key={typebot.id} className="card typebot-card">
                <span
                  className="delete-icon"
                  onClick={() =>
                    handleDeleteConfirmation("typebot", typebot.id)
                  }
                >
                  <img src="/assets/images/delete.png" alt="delete" />
                </span>
                <div className="typebot-name">{typebot.name}</div>
              </div>
            ))}
      </div>

      {/* Share modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
