import React, { useState, useEffect, useCallback } from 'react';
import { iter } from '../../utils/gameUtils';
import './Controls.css';
import { useGameContext,
  // eslint-disable-next-line
   GameContextProps 
  } from '../../utils/GameContext';

// Of course, it would be super fun to allow the user to modify these colors
// This current list is just random, so it can be changed to something better
// Have to make sure that colorList[0] is empty, because then that can be assigned to the 'clear' button
const colorList = ['','#FF5733', '#33FF57', '#3366FF', '#FF33C8', '#33C8FF', '#FF9433', '#33FFC8', '#3394FF', '#FF3394'];

const HIGHLIGHT = 'highlight';
const ENTER_DIGIT = 'enterDigit';
const COLOR = 'enterColor';
const CANDIDATE = 'toggleCandidate';

export default function Controls() {

  /** @type {GameContextProps} */
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
  } = useGameContext();

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
      default:
        return {};
      }
  }

  const actionFunction = useCallback(function(index) {
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
      default:
        return;
    }
  },[actionName,enterColor,enterDigit,setHighlightedDigit,toggleCandidate])

  useEffect(() => {
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
    <div id='controls'>
    <button onClick={()=> setModeMultiselect((prev) => !prev)}>multi-select: {modeMultiselect ? 'on' : 'off'}</button>
    <button onClick={()=> setModeAuto((prev) => !prev)}>auto-solve: {modeAuto ? 'on' : 'off'}</button>
    <button onClick={()=> setModeMouse((prev) => !prev)}>click: {modeMouse ? 'toggle candidates' : 'select cells'}</button>
      <button className={`action ${actionName === HIGHLIGHT ? 'active' : ''}`} onClick={() => setActionName(HIGHLIGHT)}>highlight</button>
      <button className={`action ${actionName === ENTER_DIGIT ? 'active' : ''}`} onClick={() => setActionName(ENTER_DIGIT)}>digits</button>
      <button className={`action ${actionName === CANDIDATE ? 'active' : ''}`} onClick={() => setActionName(CANDIDATE)}>candidates</button>
      <button className={`action ${actionName === COLOR ? 'active' : ''}`} onClick={() => setActionName(COLOR)}>colors</button>
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
      <button id='btn-clear' onClick={() => actionFunction(0)}>0</button>
    </div>
  )
}

