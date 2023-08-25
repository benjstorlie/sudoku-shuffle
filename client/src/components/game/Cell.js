import React, {useState} from 'react';
import './Grid.css';
import { iter, possibleCandidatesArr } from '../../utils/gameUtils'


export default function Cell({row, col}) {

  const [value, setValue] = useState(0);
  const [color, setColor] = useState('var(--sudoku-grid-bg)');
  // *TODO* use useContext to set this value
  const possibleSet = new Set([1,2,3])
  const isPossibleArr = possibleCandidatesArr(possibleSet);

  setColor(color === '' ? 'var(--sudoku-grid-bg)' : color);

  const box = 3*row + col;

  return (
    <div className="cell">
      {value ? (
        <Digit value={value} />
      ) : (
        iter(9).map((num) => (
          <Candidate 
            key={num} 
            num={num} 
            possible={isPossibleArr[num]}
            color={color} 
          />
        ))
      )}
    </div>
  );
}

function Digit({value}) {

  // in css, grid-area: 1 / 1 / 4 / 4, to fill the cell
  
  return (
    <div>{value ? value : ''}</div>
  )
}

function Candidate({num, color, possible}) {

  const row = (num-1) % 3;
  const col = (num-1 - 3*row);

  // Grid positioning
  const style = {
    gridRow: (row + 1) + ' span 1',
    gridColumn: (col + 1) + ' span 1',
    color: possible ? 'var(--candidate-color)' : color
  }

  return (
    <div style={style} >
    </div>
  )
}