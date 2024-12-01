import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chess } from "chess.js";
import toast from "react-hot-toast";
import api from "@/utils/axios";

import { useAuth } from "../contexts/AuthContext";
import movesStore from "@/store/movesStore";

import { Board } from "@/components/game/Board";
import { GameInfo } from "@/components/game/GameInfo";
import { ChatRoom } from "@/components/game/ChatRoom";
import { MoveList } from "@/components/game/MoveList";
import Timer from "@/components/game/Timer";

import {
  CREATE_GAME,
  GAME_OVER,
  JOIN_GAME,
  LEAVE_GAME,
  MOVE,
  START_GAME,
} from "@/constants/game";

export const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [gameId, setGameId] = useState("");
  const [gameData, setGameData] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [players, setPlayers] = useState({
    whitePlayer: "",
    blackPlayer: "",
  });
  const [gameResult, setGameResult] = useState(null);
  const setMoves = movesStore((state) => state.setMoves);
  const addMove = movesStore((state) => state.addMove);
  const resetMoves = movesStore((state) => state.resetMoves);

  const navigate = useNavigate();
  const { socket } = useAuth();

  const initialWhiteTime = 10 * 60 * 1000;
  const initialBlackTime = 10 * 60 * 1000;

  const [whiteTime, setWhiteTime] = useState(initialWhiteTime);
  const [blackTime, setBlackTime] = useState(initialBlackTime);
  const [activePlayer, setActivePlayer] = useState("w");

  const { game_id } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/game/${game_id}`);
        const data = response.data.game;

        setGameId(data.game_id);
        setGameData(data);
        setPlayers({ whitePlayer: data.white_player_id, blackPlayer: data.black_player_id });
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    // Call 2 APIs
    fetchGame();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(START_GAME, (data) => {
      setGameId(game_id);
      // setPlayers({ whitePlayer: data.white, blackPlayer: data.black });

      setIsGameStarted(true);
      setIsGameOver(false);
      setGame(new Chess());

      resetMoves();
      setWhiteTime(initialWhiteTime); // Reset to initial time
      setBlackTime(initialBlackTime);
      setActivePlayer("w");

      toast.success("Game started!");
    });

    socket.on(MOVE, (moveData) => {
      setGame((prevGame) => {
        const gameCopy = new Chess(prevGame.fen());
        gameCopy.move(moveData);

        const lastMove = gameCopy.history({ verbose: true }).slice(-1)[0];
        addMove(lastMove);

        return gameCopy;
      });

      setActivePlayer((prev) => (prev === "w" ? "b" : "w"));
    });

    socket.on(GAME_OVER, (result) => {
      setGameResult(result);
      setIsGameStarted(false);
      setIsGameOver(true);
      toast.success(`Game Kết Thúc: ${result}`);
    });

    return () => {
      socket.off(START_GAME);
      socket.off(MOVE);
      socket.off(GAME_OVER);
    };
  }, [socket, gameId, addMove, resetMoves, initialBlackTime, initialWhiteTime]);

  const onTimeUp = (player) => {
    toast.error(`${player} has run out of time!`);
    setIsGameOver(true);
    setGameResult(`${player} lost on time.`);
    socket.emit(GAME_OVER, { result: `${player} lost on time.` });
  };

  useEffect(() => {
    let timer;
    if (isGameStarted && !isGameOver) {
      timer = setInterval(() => {
        setWhiteTime((prev) => (activePlayer === "w" ? prev - 1000 : prev));
        setBlackTime((prev) => (activePlayer === "b" ? prev - 1000 : prev));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isGameStarted, isGameOver, activePlayer]);

  const createGame = () => {
    socket.emit(CREATE_GAME, (game_id) => {
      setGameId(game_id);
    });
  };

  const joinGame = () => {
    if (gameId) {
      socket.emit(JOIN_GAME, gameId);
    }
  };

  const leaveGame = () => {
    if (gameId) {
      socket.emit(LEAVE_GAME, gameId);
    }
  };

  return (
    <div className="flex-grow flex flex-col m-2">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-screen-xl w-[80%] h-full">
          <div className="flex-grow flex flex-row justify-center h-full gap-4">
            {/* Left Sidebar */}
            <div className="w-1/4 flex flex-col gap-4 flex-shrink-0">
              <div>
                <GameInfo
                  white={players.whitePlayer}
                  black={players.blackPlayer}
                  gameType="Standard Rated"
                />
              </div>
              <div className="flex-grow h-64">
                <ChatRoom game_id={gameId} />
              </div>
            </div>
            {/* Middle Section (Chessboard) */}
            <div className="w-2/4 h-full flex items-center justify-center flex-shrink-0 w-auto max-w-fit">
              <div>
                <Board
                  game={game}
                  setGame={setGame}
                  socket={socket}
                  gameId={gameId}
                  isGameOver={isGameOver}
                  addMove={addMove}
                  setActivePlayer={setActivePlayer}
                />
                {players.whitePlayer}
              </div>
            </div>
            {/* RIGHT SIDEBAR */}
            <div className="w-1/4 h-full flex flex-col flex-shrink-0">
              <div className="flex justify-between mb-4">
                <Timer
                  initialTime={whiteTime}
                  isActive={activePlayer === "w" && !isGameOver}
                  onTimeUp={() => onTimeUp("White")}
                  player="White"
                />
                <Timer
                  initialTime={blackTime}
                  isActive={activePlayer === "b" && !isGameOver}
                  onTimeUp={() => onTimeUp("Black")}
                  player="Black"
                />
              </div>
              <div className="flex-grow">
                <MoveList />
              </div>
              {gameResult && (
                <div className="mt-4 text-xl">
                  {isGameOver ? `Kết thúc: ${gameResult}` : ""}
                </div>
              )}
              {!isGameOver && (
                <div>
                  <button
                    onClick={leaveGame}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                  >
                    LEAVE GAME
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
