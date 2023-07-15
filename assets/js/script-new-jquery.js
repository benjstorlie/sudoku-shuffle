window.onload = init;

function init() {

const state = initialState({multiSelect: false, highlightedNum: "0"});
const initialConditions = {
  showDigit: false,
  candidatesPossible: true,
}
const lastSelected = initialLastSelected();

const $sudokuGrid = $( "#sudoku-grid" );
const $controls = $( "#controls" );
const highlighterBtnGrid = $( "#highlighter-btn-grid" );
const $multiSelectBtn = $("multi-select-btn");

$multiSelectBtn.addClass(state.multiSelect ? "btn-dark" : "btn-light");
$multiSelectBtn.on("click", toggleMultiSelect);

buildSudokuGrid();
const $allCells = sudokuGrid.find(".cell");
const $allCandidates = sudokuGrid.find(".cell .candidate");

buildHighlightButtons();

$(document).on("keydown", keyDownHandler);

// ********  define functions ********

/**
 * Event handler function to attach to each cell.  `$cell.on("click",selectCell($cell))`
 * @param {JQuery} $cell - the cell being the event.target
 * @returns {Function}
 */
function selectCellHandler($cell) {
  return (function (event) {
    event.preventDefault();
    selectCell($cell);
  })
}

/**
 * Toggles selection on a cell.
 * @param {JQuery} $cell - the cell to toggle select on
 * @param {Boolean} state - a boolean (not just truthy/falsy) value to determine whether the cell should be selected or deselected.
 * @returns 
 */
function selectCell($cell,state) {
  if (!state.multiSelect) {
    $allCells.removeClass("selected");
  }
  $cell.toggleClass("selected",state);
  // update lastSelected object
  if (state === true) {
    return lastSelected.push($cell);
  } else if (state === false) {
    return lastSelected.pop();
  } else if ($cell.hasClass("selected")) {
    lastSelected.push($cell);
  } else {
    return lastSelected.pop();
  }
}

function toggleEliminationHandler($candidate,$parentCell) {

}

function toggleElimination($candidate,$parentCell) {

}

/** event listener function for the multiselect btn
 */
function toggleMultiSelect() {
  $multiSelectBtn.toggleClass("btn-dark","btn-light");
  state.multiSelect = !state.multiSelect;
}

/**
 * Used with the jQuery .filter() method, returns a filter function for elements with the matching data values
 * @param {Object} obj -An object of key-value pairs of data to filter for.
 * @returns {Function} A function used as a test for each element in the set. this is the current DOM element.
 * 
 * Given a jQuery object that represents a set of DOM elements, the .filter() method constructs a new jQuery object from a subset of the matching elements. The supplied selector is tested against each element; all elements matching the selector will be included in the result.
 */
function filterData(obj) {
  return ( function() {
    let match = true;
    for (const [key, value] of Object.entries(obj)) {
      match = match && $(this).data(key) === value;
      if (!match) { return false }
    }
    return true;
  })
}


// *** build functions ***

function buildSudokuGrid() {
  for (let bigRow=0; bigRow <3 ; bigRow++ ) {
    for (let bigCol=0; bigCol <3 ; bigCol++ ) {
      const block = 3*bigRow + bigCol;
      const $block = $("<div>")
        .attr("id","block-"+ block)
        .addClass("block");
      $sudokuGrid.append($block);

      for (let smRow=0; smRow <3 ; smRow++ ) {
        for (let smCol=0; smCol <3 ; smCol++ ) {

          const row = 3*bigRow+smRow;
          const col = 3*bigRow + bigCol;

          const $cell = $("<div>")
            .attr("id", `cell-row${row}-col${col}`)
            .addClass("cell",(initialConditions.showDigit ? "show-digit" : "show-candidates"))
            .on("contextmenu",selectCell($cell));
          $block.append($cell);

          const $digit = $("<div>")
            .addClass("digit", (initialConditions.showDigit ? "show" : "hide"))
          
          $cell.append($digit)

          for (let candidateRow=0; candidateRow <3 ; candidateRow++ ) {
            for (let candidateCol=0; candidateCol <3 ; candidateCol++ ) {
              const value = (3*candidateRow + candidateCol + 1);
              const $candidate=$("<div>")
                .text(value)
                .attr("id",`candidate-row${row}-col${col}-val${value}`)
                .addClass("candidate",(initialConditions.showDigit ? "hide" : "show"), (initialConditions.candidatesPossible ? "possible" : "eliminated"))
                .data({value})
                .css("gridColumn", candidateCol + 1)
                .css("gridRow",candidateRow + 1)
                .on("click",toggleEliminationHandler($candidate,$cell));

              $cell.appendTo($candidate);
            }
          }
          $cell.find("div").add($cell).data({row,col})
        }
      }
      $block.find("div").add($block).data({block});
    }
  }
}

// ******** initial state functions *********

function initialState({multiSelect,highlightedNum}) {
  return {
    multiSelect,
    highlightedNum
  }
}

function initialLastSelected() {
  return {
    list: [],
    length() {return this.list.length },
    labels: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, '0', '1', '2', '3', '4', '5', '6', '7', '8' ],
    get() {
      return this.list[this.length - 1];
    },
    pop() {
      if (!this.length) {
        return {row:0,col:0,cell: $( `#cell-row${row}-col${col}` )}
      } else {
        return this.list.pop();
      }
    },
    push({row, col, cell}) {
      if (cell && (this.labels.includes(row) || this.labels.includes(col))) {
        throw new Error("Only push {row, col} or {cell} to lastSelected")
      } else if (cell) {
        row = cell.data("row");
        col = cell.data("col");
        if (!state.multiSelect) {
          this.list=[];
          return this.list.push({row,col,cell});
        } else {
          return this.list.push({row,col,cell});
        }
      } else if (this.labels.includes(row) && this.labels.includes(col)) {
        cell = $( `#cell-row${row}-col${col}` );
        if (!state.multiSelect) {
          this.list=[];
          return this.list.push({row,col,cell});
        } else {
          return this.list.push({row,col,cell});
        }
      } else {
        throw new Error("Only push {row, col} or {cell} to lastSelected.");
      }
    }
  }
}

}


