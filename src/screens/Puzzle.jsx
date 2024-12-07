import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import toast from "react-hot-toast";

import movesStore from "@/store/movesStore";
import { MoveList } from "@/components/puzzle/MoveList";
import { set } from "react-hook-form";
import { Separator } from "@/components/ui/separator";

export const Puzzle = () => {
  const [data, setData] = useState(null);
  const [game, setGame] = useState(new Chess());
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const addMove = movesStore((state) => state.addMove);
  const resetMoves = movesStore((state) => state.resetMoves);
  const moves = movesStore((state) => state.moves);
  const [isWatchingHistory, setIsWatchingHistory] = useState(false);
  const [botMove, setBotMove] = useState(0);
  const [selectedMove, setSelectedMove] = useState(0);
  const [highlightSquares, setHighlightSquares] = useState({
    from: null,
    to: null,
    king: null,
  });
  const [botHightLightSquares, setBotHighLightSquares] = useState({
    from: null,
    to: null,
  });
  const [isSolution, setIsSolution] = useState(false);

  // const initialPosition =
  //   "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 0 1"; // Example FEN

  const fetchData = async () => {
    try {
      const res = await fetch("https://lichess.org/api/puzzle/next");
      if (!res.ok) {
        throw new Error("Failed to fetch PGN data");
      }
      const puzzle = await res.json();
      console.log(puzzle);
      setData(puzzle);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const loadGame = async () => {
      const moveList = data.game.pgn.split(" ");
      resetMoves();
      setIsPuzzleSolved(false);
      setBotMove(0);
      setHighlightSquares({ from: null, to: null, king: null });
      setIsSolution(false);

      const newGame = new Chess();
      for (let i = 0; i < moveList.length; i++) {
        const moveResult = newGame.move(moveList[i]);
        addMove(moveResult);
        if (i === moveList.length - 1) {
          setBotHighLightSquares({ from: moveResult.from, to: moveResult.to });
        }
      }
      setSelectedMove(moveList.length - 1);
      setGame(newGame);
    };

    loadGame();
  }, [data, addMove, resetMoves]);

  useEffect(() => {
    const board = game.board();
    let kingPosition = null;

    board.forEach((row) => {
      row.forEach((square) => {
        if (square && square.type === "k" && square.color === game.turn()) {
          kingPosition = square.square;
        }
      });
    });

    const kingInCheck = game.inCheck();

    if (kingInCheck && kingPosition) {
      setHighlightSquares((prev) => ({
        ...prev,
        king: kingPosition,
      }));
    } else {
      setHighlightSquares((prev) => ({
        ...prev,
        king: null,
      }));
    }
  }, [game]);

  const handleViewHistory = (item, index) => {
    if (item === undefined) return;
    if (item === moves[moves.length - 1]) {
      setIsWatchingHistory(false);
    } else {
      setIsWatchingHistory(true);
    }
    console.log(item);
    if (data?.game.pgn.split(" ").length % 2 !== 0) {
      if (item.color === "w") {
        setBotHighLightSquares({ from: item.from, to: item.to });
        setHighlightSquares({ from: null, to: null, king: null });
      } else {
        setBotHighLightSquares({ from: null, to: null });
        setHighlightSquares({ from: item.from, to: item.to, king: null });
      }
    } else {
      if (item.color === "b") {
        setBotHighLightSquares({ from: item.from, to: item.to });
        setHighlightSquares({ from: null, to: null, king: null });
      } else {
        setBotHighLightSquares({ from: null, to: null });
        setHighlightSquares({ from: item.from, to: item.to, king: null });
      }
    }
    setSelectedMove(index);
    setGame(new Chess(item.after));
  };

  const onDrop = useCallback(
    (source, target) => {
      if (isPuzzleSolved) {
        toast.error("You have already solved the puzzle!");
        return false;
      }
      const newChess = new Chess(game.fen());
      const move = { from: source, to: target, promotion: "q" };
      const moveResult = newChess.move(move);

      console.log(data.puzzle.solution[botMove], `${source}${target}`);
      if (
        moveResult &&
        !isWatchingHistory &&
        data.puzzle.solution[botMove] === `${source}${target}`
      ) {
        addMove(moveResult);
        setSelectedMove(selectedMove + 1);
        setGame(new Chess(newChess.fen()));
        setBotHighLightSquares({ from: null, to: null });

        if (data.puzzle.solution[botMove + 1]) {
          const from = data.puzzle.solution[botMove + 1].substring(0, 2);
          const to = data.puzzle.solution[botMove + 1].substring(2, 4);
          const botMoveResult = newChess.move({
            from,
            to,
            promotion: "q",
          });
          addMove(botMoveResult);
          setSelectedMove(selectedMove + 2);
          setBotMove(botMove + 2);
          setBotHighLightSquares({ from, to });
          if (!isSolution) {
            setHighlightSquares({ from: null, to: null, king: null });
          } else {
            setHighlightSquares({
              from: data.puzzle.solution[botMove + 2]?.substring(0, 2) || null,
              to: data.puzzle.solution[botMove + 2]?.substring(2, 4) || null,
              king: null,
            });
          }
          setGame(new Chess(newChess.fen()));
        }

        // Check for puzzle solution (example condition: checkmate)
        if (
          newChess.isCheckmate() ||
          botMove === data.puzzle.solution.length - 1
        ) {
          setIsPuzzleSolved(true);
          toast.success("Puzzle solved!");
        }
      } else {
        toast.error("Invalid move. Try again.");
      }

      return !!moveResult;
    },
    [
      game,
      isPuzzleSolved,
      isWatchingHistory,
      data,
      botMove,
      addMove,
      selectedMove,
      isSolution,
    ]
  );

  const handleGetHint = () => {
    if (isPuzzleSolved) {
      toast.error("You have already solved the puzzle!");
      return;
    }

    const currentMove = data?.puzzle.solution[botMove];

    if (!currentMove) {
      toast.error("No more hints available.");
      return;
    }

    const from = currentMove.substring(0, 2);
    const to = currentMove.substring(2, 4);

    setHighlightSquares({ from, to, king: null });

    toast.success(`Hint: Move from ${from} to ${to}`);
  };

  const chessboardMemo = useMemo(
    () => (
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardWidth={550}
        boardOrientation={
          data?.game.pgn.split(" ").length % 2 !== 0 ? "black" : "white"
        }
        customBoardStyle={{
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
        }}
        customDarkSquareStyle={{ backgroundColor: "#779952" }}
        customLightSquareStyle={{ backgroundColor: "#edeed1" }}
        customDropSquareStyle={{
          boxShadow: "inset 0 0 1px 6px rgba(132,23,255,0.75)",
        }}
        customSquareStyles={{
          light: { backgroundColor: "#f0d9b5" },
          dark: { backgroundColor: "#b58863" },
          [`${botHightLightSquares.from}`]: {
            boxShadow: "inset 0 0 3px 3px blue",
          },
          [`${botHightLightSquares.to}`]: {
            boxShadow: "inset 0 0 3px 3px blue",
          },
          [`${highlightSquares.from}`]: {
            boxShadow: "inset 0 0 3px 3px yellow",
          },
          [`${highlightSquares.to}`]:
            game.get(highlightSquares.to) && !isWatchingHistory
              ? {
                  backgroundColor: "#7e42f5",
                }
              : {
                  boxShadow: "inset 0 0 3px 3px yellow",
                },
          [`${highlightSquares.king}`]: {
            boxShadow: "inset 0 0 10px 3px red",
          },
        }}
        arePiecesDraggable={!isPuzzleSolved} // Disable dragging if solved
      />
    ),
    [
      game,
      onDrop,
      isPuzzleSolved,
      data,
      highlightSquares,
      botHightLightSquares,
      isWatchingHistory,
    ]
  );

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-screen-xl w-[80%] h-full mt-2">
          <div className="flex-grow flex flex-row justify-center h-full gap-4">
            <div className="w-1/4 flex flex-col flex-shrink-0">
              {/* INFO */}
              <div className="p-2 bg-[#ffffff] rounded-lg shadow-lg flex flex-row items-center gap-2 border border-gray-300">
                <img
                  src="./puzzleicon.png"
                  alt="PUZZLE"
                  className="size-14 mr-1"
                />
                <div className="flex flex-col">
                  <span className="text-base flex gap-1">
                    Puzzle{" "}
                    <a
                      className="text-emerald-600 hover:text-emerald-800"
                      href={`https://lichess.org/training/${data?.puzzle.id}`}
                      target="_blank"
                    >
                      #{data?.puzzle.id}
                    </a>
                  </span>
                  <span className="text-base flex gap-1">
                    Rating{" "}
                    <p className="font-bold text-gray-600">
                      {data?.puzzle.rating}
                    </p>
                  </span>
                  <span className="text-base">
                    Played <b>{data?.puzzle.plays}</b> times
                  </span>
                </div>
              </div>
            </div>

            {/* CHESSBOARD */}
            <div className="w-2/4 h-full flex items-center justify-center flex-shrink-0 w-auto max-w-fit">
              {chessboardMemo}
            </div>

            <div className="flex-grow flex flex-col gap-4">
              {/* MOVE LIST */}
              <div className="flex-grow">
                <MoveList
                  handleViewHistory={handleViewHistory}
                  selected={selectedMove}
                />
              </div>

              {/* SOLUTION */}
              <div className="h-40 bg-[#F7F6F5] rounded-lg shadow-md flex flex-col items-center justify-center p-4 gap-4 border border-gray-300">
                <div className="flex items-center justify-center gap-6">
                  <img
                    src={
                      data?.game.pgn.split(" ").length % 2 !== 0
                        ? "./blackking.png"
                        : "./whiteking.png"
                    }
                    alt="Chess King Icon"
                    className="w-20 h-20 "
                  />
                  {/* Text */}
                  <div>
                    <p className="font-bold text-lg text-[#333]">Your turn</p>
                    <p className="text-sm text-[#666]">
                      Find the best move for{" "}
                      {data?.game.pgn.split(" ").length % 2 !== 0
                        ? "black"
                        : "white"}
                      .
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleGetHint}
                    className="text-emerald-600 hover:text-emerald-800 font-medium"
                  >
                    Get a hint
                  </button>
                  <button
                    onClick={() => {
                      setIsSolution(true);
                      handleGetHint();
                    }}
                    className="text-emerald-600 hover:text-emerald-800 font-medium p-2"
                  >
                    View the solution
                  </button>
                  <button
                    onClick={() => {
                      fetchData();
                    }}
                    disabled={!isPuzzleSolved}
                    className={
                      (isPuzzleSolved ? `text-emerald-600 hover:text-emerald-800` : `text-[#8e9193]`) +
                      ` font-medium  p-2`
                    }
                  >
                    Next
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