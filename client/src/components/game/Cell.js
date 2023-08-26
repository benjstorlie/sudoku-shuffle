import React, {useState} from 'react';
import { iter } from '../../utils/gameUtils';
import { useGameContext, GameContextProps } from '../../utils/GameContext';



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

  /** @type {GameContextProps} */
  const { 
    gameArray,
    colorArray, 
    highlightedDigit, 
  } = useGameContext();



  const styles = {
    /** @type {React.CSSProperties} */
    cell: {
      backgroundColor: color
    },
    /** 
     * Style object for candidates
     * @param {number} num - 0-indexed candidate number
     * @returns {React.CSSProperties}
     */
    candidate: (num) => ({
      gridRow: (Math.floor(num/3) + 1) + ' / span 1',
      gridColumn: (num % 3 + 1) + ' / span 1',
      color: possibleSet.has(num) ? 'var(--candidate-color)' : color,
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

/**
 * Candidate Element
 * @param {{num:number,style: React.CSSProperties, show: boolean}} CandidateProps
 * @returns {React.JSX.Element}
 */
function Candidate({num, style, show}) {
  return (
    <div  className={`candidate ${show ? 'show' : 'hide'}`} style={style} >
      {num+1}
    </div>
  )
}