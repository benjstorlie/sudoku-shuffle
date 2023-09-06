import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { iter } from '../../utils/gameUtils';
import { useGameContext } from '../../utils/GameContext';
import './Controls.css';
// eslint-disable-next-line
import Timer from './Timer'
import DebugPanel from './DebugPanel';
import shuffleSvg from './shuffle.svg'
import MessageBox from './MessageBox';

// Of course, it would be super fun to allow the user to modify these colors
// This current list is just random, so it can be changed to something better
// Have to make sure that colorList[0] is empty, because then that can be assigned to the 'clear' button
const colorList = ['','rgb(204, 0, 41)', '#33FF57', '#3366FF', '#FF33C8', '#33C8FF', '#FF9433', 'rgb(105, 0, 204)', 'rgb(136, 204, 0)', 'rgb(187, 0, 204)'];

const HIGHLIGHT = 'highlight';
const ENTER_DIGIT = 'enterDigit';
const COLOR = 'enterColor';
const CANDIDATE = 'toggleCandidate';

export default function Controls() {
  
  const { 
    enterDigit,
    enterColor,
    toggleCandidate,
    clearCandidates,
    fillCandidates,
    setHighlightedDigit,
    highlightedDigit, 
    modeAuto,
    setModeAuto,
    modeMouse,
    setModeMouse,
    modeMultiselect,
    setModeMultiselect,
    selected, setSelected,
    shuffle, isSolved
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

  // fill in all candidates if auto mode gets turned on
  useEffect(() => {
    if (modeAuto) {
      fillCandidates({all:true})
    }
  },[modeAuto,fillCandidates])

  /**
   * Conditonal styling object for controls grid buttons
   * @param {number} index 
   * @returns {React.CSSProperties}
   */
  const controlsGridStyles = (index) => {
    switch (actionName) {
      case HIGHLIGHT:
        if (index && index === highlightedDigit) {
          return {backgroundColor: 'var(--highlight-color)'}
        }
        break;
      case ENTER_DIGIT:
        return {fontWeight:'bold', fontSize:'30px'}
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

  const actionFunction = useCallback(async function(index) {
    //if (!isSolved) {
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
          } else {
            clearCandidates();
          }
          break;
        default:
          return;
      } 
    //}
  },[actionName,enterColor,enterDigit,setHighlightedDigit,toggleCandidate,clearCandidates])

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
  }, [actionFunction,setModeAuto,setModeMouse,setModeMultiselect]); // Empty dependency array (except for the included functions) means this effect runs once after the initial render

  const selectAll = () => {
    let cellRefList = Array(81);
    for (let r=0;r<9;r++) {
      for (let c=0;c<9;c++) {
        cellRefList[9*r+c]=`R${r}C${c}`;
      }
    }
    setSelected(cellRefList);
  }

  const clearSelection = () => {
    setSelected([]);
  }

  return (
    <>
    <div id='controls'>
    <Button variant='outline-dark' onClick={()=> setModeMultiselect((prev) => !prev)}>multi-select: {modeMultiselect ? 'on' : 'off'}</Button>
    <Button disabled variant='outline-dark' onClick={()=> setModeAuto((prev) => !prev)}>auto-solve: {modeAuto ? 'on' : 'off'}</Button>
    <Button variant='outline-dark' onClick={()=> setModeMouse((prev) => !prev)}>click: {modeMouse ? 'toggle candidates' : 'select cells'}</Button>
    <ButtonGroup vertical id="action-buttons">
      <Button variant={actionName === HIGHLIGHT ? 'warning' : 'outline-dark'} className={`action`} onClick={() => setActionName(HIGHLIGHT)}>highlight</Button>
      <Button variant={actionName === ENTER_DIGIT ? 'primary' : 'outline-dark'} className={`action`} onClick={() => setActionName(ENTER_DIGIT)}>digits</Button>
      <Button variant={actionName === CANDIDATE ? 'info' : 'outline-dark'} className={`action`} onClick={() => setActionName(CANDIDATE)}>candidates</Button>
      <Button variant={actionName === COLOR ? 'danger' : 'outline-dark'} className={`action`} onClick={() => setActionName(COLOR)}>colors</Button>
    </ButtonGroup>
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
        <button id="btn-clear" style={controlsGridStyles(0)} onClick={() => actionFunction(0)}>clear</button>
      </div>
      <Button aria-label="shuffle" variant='outline-primary' id='shuffle' onClick={() => (!isSolved && shuffle())}><img src={shuffleSvg} alt="shuffle icon"/><b>Shuffle!</b></Button>
      <Button variant='outline-dark' onClick={() => fillCandidates({all:true})}>Fill in all candidates</Button>
      <ButtonGroup vertical style={{gridRowEnd:'span 2'}}>
      <Button variant='outline-dark' onClick={clearSelection}>Clear Selection</Button>
      <Button variant='outline-dark' onClick={selectAll}>Select All</Button>
      </ButtonGroup>
      <MessageBox />
    </div>
    <DebugPanel />
  </>
  )
}





