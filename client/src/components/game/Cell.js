import React from 'react';
import { iter } from '../../utils/gameUtils';
import { useGameContext,
  // eslint-disable-next-line
   GameContextProps 
  } from '../../utils/GameContext';



export default function Cell({cellRef, row, col}) {

  /** @type {GameContextProps} */
  const { 
    gameArray,
    highlightedDigit, 
    selected,
    modeMouse, // if false, primary click selects cells, if true, primary click toggles candidates
    toggleSelected,
    toggleCandidate,
  } = useGameContext();

  const {value,candidates,color} = gameArray[row][col];
  const isHighlighted = (!value && candidates.has(highlightedDigit));
  const isSelected = selected.includes(cellRef);

  const styles = {
    /** @type {React.CSSProperties} */
    cell: {},
    /** 
     * Style object for candidates
     * @param {number} num - 0-indexed candidate number
     * @returns {React.CSSProperties}
     */
    candidate: (num) => {
      const style = {
        gridRow: (Math.floor((num-1)/3) + 1) + ' / span 1',
        gridColumn: ((num-1) % 3 + 1) + ' / span 1',
      }
      if (candidates.has(num)) {
        style.color = 'var(--candidate-color)'
      }
      return style;
    }
  }

  if (color) {
    styles.cell.backgroundColor = color
  }

  /** @type {(e:MouseEvent) => void} */
  function onCellClick() {
    if (!modeMouse  || value) {
      toggleSelected(cellRef);
    }
  }

  /** @returns {(e:MouseEvent) => void} */
  function onCandidateClick(num) {

    return ((e) => {
      if (modeMouse && !value) {
        console.log('candidate click')
        toggleSelected(cellRef,true);
        toggleCandidate(num,cellRef);
        e.stopPropagation();
      }
    });
  }

  return (
    <div id={cellRef} className={`cell ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`} style={styles.cell} onClick={onCellClick}>
        <div className={`digit ${value ? 'show' : 'hide'}`}>{value}</div>
      {
        iter(9,1).map((num) => (
          <div 
            key={num}
            className={`candidate ${value ? 'hide' : 'show'} ${modeMouse ? 'hover' : ''}`} 
            style={styles.candidate(num)} 
            onClick={onCandidateClick(num)}
          >
            {num}
          </div>
        ))
      }
    </div>
  );
}