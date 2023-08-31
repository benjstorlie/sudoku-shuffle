import React, { createContext, useContext, useState,
  // eslint-disable-next-line
  Dispatch, SetStateAction
} from 'react';

// import things for communication with server
import { useMutation } from '@apollo/client';
import { ADD_GAME, UPDATE_GAME } from './mutations';

// import game actions from game utils, to be able to pass them along as game context props.
import { 
  // eslint-disable-next-line
  Cell,
  blankGameArray,
  enterDigitHandler, 
  toggleCandidateHandler,
  toggleSelectedHandler,
  enterColorHandler,
  shuffleHandler
} from './gameUtils'

/**
 * *TODO* Make sure everything being included in the game context is included here, and add a description
 * - it's confusing, because it would be nice if the descriptions from where they originally got defined got passed along
 * - but this is at least a short description that can be read in the other files that use {@linkcode useGameContext}
 * @typedef GameContextProps
 * @prop {Cell[][]} gameArray
 * @prop {Dispatch<SetStateAction<Cell[][]>>} setGameArray
 * @prop {string[]} selected - selected cells, written as `R${row}C${col}` strings
 * @prop {Dispatch<SetStateAction<string[]>>} setSelected
 * @prop {number} highlightedDigit
 * @prop {Dispatch<SetStateAction<number>>} setHighlightedDigit
 * @prop {boolean} modeMultiselect
 * @prop {Dispatch<SetStateAction<boolean>>} setModeMultiselect
 * @prop {boolean} modeAuto
 * @prop {Dispatch<SetStateAction<boolean>>} setModeAuto
 * @prop {boolean} modeMouse - if false, primary click selects cells, if true, primary click toggles candidates
 * @prop {Dispatch<SetStateAction<boolean>>} setModeMouse - if false, primary click selects cells, if true, primary click toggles candidates
 * @prop {string} lastSelected
 * @prop {(digit: number) => void} enterDigit
 * @prop {(color: string) => void} enterColor
 * @prop {(candidate: number, cellRef?:string) => void} toggleCandidate - The optional cellRef parameter is so you don't have to wait for a cell to be added to the selected list.
 * @prop {(cell: string, force?: boolean) => void} toggleSelected - if included, if force is true, this cell will be selected, if force is false, it will not
*/

// Initialize new context for game
const GameContext = createContext();

/**
 * A custom hook to provide immediate usages of the game context in other components
 * @returns {GameContextProps}
*/ 
export const useGameContext = () => useContext(GameContext)

/**
 * GameProvider component that holds initial state, returns provider component
 */
export default function GameProvider( {children}) {
  
  // ****** define useState hooks ********

  const [gameArray , setGameArray] = useState(blankGameArray());
  const [selected, setSelected] = useState(['R0C0']);
  const [highlightedDigit, setHighlightedDigit] = useState(0);
  const [modeMultiselect, setModeMultiselect] = useState(false);
  const [modeAuto, setModeAuto] = useState(false);
  const [modeMouse, setModeMouse] = useState(false);
  const [gameId, setGameId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  // ***** define GraphQL hooks

  const [addGame] = useMutation(ADD_GAME)
  const [updateGame] = useMutation(UPDATE_GAME);

  // ***** start definition of functions or anything else to pass as game context props

  /** the last selected cell is the first cell in the list of selected cells, or, if there are no cells selected, it will just give an empty string
   * @type {string} */
  const lastSelected = selected[0] || '';
  const enterDigit = enterDigitHandler(gameArray,setGameArray,selected);
  const enterColor = enterColorHandler(gameArray,setGameArray,selected);
  const toggleCandidate = toggleCandidateHandler(gameArray,setGameArray, selected, modeMultiselect);
  const toggleSelected = toggleSelectedHandler(setSelected, modeMultiselect);
  const shuffle = shuffleHandler(gameArray,setGameArray);

  /** @type {GameContextProps} */
  const contextProps = {
      gameArray,
      setGameArray,
      selected,
      setSelected,
      highlightedDigit,
      setHighlightedDigit,
      modeMultiselect,
      setModeMultiselect,
      modeAuto,
      setModeAuto,
      modeMouse,
      setModeMouse,
      toggleCandidate,
      enterDigit,
      toggleSelected,
      lastSelected,
      enterColor,
      shuffle
    }

  return (
    <GameContext.Provider value = { contextProps }>
      { children }
    </GameContext.Provider>
  )
}