import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { useAuth } from "@/contexts/AuthContext";

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
      console.log(state);
      setGameState(state);
    });

    socket.on("game_state_update", (state) => {
      console.log(state);
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
    <div className="flex-grow flex flex-col m-2">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-screen-xl w-[80%] h-full">
          <div className="flex-grow flex flex-row justify-center h-full gap-4">
            {/* LEFT */}
            <div className="w-1/4 flex flex-col gap-4 flex-shrink-0">
              <div></div>
            </div>
            {/* MID */}
            <div className="w-2/4 h-full flex items-center justify-center flex-shrink-0 w-auto max-w-fit">
              <div>
                <Chessboard
                  animationDuration={500}
                  boardWidth={550}
                  position={gameState.fen}
                  boardOrientation="white"
                  arePiecesDraggable={false}
                  customNotationStyle={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                  customBoardStyle={{
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                  }}
                  customDarkSquareStyle={{ backgroundColor: "#779952" }}
                  customLightSquareStyle={{ backgroundColor: "#edeed1" }}
                />
              </div>
            </div>
            {/* RIGHT */}
            <div className="w-1/4 h-full flex flex-col flex-shrink-0">
              <div className="flex justify-between mb-4"></div>
              <div className="flex-grow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
