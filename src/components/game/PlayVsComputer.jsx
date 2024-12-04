import { Chess } from "chess.js";
import { useMemo, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import Engine from "../../../public/engine.ts";

export const PlayVsComputer = () => {
  const FEN_POSITION =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  useEffect(() => {
    const stockfish = new Worker("./stockfish.js");
    const DEPTH = 8; // number of halfmoves the engine looks ahead

    stockfish.postMessage("uci");
    stockfish.postMessage(`position fen ${FEN_POSITION}`);
    stockfish.postMessage(`go depth ${DEPTH}`);

    stockfish.onmessage = (e) => {
      console.log(e.data); // in the console output you will see `bestmove e2e4` message
    };
  }, []);

  return <Chessboard position={FEN_POSITION} boardWidth={400} />;
};
