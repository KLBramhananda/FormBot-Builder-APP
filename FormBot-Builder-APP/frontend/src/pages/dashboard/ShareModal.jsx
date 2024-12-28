// ShareModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ShareModal.css';

const ShareModal = ({ onClose, currentUser }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('Edit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendInvite = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/share/invite', {
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        inviteeEmail: email,
        permission: permission
      });

      if (response.status === 201) {
        setSuccess(response.data.message || 'Invite sent successfully!');
        setError('');
        setEmail('');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Failed to send invite. Please verify the email and try again.'
      );
      setSuccess('');
    }
  };

  const handleCopyLink = () => {
    try {
      const shareToken = btoa(JSON.stringify({
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        permission: permission
      }));
      
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      setSuccess('Link copied to clipboard!');
      setError('');
    } catch (err) {
      setError('Failed to generate sharing link');
      setSuccess('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Invite by Email</h2>
          <select
            className="permission-dropdown"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <option value="Edit">Edit</option>
            <option value="View">View</option>
          </select>
          <button className="close-button" onClick={onClose}>
            <img src="/assets/images/close.png" alt="" />
          </button>
        </div>
        
        <div className="modal-body">
          <input
            type="email"
            placeholder="Enter email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? 'error-input' : ''}
          />
          
          <button 
            className="send-invite-button"
            onClick={handleSendInvite}
          >
            Send Invite
          </button>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
          <div className="link-section">
            <h2>Invite by link</h2>
            <button className="copy-link-button" onClick={handleCopyLink}>
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;