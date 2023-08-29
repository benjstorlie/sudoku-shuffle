import React from 'react'

/**
 * @typedef Cell
 * @prop {number} value - the value the cell shows. If 0, the cell is empty and only shows candidates
 * @prop {Set<number>} candidates - the set of possible candidates for this cell. So, a set {2,5,6} could be 2, 5, or 6. If this.value != 0, then the cell will show the digit, and the candidates will be hidden
 * @prop {boolean} given - if true, this is a given digit/clue, and cannot be changed
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

export function blankGameArray() {
  const arr = [];
  for (let r=0 ; r < 9; r++) {
    arr[r] = [];
    for (let c=0 ; c < 9; c++) {
      arr[r][c] = {
        value: 0,
        candidates: new Set([]),
        color: '',
        given: false,
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
 * Change the value for every cell that is selected.  
 * - Goes through the selected cells and changes their value to the given digit
 * - digit could be 0, which would just empty the cells
 * @param {React.Dispatch<React.SetStateAction<Cell[][]>>} setGameArray - set state function for the gameArray
 * @param {string[]} selected - currently selected cells
 * @returns {(digit: number) => void}
 */
export function enterDigitHandler(setGameArray,selected) {
  return ( (digit) => {
    setGameArray((prevArray) => {
      // Create shallow copy of previous gameArray
      const updatedArray = prevArray.map((rows) => [...rows]);

      for (const cell of selected) {
        updatedArray[cell[1]][cell[3]].value = digit;
      }

      return updatedArray;
    })
  })
}

/**
 * Change the color for every cell that is selected.
 * - data held in `colorArray`
 * - string could be '', which would 
 * @param {React.Dispatch<React.SetStateAction<Cell[][]>>} setGameArray - set state function for the gameArray
 * @param {string[]} selected - currently selected cells
 * @returns {(color: string) => void}
 */
export function enterColorHandler(setGameArray,selected) {
  return ( (color) => {
    setGameArray((prevArray) => {
      // Create shallow copy of previous gameArray
      const updatedArray = prevArray.map((rows) => [...rows]);

      for (const cell of selected) {
        updatedArray[cell[1]][cell[3]].color = color;
      }

      return updatedArray;
    })
  })
}

/**
 * Goes through the selected cells and toggles the inclusion of the given candidate.
 * - If any of the cells includes the candidate, then it will be removed, otherwise added.
 * @param {React.Dispatch<React.SetStateAction<Cell[][]>>} setGameArray - set state function for the gameArray
 * @param {string[]} selected - currently selected cells
 * @param {boolean} modeMultiselect - if true, multi-select on, if false, single-select
 * @returns {(candidate: number, cellRef?:string) => void} - The optional cellRef parameter is so you don't have to wait for a cell to be added to the selected list.
*/
export function toggleCandidateHandler(setGameArray, selected,modeMultiselect) {
  return ( (candidate, cellRef) => {
    if (cellRef && !modeMultiselect) {
      // 'if cellRef' means that the user clicked on the grid itself. And, since it's also in single-select mode, that means that the result will be that the cell clicked on will be the only cell selected, AND the only cell whose candidates get updated.
      const [_,row,__,col] = cellRef;
      setGameArray((prevArray) => {
        // Create shallow copy of previous gameArray
        const updatedArray = prevArray.map((rows) => [...rows]);
        if (prevArray[row][col].candidates.has(candidate)) {
          updatedArray[row][col].candidates.delete(candidate)
        } else {
          updatedArray[row][col].candidates.add(candidate)
        }
        console.log('cellRef && !modeMultiSelect',cellRef,updatedArray[row][col])
        return updatedArray;
      });
    } else {
      setGameArray((prevArray) => {
        // Create shallow copy of previous gameArray
        const updatedArray = prevArray.map((rows) => [...rows]);
        if (cellRef && !selected.includes(cellRef)) {
          // This should not change the actual selected array values.
          selected = [cellRef, ...selected];
        }
        /**
         * A boolean for whether the candidates should be removed or added in all cells
         * - If any of the cells includes the candidate, then it will be removed.
         * @type {boolean}
         */
        const force = !selected.some(([_,row,__,col]) =>
          prevArray[row][col].candidates.has(candidate)
        );
        for (const [_,row,__,col] of selected) {
          if (force) {
            updatedArray[row][col].candidates.add(candidate);
          } else {
            updatedArray[row][col].candidates.delete(candidate);
          }
        }
        console.log('else',selected)
        if (cellRef) {console.log(updatedArray[cellRef[1]][cellRef[3]])}
        return updatedArray;
      });
    }
  });
}

/**
 * toggles the selected status of the given cell
 * @param {React.Dispatch<React.SetStateAction<string[]>>} setSelected - set state function for array of selected cells
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

