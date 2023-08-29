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
 * Returns a rectangular matrix filled with copies of the first argument.
 * @param {*} item - what to fill the arrays with
 * @param {number} rows - default 9, number of rows
 * @param {number} cols - defaults to a square matrix, number of columns.
 * @returns {*[][]}
 * @example
 * console.log( gridArr(0) ) // Expected output: 9x9 matrix of 0's
 * console.log( gridArr('',10) ) // Expected output: 10x10 matrix of empty strings
 * console.log( gridArr({},3,6) ) // Expected output: 3 rows of 6 filled with empty objects
 */
export function gridArr(item,rows=9,cols=rows) {
  const arr = [];
  for (let r=0 ; r < rows; r++) {
    arr[r] = [];
    for (let c=0 ; c < cols; c++) {
      arr[r][c] = item;
    }
  }
  return arr;
}

export function blankCandidatesArray() {
  const arr = [];
  for (let r=0 ; r < 9; r++) {
    arr[r] = [];
    for (let c=0 ; c < 9; c++) {
      arr[r][c] = new Set([]);
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
 * @param {React.Dispatch<React.SetStateAction<number[][]>>} setValueArray - set state function for the gameArray
 * @param {string[]} selected - currently selected cells
 * @returns {(digit: number) => void}
 */
export function enterDigitHandler(setValueArray,selected) {
  return ( (digit) => {
    setValueArray((prevValueArray) => {
      // Create shallow copy of previous gameArray
      const updatedArray = prevValueArray.map((rows) => [...rows]);

      for (const cell of selected) {
        updatedArray[cell[1]][cell[3]] = digit;
      }

      return updatedArray;
    })
  })
}

/**
 * Change the color for every cell that is selected.
 * - data held in `colorArray`
 * - string could be '', which would 
 * @param {React.Dispatch<React.SetStateAction<string[][]>>} setColorArray - set state function for the colorArray
 * @param {string[]} selected - currently selected cells
 * @returns {(color: string) => void}
 */
export function enterColorHandler(setColorArray,selected) {
  return ( (color) => {
    setColorArray((prevColorArray) => {
      // Create shallow copy of previous colorArray
      const updatedArray = prevColorArray.map((rows) => [...rows]);

      for (const cell of selected) {
        updatedArray[cell[1]][cell[3]] = color;
      }

      return updatedArray;
    })
  })
}

/**
 * Goes through the selected cells and toggles the inclusion of the given candidate.
 * - If any of the cells includes the candidate, then it will be removed, otherwise added.
 * @param {React.Dispatch<React.SetStateAction<Set[][]>>} setGameArray - set state function for the gameArray
 * @param {string[]} selected - currently selected cells
 * @param {boolean} modeMultiselect - if true, multi-select on, if false, single-select
 * @returns {(candidate: number, cellRef?:string) => void} - The optional cellRef parameter is so you don't have to wait for a cell to be added to the selected list.
*/
export function toggleCandidateHandler(setCandidatesArray, selected,modeMultiselect) {
  return ( (candidate, cellRef) => {
    if (cellRef && !modeMultiselect) {
      setCandidatesArray((prevCandidatesArray) => {
        // Create shallow copy of previous gameArray
        const updatedArray = prevCandidatesArray.map((rows) => [...rows]);
        if (prevCandidatesArray[cellRef[1]][cellRef[3]].has(candidate)) {
          updatedArray[cellRef[1]][cellRef[3]].delete(candidate)
        } else {
          updatedArray[cellRef[1]][cellRef[3]].add(candidate)
        }
        console.log('cellRef && !modeMultiSelect',cellRef,updatedArray[cellRef[1]][cellRef[3]])
        return updatedArray;
      });
    } else {
      setCandidatesArray((prevCandidatesArray) => {
        // Create shallow copy of previous gameArray
        const updatedArray = prevCandidatesArray.map((rows) => [...rows]);
        if (cellRef && !selected.includes(cellRef)) {
          selected = [cellRef, ...selected];
        }
        /**
         * A boolean for whether the candidates should be removed or added in all cells
         * - If any of the cells includes the candidate, then it will be removed.
         * @type {boolean}
         */
        const force = !selected.some((cell) =>
          prevCandidatesArray[cell[1]][cell[3]].has(candidate)
        );
        for (const cell of selected) {
          const row = cell[1];
          const col = cell[3];
          const updatedCandidates = new Set(updatedArray[row][col]) ;
    
          if (force) {
            updatedCandidates.add(candidate);
          } else {
            updatedCandidates.delete(candidate);
          }
    
          updatedArray[row][col] = updatedCandidates;
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

