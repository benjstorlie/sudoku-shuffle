import React, { useState } from 'react';
import { iter } from '../../utils/gameUtils';
import { useGameContext,
  // eslint-disable-next-line
   GameContextProps 
  } from '../../utils/GameContext';

// Of course, it would be super fun to allow the user to modify these colors
// This current list is just random, so it can be changed to something better
// Have to make sure that colorList[0] is empty, because then that can be assigned to the 'clear' button
const colorList = ['','#FF5733', '#33FF57', '#3366FF', '#FF33C8', '#33C8FF', '#FF9433', '#33FFC8', '#3394FF', '#FF3394'];


export default function Controls() {

  /** @type {GameContextProps} */
  const { 
    enterDigit,
    enterColor,
    toggleCandidate,
    setHighlightedDigit,
    // highlightedDigit, 
  } = useGameContext();

  const [ actionName, setActionName ] = useState('setHighlightedDigit');

  function actionFunction(index) {
    switch (actionName) {
      case 'setHighlightedDigit':
        setHighlightedDigit(index);
        break;
      case 'enterDigit':
        enterDigit(index);
        break;
      case 'enterColor':
        enterColor(colorList(index));
        break;
      case 'toggleCandidate':
        toggleCandidate(index);
        break;
      default:
        return;
    }
  }

  return (
    <>
      <button onClick={() => setActionName('setHighlightedDigit')}>highlight</button>
      <button onClick={() => setActionName('enterDigit')}>digits</button>
      <button onClick={() => setActionName('toggleCandidate')}>candidates</button>
      <button onClick={() => setActionName('enterColor')}>colors</button>
      <div className='controls-grid'>
        {
          iter(9,1).map((index) => (
            <button key={'btn-'+index} id={'btn-'+index} className='controls-grid-btn' onClick={() => actionFunction(index)}>{index}</button>
          ))
        }
      </div>
      <button id='btn-clear' onClick={() => actionFunction(0)}>0</button>
    </>
  )
}

