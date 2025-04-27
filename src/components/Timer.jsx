import { useState, useEffect } from "react";

function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (onTimeUp) onTimeUp();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeUp]);

  /* Reset timer for next question */
  useEffect(() => {
    setTimeLeft(duration);
    setIsActive(true);
  }, [duration]);

  /* Calculate percentage */
  const progressPercentage = (timeLeft / duration) * 100;

  /* Change color based on time left */
  const getColor = () => {
    if (progressPercentage > 66) return "#4CAF50";
    if (progressPercentage > 33) return "#FFC107";
    return "#F44336";
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span>{timeLeft > 0 ? `${timeLeft}s` : "Time's up!"}</span>
      </div>
      <div className="timer-bar-container">
        <div
          className="timer-bar"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: getColor(),
          }}
        ></div>
      </div>
    </div>
  );
}

export default Timer;
