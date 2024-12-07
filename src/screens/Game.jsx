import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chess } from "chess.js";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { useAuth } from "../contexts/AuthContext";
import movesStore from "@/store/movesStore";
import { Board } from "@/components/game/Board";
import { GameInfo } from "@/components/game/GameInfo";
import { ChatRoom } from "@/components/game/ChatRoom";
import { MoveList } from "@/components/game/MoveList";
import { Timer } from "@/components/game/Timer";
import { GAME_OVER, LEAVE_GAME, MOVE } from "@/constants/game";
import Countdown from "react-countdown";

export const Game = () => {
  const [game, setGame] = useState(new Chess());
  const [gameId, setGameId] = useState("");
  const [gameData, setGameData] = useState("");
  const [timeData, setTimeData] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const setMoves = movesStore((state) => state.setMoves);
  const addMove = movesStore((state) => state.addMove);
  const resetMoves = movesStore((state) => state.resetMoves);

  const navigate = useNavigate();
  const { socket } = useAuth();

  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [activePlayer, setActivePlayer] = useState("w");

  const [selectedMove, setSelectedMove] = useState(0);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const { game_id } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/game/${game_id}`);

        const game = response.data.game;
        const time = response.data.clock;

        setGameId(game.game_id);
        setGameData(game);
        setTimeData(time);

        // setWhiteTime(time.base_time); // Initialize timers once
        // setBlackTime(time.base_time);

        setIsGameStarted(true);
        setIsGameOver(false);
        setGame(new Chess());

        setActivePlayer("w");

        resetMoves();
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
      }
    };

    fetchGame();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(MOVE, (moveData) => {
      setGame((prevGame) => {
        const gameCopy = new Chess(prevGame.fen());
        gameCopy.move(moveData);

        const lastMove = gameCopy.history({ verbose: true }).slice(-1)[0];
        console.log(lastMove);
        addMove(lastMove);

        return gameCopy;
      });

      setActivePlayer((prev) => (prev === "w" ? "b" : "w"));
    });

    // socket.on("time_update", ({ whiteTime: wTime, blackTime: bTime }) => {
    //   console.log('hello')
    //   setWhiteTime(wTime);
    //   setBlackTime(bTime);
    // });

    socket.on(GAME_OVER, (result) => {
      setGameResult(result);
      setIsGameStarted(false);
      setIsGameOver(true);
      toast.success(`Game Over: ${result}`);
    });

    return () => {
      socket.off(MOVE);
      socket.off(GAME_OVER);
      // socket.off("time_update");
    };
  }, [socket, addMove]);

  const onTimeUp = (player) => {
    toast.error(`${player} has run out of time!`);
    setIsGameOver(true);
    setGameResult(`${player} lost on time.`);
    socket.emit(GAME_OVER, { result: `${player} lost on time.` });
  };

  // useEffect(() => {
  //   if (!isGameStarted || isGameOver) return;

  //   const updateTime = () => {
  //     // setWhiteTime((prev) => (activePlayer === "w" ? Math.max(0, prev - 1000) : prev));
  //     // setBlackTime((prev) => (activePlayer === "b" ? Math.max(0, prev - 1000) : prev));
  //   };

  //   const timer = setInterval(updateTime, 1000);

  //   return () => clearInterval(timer);
  // }, [isGameStarted, isGameOver, activePlayer]);

  const leaveGame = () => {
    if (gameId) {
      socket.emit(LEAVE_GAME, gameId);
    }
  };

  // func to handle viewing a specific move
  const handleViewHistory = (move, index) => {
    const gameCopy = new Chess();
    const moves = movesStore.getState().moves.slice(0, index + 1);
    moves.forEach((m) => gameCopy.move(m.san));
    setGame(gameCopy);
    setSelectedMove(index);

    // check
    const movesCheck = movesStore.getState().moves;
    movesCheck.length - 1 === index
      ? setIsViewingHistory(false)
      : setIsViewingHistory(true);
  };

  // update selectedMove when moves change
  useEffect(() => {
    const moves = movesStore.getState().moves;
    if (moves.length > 0) {
      setSelectedMove(moves.length - 1);
      setIsViewingHistory(false);
    }
  }, [movesStore.getState().moves]);

  // const renderer = ({ minutes, seconds }) => {
  //   return (
  //     <span>
  //       {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
  //     </span>
  //   );
  // };

  return (
    <div className="flex-grow flex flex-col m-2">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-screen-xl w-[80%] h-full">
          <div className="flex-grow flex flex-row justify-center h-full gap-4">
            {/* LEFT */}
            <div className="w-1/4 flex flex-col gap-4 flex-shrink-0">
              <div>
                <GameInfo
                  white={gameData.whitePlayer}
                  black={gameData.blackPlayer}
                  clock={timeData}
                  startTime={gameData.start_time}
                />
              </div>
              <div className="flex-grow h-64">
                <ChatRoom game_id={gameId} />
              </div>
            </div>
            {/* MID */}
            <div className="w-2/4 h-full flex items-center justify-center flex-shrink-0 w-auto max-w-fit">
              <div>
                <Board
                  game={game}
                  setGame={setGame}
                  socket={socket}
                  gameId={gameId}
                  isGameOver={isGameOver}
                  addMove={addMove}
                  setActivePlayer={setActivePlayer}
                  isViewingHistory={isViewingHistory}
                />
              </div>
            </div>
            {/* RIGHT */}
            <div className="w-1/4 h-full flex flex-col flex-shrink-0">
              <div className="flex justify-between mb-4">
                {/* <Timer
                  timeLeft={whiteTime}
                  isActive={activePlayer === "w"}
                  player="White"
                />
                <Timer
                  timeLeft={blackTime}
                  isActive={activePlayer === "b"}
                  player="Black"
                /> */}

                {/* <div>
                  <h2>White Player</h2>
                  {activePlayer === "w" && isGameStarted ? (
                    <Countdown
                      date={Date.now() + whiteTime}
                      onTick={({ total }) => setWhiteTime(total)}
                      renderer={renderer}
                      // onComplete={switchPlayer} // Chuyển đổi người chơi khi hết thời gian
                    />
                  ) : (
                    <span>{(whiteTime / 1000).toFixed(0)}s</span>
                  )}
                </div> */}

                {/* Đồng hồ đen */}
                {/* <div>
                  <h2>Black Player</h2>
                  {activePlayer === "b" && isGameStarted ? (
                    <Countdown
                      date={Date.now() + blackTime}
                      onTick={({ total }) => setBlackTime(total)}
                      renderer={renderer}
                      // onComplete={switchPlayer}
                    />
                  ) : (
                    <span>{(blackTime / 1000).toFixed(0)}s</span>
                  )}
                </div> */}
              </div>
              <div className="flex-grow">
                <MoveList
                  handleViewHistory={handleViewHistory}
                  selected={selectedMove}
                />
              </div>
              {gameResult && (
                <div className="mt-4 text-xl">
                  {isGameOver ? `Kết thúc: ${gameResult}` : ""}
                </div>
              )}
              {!isGameOver && (
                <div>
                  <button
                    onClick={leaveGame}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                  >
                    LEAVE GAME
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
