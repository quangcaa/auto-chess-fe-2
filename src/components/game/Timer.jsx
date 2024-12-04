import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const Timer = ({ timeLeft, isActive, player }) => {
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
        className="text-2xl"
      >
        {formatTime(timeLeft)}
      </p>
    </div>
  );
};

Timer.propTypes = {
  socket: PropTypes.shape({
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
  }).isRequired,
  player: PropTypes.string.isRequired,
};
