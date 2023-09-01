import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button'
import { iter } from '../../utils/gameUtils';
import './Controls.css';
// eslint-disable-next-line
import Timer from './Timer'
import { useGameContext } from '../../utils/GameContext';
import shuffleSvg from './shuffle.svg'

// Of course, it would be super fun to allow the user to modify these colors
// This current list is just random, so it can be changed to something better
// Have to make sure that colorList[0] is empty, because then that can be assigned to the 'clear' button
const colorList = ['','#FF5733', '#33FF57', '#3366FF', '#FF33C8', '#33C8FF', '#FF9433', '#33FFC8', '#3394FF', '#FF3394'];
const difficultyList = ['easy','easy','medium','hard','easy','medium','hard','easy','medium','hard',];

const HIGHLIGHT = 'highlight';
const ENTER_DIGIT = 'enterDigit';
const COLOR = 'enterColor';
const CANDIDATE = 'toggleCandidate';
const DIFFICULTY = 'loadDifficulty';

export default function Controls() {
  
  const { 
    enterDigit,
    enterColor,
    toggleCandidate,
    setHighlightedDigit,
    highlightedDigit, 
    modeAuto,
    setModeAuto,
    modeMouse,
    setModeMouse,
    modeMultiselect,
    setModeMultiselect,
    selected,
    shuffle,
    loadDifficulty,
  } = useGameContext();

  /** 
   * The last selected cell is the first cell in the list of selected cells, or, if there are no cells selected, it will just give an empty string
   * - This is used when using arrow keys to navigate the board.
   * @type {string} 
   */
  // eslint-disable-next-line
  const lastSelected = selected[0] || '';

  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [ actionName, setActionName ] = useState(HIGHLIGHT);

  /**
   * Conditonal styling object for controls grid buttons
   * @param {number} index 
   * @returns {React.CSSProperties}
   */
  const controlsGridStyles = (index) => {
    switch (actionName) {
      case HIGHLIGHT:
        if (index === highlightedDigit) {
          return {backgroundColor: 'var(--highlight-color)'}
        }
        break;
      case ENTER_DIGIT:
        return {textDecoration: 'underline'}
      case COLOR:
        if (index) {
          return {color: 'transparent', backgroundColor: colorList[index]}
        } else {
          return {color: 'transparent', backgroundColor: '#fff'}
        }
      case CANDIDATE:
        if (index) {
          return {
            fontSize: '.7em',
            justifyContent: ['start','center','end'][(index-1) % 3],
            alignContent: ['start','center','end'][Math.floor((index-1)/3)],
          };
        }
        break;
      case DIFFICULTY:
        if (difficultyList[index] === 'easy') {return {color: 'transparent', backgroundColor: 'green'}}
        else if (difficultyList[index] === 'medium') {return {color: 'transparent', backgroundColor: 'yellow'}}
        else if (difficultyList[index] === 'hard') {return {color: 'transparent', backgroundColor: 'red'}}
        break;
      default:
        return {};
      }
  }

  const actionFunction = useCallback(async function(index) {
    switch (actionName) {
      case HIGHLIGHT:
        setHighlightedDigit(index);
        break;
      case ENTER_DIGIT:
        enterDigit(index);
        break;
      case COLOR:
        enterColor(colorList[index]);
        break;
      case CANDIDATE:
        if (index) {
          toggleCandidate(index);
        }
        break;
      case DIFFICULTY:
        try{
          loadDifficulty(difficultyList[index]);
        } catch(error){
          console.error("An error occurred:", error);
        }
        setActionName(ENTER_DIGIT);
        break;
      default:
        return;
    }
  },[actionName,enterColor,enterDigit,setHighlightedDigit,toggleCandidate,loadDifficulty])

  useEffect(() => {
    /** @type {(e:KeyboardEvent) => void} */
    const handleKeyDown = (e) => {
      const key = e.key;
      if (['1','2','3','4','5','6','7','8','9'].includes(key)) {
        actionFunction(parseInt(key));
      } else if (["Backspace","Clear","Delete",'0'].includes(key)) {
        actionFunction(0);
      } else if (key === 'z') {
        setActionName(ENTER_DIGIT)
      } else if (key === 'x') {
        setActionName(CANDIDATE)
      } else if (key === 'c') {
        setActionName(COLOR) 
      } else if (key === 'v') {
        setActionName(HIGHLIGHT)
      } else if (key === 'q') {
        setModeMultiselect((prev) => !prev)
      } else if (key === 'w') {
        setModeAuto((prev) => !prev)
      } else if (key === 'e') {
        setModeMouse((prev) => !prev)
      }
    };
    // adds event listener to the whole window
    window.addEventListener('keydown', handleKeyDown);

    // Don't forget to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [actionFunction,setModeAuto,setModeMouse,setModeMultiselect]); // Empty dependency array means this effect runs once after the initial render

  return (
    <>
    <div id='controls'>
    <Button variant='outline-dark' onClick={()=> setModeMultiselect((prev) => !prev)}>multi-select: {modeMultiselect ? 'on' : 'off'}</Button>
    <Button variant='outline-dark' onClick={()=> setModeAuto((prev) => !prev)}>auto-solve: {modeAuto ? 'on' : 'off'}</Button>
    <Button variant='outline-dark' onClick={()=> setModeMouse((prev) => !prev)}>click: {modeMouse ? 'toggle candidates' : 'select cells'}</Button>
      <Button variant={actionName === HIGHLIGHT ? 'warning' : 'outline-dark'} className={`action`} onClick={() => setActionName(HIGHLIGHT)}>highlight</Button>
      <Button variant={actionName === ENTER_DIGIT ? 'primary' : 'outline-dark'} className={`action`} onClick={() => setActionName(ENTER_DIGIT)}>digits</Button>
      <Button variant={actionName === CANDIDATE ? 'info' : 'outline-dark'} className={`action`} onClick={() => setActionName(CANDIDATE)}>candidates</Button>
      <Button variant={actionName === COLOR ? 'danger' : 'outline-dark'} className={`action`} onClick={() => setActionName(COLOR)}>colors</Button>
      <Button variant={actionName === DIFFICULTY ? 'success' : 'outline-dark'} className={`action`} onClick={() => setActionName(DIFFICULTY)}>difficulties</Button>
      <div className='controls-grid'>
        {
          iter(9,1).map((index) => (
            <button
              key={'btn-'+index} 
              id={'btn-'+index} 
              className='controls-grid-btn' 
              onClick={() => actionFunction(index)}
              style={controlsGridStyles(index)}
              > <div>{index}</div>
            </button>
          ))
        }
      </div>
      <Button variant='outline-dark' id='btn-clear' onClick={() => actionFunction(0)}>clear</Button>
      <Button variant='outline-primary' id='shuffle' onClick={() => shuffle()}><img src={shuffleSvg} alt=""/></Button>
    </div>
    <div id='debug-panel' style={{border:'solid black 3px',padding:'0.5rem',margin:'0.5rem'}}>
      <div style={{gridArea:'1/1/1/4'}}><h3>Debug Panel</h3></div>
      <Button variant='outline-danger' >Solve Game (debug)</Button>
      <Button variant='outline-success' >New Example Game</Button>
    </div>
  </>
  )
}

