import { useCallback, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import toast from "react-hot-toast";

import movesStore from "@/store/movesStore";
import { MoveList } from "@/components/game/MoveList";
import { GameInfo } from "@/components/game/GameInfo";

export const Puzzle = () => {
  const [game, setGame] = useState(new Chess());
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const addMove = movesStore((state) => state.addMove);

  const initialPosition =
    "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 0 1"; // Example FEN

  // Set up initial puzzle position
  useState(() => {
    game.load(initialPosition);
  }, []);

  const onDrop = useCallback(
    (source, target) => {
      if (isPuzzleSolved) {
        toast.error("You have already solved the puzzle!");
        return false;
      }

      const move = { from: source, to: target, promotion: "q" };
      const moveResult = game.move(move);

      if (moveResult) {
        addMove(moveResult);
        setGame(new Chess(game.fen()));

        // Check for puzzle solution (example condition: checkmate)
        if (game.in_checkmate()) {
          setIsPuzzleSolved(true);
          toast.success("Puzzle solved!");
        }
      } else {
        toast.error("Invalid move. Try again.");
      }

      return !!moveResult;
    },
    [game, isPuzzleSolved, addMove]
  );

  const chessboardMemo = useMemo(
    () => (
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardWidth={550}
        customBoardStyle={{
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
        }}
        customSquareStyles={{
          light: { backgroundColor: "#f0d9b5" },
          dark: { backgroundColor: "#b58863" },
        }}
        arePiecesDraggable={!isPuzzleSolved} // Disable dragging if solved
      />
    ),
    [game, onDrop, isPuzzleSolved]
  );

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-screen-xl w-[80%] h-full">
          <div className="flex-grow flex flex-row justify-center h-full gap-4">
            <div className="w-1/4 flex flex-col gap-4 flex-shrink-0">
              <div className="p-2 bg-[#ffffff] rounded-lg shadow-lg flex flex-row items-center gap-2">
                <img
                  src="./puzzleicon.png"
                  alt="PUZZLE"
                  className="w-14 h-14 "
                />
                <h2 className="text-2xl font-semibold">Rating:</h2>
                {/* Nội dung rating ở đây */}
              </div>
              <div className="p-4 bg-[#ffffff] rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold">Difficulty Level:</h2>
                {/* Nội dung difficulty level ở đây */}
              </div>
            </div>

            {/* Chessboard */}
            <div className="w-2/4 h-full flex items-center justify-center flex-shrink-0 w-auto max-w-fit">
              {chessboardMemo}
            </div>

            {/* Move List */}
            <div className="flex-grow flex flex-col ">
              <div className="flex-grow">
                <MoveList />
              </div>

              <div className="h-40 bg-[#F7F6F5] rounded-lg mt-2 shadow-md flex flex-col items-center justify-center p-4 gap-4">
                {/* Icon and Text */}
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <img
                    src="./whiteking.png"
                    alt="Chess King Icon"
                    className="w-20 h-20 "
                  />
                  {/* Text */}
                  <div>
                    <p className="font-bold text-lg text-[#333]">Your turn</p>
                    <p className="text-sm text-[#666]">Find the best move for white.</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button className="text-[#1b78d0] font-medium ">
                    Get a hint
                  </button>
                  <button className="text-[#1b78d0] font-medium  p-2">
                    View the solution
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Puzzle;
