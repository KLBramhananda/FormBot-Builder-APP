import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShareModal.css';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

const ShareModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('Edit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleSendInvite = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      if (!email) {
        setError('Please enter an email address');
        return;
      }

      if (!currentUser?.email || !currentUser?.username) {
        setError('User session not found. Please login again.');
        return;
      }

      // First verify email
      const verifyResponse = await api.get(`/api/share/verify-email/${email}`);
      console.log('Verify response:', verifyResponse.data);

      if (!verifyResponse.data.exists) {
        setError('This email is not registered in our system');
        return;
      }

      // Send invite
      const shareData = {
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        inviteeEmail: email,
        permission
      };

      const response = await api.post('/api/share/invite', shareData);
      console.log('Invite response:', response.data);

      setSuccess('Dashboard shared successfully!');
      setEmail('');
      alert(`Dashboard has been shared successfully with ${email}`);
    } catch (error) {
      console.error('Error in handleSendInvite:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.response?.data?.message || 'Failed to send invite. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      if (!currentUser?.email || !currentUser?.username) {
        setError('User session not found. Please login again.');
        return;
      }

      const shareData = {
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        permission,
        timestamp: Date.now()
      };

      const shareToken = btoa(JSON.stringify(shareData));
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;

      const response = await api.post('/api/share/create-link', {
        token: shareToken,
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        permission
      });

      console.log('Create link response:', response.data);

      await navigator.clipboard.writeText(shareUrl);
      setSuccess('Share link has been copied to clipboard!');
      alert('Share link has been copied to your clipboard!');
    } catch (error) {
      console.error('Error in handleCopyLink:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.response?.data?.message || 'Failed to generate sharing link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Share Dashboard</h2>
          <select
            className="permission-dropdown"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
            disabled={isLoading}
          >
            <option value="Edit">Can Edit</option>
            <option value="View">Can View</option>
          </select>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="email-section">
            <h3>Share via Email</h3>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? 'error-input' : ''}
              disabled={isLoading}
            />
            <button 
              className="send-invite-button"
              onClick={handleSendInvite}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
          
          <div className="link-section">
            <h3>Share via Link</h3>
            <button 
              className="copy-link-button"
              onClick={handleCopyLink}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Copy Link'}
            </button>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;