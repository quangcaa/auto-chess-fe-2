import { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import { Chess } from "chess.js";
import Engine from "@/stockfish/engine";
import { Chessboard } from "react-chessboard";
import { MoveList } from "@/components/computer/MoveList";

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  // margin: "3rem auto",
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

  // const [positionEvaluation, setPositionEvaluation] = useState(0);
  // const [bestLine, setBestline] = useState("");
  // const [possibleMate, setPossibleMate] = useState("");

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove, depth }) => {
      depth && setStockfishLevel(depth);

      if (bestMove) {
        // game.move({
        //   from: bestMove.substring(0, 2),
        //   to: bestMove.substring(2, 4),
        //   promotion: bestMove.substring(4, 5),
        // });
        const move = game.move(bestMove, { sloppy: true });
        setGamePosition(game.fen());
        setMoves((prevMoves) => [...prevMoves, move.san]);
      }
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGamePosition(game.fen());
    setMoves((prevMoves) => [...prevMoves, move.san]);

    if (move === null) return false;
    // engine.stop();

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
          <div className="flex flex-col mt-7">
            {Object.entries(levels).map(([level, depth]) => (
              <button
                className={`cursor-pointer px-5 py-2 m-2 mt-0 rounded-md border border-gray-300 hover:bg-[#B58863] shadow-lg ${
                  stockfishLevel === depth ? "bg-[#B58863]" : "bg-[#f0d9b5]"
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
            <h4 className="mb-1">Depth: {stockfishLevel}</h4>
            <Chessboard
              id="PlayVsStockfish"
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={color}
              // customArrows={
              //   bestMove
              //     ? [
              //         [
              //           bestMove.substring(0, 2),
              //           bestMove.substring(2, 4),
              //           "rgb(0, 128, 0)",
              //         ],
              //       ]
              //     : undefined
              // }
            />

            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-[#f0d9b5] border border-gray-300 hover:bg-[#B58863]"
              onClick={() => {
                game.reset();
                setGamePosition(game.fen());
              }}
            >
              Reset
            </button>
            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-[#f0d9b5] border border-gray-300 hover:bg-[#B58863]"
              onClick={() => {
                game.undo();
                setGamePosition(game.fen());
              }}
            >
              Undo
            </button>
            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-[#f0d9b5] border border-gray-300 hover:bg-[#B58863]"
              onClick={() => {
                findBestMove();
              }}
            >
              Computer
            </button>
            <button
              className="cursor-pointer px-4 py-2 my-2 mr-2 rounded-md shadow-lg bg-[#f0d9b5] border border-gray-300 hover:bg-[#B58863]"
              onClick={() => setColor(color === "white" ? "black" : "white")}
            >
              Flip board
            </button>
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <div className="w-1/4 h-48 flex flex-col flex-shrink-0">
          <div className="flex-grow mt-7">
            <MoveList moves={moves} />
          </div>
          {/* <div className="flex-grow"></div> */}
        </div>
      </div>
    </div>
  );
};
