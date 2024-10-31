import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [roomId, setRoomId] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState({ white: null, black: null });

  const { socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on("move", (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));
    });

    socket.on("start_game", ({ players }) => {
      setGame(new Chess());
      setPlayers(players);
      setIsGameStarted(true);
    });

    socket.on("error", (message) => {
      game.undo();
      setGame(new Chess(game.fen()));
      toast.error(message);
    });

    return () => {
      socket.off("move");
      socket.off("start_game");
      socket.off("error");
    };
  }, [socket, game]);

  const createRoom = () => {
    socket.emit("create_room", (roomId) => {
      setRoomId(roomId);
    });
  };

  const joinRoom = () => {
    if (roomId) {
      socket.emit("join_room", roomId);
    }
  };

  const onDrop = (source, target) => {
    const move = game.move({ from: source, to: target });
    if (move === null) return false;

    setGame(new Chess(game.fen()));
    socket.emit("move", { room_id: roomId, move });
    return true;
  };

  return (
    <div className="App">
      {!isGameStarted ? (
        <div>
          <button onClick={createRoom}>Create Room</button>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap4 md:grid-cols-3">
            <div>
              <p>Room ID: {roomId}</p>
            </div>
            <div>
              <Chessboard position={game.fen()} onPieceDrop={onDrop} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};