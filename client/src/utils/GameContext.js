import React, { useState } from 'react';
import SudokuGrid from '../components/game/SudokuGrid'
import Controls from '../components/game/Controls';

// import game actions from game utils, to be able to pass them along as game context props.
import { 
  // eslint-disable-next-line
  Cell, GameContextProps,
  gridArr,
  enterDigitHandler, 
  toggleCandidateHandler,
  toggleSelectedHandler,
  enterColorHandler,
} from './gameUtils'

export default function Game() {
  
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
    <>
      <SudokuGrid context = {{
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
    }}
      />
      <Controls context = {{
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
    }}
      />
    </>
  )
}