import React, {useState} from 'react';
import './Grid.css';


export default function Cell({row, col}) {

  const [value, setValue] = useState(0);

  const box = 3*row + col;

  // Grid positioning
  const style = {
    gridRow: (row + 1) + ' span 1',
    gridColumn: (col + 1) + ' span 1',
  }
  
  return (
    <div style={style} className="cell">

    </div>
  )
}

function Candidate({num}) {

  const [eliminated, setEliminated] = useState(false);

  const row = (num-1) % 3;
  const col = (num-1 - 3*row);

  // Grid positioning
  const style = {
    gridRow: (row + 1) + ' span 1',
    gridColumn: (col + 1) + ' span 1',
  }

  return (
    <div style={style} className={`candidate ${eliminated ? 'hide' : 'show'}`}>
    </div>
  )
}

function Digit({value}) {
  
  return (
    <div className={`digit ${value ? "show" : "hide"}`}>{value ? value : ''}</div>
  )
}