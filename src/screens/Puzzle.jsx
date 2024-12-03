import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import toast from "react-hot-toast";

import movesStore from "@/store/movesStore";
import { MoveList } from "@/components/game/MoveList";
import { GameInfo } from "@/components/game/GameInfo";
import { extractMoves } from "@/utils/extractMoves";
import { set } from "react-hook-form";
import api from "@/utils/axios";

export const Puzzle = () => {
  const [data, setData] = useState(null);
  const [game, setGame] = useState(new Chess());
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  // const addMove = movesStore((state) => state.addMove);
  const resetMoves = movesStore((state) => state.resetMoves);
  const moves = movesStore((state) => state.moves);
  const setMoves = movesStore((state) => state.setMoves);
  const [isWatchingHistory, setIsWatchingHistory] = useState(false);
  const [botMove, setBotMove] = useState(0);
  const [trueMove, setTrueMove] = useState([])

  // const initialPosition =
  //   "r1bqkbnr/pppppppp/2n5/8/8/2N5/PPPPPPPP/R1BQKBNR w KQkq - 0 1"; // Example FEN

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/puzzle/training');
        console.log(res.data);
        setData(res.data); // Set fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const fetchPGNAndExtractMoves = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch PGN data');
      }
      const pgn = await response.text();
      return extractMoves(pgn);
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadGame = async () => {
      const moveList = await fetchPGNAndExtractMoves(`https://lichess.org/game/export/${data.id}`);
      resetMoves();
      const newGame = new Chess();
      let moveResultList = []
      let trueMoveList = []
      if (data) {
        for (let i = 0; i < moveList.length; i++) {
          if (i < moveList.length - data.moves) {
            const moveResult = newGame.move(moveList[i]);
            moveResultList.push({...moveResult, selected: i === moveList.length - data.moves.length ? true : false });
          } else {
            trueMoveList.push(moveList[i])
          }
        }
        setMoves(moveResultList);
        setTrueMove(trueMoveList)
      }
      
      setGame(newGame);
    };

    loadGame();
  }, [data]);

  const handleViewHistory = (item) => {
    if (item === undefined) return;
    if (item === moves[moves.length - 1].after) {
      setIsWatchingHistory(false);
    } else {
      setIsWatchingHistory(true);
    }
    console.log(item);
    setMoves(moves.map(move => {
      if (move.after === item) {
        return {...move, selected: true}
      }
      return {...move, selected: false }
    }))
    setGame(new Chess(item));
  }

  const onDrop = useCallback(
    (source, target) => {
      if (isPuzzleSolved) {
        toast.error("You have already solved the puzzle!");
        return false;
      }
      const newChess = new Chess(game.fen())
      const move = { from: source, to: target, promotion: "q" };
      const moveResult = newChess.move(move);
      console.log(trueMove[botMove])

      console.log(moveResult)
      if (moveResult && !isWatchingHistory && data && trueMove[botMove] === moveResult.san) {
          setMoves([...moves.map(item => ({...item, selected: false})), { ...moveResult, selected: true}]);
          if (trueMove[botMove + 1]) {
            const botMoveResult = newChess.move(trueMove[botMove + 1]);
            setMoves([...moves.map(item => ({...item, selected: false})), { ...moveResult, selected: false}, { ...botMoveResult, selected: true}])
            setBotMove(botMove + 2);
          }
          setGame(new Chess(newChess.fen()));

        // Check for puzzle solution (example condition: checkmate)
        if (newChess.isCheckmate()) {
          setIsPuzzleSolved(true);
          toast.success("Puzzle solved!");
        }
      } else {
        toast.error("Invalid move. Try again.");
      }

      return !!moveResult;
    },
    [game, isPuzzleSolved, setMoves, isWatchingHistory, data, botMove]
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
                <h2 className="text-2xl font-semibold">Rating: {data?.rating}</h2>
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
                <MoveList handleViewHistory={handleViewHistory} />
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

// import { useState, useEffect } from "react";
// import { Chessboard } from "react-chessboard";
// import { Chess } from "chess.js";
// import api from "@/utils/axios";
// import toast from "react-hot-toast";

// export const Puzzle = () => {
//   const [chess] = useState(new Chess());
//   const [puzzle, setPuzzle] = useState(null);
//   const [solutionIndex, setSolutionIndex] = useState(0);

//   useEffect(() => {
//     const fetchPuzzle = async () => {
//       try {
//         const res = await api.get("/puzzle/training");
//         console.log(res);

//         const data = res.data;

//         chess.load(data.fen);
//         setPuzzle(data);
//       } catch (error) {
//         toast.error(error.res.data.message || "Something went wrong");
//       }
//     };
//     fetchPuzzle();

    // fetch("/puzzle/training")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     chess.load(data.fen);
    //     setPuzzle(data);
    //   });
  // }, [chess]);

//   const handleMove = (move) => {
//     if (!puzzle) return;

//     const solutionMove = puzzle.moves[solutionIndex];
//     if (move === solutionMove) {
//       setSolutionIndex(solutionIndex + 1);
//       chess.move({ from: move.slice(0, 2), to: move.slice(2, 4) });

//       if (solutionIndex + 1 === puzzle.moves.length) {
//         alert("Puzzle solved!");
//       }
//     } else {
//       alert("Wrong move. Try again!");
//     }
//   };

//   return (
//     <div>
//       {puzzle && (
//         <>
//           <h3>Puzzle: {puzzle.id}</h3>
//           <p>Rating: {puzzle.rating}</p>
//           <p>Themes: {puzzle.themes.join(", ")}</p>
//           <Chessboard
//             boardWidth={450}
//             position={chess.fen()}
//             onSquareClick={(square) => handleMove(square)}
//           />

//           <iframe
//             src="https://lichess.org/embed/game/yyznGmXs?theme=auto&bg=auto#35"
//             width="600"
//             height="397"
//           ></iframe>
//         </>
//       )}
//     </div>
//   );
// };
