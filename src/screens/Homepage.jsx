import { useState } from "react";
import { Lobby } from "../components/homepage/Lobby";

import CreateGameModal from "../components/homepage/CreateGameModal";

export const Homepage = () => {
  // State lưu trữ tab hiện tại
  const [activeTab, setActiveTab] = useState("quick-pairing");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility

  // Hàm mở và đóng modal
  const openModal = () => {
    setIsModalOpen(true); // Mở modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

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
        className="aspect-[2/1] bg-[#FFFFFF80] text-[#787878] rounded-lg transition hover:bg-[#D64F0033]"
      >
        <button className="flex flex-col justify-center items-center w-full h-full p-4">
          <div className="text-4xl font-[Roboto] p-2">{button.label}</div>
          <div className="text-2xl text-gray-400">{button.type}</div>
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
      return Lobby();
    } 
  };

  return (
    <div className="flex h-full w-full">
      {/* Cột 1: Cột trống */}
      <div className="flex w-1/4"></div>

      {/* Cột 2: Điều hướng tab và nội dung */}
      <div className="w-1/2 flex flex-col items-center text-white">
        {/* Điều hướng tab */}
        <div className="flex space-x-6 mb-3 w-full justify-center">
          <button
            onClick={() => handleTabClick("quick-pairing")}
            className={`text-lg w-1/2 py-2 ${
              activeTab === "quick-pairing"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-700"
            }`}
          >
            Quick Pairing
          </button>
          <button
            onClick={() => handleTabClick("lobby")}
            className={`text-lg w-1/2 py-2 ${
              activeTab === "lobby"
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-700"
            }`}
          >
            Lobby
          </button>
        </div>

        {/* Nội dung tab */}
        {renderTabContent()}
      </div>

      {/* Cột 3: Các nút hành động được căn giữa */}
      <div className="w-1/4 flex flex-col justify-center items-center space-y-8">
        <button
          onClick={openModal}
          className="bg-gradient-to-b from-[#f5f5f5] to-[#ededed] text-[#949494] font-sans font-semibold text-xl rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:from-[#fafafa] hover:to-[#f2f2f2] w-3/4"
        >
          Create Game
        </button>

        <button className="bg-gradient-to-b from-[#f5f5f5] to-[#ededed] text-[#949494] font-sans font-semibold text-xl rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:from-[#fafafa] hover:to-[#f2f2f2] w-3/4">
          Play with Friend
        </button>
        <button className="bg-gradient-to-b from-[#f5f5f5] to-[#ededed] text-[#949494] font-sans font-semibold text-xl rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:from-[#fafafa] hover:to-[#f2f2f2] w-3/4">
          Play with the Computer
        </button>
      </div>
      <CreateGameModal isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};
