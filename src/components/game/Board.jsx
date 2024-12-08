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
  isViewingHistory,
  playerColor,
}) => {
  const onDrop = useCallback(
    (sourceSquare, targetSquare, piece) => {
      if (isGameOver) {
        toast.error("Game đã kết thúc. Bạn không thể thực hiện nước đi.");
        return false;
      }

      const move = {
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1].toLowerCase() ?? "q",
      };

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

  // const isDraggablePiece = useCallback(
  //   (piece, sourceSquare) => {
  //     // const pieceColor = piece[0]; // "w" for white, "b" for black
  //     console.log(piece)

  //     // console.log(pieceColor);
  //     // console.log(activePlayer);

  //     // if (pieceColor !== activePlayer) {
  //     //   return false; // Prevent dragging if it's not the player's turn
  //     // }

  //     return true; // Allow dragging otherwise
  //   },
  //   [activePlayer]
  // );

  // const isDraggablePiece = useCallback(({piece, sourceSquare}) => {\
  //   const pieceColor = piece[0]; // "w" for white, "b" for black"

  //   // Replace "w" with the player's color if necessary
  //   const playerColor = "w"; // Set to "w" for white player, "b" for black player

  //   if (pieceColor !== playerColor) {
  //     return false; // Prevent dragging opponent's pieces
  //   }

  //   return true; // Allow dragging own pieces
  // }, []);

  const isDraggablePiece = useCallback(
    ({ piece, sourceSquare }) => {
      const pieceColor = piece[0];
      return pieceColor === playerColor;
    },
    [playerColor]
  );

  return (
    <Chessboard
      position={game.fen()}
      onPieceDrop={onDrop}
      isDraggablePiece={isDraggablePiece}
      animationDuration={500}
      areArrowsAllowed={true}
      arePiecesDraggable={!isGameOver && !isViewingHistory}
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
      customDarkSquareStyle={{ backgroundColor: "#779952" }}
      customLightSquareStyle={{ backgroundColor: "#edeed1" }}
      customDropSquareStyle={{
        boxShadow: "inset 0 0 1px 6px rgba(132,23,255,0.75)",
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
  isViewingHistory: PropTypes.bool.isRequired,
  playerColor: PropTypes.string.isRequired,
};
