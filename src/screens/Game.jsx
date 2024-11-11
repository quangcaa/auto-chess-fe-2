import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  CREATE_GAME,
  GAME_OVER,
  JOIN_GAME,
  LEAVE_GAME,
  MOVE,
  START_GAME,
} from "@/constants/game";
import { Button } from "@/components/ui/button";

export const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [roomId, setRoomId] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [players, setPlayers] = useState({ white: null, black: null });
  const [gameResult, setGameResult] = useState(null);

  const { socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on(START_GAME, (data) => {
      setPlayers(data.players);
      setIsGameStarted(true);
      setIsGameOver(false);
      setGame(new Chess());
      toast.success("Game started!");
    });

    socket.on(MOVE, (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));
    });

    // Lắng nghe sự kiện kết thúc game
    socket.on(GAME_OVER, (result) => {
      setGameResult(result);
      setIsGameStarted(false);
      setIsGameOver(true);
      toast.success(`Game Kết Thúc: ${result}`);
    });

    return () => {
      socket.off(MOVE);
      socket.off("game_over");
      socket.off("start_game");
    };
  }, [socket, game]);

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
        } else {
          toast.error(response.message || "Nước đi không hợp lệ.");
        }
      });

      return true;
    },
    [socket, roomId, game, isGameOver]
  );


  const gameFen = game.fen();

  const chessboardMemo = useMemo(
    () => (
      <Chessboard
        position={gameFen}
        onPieceDrop={onDrop}
        boardWidth={600}
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
    <div className="App">
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
        <div className="flex flex-row justify-center items-center gap-4">
          <div> {chessboardMemo} </div>
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
      )}
    </div>
  );
};
