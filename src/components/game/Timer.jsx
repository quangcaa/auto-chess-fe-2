// src/components/game/Timer.jsx

import { useEffect, useState } from "react";

const Timer = ({ initialTime, isActive, onTimeUp, player }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    let timer = null;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1000);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      onTimeUp(player);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, onTimeUp, player]);

  useEffect(() => {
    // Reset timer when initialTime changes (e.g., new game starts)
    setTimeLeft(initialTime);
  }, [initialTime]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="timer">
      <h3 className="text-xl font-semibold">{player} Time</h3>
      <p
        className={`text-2xl ${
          timeLeft <= 300000 ? "text-red-500" : "text-gray-700"
        }`}
      >
        {formatTime(timeLeft)}
      </p>
    </div>
  );
};

export default Timer;
