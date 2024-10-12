import React from 'react';

function EditProfile() {
  return (
    <div className="flex flex-col bg-gray-100 p-8 w-full max-w-xl mx-auto">
      <div className="flex flex-col items-center mb-5">
        <p className="text-3xl text-red-500 mb-0">Edit Profile</p>
        <p>All information is public and optional.</p>
      </div>
      <div className="flex flex-wrap justify-between gap-8">
        <div className="flex flex-col flex-basis-1/2">
          <label><b>Biography</b></label>
          <textarea className="bg-gray-300 border-none rounded-md h-16 p-2" />
          <p className="mt-1">Talk about yourself, your interests, what you like in chess, your favorite openings, players, ...</p>
        </div>
        <div className="flex flex-col flex-basis-1/3">
          <label><b>Userame</b></label>
          <input type="text" className="bg-gray-300 border-none rounded-md h-8 p-2" />
        </div>
        <div className="flex flex-col flex-basis-1/3">
          <label><b>Real Name</b></label>
          <input type="text" className="bg-gray-300 border-none rounded-md h-8 p-2" />
        </div>
        <div className="flex flex-col flex-basis-1/3">
          <label><b>Region or country</b></label>
          <input type="text" className="bg-gray-300 border-none rounded-md h-8 p-2" />
        </div>
        <div className="flex flex-col flex-basis-1/3">
          <label><b>Location</b></label>
          <input type="text" className="bg-gray-300 border-none rounded-md h-8 p-2" />
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <hr className="my-2" />
        <button className="bg-blue-500 text-white rounded-md py-2 px-4 self-end">Submit</button>
      </div>
    </div>
  );
}

export default EditProfile;
