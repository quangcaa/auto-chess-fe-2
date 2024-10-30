import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const socket = io("http://localhost:3334");

const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [roomId, setRoomId] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState({ white: null, black: null });

  useEffect(() => {
    socket.on("move", (move) => {
      game.move(move);
      setGame(new Chess(game.fen()));
    });

    socket.on("start_game", (players) => {
      setGame(new Chess());
      setPlayers(players);
      setIsGameStarted(true);
    });

    return () => {
      socket.off("move");
      socket.off("startGame");
    };
  }, [game]);

  const createRoom = () => {
    socket.emit("create_room", (roomId) => {
        setRoomId(roomId)
    }); // Yêu cầu tạo phòng mới
  };

  const joinRoom = () => {
    if (roomId) {
      socket.emit("join_room", roomId); // Tham gia phòng với roomId đã nhập
    }
  };

  const onDrop = (source, target) => {
    const move = game.move({ from: source, to: target });
    if (move === null) return false;

    setGame(new Chess(game.fen()));
    socket.emit('move', { room_id: roomId, move }); // send move to server
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

export default Game;
