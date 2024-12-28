import React, { useState } from 'react';
import axios from 'axios';
import './ShareModal.css';

const ShareModal = ({ onClose, currentUser }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('Edit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to test API connection
  const testConnection = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/share/test');
      console.log('API test response:', response.data);
    } catch (error) {
      console.error('API test error:', error);
    }
  };

  // Call test connection when component mounts
  React.useEffect(() => {
    testConnection();
  }, []);

  const handleSendInvite = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      console.log('Current user data:', currentUser);
      console.log('Attempting to verify email:', email);

      const verifyResponse = await axios.get(
        `http://localhost:5000/api/share/verify-email/${email}`
      );
      console.log('Verify response:', verifyResponse.data);

      if (!verifyResponse.data.exists) {
        setError('This email is not registered in our system');
        return;
      }

      const shareData = {
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        inviteeEmail: email,
        permission
      };
      
      console.log('Sending invite with data:', shareData);

      const response = await axios.post(
        'http://localhost:5000/api/share/invite', 
        shareData
      );

      console.log('Invite response:', response.data);

      if (response.status === 201) {
        setSuccess('Invite sent successfully!');
        setEmail('');
      }
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response?.data);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to send invite. Please try again.'
      );
    }
  };

  const handleCopyLink = async () => {
    try {
      console.log('Current user data:', currentUser);
      
      const shareData = {
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        permission: permission,
        timestamp: Date.now()
      };
      
      const shareToken = btoa(JSON.stringify(shareData));
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;
      
      console.log('Creating share link with data:', {
        token: shareToken,
        ...shareData
      });

      const response = await axios.post(
        'http://localhost:5000/api/share/create-link',
        {
          token: shareToken,
          ...shareData
        }
      );

      console.log('Create link response:', response.data);

      await navigator.clipboard.writeText(shareUrl);
      setSuccess('Link copied to clipboard!');
      setError('');
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response?.data);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to generate sharing link. Please try again.'
      );
    }
  };

  // Rest of your component remains the same
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Share Dashboard</h2>
          <select
            className="permission-dropdown"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
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
            />
            <button 
              className="send-invite-button"
              onClick={handleSendInvite}
            >
              Send Invite
            </button>
          </div>
          
          <div className="link-section">
            <h3>Share via Link</h3>
            <button 
              className="copy-link-button"
              onClick={handleCopyLink}
            >
              Copy Link
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