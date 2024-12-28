// Settings.jsx
import React, { useState, useEffect } from 'react';
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
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(prevData => ({
        ...prevData,
        username: parsedData.username,
        email: parsedData.email
      }));
    }
  }, []);

  const handleUpdate = async () => {
    try {
      // If password fields are filled, update password
      if (userData.newPassword || userData.confirmPassword || userData.oldPassword) {
        if (!userData.oldPassword) {
          setMessage({ type: 'error', text: 'Please enter your old password' });
          return;
        }
        if (userData.newPassword !== userData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          return;
        }

        const response = await axios.put('http://localhost:5000/api/users/update', {
          email: userData.email,
          oldPassword: userData.oldPassword,
          newPassword: userData.newPassword,
          username: userData.username
        });

        if (response.status === 200) {
          // Update local storage
          localStorage.setItem('userData', JSON.stringify({
            username: userData.username,
            email: userData.email
          }));

          // Clear password fields
          setUserData(prev => ({
            ...prev,
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));

          setMessage({ type: 'success', text: 'Profile and password updated successfully!' });
        }
      } else {
        // Only update profile
        const response = await axios.put('http://localhost:5000/api/users/update', {
          email: userData.email,
          username: userData.username
        });

        if (response.status === 200) {
          localStorage.setItem('userData', JSON.stringify({
            username: userData.username,
            email: userData.email
          }));
          setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Update failed' 
      });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={(e) => setUserData({...userData, username: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Old Password"
            value={userData.oldPassword}
            onChange={(e) => setUserData({...userData, oldPassword: e.target.value})}
          />
          <input
            type="password"
            placeholder="New Password"
            value={userData.newPassword}
            onChange={(e) => setUserData({...userData, newPassword: e.target.value})}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
          />
          <button onClick={handleUpdate}>Update</button>
        </div>

        {message.text && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;