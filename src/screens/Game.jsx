import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import toast from "react-hot-toast";

import { useAuth } from "../contexts/AuthContext";

import {
  CREATE_GAME,
  GAME_OVER,
  JOIN_GAME,
  LEAVE_GAME,
  MOVE,
  START_GAME,
} from "@/constants/game";

import { GameInfo } from "@/components/game/GameInfo";
import { ChatRoom } from "@/components/game/ChatRoom";
import { MoveList } from "@/components/game/MoveList";

import movesStore from "@/store/movesStore";

export const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [roomId, setRoomId] = useState("");
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

  const { socket } = useAuth();

  const [whiteTime, setWhiteTime] = useState(10 * 60 * 1000); // 10 minutes in milliseconds
  const [blackTime, setBlackTime] = useState(10 * 60 * 1000); // 10 minutes in milliseconds
  const [activePlayer, setActivePlayer] = useState("w"); // 'w' for white, 'b' for black

  useEffect(() => {
    if (!socket) return;

    socket.on(START_GAME, (data) => {
      console.log(data);
      setPlayers({ whitePlayer: data.white, blackPlayer: data.black });

      setIsGameStarted(true);
      setIsGameOver(false);
      setGame(new Chess());

      resetMoves();
      setWhiteTime(10 * 60 * 1000); // Reset to 10 minutes
      setBlackTime(10 * 60 * 1000); // Reset to 10 minutes
      setActivePlayer("w"); // White starts
      toast.success("Game started!");
    });

    socket.on(MOVE, (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));

      // Get the last move and add it to the store
      const lastMove = game.history({ verbose: true }).slice(-1)[0];
      addMove(lastMove);

      console.log("New move added:", lastMove);

      // Switch active player
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
  }, [socket, game, addMove, resetMoves]);

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

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const createRoom = () => {
    socket.emit(CREATE_GAME, (game_id) => {
      setRoomId(game_id);
    });
  };

  const joinRoom = () => {
    if (roomId) {
      socket.emit(JOIN_GAME, roomId);
    }
  };

  const leaveGame = () => {
    if (roomId) {
      socket.emit(LEAVE_GAME, roomId);
    }
  };

  const onDrop = useCallback(
    (source, target) => {
      if (isGameOver) {
        toast.error("Game đã kết thúc. Bạn không thể di chuyển quân cờ nữa.");
        return false;
      }

      const move = { from: source, to: target, promotion: "q" };

      socket.emit(MOVE, { game_id: roomId, move }, (response) => {
        if (response.success) {
          game.move(move);
          setGame(new Chess(game.fen()));

          // Get the last move and add it to the store
          const lastMove = game.history({ verbose: true }).slice(-1)[0];
          addMove(lastMove);
          console.log("New move added:", lastMove);

          // Switch active player
          setActivePlayer((prev) => (prev === "w" ? "b" : "w"));
        } else {
          toast.error(response.message || "Nước đi không hợp lệ.");
        }
      });

      return true;
    },
    [socket, roomId, game, isGameOver, addMove]
  );

  const gameFen = game.fen();

  const chessboardMemo = useMemo(
    () => (
      <Chessboard
        position={gameFen}
        onPieceDrop={onDrop}
        boardWidth={550}
        customBoardStyle={{
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
        }}
        customSquareStyles={{
          light: { backgroundColor: "#f0d9b5" },
          dark: { backgroundColor: "#b58863" },
        }}
        arePiecesDraggable={!isGameOver} // Disable dragging if game is over
      />
    ),
    [gameFen, onDrop, isGameOver]
  );

  return (
    <div className="flex-grow flex flex-col">
      {!isGameStarted && !isGameOver ? (
        <div className="flex flex-col items-center justify-center h-full">
          <button
            onClick={createRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded m-2"
          >
            Create Room
          </button>
          <div className="flex items-center">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={joinRoom}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
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
                  <ChatRoom />
                </div>
              </div>
              {/* Middle Section (Chessboard) */}
              <div className="w-2/4 h-full flex items-center justify-center flex-shrink-0 w-auto max-w-fit">
                <div>{chessboardMemo}</div>
              </div>
              {/* Right Sidebar */}
              <div className="w-1/4 h-full flex flex-col flex-shrink-0">
                <div className="flex justify-between mb-4">
                  <div
                    className={`timer ${activePlayer === "w" ? "active" : ""}`}
                  >
                    White: {formatTime(whiteTime)}
                  </div>
                  <div
                    className={`timer ${activePlayer === "b" ? "active" : ""}`}
                  >
                    Black: {formatTime(blackTime)}
                  </div>
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
      )}
    </div>
  );
};

export default Game;
