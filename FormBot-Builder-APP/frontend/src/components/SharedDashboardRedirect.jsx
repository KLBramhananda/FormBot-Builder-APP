import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SharedDashboardRedirect = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const handleShare = async () => {
      try {
        // Check if user is logged in
        const userData = localStorage.getItem('userData');
        
        if (!userData) {
          // If not logged in, store the share token and redirect to login
          localStorage.setItem('pendingShareToken', token);
          navigate('/login');
          return;
        }

        // If logged in, verify the share token with the backend
        const response = await axios.get(`http://localhost:5000/api/share/verify-token/${token}`);
        const shareData = response.data;

        if (!shareData) {
          console.error('Invalid share token');
          navigate('/dashboard');
          return;
        }

        // Store the verified share data
        localStorage.setItem('activeShare', JSON.stringify({
          sharedBy: shareData.sharedBy,
          sharerUsername: shareData.sharerUsername,
          permission: shareData.permission
        }));

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error handling share:', error);
        navigate('/dashboard');
      }
    };

    handleShare();
  }, [token, navigate]);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <p>Loading shared dashboard...</p>
        {/* You can add a loading spinner here if you want */}
      </div>
    </div>
  );
};

export default SharedDashboardRedirect;