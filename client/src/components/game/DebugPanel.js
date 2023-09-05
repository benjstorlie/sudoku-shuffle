import React, { useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import { useGameContext } from '../../utils/GameContext';
import { temporaryGetBoard } from '../../utils/api';
import { blankGameArray, shuffleHandler } from '../../utils/gameUtils';

export default function DebugPanel() {
  const {
    gameId, difficulty,
    message, setMessage,
    gameArray, setGameArray, saveGameState,
    modeAuto, saveNewGame,
    resetGame, setOverlay,
    setMove, setElapsedTime,
    setDifficulty
  } = useGameContext();

  const [messageBg, setMessageBg] = useState('light')

  useEffect(() => {
    if (message) {
      if (message.startsWith('You won!')) {
        setMessageBg('success')
      } else {
        setMessageBg('danger');
      }
      
      setTimeout(() => {
        setMessageBg('light'); // Reset to light
      }, 1000); // Adjust the delay as needed

      // Event listener to clear message when the mouse is clicked
      const handleClick = () => {
        setMessage('');
        setMessageBg('light')
      };
      
      // Event listener to clear message when a key is pressed
      const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
          setMessage('');
          setMessageBg('light')
        }
      };

      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyPress);

      return () => {
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [message, setMessage]);

  function debugSolveGame() {
    let updatedArray = gameArray.map((rows) => [...rows]);
    for (let r=0 ; r < 9; r++) {
      for (let c=0 ; c < 9; c++) {
        if (!gameArray[r][c].given) {
          updatedArray[r][c].value = gameArray[r][c].solution
        }
      }
    }
    setGameArray(updatedArray);
    saveGameState(updatedArray,true);
  }

  async function debugNewExampleGame(difficulty) {
    const board = temporaryGetBoard(difficulty);
    const updatedArray = blankGameArray();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        let newValue = board.newboard.grids[0].value[row][col];
        let newSolution = board.newboard.grids[0].solution[row][col];
        const newCell = {
          ...updatedArray[row][col],
          value: newValue,
          candidates: modeAuto ? new Set([1,2,3,4,5,6,7,8,9]) : new Set() ,
          given: !!newValue,
          solution: newSolution,
        };
        updatedArray[row][col] = newCell;
      }
    }
    const shuffledArray = shuffleHandler(updatedArray)
    setGameArray(shuffledArray);
    setDifficulty(difficulty);
    setMove(0);
    setElapsedTime(0);
    setOverlay({show:false,message:<p></p>})
    await saveNewGame(shuffledArray,difficulty);
  }
  /** @type {React.CSSProperties} */
  const panelStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto',
    border: 'solid black 3px',
    borderRadius: '1rem',
    padding: '0.5rem',
    margin: '0.5rem'
  };

  return (<div id='debug-panel' style={panelStyle}>
  <div><h3>Debug Panel</h3></div>
  <div>Current Game ID: <span style={{fontSize:'0.7em'}}>{gameId}</span></div>
  <div>Difficulty: {difficulty}</div>
  <Button variant='primary' onClick={() => debugSolveGame()}>Solve Game (debug)</Button>
  <ButtonGroup >
    <Button variant='success' onClick={() => debugNewExampleGame('easy')}>New Easy</Button>
    <Button variant='warning' onClick={() => debugNewExampleGame('medium')} >New Med</Button>
    <Button variant='danger' onClick={() => debugNewExampleGame('hard')} >New Hard</Button>
  </ButtonGroup>
  <Button variant='secondary' onClick={() => resetGame()}>Reset Game to Blank</Button>
  <Card bg={messageBg} style={{transition: 'all 0.5s', minHeight:'8rem'}}>
    <Card.Header>Message:</Card.Header>
    <Card.Body><Card.Text>{message}</Card.Text></Card.Body>
  </Card>
  </div>)
}









