import React from 'react';
import warningImage from './../assets/images/warning.png'

function CloseAccount() {
  return (
    <div className="flex flex-col bg-gray-100 p-8 w-full max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        <img src={warningImage} alt="warning" className="w-12 pr-2" />
        <p className="text-3xl text-red-500">Close Account</p>
      </div>
      <p>Are you sure you want to close your account? Closing your account is a permanent decision. You will NEVER be able to log in EVER AGAIN.</p>
      <p>You will not be allowed to open a new account with the same name, even if the case is different.</p>
      <p className="font-bold mt-4">Password</p>
      <input type="password" className="bg-gray-300 border-none rounded-md h-8 w-full p-2" />
      <div className="flex flex-col mt-6">
        <hr className="my-2" />
        <div className="flex justify-between items-center">
          <p className="text-blue-500">I changed my mind, don't close my account</p>
          <button className="bg-red-500 text-white rounded-md py-2 px-4">CLOSE ACCOUNT</button>
        </div>
      </div>
    </div>
  );
}

export default CloseAccount;
