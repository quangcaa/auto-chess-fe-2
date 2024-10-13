import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import warningImage from './../assets/images/warning.png';
import useCloseAccount from '../hooks/useCloseAccount';

export const CloseAccount = () => {
  const navigate = useNavigate()
  const { closeAccount, loading, error, success } = useCloseAccount();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await closeAccount(password);
    if (result) {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 p-8 w-full max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        <img src={warningImage} alt="warning" className="w-12 pr-2" />
        <p className="text-3xl text-red-500">Close Account</p>
      </div>
      <p>Are you sure you want to close your account? Closing your account is a permanent decision. You will NEVER be able to log in EVER AGAIN.</p>
      <p>You will not be allowed to open a new account with the same name, even if the case is different.</p>
      <p className="font-bold mt-4">Password</p>
      <input
        type="password"
        className="bg-gray-300 border-none rounded-md h-8 w-full p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="flex flex-col mt-6">
        <hr className="my-2" />
        <div className="flex justify-between items-center">
          <p className="text-blue-500">I changed my mind, don't close my account</p>
          <button
            className="bg-red-500 text-white rounded-md py-2 px-4"
            onClick={handleSubmit} // Handle account closure
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Closing...' : 'CLOSE ACCOUNT'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">Account closed successfully!</p>}
      </div>
    </div>
  );
}

