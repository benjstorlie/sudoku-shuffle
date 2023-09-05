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
import { useGameContext } from '../../utils/GameContext';
import moment from 'moment';

export default function Timer() {
  // let [currentTime, setCurrentTime] = useState(moment());
  // let [pausedTime, setPausedTime] = useState(0); // number of seconds to add to current time interval

  // State to track whether the stopwatch is running
  const [isRunning, setIsRunning] = useState(false);

  const { saveGameState ,setElapsedTime, elapsedTime, isSolved, gameId } = useGameContext();

  // Function to start the stopwatch
  const startStopwatch = () => {
    setIsRunning(true);
  };

  // Function to pause the stopwatch
  const pauseStopwatch = () => {
    setIsRunning(false);
  };

  // Start stopwatch if gameId changes, or game is solved
  useEffect(() => {
    if (isSolved || (gameId && gameId !== 'test')) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  },[gameId,isSolved,setIsRunning])


  // useEffect(() => {
  //   if(!isSolved && (gameId && gameId !== 'test'))
  //     setTimeout(() => {
  //       setCurrentTime(moment());
  //       let secondsTotal = moment().diff(startTime, 'seconds');
  //       setElapsedTime(prevTime => prevTime + 1 );
  //     }, 1000);
  //   },[isSolved,saveGameState,setElapsedTime,startTime,gameId]);

  useEffect(() => {
    // Function to save game state beforeunload or on unmount
    const handleBeforeUnload = () => {
      if (gameId && gameId !== 'test') {
        saveGameState();
      }
    };

    if (isRunning) {
      // Start an interval to update the elapsed time every second
      const intervalId = setInterval(() => {
        // add one second to previous elapsed time
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);

      // Add beforeunload event listener to save game state
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Return a cleanup function to clear the interval and remove the event listener on unmount
      return () => {
        // Return a cleanup function to clear the interval on unmount
        clearInterval(intervalId);
        window.removeEventListener('beforeunload', handleBeforeUnload);

        // Save game state on unmount if the stopwatch is running
        if (isRunning && (gameId && gameId !== 'test')) {
          saveGameState();
        }
      };
    } else {
      // Remove the beforeunload event listener when the stopwatch is not running
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isRunning, saveGameState, gameId, setElapsedTime]);

  function getTimer() {
    // let secondsTotal  = currentTime.diff(startTime, 'seconds');
    let secondsTotal = elapsedTime;
    if (secondsTotal <=0) 
      return "00:00";

    let duration = moment.duration(secondsTotal, 'seconds');
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();
  // let timer = `${hours}:${minutes}:${seconds}`;
    let stringTimer = '';

    stringTimer += hours ?  `:` : ``;
    stringTimer += minutes ? (minutes < 10 ? `0` + minutes : minutes) + `:` : `00:`;
    stringTimer += seconds < 10 ? `0` + seconds : seconds;
    return stringTimer;
  }

  if (gameId && gameId !== 'test') {
  return (
    <div className="stopwatch">
      <div className="check_time">{getTimer()}</div>
      { (isRunning)
      ? <button onClick={pauseStopwatch}>Pause</button>
      : <button onClick={startStopwatch}>Start</button>
      }
    </div>
  )
    }
}



   // const interval = setInterval(() => {
     // setCurrentTime(instant());
    //}, 1000);
    //return () => clearInterval(interval);
  //}
//}, [won];
//


//function timeGameStartedInMilliseconds() {
  //let { timeGameStarted } = useGameContext();
  //let timeGameStartedInMilliseconds = instant(timeGameStarted).milliseconds();
  //return timeGameStartedInMilliseconds;
//}
//return (
  //<div className="check_time">{ timeGameStartedInMilliseconds()}</div>
//)


// function timeGameStartedInSeconds() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInSeconds = instant(timeGameStarted).seconds();
//   return timeGameStartedInSeconds;
// }
//return (
  //<div className="check_time">{ timeGameStartedInSeconds()}</div>
//)

// function timeGameStartedInMinutes() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInMinutes = instant(timeGameStarted).minutes();
//   return timeGameStartedInMinutes;
// }
//return (
  //<div className="check_time">{ timeGameStartedInMinutes()}</div>
//)

// function timeGameStartedInHours() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInHours = instant(timeGameStarted).hours();
//   return timeGameStartedInHours;
// }
//return (
  //<div className="check_time">{ timeGameStartedInHours()}</div>
//)

// function timeGameStartedInDays() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInDays = instant(timeGameStarted).days();
//   return timeGameStartedInDays;
// }
//return (
  //<div className="check_time">{ timeGameStartedInDays()}</div>
//)

// function timeGameStartedInWeeks() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInWeeks = instant(timeGameStarted).weeks();
//   return timeGameStartedInWeeks;
// }
//return (
  //<div className="check_time">{ timeGameStartedInWeeks()}</div>
//)

// function timeGameStartedInMonths() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInMonths = instant(timeGameStarted).months();
//   return timeGameStartedInMonths;
// }
//return (
  //<div className="check_time">{  timeGameStartedInMonths()}</div>
//)

// function timeGameStartedInYears() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInYears = instant(timeGameStarted).years();
//   return timeGameStartedInYears;
// }
//return (
  //<div className="check_time">{ timeGameStartedInYears()}</div>
//)

// function timeGameStartedInDecades() {
//   let { timeGameStarted } = useGameContext();
//   let timeGameStartedInDecades = instant(timeGameStarted).decades();
//   return timeGameStartedInDecades;
// }
//return (
  //<div className="check_time">{ timeGameStartedInDecades()}</div>
//)




