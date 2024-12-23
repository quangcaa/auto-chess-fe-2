import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { CreateGameCard } from "@/components/homepage/CreateGameCard";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/Loading";

export const Homepage = () => {
  const [isJoinGameClicked, setIsJoinGameClicked] = useState(false);
  const [joinGameId, setJoinGameId] = useState("");
  const [activeTab, setActiveTab] = useState("quick-pairing");
  const [lobby, setLobby] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { socket } = useAuth();

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
  ];

  const openCard = () => setIsModalOpen(true);
  const closeCard = () => setIsModalOpen(false);

  const handleQuickPairing = (index) => {
    const selectedTimeControl = timeControls[index];

    if (isWaiting) {
      // if is pairing, cancel
      socket.emit("cancel_quick_pairing");
      setIsWaiting(false);
      setLoadingIndex(null);
    } else {
      // if not, send quick pairing
      setIsWaiting(true);
      setLoadingIndex(index);
      socket.emit("join_quick_pairing", selectedTimeControl);
    }
  };

  const handleJoinGame = () => {
    if (joinGameId) {
      socket.emit("join_game", joinGameId, (response) => {
        if (response.success) {
          navigate(`/game/${joinGameId}`);
        } else {
          console.error(response.message);
          toast.error(response.message);
        }
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("paired", (game_id) => {
      navigate(`/game/${game_id}`);
      setIsWaiting(false);
      setLoadingIndex(null);
    });

    socket.on("cancel_paired", () => {
      setIsWaiting(false);
      setLoadingIndex(null);
    });

    socket.on("start_now", (game_id) => {
      navigate(`/game/${game_id}`);
    });

    socket.emit("request_lobby");

    socket.on("update_lobby", (allLobbies) => {
      const gamesArray = Array.from(allLobbies.values());
      setLobby(gamesArray);
    });

    return () => {
      socket.off("update_lobby");
      socket.off("paired");
      socket.off("cancel_paired");
      socket.off("start_now");
    };
  }, [socket, navigate]);

  return (
    <div className="flex w-full h-[calc(100vh-60px)] py-2">
      <div className="flex w-1/4"></div>

      <div className="w-1/2 flex flex-col items-center">
        <div className="flex w-full justify-center">
          <button
            onClick={() => setActiveTab("quick-pairing")}
            className={`text-lg font-medium w-1/3 py-2 hover:border-b-2 hover:border-emerald-600 ${
              activeTab === "quick-pairing"
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-gray-700"
            }`}
          >
            Quick Pairing
          </button>
          <button
            onClick={() => setActiveTab("lobby")}
            className={`text-lg font-medium w-1/3 py-2 hover:border-b-2 hover:border-emerald-600 ${
              activeTab === "lobby"
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-gray-700"
            }`}
          >
            Lobby
          </button>
          <button
            onClick={() => setActiveTab("livestream")}
            className={`text-lg font-medium w-1/3 py-2 hover:border-b-2 hover:border-emerald-600 ${
              activeTab === "livestream"
                ? "border-b-2 border-emerald-600 text-emerald-700"
                : "text-gray-700"
            }`}
          >
            Livestream
          </button>
        </div>

        <div className="flex w-full h-full pt-2">
          {activeTab === "quick-pairing" && (
            <QuickPairing
              timeControls={timeControls}
              handleQuickPairing={handleQuickPairing}
              loadingIndex={loadingIndex}
              openCard={openCard}
              isWaiting={isWaiting}
            />
          )}
          {activeTab === "lobby" && <Lobby games={lobby} socket={socket} />}
          {activeTab === "livestream" && (
            <Livestream games={lobby} socket={socket} />
          )}
        </div>
      </div>

      <div className="w-1/4 flex flex-col justify-center items-center space-y-8">
        <button
          onClick={openCard}
          className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase"
        >
          Create Game
        </button>

        <button
          onClick={() => setIsJoinGameClicked(!isJoinGameClicked)}
          className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase"
        >
          Join Game
        </button>
        {isJoinGameClicked && (
          <div className="flex flex-row items-center gap-2">
            <input
              type="text"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              placeholder="Enter Game ID"
              className="border border-gray-300 p-2 rounded-md shadow-lg text-center focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
            />
            <button
              onClick={handleJoinGame}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-lg transition"
            >
              Join
            </button>
          </div>
        )}

        <button
          onClick={() => navigate("/computer")}
          className="bg-white opacity-80 border border-gray-300 text-gray-600 font-medium text-lg rounded-lg px-6 py-3 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:opacity-100 w-3/4 uppercase"
        >
          Play with Computer
        </button>
      </div>

      {isModalOpen && <CreateGameCard closeCard={closeCard} />}
    </div>
  );
};

const QuickPairing = ({
  timeControls,
  handleQuickPairing,
  loadingIndex,
  openCard,
  isWaiting,
}) => (
  <div className="flex h-full w-full">
    <div className="grid grid-cols-3 gap-2 w-full h-full">
      {timeControls.map((time, index) => (
        <div
          key={index}
          className={`bg-white shadow-md text-gray-700 rounded-lg transition ${
            loadingIndex === index && isWaiting
              ? "bg-yellow-400"
              : "hover:bg-emerald-400"
          }`}
        >
          <button
            className="flex flex-col justify-center items-center w-full h-full p-4 opacity-80"
            onClick={() => handleQuickPairing(index)}
          >
            {loadingIndex === index && isWaiting ? (
              <div className="flex flex-col gap-2">
                <Loading />
                <span className="text-xl">Cancel</span>
              </div>
            ) : (
              <>
                <span className="text-4xl p-2">
                  {time.base_time}+{time.increment_by_turn}
                </span>
                <div className="text-2xl text-gray-500">{time.name}</div>
              </>
            )}
          </button>
        </div>
      ))}
      <div className="bg-white shadow-md text-gray-700 rounded-lg transition hover:bg-emerald-400">
        <button
          className="flex flex-col justify-center items-center w-full h-full p-4 opacity-80"
          onClick={openCard}
        >
          <div className="text-4xl">Custom</div>
        </button>
      </div>
    </div>
  </div>
);
QuickPairing.propTypes = {
  timeControls: PropTypes.array.isRequired,
  handleQuickPairing: PropTypes.func.isRequired,
  loadingIndex: PropTypes.number,
  openCard: PropTypes.func.isRequired,
  isWaiting: PropTypes.bool.isRequired,
};

const Lobby = ({ games, socket }) => {
  const availableGames = games.filter((game) => !game.player1 || !game.player2);
  const navigate = useNavigate();

  const handleJoinGame = (gameId) => {
    socket.emit("join_game", gameId, (response) => {
      if (response.success) {
        navigate(`/game/${gameId}`);
      } else {
        console.error(response.message);
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-white shadow-md rounded-lg overflow-auto py-2">
      {availableGames.length > 0 ? (
        <table className="w-full table-fixed">
          <thead className="sticky top-0 text-gray-700 py-5 border-b border-gray-300">
            <tr className=" text-2xl">
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/2">
                Game ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
                <div className="flex justify-center">Side</div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
                <div className="flex justify-center">Time</div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
                <div className="flex justify-center">Type</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {availableGames.map((lobby) => (
              <tr
                key={lobby.id}
                className="cursor-pointer border-b border-gray-300 bg-[#ffffff80] hover:bg-[#D64F0033]"
                onDoubleClick={() => handleJoinGame(lobby.game_id)}
              >
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                  {lobby.game_id}
                </td>
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold flex justify-center">
                  {lobby.player1 === null ? "♘" : "♞"}
                </td>
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                  <div className="flex justify-center">
                    {lobby.baseTime / 60000} + {lobby.increment / 1000}
                  </div>
                </td>
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                  <div className="flex justify-center">
                    {lobby.timeControlName}
                  </div>
                </td>
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
};
Lobby.propTypes = {
  games: PropTypes.array.isRequired,
  socket: PropTypes.object.isRequired,
};

const Livestream = ({ games, socket }) => {
  const playingGames = games.filter((game) => game.player1 && game.player2);
  const navigate = useNavigate();

  const handleSpectateGame = (gameId) => {
    navigate(`/spectate/${gameId}`);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white shadow-md rounded-lg overflow-auto py-2">
      {playingGames.length > 0 ? (
        <table className="w-full table-fixed">
          <thead className="sticky top-0 text-gray-700 py-5 border-b border-gray-300">
            <tr className="text-2xl">
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/2">
                Game ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
                <div className="flex justify-center">Time</div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
                <div className="flex justify-center">Type</div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-1/6">
                <div className="flex justify-center">Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {playingGames.map((game) => (
              <tr
                key={game.id}
                className="cursor-pointer border-b border-gray-300 bg-[#ffffff80] hover:bg-[#D64F0033]"
              >
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                  {game.game_id}
                </td>
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                  <div className="flex justify-center">
                    {game.baseTime / 60000} + {game.increment / 1000}
                  </div>
                </td>
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                  <div className="flex justify-center">
                    {game.timeControlName}
                  </div>
                </td>
                <td className="px-4 py-2 text-[#4D4D4D] font-semibold">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleSpectateGame(game.game_id)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-lg transition"
                    >
                      Spectate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-xl text-gray-700">
          No current games. Join or create one now!
        </div>
      )}
    </div>
  );
};

Livestream.propTypes = {
  games: PropTypes.array.isRequired,
  socket: PropTypes.object.isRequired,
};
