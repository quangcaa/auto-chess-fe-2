import { useState, useMemo } from "react";
import { Chess } from "chess.js";
import Engine from "@/stockfish/engine";
import { Chessboard } from "react-chessboard";
import { MoveList } from "@/components/computer/MoveList";
import toast from "react-hot-toast";

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
};

export const PlayVsComputer = () => {
  const levels = {
    "Very Easy 🤓": 2,
    "Easy 😅": 4,
    "Below Average 😐": 6,
    "Above Average 🧐": 8,
    "Hard 😵": 11,
    "Very Hard 😤": 14,
    "Insane 😱": 16,
    "Master 💀": 18,
  };
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);

  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(2);
  const [color, setColor] = useState("white");
  const [moves, setMoves] = useState([]);
  const [selectedMove, setSelectedMove] = useState(null);

  const handleViewHistory = (move, index) => {
    const gameCopy = new Chess();
    const movesToApply = moves.slice(0, index + 1);
    movesToApply.forEach((m) => gameCopy.move(m));
    setGamePosition(gameCopy.fen());
    setSelectedMove(index);
  };

  const handleReturnToCurrent = () => {
    const gameCopy = new Chess();
    moves.forEach((m) => gameCopy.move(m));
    setGamePosition(gameCopy.fen());
    setSelectedMove(null);
  };

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove, depth }) => {
      depth && setStockfishLevel(depth);

      if (bestMove) {
        const move = game.move(bestMove, { sloppy: true });
        setGamePosition(game.fen());
        setMoves((prevMoves) => [...prevMoves, move.san]);
      }
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    if (selectedMove !== null) {
      toast.error(
        "You must return to the current move to make a new move."
      );
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });

    if (move === null) return false;

    setGamePosition(game.fen());
    setMoves((prevMoves) => [...prevMoves, move.san]);

    if (game.isGameOver() || game.isDraw()) {
      return false;
    }

    findBestMove();

    return true;
  }

  return (
    <div className="w-full h-[calc(100vh-60px)] py-2 flex justify-center items-center">
      <div className="flex flex-row w-[85%] h-full gap-2">
        {/* LEFT */}
        <div className="w-1/4 flex flex-col items-end gap-2 flex-shrink h-full">
          <div className="flex flex-col">
            {Object.entries(levels).map(([level, depth]) => (
              <button
                className={`cursor-pointer px-5 py-2 mb-2 mt-0 rounded-md border border-gray-300 hover:bg-[#779952] hover:text-white shadow-lg ${
                  stockfishLevel === depth
                    ? "bg-[#779952] text-white"
                    : "bg-white"
                }`}
                key={level}
                onClick={() => setStockfishLevel(depth)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        {/* MID */}
        <div className="w-2/4 h-full flex justify-center flex-shrink-0 w-auto max-w-fit">
          <div style={boardWrapper}>
            <Chessboard
              position={gamePosition}
              onPieceDrop={onDrop}
              boardOrientation={color}
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
            />

            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-white border border-gray-300 hover:bg-[#779952] hover:text-white"
              onClick={() => {
                game.reset();
                setGamePosition(game.fen());
                setMoves([]);
              }}
            >
              Reset
            </button>
            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-white border border-gray-300 hover:bg-[#779952] hover:text-white"
              onClick={() => {
                game.undo();
                setGamePosition(game.fen());
                setMoves((prevMoves) => prevMoves.slice(0, -1));
              }}
            >
              Undo
            </button>
            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-white border border-gray-300 hover:bg-[#779952] hover:text-white"
              onClick={() => {
                findBestMove();
              }}
            >
              Computer Move
            </button>
            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-white border border-gray-300 hover:bg-[#779952] hover:text-white"
              onClick={() => setColor(color === "white" ? "black" : "white")}
            >
              Flip board
            </button>
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <div className="w-1/4 h-80 flex flex-col flex-shrink-0">
          <div className="flex-grow">
            <MoveList
              moves={moves}
              handleViewHistory={handleViewHistory}
              selected={selectedMove}
            />
          </div>
          <div className="flex-grow">
            {selectedMove !== null && (
              <button
                className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-white border border-gray-300 hover:bg-[#779952] hover:text-white"
                onClick={handleReturnToCurrent}
              >
                Return to Current Move
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
