import React from 'react';
import Cell from './Cell';
import './Grid.css';
import { iter } from '../../utils/gameUtils'
  // eslint-disable-next-line
import { GameContextProps } from '../../utils/gameUtils';

/**
 * Positioning for boxes within the 3x3 sudoku grid
 * @param {number} band - 0-indexed horizontal band
 * @param {number} stack - 0-indexed vertical stack
 * @returns {React.CSSProperties}
 */
const boxStyle = (band,stack) => ({
  gridRow: (band + 1) + ' span 1',
  gridColumn: (stack + 1) + ' span 1',
})

/**
 * Sudoku Grid component
 * @param {{context: GameContextProps}} props 
 * @returns {React.JSX.Element}
 */
export default function SudokuGrid( {context} ) {

  return (
    <div id="sudoku-grid">
      {
        iter(3).map((band) => (
          iter(3).map((stack) => (
            <div key={`box-${3*band+stack}`} style={boxStyle(band,stack)} className="box">
              {
                iter(3,3*band).map((row) => (
                  iter(3,3*stack).map((col) => (
                    <Cell key={`R${row}C${col}`} cellRef={`R${row}C${col}`} row={row} col={col} context={context}/>
                  ))
                ))
              }
            </div>
          ))
        ))
      }
    </div>
  )
}