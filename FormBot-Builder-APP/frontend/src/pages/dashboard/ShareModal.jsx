import React, { useState } from 'react';
import './ShareModal.css';

const ShareModal = ({ onClose, currentUser }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [shareLink, setShareLink] = useState('');

  const handleSendInvite = () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }
    
    // Here you would typically make an API call to send the invitation
    console.log(`Sending ${permission} invitation to ${email}`);
    alert('Invitation sent successfully!');
  };

  const handleGenerateLink = () => {
    // Generate a unique sharing link
    const link = `${window.location.origin}/shared/${currentUser.username}/${permission}/${Date.now()}`;
    setShareLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <img
          src="/assets/images/close.png"
          alt="close"
          className="close-button"
          onClick={onClose}
        />

        <div className="invite-section">
          <div className="section-header">
            <label>Invite by email</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value="edit">Edit</option>
              <option value="view">View</option>
            </select>
          </div>

          <div className="email-input-container">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendInvite}>Send Invite</button>
          </div>
        </div>

        <div className="link-section">
          <label>Invite by link</label>
          <div className="link-container">
            <input
              type="text"
              value={shareLink}
              readOnly
              placeholder="Generate a sharing link"
            />
            {!shareLink ? (
              <button onClick={handleGenerateLink}>Generate Link</button>
            ) : (
              <button onClick={handleCopyLink}>Copy Link</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;