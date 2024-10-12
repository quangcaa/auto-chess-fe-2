import React from 'react';

function ChangePassword() {
  return (
    <div className="flex flex-col bg-gray-100 p-8 w-full max-w-xl mx-auto">
      <p className="text-3xl text-red-500">Change Password</p>
      <ul className="mt-5 space-y-4">
        <li>
          <p className="font-bold">Current Password</p>
          <input type="password" className="bg-gray-300 border-none rounded-md h-8 p-2 w-full" />
        </li>
        <li>
          <p className="font-bold">New Password</p>
          <input type="password" className="bg-gray-300 border-none rounded-md h-8 p-2 w-full" />
        </li>
        <li>
          <p className="font-bold">New Password (again)</p>
          <input type="password" className="bg-gray-300 border-none rounded-md h-8 p-2 w-full" />
        </li>
      </ul>
      <div className="flex flex-col mt-6">
        <hr className="my-2" />
        <button className="bg-blue-500 text-white rounded-md py-2 px-4 self-end">Submit</button>
      </div>
    </div>
  );
}

export default ChangePassword;
