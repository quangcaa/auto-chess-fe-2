import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      // Gửi yêu cầu đăng xuất đến server
      const res = await axios.post(`http://localhost:3333/auth/logout`, {}, {
        headers: {
          'x_authorization': localStorage.getItem('accessToken') || '' 
        }
      });

      if (res.data.success) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        navigate('/login');
      }
    } catch (error) {
        setError("Please check your internet");
        console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
     
    >
      Logout
    </button>
  );
};


