import React, { useState } from 'react';
import useChangePassword from '../hooks/useChangePassword';

function ChangePassword() {
  const { changePassword, loading, error, success } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword(currentPassword, newPassword, retypeNewPassword);
  };

  return (
    <div className="flex flex-col bg-gray-100 p-8 w-full max-w-xl mx-auto">
      <p className="text-3xl text-red-500">Change Password</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <ul>
          <li>
            <p className="font-bold">Current Password</p>
            <input
              type="password"
              className="bg-gray-300 border-none rounded-md h-8 p-2 w-full"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </li>
          <li>
            <p className="font-bold">New Password</p>
            <input
              type="password"
              className="bg-gray-300 border-none rounded-md h-8 p-2 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </li>
          <li>
            <p className="font-bold">New Password (again)</p>
            <input
              type="password"
              className="bg-gray-300 border-none rounded-md h-8 p-2 w-full"
              value={retypeNewPassword}
              onChange={(e) => setRetypeNewPassword(e.target.value)}
              required
            />
          </li>
        </ul>
        <div className="flex flex-col mt-6">
          <hr className="my-2" />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md py-2 px-4 self-end"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Changing...' : 'Submit'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">Password changed successfully!</p>}
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
