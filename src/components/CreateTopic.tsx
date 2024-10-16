import React from "react";
import backImage from "./../assets/images/back.png";

export const CreateTopic = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="bg-white p-4 w-1/2 ">
        <div className="flex flex-row items-center gap-4 m-5">
          <img src={backImage} alt="forum" className="h-8" />
          <p className="text-3xl">General Chess Discussion</p>
        </div>
        <form className="m-5 space-y-4">
          <p className="font-bold text-sm">Subject</p>
          <input type="text" className="bg-gray-200 border-none rounded-md h-8 p-2 w-full" />
          <p className="font-bold text-sm">Message</p>
          <textarea className="bg-gray-200 border-none rounded-md h-32 w-full"/>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white text-sm font-bold rounded-md py-2 px-4">CREATE THE TOPIC</button>
          </div>
        </form>
      </div>
    </div>
  );
};
