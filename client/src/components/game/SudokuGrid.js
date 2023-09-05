'use client'; // This is required by react-error-boundary see https://www.npmjs.com/package/react-error-boundary#errorboundary-component

import React from 'react';
import Cell from './Cell';
import { ErrorBoundary } from 'react-error-boundary';
import './Game.css';
import { iter } from '../../utils/gameUtils'
import { useGameContext } from '../../utils/GameContext';

export default function SudokuGrid() {

  const { overlay , difficulty, elapsedTime } = useGameContext();

  return (
    <>
    <div className='d-flex'>
      <div className='pb-2 px-2'>Difficulty: {difficulty[0].toUpperCase()+difficulty.slice(1)}</div>
      <div className='pb-2 px-2'>Move Count: {elapsedTime}</div>
      </div>
    <div id="sudoku-grid">
      <ErrorBoundary fallback={<div className="overlay">Something went wrong. 😢 <br /> Please refresh page.</div>}>
       {overlay.show && (<div className='overlay'>{overlay.message}</div>)}
      {
        iter(3).map((band) => (
          iter(3).map((stack) => (
            <Box key={3*band+stack} band={band} stack={stack}/>
          ))
        ))
      }
      </ErrorBoundary>
    </div>
    </>
  )
}

function Box({band, stack}) {
  const style = {
    gridRow: (band + 1) + '/ span 1',
    gridColumn: (stack + 1) + '/ span 1',
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