import { useState } from "react";
import PropTypes from "prop-types";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import toast from "react-hot-toast";

export const Board = ({
  game,
  setGame,
  gameId,
  socket,
  setActivePlayer,
  playerColor,
  setMoves,
  isViewingHistory,
  isGameOver
}) => {
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    if (isViewingHistory) {
      return;
    }

    if (isGameOver) {
      return;
    }

    // from square
    if (!moveFrom) {
      // check if square is their piece
      const piece = game.get(square);
      if (!piece || piece.color !== playerColor) {
        return;
      }

      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      // valid move
      setMoveTo(square);

      // // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const gameCopy = new Chess(game.fen());

      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setGame(gameCopy);
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});

      setMoves((prevMoves) => [...prevMoves, move.san]);

      socket.emit("move", { game_id: gameId, move }, (response) => {
        if (!response.success) {
          toast.error(response.message || "Invalid move");
          return false;
        }

        setActivePlayer((prev) => (prev === "w" ? "b" : "w"));
      });

      return;
    }
  }

  function onPromotionPieceSelect(piece) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const gameCopy = new Chess(game.fen());

      const move = gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(gameCopy);

      setMoves((prevMoves) => [...prevMoves, move.san]);

      socket.emit("move", { game_id: gameId, move }, (response) => {
        if (!response.success) {
          toast.error(response.message || "Invalid move");
          return false;
        }

        setActivePlayer((prev) => (prev === "w" ? "b" : "w"));
      });
    }
    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});

    return true;
  }

  return (
    <Chessboard
      position={game.fen()}
      animationDuration={500}
      boardWidth={550}
      arePiecesDraggable={false}
      onSquareClick={onSquareClick}
      onPromotionPieceSelect={onPromotionPieceSelect}
      boardOrientation={playerColor === "w" ? "white" : "black"}
      customArrowColor={"#102081"}
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
      customSquareStyles={{
        ...optionSquares,
      }}
      promotionToSquare={moveTo}
      showPromotionDialog={showPromotionDialog}
      promotionDialogVariant={"modal"}
    />
  );
};

Board.propTypes = {
  game: PropTypes.instanceOf(Chess).isRequired,
  setGame: PropTypes.func.isRequired,
  gameId: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
  setActivePlayer: PropTypes.func.isRequired,
  playerColor: PropTypes.string.isRequired,
  isViewingHistory: PropTypes.bool.isRequired,
  isGameOver: PropTypes.bool.isRequired,
};
