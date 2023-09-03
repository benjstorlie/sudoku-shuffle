

import React from 'react';
import Cell from './Cell';
import './Game.css';
import { iter } from '../../utils/gameUtils'

export default function SudokuGrid() {

  return (
    <div id="sudoku-grid">
      {
        iter(3).map((band) => (
          iter(3).map((stack) => (
            <Box key={3*band+stack} band={band} stack={stack}/>
          ))
        ))
      }
    </div>
  )
}

function Box({band, stack}) {
  const style = {
    gridRow: (band + 1) + ' span 1',
    gridColumn: (stack + 1) + ' span 1',
  }
  return (
    <div style={style} className="box">
      {
        iter(3,3*band).map((row) => (
          iter(3,3*stack).map((col) => (
            <Cell key={`R${row}C${col}`} cellRef={`R${row}C${col}`} row={row} col={col}/>
          ))
        ))
      }
    </div>
  )
}