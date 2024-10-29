import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Homepage = () => {
  const [activeTab, setActiveTab] = useState("quick-pairing");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
      <button
        key={index}
        className="bg-gray-800 text-white rounded-lg p-6 flex flex-col justify-center items-center transition hover:bg-gray-700"
      >
        <div className="text-2xl font-bold">{button.label}</div>
        <div className="text-sm text-gray-400">{button.type}</div>
      </button>
    ));
  };

  return (
    <div className="flex flex-col items-center text-white h-full overflow-hidden">
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

      <div className="grid grid-cols-3 gap-6 max-w-3xl w-full">
        {renderButtons()}
      </div>
    </div>
  );
};
