import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { GameInfo } from "@/components/game/GameInfo";
import ChatRoom from "@/components/game/ChatRoom";

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

  const { socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on(START_GAME, (data) => {
      console.log(data);
      setPlayers({ whitePlayer: data.white, blackPlayer: data.black });

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
  }, [socket, game, players]);

  useEffect(() => {
    console.log(
      `Updated players: ${players.whitePlayer}, ${players.blackPlayer}`
    );
  }, [players]);

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-screen-xl h-full">
            <div className="grid grid-rows-[90%,10%] grid-cols-5 h-full gap-4">
              {/* Hàng 1 */}
              <div className="col-span-1 h-full flex flex-col">
                <GameInfo
                  white={players.whitePlayer}
                  black={players.blackPlayer}
                  gameType="Standard Rated"
                />
                <ChatRoom className="flex-grow" />
              </div>
              <div className="col-span-3 bg-green-500 h-full flex items-center justify-center w-full">
                <div> {chessboardMemo} </div>
              </div>
              <div className="col-span-1 bg-red-500 h-full">
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

              {/* Hàng 2 */}
              <div className="col-span-5 bg-yellow-500 h-full">Bottom</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
