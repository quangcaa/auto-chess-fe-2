import { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import { Chess } from "chess.js";
import Engine from "@/stockfish/engine";
import { Chessboard } from "react-chessboard";

const buttonStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  margin: "10px 10px 0px 0px",
  borderRadius: "6px",
  backgroundColor: "#f0d9b5",
  border: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
};

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
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
  const [positionEvaluation, setPositionEvaluation] = useState(0);
  const [depth, setDepth] = useState(10);
  const [bestLine, setBestline] = useState("");
  const [possibleMate, setPossibleMate] = useState("");
  const [color, setColor] = useState("white");

  function findBestMove() {
    engine.evaluatePosition(game.fen(), depth);

    engine.onMessage(
      ({ bestMove, positionEvaluation, possibleMate, pv, depth }) => {
        if (depth && depth < 10) return;
        positionEvaluation &&
          setPositionEvaluation(
            ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
          );
        possibleMate && setPossibleMate(possibleMate);
        depth && setDepth(depth);
        pv && setBestline(pv);

        if (bestMove) {
          // game.move({
          //   from: bestMove.substring(0, 2),
          //   to: bestMove.substring(2, 4),
          //   promotion: bestMove.substring(4, 5),
          // });
          // game.move(bestMove, { sloppy: true });
          // setGamePosition(game.fen());
        }
      }
    );
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setPossibleMate("");
    setGamePosition(game.fen());

    if (move === null) return false;
    engine.stop();
    setBestline("");

    if (game.isGameOver() || game.isDraw()) {
      return false;
    }

    findBestMove();
    return true;
  }

  useEffect(() => {
    if (!game.isGameOver() || game.isDraw()) {
      findBestMove();
    }
  }, [gamePosition]);

  const bestMove = bestLine?.split(" ")?.[0];
  // const handleFenInputChange = (e) => {
  //   const { valid } = game.validate_fen(e.target.value);
  //   if (valid && inputRef.current) {
  //     inputRef.current.value = e.target.value;
  //     game.load(e.target.value);
  //     setChessBoardPosition(game.fen());
  //   }
  // };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-screen-xl w-[80%] h-full">
        <div className="flex-grow flex flex-row justify-center h-full gap-4">
          <div className="flex flex-col">
            {Object.entries(levels).map(([level, depth]) => (
              <button
                key={level}
                style={{
                  ...buttonStyle,
                  backgroundColor: depth === depth ? "#B58863" : "#f0d9b5",
                }}
                onClick={() => setDepth(depth)}
              >
                {level}
              </button>
            ))}
          </div>

          <div style={boardWrapper}>
            <h4>
              Position Evaluation:{" "}
              {possibleMate ? `#${possibleMate}` : positionEvaluation}
              {"; "}
              Depth: {depth}
            </h4>
            <h5>
              Best line: <i>{bestLine.slice(0, 40)}</i> ...
            </h5>

            <Chessboard
              id="PlayVsStockfish"
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={color}
              customArrows={
                bestMove
                  ? [
                      [
                        bestMove.substring(0, 2),
                        bestMove.substring(2, 4),
                        "rgb(0, 128, 0)",
                      ],
                    ]
                  : undefined
              }
            />

            <button
              style={buttonStyle}
              onClick={() => {
                setPossibleMate("");
                setBestline("");
                game.reset();
                setGamePosition(game.fen());
              }}
            >
              Reset
            </button>
            <button
              style={buttonStyle}
              onClick={() => {
                game.undo();
                game.undo();
                setPossibleMate("");
                setBestline("");
                setGamePosition(game.fen());
              }}
            >
              Undo
            </button>
            <button
              style={buttonStyle}
              onClick={() => {
                findBestMove();
              }}
            >
              Computer
            </button>
            <button
              style={buttonStyle}
              onClick={() => setColor(color === "white" ? "black" : "white")}
            >
              Flip board
            </button>
          </div>

          <div>MOVE LIST</div>
        </div>
      </div>
    </div>
  );
};
