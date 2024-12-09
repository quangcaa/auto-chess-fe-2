import { Chessboard } from "react-chessboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  GiBulletBill,
  GiTurtle,
  GiFireBowl,
  GiRabbit,
  GiCrossedSwords,
} from "react-icons/gi";

export const HistoryGames = ({ games }) => {
  const [filter, setFilter] = useState("All");
  const user_id = Number(localStorage.getItem("user_id"));
  const navigate = useNavigate();

  const checkGameWins = (game) => {
    if (game.result === "Black is victorious") {
      return user_id === game.black_player_id;
    } else if (game.result === "White is victorious") {
      return user_id === game.white_player_id;
    }
    return false;
  };

  // Hàm lọc các trận đấu theo loại
  const filteredGames = games.filter((game) => {
    if (filter === "All") return true;
    if (filter === "Win") return checkGameWins(game);
    if (filter === "Lose") return !checkGameWins(game);
    //return false;
  });

  return (
    <div className="bg-gray-100">
      <div className="text-lg font-semibold text-gray-800 text-center py-3">
        History Games
      </div>
      <div className="flex justify-center gap-2 mb-2">
        {["All", "Win", "Lose"].map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`w-1/4 h-10 text-gray-700 border border-gray-300 rounded-lg hover:bg-[#779952] hover:text-white transition-all duration-300 ${
              filter === label ? "bg-[#779952] font-bold text-white" : "bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ul>
        {filteredGames.map((game, index) => (
          <li
            key={index}
            className={`cursor-pointer flex gap-4 p-4 border-y border-gray-300 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-200"
            } hover:bg-blue-200`}
            onClick={() => navigate(`/game/${game.game_id}`)}
          >
            <div className="w-[200px]">
              <Chessboard
                position={game.fen || "start"}
                boardWidth={200}
                arePiecesDraggable={false}
                boardOrientation={
                  game.white_player_id === user_id ? "white" : "black"
                }
                customBoardStyle={{
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                }}
                customDarkSquareStyle={{ backgroundColor: "#779952" }}
                customLightSquareStyle={{ backgroundColor: "#edeed1" }}
              />
            </div>
            <div className="flex-1">
              <div className="flex gap-x-2">
                <div className="flex items-center text-gray-700">
                  {game.time_control_name === "Bullet" ? (
                    <GiBulletBill className="size-10 text-yellow-500" />
                  ) : game.time_control_name === "Classical" ? (
                    <GiTurtle className="size-10 text-green-600" />
                  ) : game.time_control_name === "Blitz" ? (
                    <GiFireBowl className="size-10 text-red-500" />
                  ) : (
                    <GiRabbit className="size-10" />
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-2xl font-semibold text-gray-700">
                    {game.base_time / 60000}+{game.increment_by_turn / 1000} •{" "}
                    {game.time_control_name}
                  </p>
                  <time
                    className="text-xs text-gray-500"
                    dateTime={game.start_time}
                  >
                    {formatDistanceToNow(new Date(game.start_time), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
              </div>
              <div className="flex justify-center mt-6 text-gray-700">
                <p className="text-2xl font-bold">
                  {game.white_player_username}
                </p>
                <GiCrossedSwords className="size-10 mx-2 text-gray-500" />
                <p className="text-2xl font-bold">
                  {game.black_player_username}
                </p>
              </div>
              <div className="text-center text-gray-600">
                {(game.result === "White is victorious" &&
                  game.white_player_id === user_id) ||
                (game.result === "Black is victorious" &&
                  game.black_player_id === user_id) ? (
                  <div className="text-green-600">
                    {game.reason} • {game.result}
                  </div>
                ) : (
                  <div className="text-red-600">
                    {game.reason} • {game.result}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
