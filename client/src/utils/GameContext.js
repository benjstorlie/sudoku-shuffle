import React, { createContext, useContext, useState,
  // eslint-disable-next-line
  Dispatch, SetStateAction
 } from 'react';

// import game actions from game utils, to be able to pass them along as game context props.
import { 
  // eslint-disable-next-line
  Cell,
  blankGameArray,
  enterDigitHandler,
  toggleCandidateHandler,
  toggleSelectedHandler,
  enterColorHandler,
  loadDifficultyHandler,
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
 * @prop {(difficulty: string) => void} loadDifficulty
*/

/**
 * @typedef GameProviderProps
 * @prop {React.ReactElement} children
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
 * @param {GameProviderProps} props
 * @returns {React.JSX.Element}
 */
export default function GameProvider( {children}) {
  
  // ****** define useState hooks ********

  /** @type {[Cell[][], Dispatch<SetStateAction<Cell[][]>>]} */
  const [gameArray , setGameArray] = useState(blankGameArray());
  
  /** @type {[string[], Dispatch<SetStateAction<string[]>>]} */
  const [selected, setSelected] = useState(['R0C0']);

  /** @type {[number, Dispatch<SetStateAction<number>>]} */
  const [highlightedDigit, setHighlightedDigit] = useState(0);

  /** @type {[boolean, Dispatch<SetStateAction<boolean>>]} */
  const [modeMultiselect, setModeMultiselect] = useState(false);

  /** @type {[boolean, Dispatch<SetStateAction<boolean>>]} */
  const [modeAuto, setModeAuto] = useState(false);

  /** @type {[boolean, Dispatch<SetStateAction<boolean>>]} */
  const [modeMouse, setModeMouse] = useState(false)

  // ***** end useState definitions
  // ***** start definition of functions or anything else to pass as game context props

  /** the last selected cell is the first cell in the list of selected cells, or, if there are no cells selected, it will just give an empty string
   * @type {string} */
  const lastSelected = selected[0] || '';

  const enterDigit = enterDigitHandler(setGameArray,selected);

  const enterColor = enterColorHandler(setGameArray,selected);

  const toggleCandidate = toggleCandidateHandler(setGameArray, selected, modeMultiselect);
  
  const toggleSelected = toggleSelectedHandler(setSelected, modeMultiselect);

  const loadDifficulty = loadDifficultyHandler(setGameArray);
  
  const shuffle = shuffleHandler(setGameArray);

  return (
    <GameContext.Provider value = {{
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
      loadDifficulty,
      shuffle,
    }}>
      { children }
    </GameContext.Provider>
  )
}