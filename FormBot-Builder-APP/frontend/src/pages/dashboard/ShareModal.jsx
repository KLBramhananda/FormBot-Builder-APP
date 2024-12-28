import React, { useState } from 'react';
import './ShareModal.css';

const ShareModal = ({ onClose }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="modal-overlay">
      
      <div className="modal-content">
        <div className="modal-header">
          <h2>Invite by Email</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <input
            type="email"
            placeholder="Enter email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <button className="send-invite-button">
            Send Invite
          </button>
          
          <div className="link-section">
            <h2>Invite by link</h2>
            <button className="copy-link-button">
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;