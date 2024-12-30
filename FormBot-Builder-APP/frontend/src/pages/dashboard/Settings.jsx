import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const storedData = JSON.parse(localStorage.getItem('userData'));

      const updateData = { userId: storedData.userId };
      if (userData.username.trim()) updateData.username = userData.username.trim();
      if (userData.email.trim()) updateData.email = userData.email.trim();
      if (userData.oldPassword && userData.newPassword) {
        updateData.oldPassword = userData.oldPassword;
        updateData.newPassword = userData.newPassword;
      }

      if (Object.keys(updateData).length <= 1) {
        setMessage({ type: 'error', text: 'Please fill at least one field to update' });
        setIsUpdating(false);
        return;
      }

      if ((userData.oldPassword && !userData.newPassword) || (!userData.oldPassword && userData.newPassword)) {
        setMessage({ type: 'error', text: 'Please provide both current and new password' });
        setIsUpdating(false);
        return;
      }

      const response = await axios.put('http://localhost:5000/api/users/update', updateData);

      if (response.data) {
        const updatedUserData = {
          ...storedData,
          ...(updateData.username && { username: updateData.username }),
          ...(updateData.email && { email: updateData.email }),
        };

        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData({ username: '', email: '', oldPassword: '', newPassword: '' });
        setMessage({ type: 'success', text: response.data.message });
      }
    } catch (error) {
      console.error('Update error:', error.response || error);
      let errorMessage = 'Update failed';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email is already in use';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found';
      }

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      <div className="settings-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            disabled={isUpdating}
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            disabled={isUpdating}
          />
          <div className="password-section">
            <input
              type="password"
              placeholder="Old Password"
              value={userData.oldPassword}
              onChange={(e) => setUserData({ ...userData, oldPassword: e.target.value })}
              disabled={isUpdating}
            />
            <input
              type="password"
              placeholder="New Password"
              value={userData.newPassword}
              onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
              disabled={isUpdating}
            />
          </div>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className={isUpdating ? 'updating' : ''}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
        {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
      </div>
      <div className="logout-section">
        <button onClick={handleLogout}>
          <img src="/assets/images/logout.png" alt="Logout" />
        </button>
      </div>
    </div>
  );
};

export default Settings;
