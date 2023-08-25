import React, {useState} from 'react';
import { iter, possibleCandidatesArr } from '../../utils/gameUtils'


export default function Cell({row, col}) {

  // *TODO* use useContext to set these values
  // eslint-disable-next-line
  const [value, setValue] = useState(0);
  // eslint-disable-next-line
  const [possibleSet, setPossibleSet] = useState(new Set([1,2,3]));
  // eslint-disable-next-line
  const [highlighted, setHighlighted] = useState(false);
  // eslint-disable-next-line
  const [color, setColor] = useState('var(--sudoku-grid-bg)');
  // eslint-disable-next-line
  const isPossibleArr = possibleCandidatesArr(possibleSet);
  // eslint-disable-next-line
  const box = 3*row + col; // maybe this won't be used here

  const styles = {
    cell: {
      backgroundColor: color
    },
    /** 
     * Style object for candidates
     * @param {number} num - 0-indexed candidate number
     * @returns {{}}
     */
    candidate: (num) => ({
      gridRow: (Math.floor(num/3) + 1) + ' / span 1',
      gridColumn: (num % 3 + 1) + ' / span 1',
      color: isPossibleArr[num] ? 'var(--candidate-color)' : color,
    })
  }

  return (
    <div className={`cell ${highlighted ? 'highlighted' : ''}`} style={styles.cell}>
        <Digit value={value} show={!!value}/>
      {
        iter(9).map((num) => (
          <Candidate 
            key={num} 
            num={num} 
            style={styles.candidate(num)}
            show={!value}
          />
        ))
      }
    </div>
  );
}

function Digit({value, show}) {

  // in css, grid-area: 1 / 1 / 4 / 4, to fill the cell
  
  return (
    <div className={`digit ${show ? 'show' : 'hide'}`}>{value}</div>
  )
}

function Candidate({num, style, show}) {
  return (
    <div  className={`candidate ${show ? 'show' : 'hide'}`} style={style} >
      {num+1}
    </div>
  )
}