import { useState } from "react";
import { EditProfile } from "../components/setting/EditProfile";
import { ChangePassword } from "../components/setting/ChangePassword";
import { CloseAccount } from "../components/setting/CloseAccount";

export const Setting = () => {
  const [activePage, setActivePage] = useState("EditProfile");

  return (
    <div className="flex justify-center h-screen w-screen">
      <div className="w-5/6 flex flex-row ">
        <div className="w-1/6  rounded-lg ">
          <div className="flex flex-col text-[#5E5E5E] text-lg font-sans   shadow-sm">
            {["EditProfile", "ChangePassword", "CloseAccount"].map((page) => (
              <p
                key={page}
                onClick={() => setActivePage(page)}
                className={`cursor-pointer px-3 py-2  transition-colors ${
                  activePage === page
                    ? "text-red-500 border-r-2 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page.replace(/([A-Z])/g, " $1").trim()}
              </p>
            ))}
          </div>
        </div>

        <div className="w-5/6">
          {activePage === "EditProfile" && <EditProfile />}
          {activePage === "ChangePassword" && <ChangePassword />}
          {activePage === "CloseAccount" && <CloseAccount />}
        </div>
      </div>
    </div>
  );
};
