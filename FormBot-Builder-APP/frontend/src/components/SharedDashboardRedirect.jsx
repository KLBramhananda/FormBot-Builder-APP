import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SharedDashboardRedirect = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    try {
      // Check if user is logged in
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
        // If not logged in, store the share token and redirect to login
        localStorage.setItem('pendingShareToken', token);
        navigate('/login');
        return;
      }

      // If logged in, decode the token and handle the shared dashboard
      const shareData = JSON.parse(atob(token));
      
      // Store the share data in localStorage
      localStorage.setItem('activeShare', JSON.stringify(shareData));
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Invalid share link:', error);
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="loading-container">
      <p>Loading shared dashboard...</p>
    </div>
  );
};

export default SharedDashboardRedirect;