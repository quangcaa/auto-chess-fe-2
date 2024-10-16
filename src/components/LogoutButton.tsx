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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, {
        headers: {
          'x_authorization': localStorage.getItem('accessToken') || '' 
        }
      });

      if (res.data.success) {
        localStorage.removeItem('accessToken');
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
      className="bg-white text-black font-bold py-2 px-4 rounded border border-gray-300 hover:bg-gray-200 transition duration-200"
    >
      Logout
    </button>
  );
};


