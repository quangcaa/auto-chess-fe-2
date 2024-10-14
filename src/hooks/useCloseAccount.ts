import { useState } from 'react';

const useCloseAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const closeAccount = async (password) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch('http://localhost:3333/account/close-account', {
        method: 'DELETE',
        headers: {
          'x_authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Incorrect password');
      }

      const data = await response.json();
      setSuccess(true);
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
