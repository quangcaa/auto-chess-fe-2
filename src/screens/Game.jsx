import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chess } from "chess.js";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { Board } from "@/components/game/Board";
import { GameInfo } from "@/components/game/GameInfo";
import { ChatRoom } from "@/components/game/ChatRoom";
import { MoveList } from "@/components/game/MoveList";
import { Timer } from "@/components/game/Timer";
import { GAME_OVER, LEAVE_GAME, MOVE } from "@/constants/game";

export const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [gameId, setGameId] = useState("");
  const [moves, setMoves] = useState([]);

  const [gameData, setGameData] = useState("");
  const [timeData, setTimeData] = useState("");

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const navigate = useNavigate();
  const { socket } = useAuth();

  const { game_id } = useParams();
  const user_id = Number(localStorage.getItem("user_id"));

  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);

  const [activePlayer, setActivePlayer] = useState("w");
  const [playerColor, setPlayerColor] = useState("w");

  const [selectedMove, setSelectedMove] = useState(0);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const isViewingHistoryRef = useRef(isViewingHistory);

  useEffect(() => {
    isViewingHistoryRef.current = isViewingHistory;
  }, [isViewingHistory]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/game/${game_id}`);

        console.log(response);

        const gameD = response.data.game;
        const time = response.data.clock;

        setGameId(gameD.game_id);
        setGameData(gameD);
        setTimeData(time);

        setWhiteTime(time.base_time);
        setBlackTime(time.base_time);

        setIsGameStarted(gameD.status === "PENDING");
        if (gameD.result !== null) {
          setIsGameOver(true);
          setGameResult(`${gameD.reason} • ${gameD.result}`);
          setSelectedMove(0)
        } else {
          setIsGameOver(false);
        }

        const pgn = gameD.pgn;
        if (pgn) {
          const parsedMoves = parsePGN(pgn);
          setMoves(parsedMoves);

          const newGame = new Chess();
          parsedMoves.forEach((move) => {
            newGame.move(move);
          });
          setGame(newGame);

          setActivePlayer(newGame.turn());
        }

        const playerRole = gameD.whitePlayer.user_id === user_id;
        setPlayerColor(playerRole === true ? "w" : "b");
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
        console.log(error);
      }
    };

    fetchGame();
  }, []);

  const parsePGN = (pgn) => {
    return pgn
      .replace(/\d+\./g, "") // loại bỏ số thứ tự nước đi
      .trim() // xóa khoảng trắng thừa
      .split(/\s+/); // tách các nước đi thành mảng
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(MOVE, (moveData) => {
      // reset to current state if viewing history
      if (isViewingHistoryRef.current) {
        // reset to the latest game state
        const newGame = new Chess();
        console.log(moves);
        moves.forEach((move) => newGame.move(move));
        newGame.move(moveData.san);

        setGame(newGame);
        setIsViewingHistory(false);
        setSelectedMove(moves.length - 1);

        toast("Opponent made a new move");
      }

      // update moves
      setMoves((prevMoves) => [...prevMoves, moveData.san]);

      // update game state if not in history view
      if (!isViewingHistoryRef.current) {
        setGame((prevGame) => {
          const gameCopy = new Chess(prevGame.fen());
          gameCopy.move(moveData);
          return gameCopy;
        });
      }

      setActivePlayer((prev) => (prev === "w" ? "b" : "w"));
    });

    socket.on("time_update", ({ whiteTime: wTime, blackTime: bTime }) => {
      setWhiteTime(wTime);
      setBlackTime(bTime);
    });

    socket.on(GAME_OVER, (result) => {
      setGameResult(result);
      setIsGameStarted(false);
      setIsGameOver(true);
      toast(`${result}`);
    });

    return () => {
      socket.off(MOVE);
      socket.off(GAME_OVER);
      socket.off("time_update");
    };
  }, [socket, moves]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    const updateTime = () => {
      setWhiteTime((prev) =>
        activePlayer === "w" ? Math.max(0, prev - 1000) : prev
      );
      setBlackTime((prev) =>
        activePlayer === "b" ? Math.max(0, prev - 1000) : prev
      );

      if (whiteTime <= 0) {
        onTimeOut("White");
      } else if (blackTime <= 0) {
        onTimeOut("Black");
      }
    };

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [isGameStarted, isGameOver, activePlayer, blackTime, whiteTime]);

  const onTimeOut = (player) => {
    setIsGameOver(true);
    const resultD = `${player} time out • ${player === "White" ? "Black" : "White"} is victorious`
    setGameResult(resultD);
    socket.emit(GAME_OVER, {
      game_id: gameId,
      reason: `${player} time out`,
      result: `${player === "White" ? "Black" : "White"} is victorious`,
    });
  };

  const leaveGame = () => {
    if (gameId) {
      socket.emit(LEAVE_GAME, gameId);
      navigate("/");
    }
  };

  // func to handle viewing a specific move
  const handleViewHistory = (move, index) => {
    const gameCopy = new Chess();
    const movesUpToIndex = moves.slice(0, index + 1);
    movesUpToIndex.forEach((m) => gameCopy.move(m));
    setGame(gameCopy);
    setSelectedMove(index);

    setIsViewingHistory(index !== moves.length - 1);
  };

  useEffect(() => {
    if (moves.length > 0) {
      setSelectedMove(moves.length - 1);
      setIsViewingHistory(false);
    }
  }, [moves]);

  useEffect(() => {
    if (gameResult !== null) {
      setSelectedMove(moves.length);
      setIsViewingHistory(false);
    }
  }, [gameResult, moves]);

  return (
    <div className="flex-grow flex flex-col m-2">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-screen-xl w-[80%] h-full">
          <div className="flex-grow flex flex-row justify-center h-full gap-4">
            {/* LEFT */}
            <div className="w-1/4 flex flex-col gap-4 flex-shrink-0">
              <div>
                <GameInfo
                  white={gameData.whitePlayer}
                  black={gameData.blackPlayer}
                  clock={timeData}
                  startTime={gameData.start_time}
                  gameResult={gameResult}
                />
              </div>
              {!isGameOver && (
                <div className="flex-grow h-64">
                  <ChatRoom game_id={gameId} />
                </div>
              )}
            </div>
            {/* MID */}
            <div className="w-2/4 h-full flex items-center justify-center flex-shrink-0 w-auto max-w-fit">
              <div>
                <Board
                  game={game}
                  setGame={setGame}
                  gameId={gameId}
                  socket={socket}
                  setActivePlayer={setActivePlayer}
                  playerColor={playerColor}
                  setMoves={setMoves}
                  isViewingHistory={isViewingHistory}
                  isGameOver={isGameOver}
                />
              </div>
            </div>
            {/* RIGHT */}
            <div className="w-1/4 h-full flex flex-col flex-shrink-0">
              <div className="flex justify-between">
                {!isGameOver && (
                  <div className="flex justify-between mb-4">
                    <Timer
                      timeLeft={whiteTime}
                      isActive={activePlayer === "w"}
                      player="White"
                    />
                    <Timer
                      timeLeft={blackTime}
                      isActive={activePlayer === "b"}
                      player="Black"
                    />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <MoveList
                  moves={moves}
                  handleViewHistory={handleViewHistory}
                  selected={selectedMove}
                  isGameOver={isGameOver}
                />
              </div>
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
