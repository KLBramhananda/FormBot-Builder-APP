import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Settings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

library.add(faEye, faEyeSlash);

const Settings = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const storedData = JSON.parse(localStorage.getItem("userData"));

      const updateData = { userId: storedData.userId };
      if (userData.username.trim())
        updateData.username = userData.username.trim();
      if (userData.email.trim()) updateData.email = userData.email.trim();
      if (userData.oldPassword && userData.newPassword) {
        updateData.oldPassword = userData.oldPassword;
        updateData.newPassword = userData.newPassword;
      }

      if (Object.keys(updateData).length <= 1) {
        setMessage({
          type: "error",
          text: "Please fill at least one field to update",
        });
        setIsUpdating(false);
        return;
      }

      if (
        (userData.oldPassword && !userData.newPassword) ||
        (!userData.oldPassword && userData.newPassword)
      ) {
        setMessage({
          type: "error",
          text: "Please provide both current and new password",
        });
        setIsUpdating(false);
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        updateData
      );

      const isError = !response.data;

      if (isError) {
        setMessage({
          text: "An error occurred while updating.",
          type: "error",
        });
      } else {
        const updatedUserData = {
          ...storedData,
          ...(updateData.username && { username: updateData.username }),
          ...(updateData.email && { email: updateData.email }),
        };

        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        setUserData({
          username: "",
          email: "",
          oldPassword: "",
          newPassword: "",
        });
        setMessage({
          text: response.data.message,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Update error:", error.response || error);
      let errorMessage = "Internal Server Error";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Current password is incorrect";
      } else if (error.response?.status === 409) {
        errorMessage = "Email is already in use";
      } else if (error.response?.status === 500) {
        errorMessage = "Internal Server Error";
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-form">
        <div className="input-container">
          <img
            src="/assets/images/user.png"
            alt="user"
            className="input-icon"
          />
          <input
            type="text"
            placeholder="Name"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            disabled={isUpdating}
            className="text-input"
          />
        </div>
        <div className="input-container">
          <img
            src="/assets/images/lock.png"
            alt="lock"
            className="input-icon"
          />
          <input
            type={passwordVisibility.email ? "text" : "password"}
            placeholder="Update Email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            disabled={isUpdating}
            className="text-input"
          />
          <span
            className="toggle-icon"
            onClick={() => togglePasswordVisibility("email")}
          >
            <FontAwesomeIcon
              icon={
                passwordVisibility.email
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            />
          </span>
        </div>
        <div className="input-container">
          <img
            src="/assets/images/lock.png"
            alt="lock"
            className="input-icon"
          />
          <input
            type={passwordVisibility.oldPassword ? "text" : "password"}
            placeholder="Old Password"
            value={userData.oldPassword}
            onChange={(e) =>
              setUserData({ ...userData, oldPassword: e.target.value })
            }
            disabled={isUpdating}
            className="text-input"
          />
          <span
            className="toggle-icon"
            onClick={() => togglePasswordVisibility("oldPassword")}
          >
            <FontAwesomeIcon
              icon={
                passwordVisibility.oldPassword
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            />
          </span>
        </div>
        <div className="input-container">
          <img
            src="/assets/images/lock.png"
            alt="lock"
            className="input-icon"
          />
          <input
            type={passwordVisibility.newPassword ? "text" : "password"}
            placeholder="New Password"
            value={userData.newPassword}
            onChange={(e) =>
              setUserData({ ...userData, newPassword: e.target.value })
            }
            disabled={isUpdating}
            className="text-input"
          />
          <span
            className="toggle-icon"
            onClick={() => togglePasswordVisibility("newPassword")}
          >
            <FontAwesomeIcon
              icon={
                passwordVisibility.newPassword
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
            />
          </span>
        </div>
        <button onClick={handleUpdate} disabled={isUpdating} className="update">
          Update
        </button>
        {message.text && (
          <div className={`alert ${message.type}`}>{message.text}</div>
        )}
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
