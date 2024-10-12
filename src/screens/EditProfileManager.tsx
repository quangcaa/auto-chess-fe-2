import React, { useState } from 'react';
import EditProfile from './../components/EditProfile';
import ChangePassword from './../components/ChangePassword';
import CloseAccount from './../components/CloseAccount';

function EditProfileManager() {
  const [activePage, setActivePage] = useState('EditProfile');
  
  return (
    <div className="flex flex-row justify-center bg-gray-200 h-screen">
      <div className="space-x-8 p-4">
        <div className="flex flex-col">
          {['EditProfile', 'ChangePassword', 'CloseAccount'].map((page) => (
            <p
              key={page}
              onClick={() => setActivePage(page)}
              className={`cursor-pointer ${activePage === page ? 'text-red-500' : 'text-black'}`}
            >
              {page.replace(/([A-Z])/g, ' $1').trim()} {/* Chuyển đổi tên thành dạng hiển thị */
              }
            </p>
          ))}
        </div>
      </div>
      <div className="flex-grow mt-1">
        {activePage === 'EditProfile' && <EditProfile />}
        {activePage === 'ChangePassword' && <ChangePassword />}
        {activePage === 'CloseAccount' && <CloseAccount />}
      </div>
    </div>
  );
}

export default EditProfileManager;
