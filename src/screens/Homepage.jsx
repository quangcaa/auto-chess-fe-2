import { useEffect, useState } from "react";

import { CreateGameModal } from "@/components/homepage/CreateGameModal";

import { useAuth } from "@/contexts/AuthContext";

export const Homepage = () => {
  const [activeTab, setActiveTab] = useState("quick-pairing");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lobby, setLobby] = useState([]);

  const { socket } = useAuth();

  const timeControls = [
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Listen for the initial lobby list
    socket.on("update_lobby", (allLobbies) => {
      const gamesArray = Array.from(allLobbies.values());
      setLobby(gamesArray);
    });

    return () => {
      socket.off("update_lobby");
    };
  }, [socket]);

  return (
    <div className="flex w-full h-[calc(100vh-60px)] py-2">
      <div className="flex w-1/4"></div>

      <div className="w-1/2 flex flex-col items-center">
        <div className="flex w-full justify-center">
          <button
            onClick={() => setActiveTab("quick-pairing")}
            className={`text-lg font-medium w-1/2 py-2 hover:border-b-2 hover:border-emerald-600 ${
              activeTab === "quick-pairing"
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-gray-700"
            }`}
          >
            Quick Pairing
          </button>
          <button
            onClick={() => setActiveTab("lobby")}
            className={`text-lg font-medium w-1/2 py-2 hover:border-b-2 hover:border-emerald-600 ${
              activeTab === "lobby"
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-gray-700"
            }`}
          >
            Lobby
          </button>
        </div>

        <div className="flex w-full h-full pt-2">
          {activeTab === "quick-pairing" && (
            <QuickPairing timeControls={timeControls} />
          )}
          {activeTab === "lobby" && <Lobby games={lobby} />}
        </div>
      </div>

      <div className="w-1/4 flex flex-col justify-center items-center space-y-8">
        <button
          onClick={openModal}
          className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase"
        >
          Create Game
        </button>

        <button className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase">
          Join Game
        </button>
        <button className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase">
          Play with the Computer
        </button>
      </div>

      {isModalOpen && <CreateGameModal closeModal={closeModal} />}
    </div>
  );
};

const QuickPairing = ({ timeControls }) => (
  <div className="flex h-full w-full">
    <div className="grid grid-cols-3 gap-2 w-full h-full">
      {timeControls.map((time, index) => (
        <div
          key={index}
          className="bg-white shadow-md text-gray-700 rounded-lg transition hover:bg-emerald-400"
        >
          <button className="flex flex-col justify-center items-center w-full h-full p-4 opacity-80">
            <div className="text-4xl p-2">{time.label}</div>
            <div className="text-2xl text-gray-500">{time.type}</div>
          </button>
        </div>
      ))}
    </div>
  </div>
);

const Lobby = ({ games }) => (
  <div className="flex h-full w-full flex-col bg-white shadow-md rounded-lg overflow-auto py-2">
    {games.length > 0 ? (
      <table className="w-full table-fixed">
        <thead className="sticky top-0 text-gray-700 py-5 border-b border-gray-300">
          <tr className=" text-2xl">
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/2">
              Player
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
              Time
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
              Mode
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((lobby) => (
            <tr
              key={lobby.id}
              className="border-b  border-[#D9D9D9] bg-[#ffffff80] hover:bg-[#D64F0033] hover:text-[#FFFFFF]"
            >
              <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                {lobby.game_id}
              </td>
              {/* <td className="px-4 py-2 text-[#4D4D4D] font-semibold ">
              {lobby.rating}
            </td>
            <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
              {lobby.time}
            </td>
            <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
              {lobby.mode}
            </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="w-full h-full flex justify-center items-center text-xl text-emerald-700">
        No games available. Create one now!
      </div>
    )}
  </div>
);
