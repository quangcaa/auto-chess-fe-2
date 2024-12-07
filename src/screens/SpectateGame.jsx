import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/axios";

export const SpectateGame = () => {
  const { game_id } = useParams();
  const { socket } = useAuth();
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_spectator", game_id, (response) => {
      if (response.success) {
        console.log("Joined as spectator");
      } else {
        console.error(response.message);
      }
    });

    socket.on("game_state", (state) => {
      setGameState(state);
    });

    socket.on("game_state_update", (state) => {
      setGameState(state);
    });

    return () => {
      socket.emit("leave_room", game_id);
      socket.off("game_state");
      socket.off("game_state_update");
    };
  }, [socket, game_id]);

  if (!gameState) {
    return <p>Loading game...</p>;
  }

  return (
    <div>
      <h2>Watching Game {game_id}</h2>
      <Chessboard
      boardWidth={550}
        position={gameState.fen}
        boardOrientation="white"
        arePiecesDraggable={false}
      />
      {/* Add more game details if needed */}
    </div>
  );
};
