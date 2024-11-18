import { useState } from "react";
import { EditProfile } from "../components/setting/EditProfileSection";
import { ChangePassword } from "../components/setting/ChangePasswordSection";
import { CloseAccount } from "../components/setting/CloseAccountSection";

export const Setting = () => {
  const [activePage, setActivePage] = useState("EditProfile");

  return (
    <div className="flex flex-grow justify-center">
      <div className="w-4/6 flex flex-row">
        <div className="w-1/6 rounded-lg">
          <div className="flex flex-col text-gray-800 text-lg mt-2">
            {["EditProfile", "ChangePassword", "CloseAccount"].map((page) => (
              <p
                key={page}
                onClick={() => setActivePage(page)}
                className={`cursor-pointer px-3 py-2 transition-colors ${
                  activePage === page
                    ? "text-red-500 border-r-2 border-red-500"
                    : "hover:border-r-2 hover:border-red-500"
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