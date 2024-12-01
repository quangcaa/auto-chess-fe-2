// Homepage.jsx
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { CreateGameModal } from "@/components/homepage/CreateGameModal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/Loading";

const debounce = (func, delay) => {
  let debounceTimer;
  return function (...args) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

export const Homepage = () => {
  const [isCreateGameClicked, setIsCreateGameClicked] = useState(false);
  const [isJoinGameClicked, setIsJoinGameClicked] = useState(false);
  const [createdGameId, setCreatedGameId] = useState("");
  const [joinGameId, setJoinGameId] = useState("");
  const [activeTab, setActiveTab] = useState("quick-pairing");
  const [lobby, setLobby] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { socket } = useAuth();

  const debouncedNavigate = useCallback(debounce(navigate, 300), [navigate]);

  const timeControls = [
    { base_time: "1", increment_by_turn: "0", name: "Bullet" },
    { base_time: "2", increment_by_turn: "1", name: "Bullet" },
    { base_time: "3", increment_by_turn: "0", name: "Blitz" },
    { base_time: "3", increment_by_turn: "2", name: "Blitz" },
    { base_time: "5", increment_by_turn: "0", name: "Blitz" },
    { base_time: "5", increment_by_turn: "3", name: "Blitz" },
    { base_time: "10", increment_by_turn: "0", name: "Rapid" },
    { base_time: "10", increment_by_turn: "5", name: "Rapid" },
    { base_time: "15", increment_by_turn: "10", name: "Rapid" },
    { base_time: "30", increment_by_turn: "0", name: "Classical" },
    { base_time: "30", increment_by_turn: "20", name: "Classical" },
    { base_time: null, increment_by_turn: null, name: "Custom" },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleQuickPairing = (index) => {
    setIsWaiting(true);
    setLoadingIndex(index);
    socket.emit("join_quick_pairing");
  };

  const handleCreateGame = () => {
    socket.emit("create_game", (response) => {
      if (response.success) {
        setCreatedGameId(response.game_id);
        setIsCreateGameClicked(true);
      } else {
        console.error(response.message);
      }
    });
  };

  // testing
  const handleJoinGame = () => {
    if (joinGameId) {
      socket.emit("join_game", joinGameId, (response) => {
        if (response.success) {
          debouncedNavigate(`/${joinGameId}`);
        } else {
          console.error(response.message);
        }
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("paired", (game_id) => {
      console.log(`Paired with game_id: ${game_id}`);
      // Navigate to the game page with the game_id
      navigate(`/${game_id}`);
    });

    // Listen for the initial lobby list
    socket.on("update_lobby", (allLobbies) => {
      const gamesArray = Array.from(allLobbies.values());
      setLobby(gamesArray);
    });

    return () => {
      socket.off("update_lobby");
      socket.off("paired"); // Cleanup listener
    };
  }, [socket, navigate]);

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
            <QuickPairing
              timeControls={timeControls}
              handleQuickPairing={handleQuickPairing}
              loadingIndex={loadingIndex}
            />
          )}
          {activeTab === "lobby" && <Lobby games={lobby} />}
        </div>
      </div>

      <div className="w-1/4 flex flex-col justify-center items-center space-y-8">
        <button
          onClick={handleCreateGame}
          className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase"
        >
          Create Game
        </button>
        {isCreateGameClicked && (
          <div className="mt-4 text-center">
            <p
              className="text-lg cursor-pointer"
              onClick={() => navigator.clipboard.writeText(createdGameId)}
            >
              Game ID: <span className="font-bold">{createdGameId}</span>
            </p>
            <button
              onClick={() => debouncedNavigate(`/game/${createdGameId}`)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Start Game
            </button>
          </div>
        )}

        <button
          onClick={() => setIsJoinGameClicked(!isJoinGameClicked)}
          className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase"
        >
          Join Game
        </button>
        {isJoinGameClicked && (
          <div className="mt-4 flex flex-col items-center">
            <input
              type="text"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              placeholder="Enter Game ID"
              className="border border-gray-300 p-2 rounded-md text-center"
            />
            <button
              onClick={handleJoinGame}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Join Game
            </button>
          </div>
        )}

        <button
          onClick={() => debouncedNavigate("/computer")}
          className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase"
        >
          Play with Computer
        </button>
      </div>

      {isModalOpen && <CreateGameModal closeModal={closeModal} />}
    </div>
  );
};

const QuickPairing = ({ timeControls, handleQuickPairing, loadingIndex }) => (
  <div className="flex h-full w-full">
    <div className="grid grid-cols-3 gap-2 w-full h-full">
      {timeControls.map((time, index) => (
        <div
          key={index}
          className="bg-white shadow-md text-gray-700 rounded-lg transition hover:bg-emerald-400"
        >
          {loadingIndex === index ? (
            <Loading />
          ) : (
            <button
              className="flex flex-col justify-center items-center w-full h-full p-4 opacity-80"
              onClick={() => handleQuickPairing(index)}
            >
              <span className="text-4xl p-2">
                {time.base_time}+{time.increment_by_turn}
              </span>
              <div className="text-2xl text-gray-500">{time.name}</div>
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);
QuickPairing.propTypes = {
  timeControls: PropTypes.array.isRequired,
  handleQuickPairing: PropTypes.func.isRequired,
  loadingIndex: PropTypes.number.isRequired,
};

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
      <div className="w-full h-full flex justify-center items-center text-xl text-gray-700">
        No games available. Create one now!
      </div>
    )}
  </div>
);
Lobby.propTypes = {
  games: PropTypes.array.isRequired,
};
