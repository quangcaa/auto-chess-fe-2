import { useState } from "react";

export const HistoryGames = ({ games }) => {
  const [filter, setFilter] = useState("all");

  const filteredGames = games.filter((game) => {
    if (filter === "all") return true;
    if (filter === "rated") return game.isRated;
    if (filter === "win") return game.result === "win";
    if (filter === "lose") return game.result === "lose";
    return true;
  });

  return (
    <div className="bg-gray-100">
      <div className="text-lg font-semibold text-gray-700 text-center py-3">
        History games
      </div>
      <div className="flex justify-center">
        <button
          className={`w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300 ${
            filter === "all" ? "bg-blue-200" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300 ${
            filter === "rated" ? "bg-blue-200" : ""
          }`}
          onClick={() => setFilter("rated")}
        >
          Rated
        </button>
        <button
          className={`w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300 ${
            filter === "win" ? "bg-blue-200" : ""
          }`}
          onClick={() => setFilter("win")}
        >
          Win
        </button>
        <button
          className={`w-1/3 h-10 text-gray-700 hover:bg-blue-100 transition-all duration-300 ${
            filter === "lose" ? "bg-blue-200" : ""
          }`}
          onClick={() => setFilter("lose")}
        >
          Lose
        </button>
      </div>

      <ul className="space-y-1">
        {filteredGames.map((game) => (
          <li
            key={game.game_id}
            className="text-sm text-gray-600 flex p-2 hover:bg-blue-200 rounded-md mb-2 bg-white shadow"
          >
            <div className="w-[220px] h-[200px]">
              {/* Game content */}
              <p>{game.game_id}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
