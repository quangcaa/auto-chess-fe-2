import { useState } from "react";
import { renderLobbyContent } from "../components/homepage/renderLobbyContent";
import { renderCorrespondenceContent } from "../components/homepage/renderCorrespondenceContent";

export const Homepage = () => {
  // State lưu trữ tab hiện tại
  const [activeTab, setActiveTab] = useState("quick-pairing");

  // Hàm thay đổi tab khi người dùng click vào
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Hàm render các nút với thời gian chơi khác nhau
  const renderButtons = () => {
    const buttons = [
      { label: "1+0", type: "Bullet" },
      { label: "2+1", type: "Bullet" },
      { label: "3+0", type: "Blitz" },
      { label: "3+2", type: "Blitz" },
      { label: "5+0", type: "Blitz" },
      { label: "5+3", type: "Blitz" },
      { label: "10+0", type: "Rapid" },
      { label: "10+5", type: "Rapid" },
      { label: "15+10", type: "Rapid" },
      { label: "30+0", type: "Classical" },
      { label: "30+20", type: "Classical" },
      { label: "Custom", type: "" },
    ];

    return buttons.map((button, index) => (
      <div
        key={index}
        className="aspect-[2/1] bg-gray-800 text-white rounded-lg transition hover:bg-gray-700"
      >
        <button className="flex flex-col justify-center items-center w-full h-full p-4">
          <div className="text-2xl font-bold">{button.label}</div>
          <div className="text-sm text-gray-400">{button.type}</div>
        </button>
      </div>
    ));
  };

  // Hàm render nội dung cho các tab khác nhau
  const renderTabContent = () => {
    if (activeTab === "quick-pairing") {
      return (
        <div className="grid grid-cols-3 gap-2 w-full">
          {renderButtons()}
        </div>
      );
    } else if (activeTab === "lobby") {
      return renderLobbyContent();
    } else if (activeTab === "correspondence") {
      return renderCorrespondenceContent();
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Cột 1: Cột trống */}
      <div className="flex w-1/4"></div>

      {/* Cột 2: Điều hướng tab và nội dung */}
      <div className="w-1/2 flex flex-col items-center text-white">
        {/* Điều hướng tab */}
        <div className="flex space-x-6 mb-8">
          <button
            onClick={() => handleTabClick("quick-pairing")}
            className={`text-lg px-4 py-2 ${
              activeTab === "quick-pairing"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-700"
            }`}
          >
            Quick Pairing
          </button>
          <button
            onClick={() => handleTabClick("lobby")}
            className={`text-lg px-4 py-2 ${
              activeTab === "lobby"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-700"
            }`}
          >
            Lobby
          </button>
          <button
            onClick={() => handleTabClick("correspondence")}
            className={`text-lg px-4 py-2 ${
              activeTab === "correspondence"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-700"
            }`}
          >
            Correspondence
          </button>
        </div>

        {/* Nội dung tab */}
        {renderTabContent()}
      </div>

      {/* Cột 3: Các nút hành động được căn giữa */}
      <div className="w-1/4 flex flex-col justify-center items-center space-y-8">
  <button className="bg-white text-gray-700 font-sans font-semibold text-lg rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-white w-3/4">
    Create Game
  </button>
  <button className="bg-white text-gray-700 font-sans font-semibold text-lg rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-white w-3/4">
    Play with Friend
  </button>
  <button className="bg-white text-gray-700 font-sans font-semibold text-lg rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-white w-3/4">
    Play with the Computer
  </button>
</div>
</div>
  );
};
