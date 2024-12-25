import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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

  const handleUpdate = (type) => {
    if (type === 'profile') {
      // Update profile logic
      localStorage.setItem('userData', JSON.stringify({
        username: userData.username,
        email: userData.email
      }));
    } else if (type === 'password') {
      if (userData.password === userData.confirmPassword) {
        // Update password logic
        console.log('Password updated');
      } else {
        alert('Passwords do not match');
      }
    }
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
          <button onClick={() => handleUpdate('profile')}>Update Profile</button>
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="New Password"
            value={userData.password}
            onChange={(e) => setUserData({...userData, password: e.target.value})}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
          />
          <button onClick={() => handleUpdate('password')}>Update Password</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;