import React from 'react';
import { iter } from '../../utils/gameUtils';
import { useGameContext,
  // eslint-disable-next-line
   GameContextProps 
  } from '../../utils/GameContext';



export default function Cell({row, col}) {

  /** @type {GameContextProps} */
  const { 
    valueArray,
    candidatesArray,
    colorArray, 
    highlightedDigit, 
    selected,
    toggleSelected,
    toggleCandidate,
  } = useGameContext();

  const value = valueArray[row][col];
  const candidates = candidatesArray[row][col];
  const isHighlighted = (!value && candidates.has(highlightedDigit));
  const isSelected = selected.includes(`R${row}C${col}`);

  const styles = {
    /** @type {React.CSSProperties} */
    cell: {},
    /** 
     * Style object for candidates
     * @param {number} num - 0-indexed candidate number
     * @returns {React.CSSProperties}
     */
    candidate: (num) => ({
      gridRow: (Math.floor((num-1)/3) + 1) + ' / span 1',
      gridColumn: ((num-1) % 3 + 1) + ' / span 1',
      color: candidates.has(num) ? 'var(--candidate-color)' : 'transparent',
    })
  }

  if (colorArray[row][col]) {
    styles.cell.backgroundColor = colorArray[row][col]
  }

  function onCellClick() {
    return (() => toggleSelected(`R${row}C${col}`));
  }

  // function onCandidateClick(num) {
  //   return (() => toggleCandidate(num));
  // }

  return (
    <div className={`cell ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`} style={styles.cell} onClick={onCellClick}>
        <div className={`digit ${value ? 'show' : 'hide'}`}>{value}</div>
      {
        iter(9,1).map((num) => (
          <div 
            key={num}
            className={`candidate ${value ? 'hide' : 'show'}`} 
            style={styles.candidate(num)} 
            // onClick={onCandidateClick(num)}
          >
            {num}
          </div>
        ))
      }
    </div>
  );
}