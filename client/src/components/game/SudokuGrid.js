import React from 'react';
import Cell from './Cell';
import './Grid.css';

export default function SudokuGrid() {

  return (
    <div id="sudoku-grid">
      {
        [0,1,2].map((band) => {
          [0,1,2].map((stack) => {
            <Box key={3*band+stack} band={band} stack={stack}/>
          })
        })
      }
      {
        [...Array(9)].map((row) => {
          [...Array(9)].map((col) => {
            (<Cell row={row} col={col}/>)
          })
        })
      }
    </div>
  )
}

function Box({band, stack}) {
  const style = {
    gap: '2px',
    gridRow: (3*band + 1) + ' span 3',
    gridColumn: (3*stack + 1) + ' span 3',
  }
  return (
    <div style={style} className="box"></div>
  )
}