import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShareModal.css";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const ShareModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("Edit");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleSendInvite = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (!email) {
        setError("Please enter an email address");
        return;
      }

      // Verify email exists
      const verifyResponse = await api.get(`/api/share/verify-email/${email}`);
      if (!verifyResponse.data.exists) {
        setError("This email is not registered in our system");
        return;
      }

      // Send share invite with complete dashboard data
      const dashboardData = {
        folders:
          JSON.parse(localStorage.getItem(`folders_${currentUser.email}`)) ||
          [],
        folderContents: JSON.parse(
          localStorage.getItem(`folderContents_${currentUser.email}`)
        ) || { mainPage: [] },
      };

      const shareData = {
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        inviteeEmail: email,
        permission,
        dashboardData,
      };

      const response = await api.post("/api/share/invite", shareData);
      setSuccess("Dashboard shared successfully!");
      setEmail("");
      alert(`Dashboard has been shared successfully with ${email}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send invite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const dashboardData = {
        folders:
          JSON.parse(localStorage.getItem(`folders_${currentUser.email}`)) ||
          [],
        folderContents: JSON.parse(
          localStorage.getItem(`folderContents_${currentUser.email}`)
        ) || { mainPage: [] },
      };

      const shareData = {
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        permission,
        dashboardData,
        timestamp: Date.now(),
      };

      const shareToken = btoa(JSON.stringify(shareData));
      const shareUrl = `${window.location.origin}/shared/${shareToken}`;

      const response = await api.post("/api/share/create-link", {
        token: shareToken,
        sharedBy: currentUser.email,
        sharerUsername: currentUser.username,
        permission,
        dashboardData,
      });

      await navigator.clipboard.writeText(shareUrl);
      setSuccess("Share link copied to clipboard!");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to generate sharing link"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="email-section">
            <h2>
              Invite by Email
              <select
                className="permission-dropdown"
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                disabled={isLoading}
              >
                <option value="Edit">Edit</option>
                <option value="View">View</option>
              </select>
            </h2>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? "error-input" : ""}
              disabled={isLoading}
            />
            <button
              className="send-invite-button"
              onClick={handleSendInvite}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Invite"}
            </button>
          </div>

          <div className="link-section">
            <h2>Share via Link</h2>
            <button
              className="copy-link-button"
              onClick={handleCopyLink}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Copy Link"}
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
