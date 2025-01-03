import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SharedDashboardRedirect = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const handleShare = async () => {
      try {
        const userData = localStorage.getItem('userData');
        
        if (!userData) {
          localStorage.setItem('pendingShareToken', token);
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/share/verify-token/${token}`);
        const shareData = response.data;

        if (!shareData) {
          console.error('Invalid share token');
          navigate('/dashboard');
          return;
        }

        localStorage.setItem('activeShare', JSON.stringify({
          sharedBy: shareData.sharedBy,
          sharerUsername: shareData.sharerUsername,
          permission: shareData.permission
        }));

        
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