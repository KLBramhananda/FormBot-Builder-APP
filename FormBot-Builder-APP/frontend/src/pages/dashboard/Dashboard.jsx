import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ShareModal from "./ShareModal";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [showShareModal, setShowShareModal] = useState(false);
  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem("folders");
    return savedFolders ? JSON.parse(savedFolders) : [];
  });

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderContents, setFolderContents] = useState(() => {
    const savedContents = localStorage.getItem("folderContents");
    return savedContents ? JSON.parse(savedContents) : {};
  });

  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [showTypebotPrompt, setShowTypebotPrompt] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newTypebotName, setNewTypebotName] = useState("");
  const [currentUser, setCurrentUser] = useState({
    username: "Bramhananda K L",
    email: "",
  });

  // Save folders and contents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("folderContents", JSON.stringify(folderContents));
  }, [folders, folderContents]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName,
      };
      setFolders([...folders, newFolder]);
      setFolderContents({
        ...folderContents,
        [newFolder.id]: [],
      });
      setNewFolderName("");
      setShowFolderPrompt(false);
    }
  };

  const handleCreateTypebot = () => {
    if (newTypebotName.trim() && selectedFolder) {
      const newTypebot = {
        id: Date.now(),
        name: newTypebotName,
      };
      setFolderContents({
        ...folderContents,
        [selectedFolder]: [
          ...(folderContents[selectedFolder] || []),
          newTypebot,
        ],
      });
      setNewTypebotName("");
      setShowTypebotPrompt(false);
    }
  };

  const handleDeleteConfirmation = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeletePrompt(true);
  };

  const handleDelete = () => {
    if (itemToDelete.type === "folder") {
      setFolders(folders.filter((folder) => folder.id !== itemToDelete.id));
      const { [itemToDelete.id]: deleted, ...rest } = folderContents;
      setFolderContents(rest);
    } else if (itemToDelete.type === "typebot" && selectedFolder) {
      setFolderContents({
        ...folderContents,
        [selectedFolder]: folderContents[selectedFolder].filter(
          (typebot) => typebot.id !== itemToDelete.id
        ),
      });
    }
    setShowDeletePrompt(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    // Load saved folders and contents when component mounts
    const savedFolders = localStorage.getItem("folders");
    const savedContents = localStorage.getItem("folderContents");

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }

    if (savedContents) {
      setFolderContents(JSON.parse(savedContents));
    }
  }, []);

  // Save whenever folders or contents change
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("folderContents", JSON.stringify(folderContents));
  }, [folders, folderContents]);

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value === "settings") {
      navigate("/settings");
    } else if (value === "logout") {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Navbar */}
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
          <p className="light">Light</p>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === "light"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <p className="dark">Dark</p>
          <button
            className="share-button"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </button>
        </div>
      </div>

      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        <button
          className="action-button"
          onClick={() => setShowFolderPrompt(true)}
        >
          <FontAwesomeIcon icon={faFolderPlus} /> Create a folder
        </button>
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`tab ${
              selectedFolder === folder.id ? "active-tab" : ""
            }`}
            onClick={() => setSelectedFolder(folder.id)}
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

      {/* Folder Creation Prompt */}
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

      {/* Typebot Creation Prompt */}
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

      {/* Delete Confirmation Prompt */}
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

      {/* Cards Section */}
      {selectedFolder ? (
        <div className="dashboard-cards">
          <div
            className="card create-card"
            onClick={() => setShowTypebotPrompt(true)}
          >
            <img src="/assets/images/plus.png" alt="create" />
            <div className="typebot-name">Create a typebot</div>
          </div>
          {selectedFolder &&
            folderContents[selectedFolder]?.map((typebot) => (
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
      ) : (
        <div className="dashboard-cards">
          <div
            className="card create-card"
            onClick={() => setShowFolderPrompt(true)}
          >
            <img src="/assets/images/plus.png" alt="create" />
            <div className="typebot-name">Create a folder</div>
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Dashboard;
