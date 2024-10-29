import { useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

const useCloseAccount = () => {
  const { logout } = useAuth()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const closeAccount = async (password) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.delete('http://localhost:3333/account/close-account', {
        data: { password }
      });

      const data = await response.data;
      setSuccess(true);
      logout()
      console.log(data.message);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { closeAccount, loading, error, success };
};
//  
export default useCloseAccount;
