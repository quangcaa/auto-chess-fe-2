import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import toast from "react-hot-toast";

export const Board = ({
  game,
  setGame,
  socket,
  gameId,
  isGameOver,
  addMove,
  setActivePlayer,
}) => {
  const onDrop = useCallback(
    (sourceSquare, targetSquare) => {
      if (isGameOver) {
        toast.error("Game đã kết thúc. Bạn không thể thực hiện nước đi.");
        return false;
      }

      const move = { from: sourceSquare, to: targetSquare, promotion: "q" };

      socket.emit("move", { game_id: gameId, move }, (response) => {
        if (!response.success) {
          toast.error(response.message || "Nước đi không hợp lệ.");
          return false;
        }

        setGame((prevGame) => {
          const gameCopy = new Chess(prevGame.fen());
          gameCopy.move(move);

          const lastMove = gameCopy.history({ verbose: true }).slice(-1)[0];
          addMove(lastMove);

          setActivePlayer((prev) => (prev === "w" ? "b" : "w"));

          return gameCopy;
        });
      });

      return true;
    },
    [socket, gameId, isGameOver, setGame, addMove, setActivePlayer]
  );

  return (
    <Chessboard
      position={game.fen()}
      onPieceDrop={onDrop}
      animationDuration={500}
      areArrowsAllowed={true}
      arePiecesDraggable={!isGameOver}
      // arePremovesAllowed={true}
      // boardOrientation={'black'}
      boardWidth={550}
      clearPremovesOnRightClick={true}
      customArrowColor={"#10b981"}
      customBoardStyle={{
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
      }}
      customNotationStyle={{
        fontSize: "11px",
        fontWeight: "bold",
        fontFamily: "'Roboto', sans-serif",
      }}
      // customDarkSquareStyle={{ backgroundColor: "#B58863" }}
      customDropSquareStyle={{
        backgroundColor: "#4d7c0f",
      }}
      customSquareStyles={{
        light: { backgroundColor: "#f0d9b5" },
        dark: { backgroundColor: "#b58863" },
      }}
      // isDraggablePiece={}
      promotionDialogVariant={"modal"}
      // promotionToSquare={}
    />
  );
};

Board.propTypes = {
  game: PropTypes.instanceOf(Chess).isRequired,
  setGame: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
  gameId: PropTypes.string.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  addMove: PropTypes.func.isRequired,
  setActivePlayer: PropTypes.func.isRequired,
};
