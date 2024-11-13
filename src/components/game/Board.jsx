import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";

export const Board = () => {
  const [boardSize, setBoardSize] = useState(600);
  const boardContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (boardContainerRef.current) {
        setBoardSize(boardContainerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={boardContainerRef}
      className="w-full h-full flex justify-center items-center p-4"
    >
      <Chessboard
        boardWidth={boardSize}
        customBoardStyle={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};
