import React, { createContext, useContext, useState } from 'react';

// import game actions from game utils, to be able to pass them along as game context props.
import { 
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
 * @prop {number[][]} valueArray
 * @prop {React.Dispatch<React.SetStateAction<number[][]>>} setValueArray
 * @prop {Set[][]} candidatesArray
 * @prop {React.Dispatch<React.SetStateAction<Set[][]>>} setCandidatesArray
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
 * @prop {boolean} modeMouse - if false, primary click selects cells, if true, primary click toggles candidates
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setModeMouse - if false, primary click selects cells, if true, primary click toggles candidates
 * @prop {string} lastSelected
 * @prop {(digit: number) => void} enterDigit
 * @prop {(color: string) => void} enterColor
 * @prop {(candidate: number, cellRef?:string) => void} toggleCandidate - The optional cellRef parameter is so you don't have to wait for a cell to be added to the selected list.
 * @prop {(cell: string, force?: boolean) => void} toggleSelected - if included, if force is true, this cell will be selected, if force is false, it will not
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

  /** @type {[number[][], React.Dispatch<React.SetStateAction<number[][]>>]} */
  const [valueArray , setValueArray] = useState(
    gridArr(0)
  );

  /** @type {[Set[][], React.Dispatch<React.SetStateAction<Set[][]>>]} */
  const [candidatesArray , setCandidatesArray] = useState(
    gridArr(new Set([]))
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

  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [modeMouse, setModeMouse] = useState(false)

  // ***** end useState definitions
  // ***** start definition of functions or anything else to pass as game context props

  /** the last selected cell is the first cell in the list of selected cells, or, if there are no cells selected, it will just give an empty string
   * @type {string} */
  const lastSelected = selected[0] || '';

  const enterDigit = enterDigitHandler(setValueArray,selected);

  const enterColor = enterColorHandler(setColorArray,selected);

  const toggleCandidate = toggleCandidateHandler(setCandidatesArray, selected, modeMultiselect);
  
  const toggleSelected = toggleSelectedHandler(setSelected, modeMultiselect);

  return (
    <GameContext.Provider value = {{
      valueArray,
      setValueArray,
      candidatesArray,
      setCandidatesArray,
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
      modeMouse,
      setModeMouse,
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