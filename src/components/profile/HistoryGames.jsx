import { Chessboard } from "react-chessboard";
import { GiBurningEmbers, GiCrossedSwords } from "react-icons/gi";
import { useState } from "react";

export const HistoryGames = ({ games, formatDate }) => {
  const [filter, setFilter] = useState("All"); 
  const user_id = localStorage.getItem("user_id");

  const checkGameWins = (game) => {
    if (game.result === "black_wins") {
      return user_id === String(game.black_player_id);
    } else if (game.result === "white_wins") {
      return user_id === String(game.white_player_id);
    }
    return false;
  }

  // Hàm lọc các trận đấu theo loại
  const filteredGames = games.filter((game) => {
    if (filter === "All") return true; 
    if (filter === "Win") return checkGameWins(game); 
    if (filter === "Lose") return (!checkGameWins(game)); 
    //return false;
  });

  return (
    <div className="bg-gray-100">
      <div className="text-lg font-semibold text-gray-800 text-center py-3">
        History Games
      </div>
      <div className="flex justify-center gap-2">
        {["All", "Win", "Lose"].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)} 
            className={`w-1/4 h-10 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-blue-100 transition-all duration-300 ${
              filter === label ? "bg-blue-200 font-bold" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="space-y-4 p-4">
        {filteredGames.map((game, index) => (
          <li
            key={index}
            className={`flex gap-4 p-4 rounded-lg ${
              index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"
            } hover:bg-blue-200`}
          >
            <div className="w-[220px]">
              <Chessboard position={game.fen || "start"} boardWidth={200} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-x-3">
                <GiBurningEmbers className="size-12" />
                <div>
                  <strong className="text-lg font-semibold text-gray-800 flex gap-2">
                    <p>{game.time_control_id}</p>
                    <p>•</p>
                    <p>{game.variant_id}</p>
                  </strong>
                  <time
                    className="text-sm text-gray-600"
                    dateTime={game.start_time}
                  >
                    {formatDate(game.start_time)}
                  </time>
                </div>
              </div>
              <div className="flex justify-center mt-3 text-gray-700">
                <p>{game.white_player_username}</p>
                <GiCrossedSwords className="mx-2 text-gray-500" />
                <p>{game.black_player_username}</p>
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">
                {game.status} • {game.result}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
