// eslint-disable-next-line
import { Dispatch, SetStateAction } from "react";
import { getBoardByDifficulty } from "./api";
/**
 * @typedef Cell
 * @prop {number} value - the value the cell shows. If 0, the cell is empty and only shows candidates
 * @prop {Set<number>} candidates - the set of possible candidates for this cell. So, a set {2,5,6} could be 2, 5, or 6. If this.value != 0, then the cell will show the digit, and the candidates will be hidden
 * @prop {boolean} given - if true, this is a given digit/clue, and cannot be changed
 * @prop {number} solution - 
 * @prop {string} color - background color to show. default is empty string
 */

/**
 * Gives an array of integers to be able to map over to make repeated elements
 * @param {number} length - length of array
 * @param {number} start - first number
 * @returns {number[]}
 */
export function iter(length, start=0) {
  return Array.from({length}, (_,i) => start+i);
}

/**
 * Blank entries for each cell
 * @returns {Cell[][]}
 */
export function blankGameArray() {
  const arr = [];
  for (let r=0 ; r < 9; r++) {
    arr[r] = [];
    for (let c=0 ; c < 9; c++) {
      arr[r][c] = {
        value: 0,
        candidates: new Set(),
        color: '',
        given: false,
        solution: 0
      }
    }
  }
  return arr;
}

/**
 * Compares two cells and returns a Boolean for if they are in the same box.
 * @param {{row: number, col: number}} cell1 - first cell
 * @param {{row: number, col: number}} cell2 - second cell
 * @returns {boolean}
 */
export function isSameBox({row: row1, col: col1}, {row: row2, col: col2}) {
  return (Math.floor(row1/3) === Math.floor(row2/3)) && (Math.floor(col1/3) === Math.floor(col2/3))
}

/**
 * Change the color for every cell that is selected.
 * - data held in `colorArray`
 * - string could be '', which would indicate the cell is not colored
 * @param {Cell[][]} gameArray  
 * @param {Dispatch<SetStateAction<Cell[][]>>} setGameArray - set state function for the gameArray
 * @param {string[]} selected - currently selected cells
 * @returns {(color: string) => void}
 */
export function enterColorHandler(gameArray,setGameArray,selected) {
  return ( (color) => {
    // Create shallow copy of previous gameArray
    const updatedArray = gameArray.map((rows) => [...rows]);

    for (const [,row,,col] of selected) {
      updatedArray[row][col].color = color;
    }

    setGameArray(updatedArray);
  })
}

/**
 * Goes through the selected cells and toggles the inclusion of the given candidate.
 * - If any of the cells includes the candidate, then it will be removed, otherwise added.
 * @param {Cell[][]} gameArray 
 * @param {string[]} selected - currently selected cells
 * @param {boolean} modeMultiselect - if true, multi-select on, if false, single-select
 * @param {number} candidate - candidate number to toggle
 * @param {string} [cellRef] - cell to make sure to include, this scenario comes up when toggling a candidate by clicking in the cell itself.
 * @returns {Cell[][]} updatedArray
*/
export function toggleCandidateHandler(gameArray,selected,modeMultiselect,candidate,cellRef) {
  // Create shallow copy of previous gameArray
  const updatedArray = gameArray.map((rows) => [...rows]);
  if (cellRef && !modeMultiselect) {
    // 'if cellRef' means that the user clicked on the grid itself. And, since it's also in single-select mode, that means that the result will be that the cell clicked on will be the only cell selected, AND the only cell whose candidates get updated.
    const [,row,,col] = cellRef;
    if (gameArray[row][col].candidates.has(candidate)) {
      updatedArray[row][col].candidates.delete(candidate)
    } else {
      updatedArray[row][col].candidates.add(candidate)
    }
  } else {
    if (cellRef && !selected.includes(cellRef)) {
      // This should not change the actual selected array values.
      selected = [cellRef, ...selected];
    }
    /**
     * A boolean for whether the candidates should be removed or added in all cells
     * - If any of the cells includes the candidate, then it will be removed.
     * @type {boolean}
     */
    const force = !selected.some(([,row,,col]) =>
      gameArray[row][col].candidates.has(candidate)
    );
    for (const [,row,,col] of selected) {
      if (force) {
        updatedArray[row][col].candidates.add(candidate);
      } else {
        updatedArray[row][col].candidates.delete(candidate);
      }
    }
    if (cellRef) {console.log(updatedArray[cellRef[1]][cellRef[3]])}
  }
  return updatedArray
}

/**
 * toggles the selected status of the given cell
 * @param {Dispatch<SetStateAction<string[]>>} setSelected - set state function for array of selected cells
 * @param {boolean} modeMultiselect - state of multiselect mode
 * @returns {(cell: string, force?: boolean) => void}
 */
export function toggleSelectedHandler(setSelected, modeMultiselect) {
  if (modeMultiselect) {
    return (cell, force) => {
      // Multi-select mode behavior
      setSelected((prevSelected) => {
        if (force === false || (force !== true && prevSelected.includes(cell))) {
          return prevSelected.filter((selectedCell) => selectedCell !== cell);
        } else if (force === true) {
          return [cell, ...prevSelected.filter((selectedCell) => selectedCell !== cell)];
        } else {
          return [cell, ...prevSelected];
        }
      });
    };
  } else {
    return (cell, force) => {
      // single-select mode behavior
      setSelected((prevSelected) => {
        if (force === false || (force !== true && prevSelected.includes(cell))) {
          return prevSelected.filter((selectedCell) => selectedCell !== cell);
        } else {
          return [cell];
        }
      });
    };
  }
}

/**
 * Fisher-Yates Shuffle: returns an array to be used to permute the digits themselves within the cells. The first entry is always 0, since 0 represents a cell without a value
 * @returns {number[]} 
 * @example
 * [0, 4, 6, 5, 7, 2, 9, 1, 3, 8]
 * [0, 4, 2, 7, 5, 3, 6, 1, 8, 9]
 * [0, 2, 9, 8, 3, 5, 4, 7, 6, 1]
 */
const permuteDigits = () => {
  const a = [1,2,3,4,5,6,7,8,9];

  for (let i = 0 ; i < 8 ; i++) {
    let j = i + Math.floor((9-i)*Math.random());
    [a[i], a[j]] = [a[j], a[i]] // swap the i-th and j-th entries
  }
  return [0,...a];
}

// ************  Permutation functions to use in exported shuffling function *******

/**
 * Fisher-Yates Shuffle: returns an array that permutes either all the rows or all the columns. It permutes each band within themselves, and then permutes all the bands.
 * @returns {number[]} 
 * @example
 * [0,2,1,9,7,8,3,5,4]
 * [3,4,5,1,0,2,7,8,9]
 * [9,8,7,5,3,4,0,1,2]
 */
const permuteBands = () => {
  const a = [0,1,2,3,4,5,6,7,8];

  for (let i = 0 ; i < 2 ; i++) {
    let j = i + Math.floor((3-i) * Math.random());
    [a[i], a[j]] = [a[j], a[i]] // swap the i-th and j-th entries
    j = 3+i + Math.floor((3-i) * Math.random());
    [a[3+i], a[j]] = [a[j], a[3+i]] 
    j = 6+i + Math.floor((3-i) * Math.random());
    [a[6+i], a[j]] = [a[j], a[6+i]] 
  }

  for (let n = 0 ; n < 2 ; n++) {
    let m = n + Math.floor((3-n) * Math.random());
    [a[3*n], a[3*m]] = [a[3*m], a[3*n]];
    [a[3*n+1], a[3*m+1]] = [a[3*m+1], a[3*n+1]];
    [a[3*n+2], a[3*m+2]] = [a[3*m+2], a[3*n+2]];
  }
  return a;
}

/**
 * Shuffles the rows and columns around, and also permutes the digits, resulting in an automorphic game to the first.
 * @param {Cell[][]} gameArray  
 */
export function shuffleHandler(gameArray) {

  const Tr = permuteBands();
  const Tc = permuteBands();
  const Z = permuteDigits();
  const transpose = Math.random() < 0.5;
  
  const updatedArray = blankGameArray();
  for (let row = 0 ; row < 9 ; row++ ) {
    for (let col = 0 ; col < 9 ; col++ ) {
      let newRow = transpose ? Tc[col] : Tr[row];
      let newCol = transpose ? Tr[row] : Tc[col];
      let cell = { ...gameArray[row][col]};
      let newCandidates = new Set();
      for (const entry of cell.candidates.values()) {
        newCandidates.add(Z[entry]);
      }
      updatedArray[newRow][newCol] = {
        ...cell,
        value: Z[cell.value],
        solution: Z[cell.solution],
        candidates: newCandidates,
      }
    }
  }
  return updatedArray;

}


function isArrayFilled(sudokuArray) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!sudokuArray[row][col].value) {
        return false;
      }
    }
  }
  return true;
}

/**
 * To be run after any digits are entered.
 * - If array is filled, but solution is incorrect, an error message will be given
 * @param {Cell[][]} sudokuArray - Array to test
 * @returns {isSolved: boolean, message?: string} 
 * @example
 * const { isCorrect, error } = isSolutionCorrect(sudokuArray);
 * error ? setMessage(error) : ( isCorrect ? setIsSolved(true) : null )
 */
export function isSolutionCorrect(sudokuArray) {
  const isFilled = isArrayFilled(sudokuArray);
  if (isFilled) {
    let isCorrect = true;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!sudokuArray[row][col].value) {
          isCorrect = false;
          break;
        }
      }
    }
    return isCorrect ? { isCorrect } : { isCorrect, error: 'Solution is incorrect. Try again.' }
  } else {
    return { isCorrect: false }
  }
}
