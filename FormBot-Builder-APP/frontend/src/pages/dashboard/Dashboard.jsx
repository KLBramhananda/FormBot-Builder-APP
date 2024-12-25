import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import Sharemodal from './ShareModal';
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [folders, setFolders] = useState([]);
  const [cards, setCards] = useState([]);
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: 'Guest',
    email: ''
  });

  // Simulate getting user data from authentication
  useEffect(() => {
    // Replace this with your actual auth logic
    const userData = localStorage.getItem('userData');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, newFolderName]);
      setNewFolderName('');
      setShowFolderPrompt(false);
    }
  };

  const handleCreateCard = () => {
    setCards([...cards, { id: cards.length + 1, name: 'New Typebot' }]);
  };

  const handleDeleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Navbar */}
      <div className="dashboard-navbar">
        <div className="dropdown-container">
          <select className="workspace-dropdown">
            <option className='user-dashboard'>{currentUser.username}</option>
            <option onClick={handleNavigateToSettings}>Settings</option>
            <option onClick={handleLogout}>Logout</option>
          </select>
        </div>
        <div className="navbar-right">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={theme === "light"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <button 
            className="share-button"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <button
          className="action-button"
          onClick={() => setShowFolderPrompt(true)}
        >
          <FontAwesomeIcon icon={faFolderPlus} /> Create a folder
        </button>
        {folders.map((folder, index) => (
          <div key={index} className="tab">
            {folder}
            <img 
              src="/assets/images/delete.png" 
              alt="delete" 
              onClick={() => {
                setFolders(folders.filter((_, i) => i !== index));
              }}
            />
          </div>
        ))}
      </div>

      {/* Folder Creation Prompt */}
      {showFolderPrompt && (
        <div className="folder-prompt">
          <h3>Create New Folder</h3>
          <input
            type="text"
            placeholder="Enter folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <div className="prompt-buttons">
            <button onClick={handleCreateFolder}>Done</button>
            <button onClick={() => setShowFolderPrompt(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Cards Section */}
      <div className="dashboard-cards">
        <div className="card create-card" onClick={handleCreateCard}>
          <img src="/assets/images/plus.png" alt="create" />
          <div className='typebot-name'>Create a typebot</div>
        </div>
        {cards.map((card) => (
          <div key={card.id} className="card">
            {card.name}
            <span
              className="delete-icon"
              onClick={() => handleDeleteCard(card.id)}
            >
              <img src="/assets/images/delete.png" alt="delete" />
            </span>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <Sharemodal
          onClose={() => setShowShareModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Dashboard;