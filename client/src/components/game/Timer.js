import React from "react";
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
}