import React, { useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import { useGameContext } from '../../utils/GameContext';
import { temporaryGetBoard } from '../../utils/api';
import { blankGameArray } from '../../utils/gameUtils';

export default function DebugPanel() {
  const {
    message, setMessage,
    gameArray, setGameArray, saveGameState,
    modeAuto, saveNewGame,
  } = useGameContext();

  const [messageBg, setMessageBg] = useState('light')

  useEffect(() => {
    if (message) {
      setMessageBg('danger');

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
    saveGameState(updatedArray);
  }

  function debugNewExampleGame(difficulty) {
    const board = temporaryGetBoard(difficulty);
    const updatedArray = blankGameArray();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        let newValue = board.newboard.grids[0].value[row][col];
        let newSolution = board.newboard.grids[0].solution[row][col];
        const newCell = {
          ...gameArray[row][col],
          value: newValue,
          candidates: modeAuto ? new Set([1,2,3,4,5,6,7,8,9]) : new Set() ,
          given: !!newValue,
          solution: newSolution,
        };
        updatedArray[row][col] = newCell;
      }
    }
    setGameArray(updatedArray);
    saveNewGame(updatedArray,difficulty);
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
  <Button variant='primary' onClick={() => debugSolveGame()}>Solve Game (debug)</Button>
  <ButtonGroup >
    <Button variant='success' onClick={() => debugNewExampleGame('easy')}>New Easy</Button>
    <Button variant='warning' onClick={() => debugNewExampleGame('medium')} >New Med</Button>
    <Button variant='danger' onClick={() => debugNewExampleGame('hard')} >New Hard</Button>
  </ButtonGroup>
  <Card bg={messageBg}>
    <Card.Header>Message:</Card.Header>
    <Card.Body><Card.Text>{message}</Card.Text></Card.Body>
  </Card>
  </div>)
}









