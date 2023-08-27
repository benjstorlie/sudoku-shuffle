import React, { createContext, useContext, useState } from 'react';

// import game actions from game utils, to be able to pass them along as game context props.
import { 
  // eslint-disable-next-line
  Cell, 
  gridArr,
  enterDigitHandler, 
  toggleCandidateHandler,
  toggleSelectedHandler,
  enterColorHandler,
} from './gameUtils'

/**
 * *TODO* Make sure everything being included in the game context is included here, and add a description
 * - it's confusing, because it would be nice if the descriptions from where they originally got defined got passed along
 * - but this is at least a short description that can be read in the other files that use {@linkcode useGameContext}
 * @typedef GameContextProps
 * @prop {Cell[][]} gameArray
 * @prop {React.Dispatch<React.SetStateAction<Cell[][]>>} setGameArray
 * @prop {string[]} selected - selected cells, written as `R${row}C${col}` strings
 * @prop {React.Dispatch<React.SetStateAction<string[]>>} setSelected
 * @prop {string[][]} colorArray
 * @prop {React.Dispatch<React.SetStateAction<string[][]>>} setColorArray
 * @prop {number} highlightedDigit
 * @prop {React.Dispatch<React.SetStateAction<number>>} setHighlightedDigit
 * @prop {boolean} modeMultiselect
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setModeMultiselect
 * @prop {boolean} modeAuto
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setModeAuto
 * @prop {string} lastSelected
 * @prop {(digit: number) => void} enterDigit
 * @prop {(color: string) => void} enterColor
 * @prop {(candidate: number) => void} toggleCandidate
 * @prop {(cell: string, force?: boolean) => void} toggleSelected
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

  /** @type {[Cell[][], React.Dispatch<React.SetStateAction<Cell[][]>>]} */
  const [gameArray , setGameArray] = useState(
    gridArr({
      candidates: new Set([]),
      value: 0,
    })
  );
  
  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [selected, setSelected] = useState(['R0C0']);

  /** @type {[string[][], React.Dispatch<React.SetStateAction<string[][]>>]} */
  const [colorArray, setColorArray] = useState(gridArr(''));

  /** @type {[number, React.Dispatch<React.SetStateAction<number>>]} */
  const [highlightedDigit, setHighlightedDigit] = useState(0);

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [modeMultiselect, setModeMultiselect] = useState(false);

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [modeAuto, setModeAuto] = useState(false);

  // ***** end useState definitions
  // ***** start definition of functions or anything else to pass as game context props

  /** the last selected cell is the first cell in the list of selected cells, or, if there are no cells selected, it will just give an empty string
   * @type {string} */
  const lastSelected = selected[0] || '';

  const enterDigit = enterDigitHandler(setGameArray,selected);

  const enterColor = enterColorHandler(setColorArray,selected);

  const toggleCandidate = toggleCandidateHandler(setGameArray, selected);
  
  const toggleSelected = toggleSelectedHandler(setSelected, modeMultiselect);

  return (
    <GameContext.Provider value = {{
      gameArray,
      setGameArray,
      selected,
      setSelected,
      colorArray,
      setColorArray,
      highlightedDigit,
      setHighlightedDigit,
      modeMultiselect,
      setModeMultiselect,
      modeAuto,
      setModeAuto,
      toggleCandidate,
      enterDigit,
      toggleSelected,
      lastSelected,
      enterColor,
    }}>
      { children }
    </GameContext.Provider>
  )
}