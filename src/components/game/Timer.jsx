import PropTypes from "prop-types";

export const Timer = ({ timeLeft, isActive, player }) => {
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className={`timer ${
        isActive ? "text-green-500 font-bold" : "text-gray-500"
      }`}
    >
      <p className="text-2xl">{formatTime(timeLeft)}</p>
    </div>
  );
};

Timer.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  player: PropTypes.string.isRequired,
};

// import { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import toast from "react-hot-toast";

// export const Timer = ({
//   socket,
//   gameId,
//   isGameStarted,
//   isGameOver,
//   initialTime,
//   increment,
//   activePlayer,
//   playerColor,
// }) => {
//   const [whiteTime, setWhiteTime] = useState(initialTime);
//   const [blackTime, setBlackTime] = useState(initialTime);
//   const timerIntervalRef = useRef(null);

//   // Format time to MM:SS
//   const formatTime = (milliseconds) => {
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
//     const seconds = String(totalSeconds % 60).padStart(2, "0");
//     return `${minutes}:${seconds}`;
//   };

//   // Start timer interval
//   const startTimerInterval = () => {
//     if (isGameOver) return;

//     timerIntervalRef.current = setInterval(() => {
//       const currentTime = Date.now();

//       if (activePlayer === "w") {
//         setWhiteTime((prevTime) => {
//           const newTime = Math.max(0, prevTime - 1000);

//           if (newTime <= 0) {
//             clearInterval(timerIntervalRef.current);
//             socket.emit("time_up", {
//               gameId,
//               player: "white",
//               result: "Black wins on time",
//             });
//             toast.error("White ran out of time!");
//           }

//           return newTime;
//         });
//       } else {
//         setBlackTime((prevTime) => {
//           const newTime = Math.max(0, prevTime - 1000);

//           if (newTime <= 0) {
//             clearInterval(timerIntervalRef.current);
//             socket.emit("time_up", {
//               gameId,
//               player: "black",
//               result: "White wins on time",
//             });
//             toast.error("Black ran out of time!");
//           }

//           return newTime;
//         });
//       }
//     }, 1000);
//   };

//   // Stop timer interval
//   const stopTimerInterval = () => {
//     if (timerIntervalRef.current) {
//       clearInterval(timerIntervalRef.current);
//       timerIntervalRef.current = null;
//     }
//   };

//   // Effect to manage timer based on game state
//   useEffect(() => {
//     if (isGameStarted && !isGameOver) {
//       startTimerInterval();
//     } else {
//       stopTimerInterval();
//     }

//     return () => {
//       stopTimerInterval();
//     };
//   }, [isGameStarted, isGameOver, activePlayer]);

//   // Socket listener for time updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleTimeUpdate = (data) => {
//       setWhiteTime(data.whiteTime);
//       setBlackTime(data.blackTime);
//     };

//     socket.on("time_update", handleTimeUpdate);

//     return () => {
//       socket.off("time_update", handleTimeUpdate);
//     };
//   }, [socket]);

//   return (
//     <div className="flex justify-between items-center space-x-4">
//       <div
//         className={`timer white-timer ${
//           activePlayer === "w" ? "text-green-500 font-bold" : "text-gray-500"
//         } ${playerColor === "w" ? "border-2 border-green-500" : ""}`}
//       >
//         <h3 className="text-xl font-semibold">White Time</h3>
//         <p className="text-2xl">{formatTime(whiteTime)}</p>
//       </div>
//       <div
//         className={`timer black-timer ${
//           activePlayer === "b" ? "text-green-500 font-bold" : "text-gray-500"
//         } ${playerColor === "b" ? "border-2 border-green-500" : ""}`}
//       >
//         <h3 className="text-xl font-semibold">Black Time</h3>
//         <p className="text-2xl">{formatTime(blackTime)}</p>
//       </div>
//     </div>
//   );
// };

// Timer.propTypes = {
//   socket: PropTypes.object.isRequired,
//   gameId: PropTypes.string.isRequired,
//   isGameStarted: PropTypes.bool.isRequired,
//   isGameOver: PropTypes.bool.isRequired,
//   initialTime: PropTypes.number.isRequired,
//   increment: PropTypes.number.isRequired,
//   activePlayer: PropTypes.oneOf(["w", "b"]).isRequired,
//   playerColor: PropTypes.oneOf(["w", "b"]).isRequired,
// };
