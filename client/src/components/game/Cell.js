import React from 'react';
import { iter } from '../../utils/gameUtils';
// eslint-disable-next-line
import { GameContextProps } from '../../utils/GameContext';

/**
 * @typedef CellProps
 * @prop {string} cellRef - string cell reference like, `R${row}C${col}`
 * @prop {number} row - 0-indexed cell row
 * @prop {number} col - 0-indexed cell column
 * @prop {GameContextProps} context - functions and variables passed along from Game component defined in '../../utils/GameContext'
 */

/**
 * Sudoku Cell component
 * @param {CellProps} props 
 * @returns {React.JSX.Element}
 */
export default function Cell({cellRef, row, col, context}) {

  const { 
    gameArray,
    colorArray, 
    highlightedDigit, 
    selected,
    toggleSelected,
    toggleCandidate,
  } = context;

  const {value, candidates} = gameArray[row][col];
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
    return (() => toggleSelected(cellRef));
  }

  function onCandidateClick(num) {
    return (() => toggleCandidate(num));
  }

  return (
    <div id={cellRef} className={`cell ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`} style={styles.cell} onClick={onCellClick}>
        <div className={`digit ${value ? 'show' : 'hide'}`}>{value}</div>
      {
        iter(9,1).map((num) => (
          <div 
            key={num}
            className={`candidate ${value ? 'hide' : 'show'}`} 
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