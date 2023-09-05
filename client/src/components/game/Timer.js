/*import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import { useGameContext } from '../../utils/GameContext';

// Random component
const Completionist = () => <span>Times out!</span>;
const Pause = () => <span>Timer Paused!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span>
        {hours}:{minutes}:{seconds}
      </span>
    );
  }
 
  
};

ReactDOM.render(
  <Countdown date={Date.now() + 600000} renderer={renderer}/>,
  document.getElementById("root")
);


export default function Timer() {

  return (
    <div>
      Timer
    </div>
  )
}*/
import React, { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div>
      <h2>Timer: {seconds} seconds</h2>
      <div className="button-container">
        <button
          className="btn btn-lg btn-secondary m-2 border-white"
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className="btn btn-lg btn-secondary m-2 border-white"
          onClick={handlePause}
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          className="btn btn-lg btn-secondary m-2 border-white"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;
