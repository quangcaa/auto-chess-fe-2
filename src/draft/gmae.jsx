import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { io } from "socket.io-client";
import { Chess } from "chess.js";

const socket = io("http://localhost:3334");

const Game = () => {
  const [gameCode, setGameCode] = useState("");
  const [username, setUsername] = useState("");
  const [fen, setFen] = useState("start");
  const [message, setMessage] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState({ white: null, black: null });

  useEffect(() => {
    socket.on("start_game", ({ fen, players }) => {
      setFen(fen);
      setPlayers(players);
      setIsGameStarted(true);
    });

    socket.on("move", (move) => {
      setFen((prev) => socket.emit("make_move", gameCode, move));
    });

    socket.on("game_over", (finalFen) => {
      setMessage("Game Over!");
      setFen(finalFen);
      setIsGameStarted(false);
    });

    return () => {
      socket.off("startGame");
      socket.off("moveMade");
      socket.off("gameOver");
    };
  }, []);

  const createGame = () => {
    socket.emit("create_game", username, (code) => {
      setGameCode(code);
      setMessage(`Game created! Code: ${code}`);
    });
  };

  const joinGame = () => {
    socket.emit("join_room", gameCode, username, (response) => {
      if (response.success) {
        setPlayers(response.players);
        setMessage("Joined the game!");
      } else {
        setMessage(response.message);
      }
    });
  };

  const onDrop = (source, target) => {
    const move = { from: source, to: target };
    socket.emit("make_move", gameCode, move, (response) => {
      if (!response.success) {
        alert(response.message);
      }
    });
    return true;
  };

  return (
    <div>
      <h1>Chess Game</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={createGame}>Create Game</button>
      <input
        type="text"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
        placeholder="Enter Game Code"
      />
      <button onClick={joinGame}>Join Game</button>
      <p>{message}</p>
      {isGameStarted && (
        <div>
          <h3>White Player: {players.white?.username}</h3>
          <h3>Black Player: {players.black?.username}</h3>
          <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
        </div>
      )}
    </div>
  );
};

export default Game;
