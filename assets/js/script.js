
function loadScript(url, callback) {
  var script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

function loadjquery(callback) {
  if (navigator.onLine) {
    // Online: Load jQuery from CDN
    loadScript('https://code.jquery.com/jquery-3.6.0.min.js', function() {
      // jQuery loaded, you can start using it
      console.log('jQuery loaded from CDN');
      callback();
    });
  } else {
    // Offline: Load jQuery locally
    loadScript('/assets/js/jquery-3.6.0.min.js', function() {
      // jQuery loaded, you can start using it
      console.log('jQuery loaded locally');
      callback();
    });
  }
}

loadjquery(init);

/**
 * Stack holding the last selected cells, with their respective rows and columns.  If multi-select is off, the stack just holds the last selected cell.
 * I only need the one instance, but I understand better how classes are written, than objects with methods that act on itself.
 */
class LastSelected {
  static labels = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, '0', '1', '2', '3', '4', '5', '6', '7', '8' ];
  constructor() {
    this.list = [];
  }
  get length() {
    return this.list.length;
  }
  get() {
    return this.list[this.length - 1];
  }
  pop() {
    return this.list.pop();
  }
  push({row, col, $cell}) {
    if ($cell && (LastSelected.labels.includes(row) || LastSelected.labels.includes(col))) {
      if ($cell.data("row") == row && $cell.data("col") == col) {
        if (!state.multiSelect) {
          this.list=[];
          return this.list.push({row,col,$cell});
        } else {
          return this.list.push({row,col,$cell});
        }
      } else {
        console.log("Given row and col:", row, col,"cell row and col", $cell.data("row"),$cell.data("col"));
        throw new Error("Given row and col do not match given cell.")
      }
    } else if ($cell) {
      row = $cell.data("row");
      col = $cell.data("col");
      if (!state.multiSelect) {
        this.list=[];
        return this.list.push({row,col,$cell});
      } else {
        return this.list.push({row,col,$cell});
      }
    } else if (LastSelected.labels.includes(row) && LastSelected.labels.includes(col)) {
      $cell = $( `#cell-row${row}-col${col}` );
      if (!state.multiSelect) {
        this.list=[];
        return this.list.push({row,col,$cell});
      } else {
        return this.list.push({row,col,$cell});
      }
    } else {
      console.log(arguments);
      throw new Error("Only push {row, col} or {$cell} to lastSelected.");
    }
  } 
}

/**
 * @namespace
 * @prop {Boolean} multiSelect - If true, select many cells at once.  If false, select only one cell at a time; clicking a new cell will deselect the previous.
 * @prop {Boolean} selectCellsPrimary - If true, the primary mouse button will select and deselect cells, and eliminating candidates will be impossible with clicking.  If false, selecting cells is done with a secondary click.
 * @prop {Object} highlight - conditions about highlighting
 * @prop {String[] | Number[]} highlight.list - This value changes when different candidates are highlighted.
 * @prop {String} highlight.operator - one of "single", "and", ""
 */
const state = {
  multiSelect: false,
  selectCellsPrimary: false,
  highlight: {
    list: [],

  }
};
const initialConditions = {
  showDigit: false,
  candidatesPossible: true,
}
const lastSelected = new LastSelected();

function init() {

const $sudokuGrid = $( "#sudoku-grid" );
const $controls = $( "#controls" );
const highlighterBtnGrid = $( "#highlighter-btn-grid" );
const $multiSelectBtn = $("#multi-select-btn");
const $toggleMouseTypeSelectBtn = $("#toggle-mousetype-select-btn")
const $clearCandidatesBtn = $("#clear-candidates-btn");
const $showCandidatesBtn = $("#show-candidates-btn");

$multiSelectBtn.addClass(state.multiSelect ? "btn-dark" : "btn-light");
$multiSelectBtn.on("click", toggleMultiSelect);
$toggleMouseTypeSelectBtn.addClass(state.selectCellsPrimary ? "btn-dark" : "btn-light");
$toggleMouseTypeSelectBtn.on("click", toggleMouseTypeSelect);
$clearCandidatesBtn.on("click",clearCandidates);
$showCandidatesBtn.on("click",showCandidates);

buildSudokuGrid();
const $allCells = $sudokuGrid.find(".cell");
const $allCandidates = $sudokuGrid.find(".cell .candidate");

buildHighlightButtons();

$(document).on("keydown", keyDownHandler);

// ********  define functions ********

/** event listener function for the multiselect btn
 */
function toggleMultiSelect() {
  $multiSelectBtn.toggleClass("btn-dark","btn-light");
  state.multiSelect = !state.multiSelect;
}

/**
 * returns the event handler to attach to each cell.  Attach both $cell.on("click",clickHandler($cell,"click")) and $cell.on("contextmenu",clickHandler($cell),"contextmenu")
 * @param {JQuery} $cell - the cell being the event.target
 * @param {String} mouseType - the type of mouse event this will be attached to, either "click" or "contextmenu"
 * @returns {Function}
 */
function cellMouseEventHandler($cell,mouseType) {
  const click = (mouseType === "click");
  return (function (event) {
    event.preventDefault();
    if (click ^ state.selectCellsPrimary) {
      if ($(event.target).hasClass("candidate")) {
        toggleElimination($(event.target),$cell);
      }
      selectCell($cell,true);
    } else {
      selectCell($cell)
    }
  })
}

/**
 * Toggles selection on a cell.
 * @param {JQuery} $cell - the cell to toggle select on
 * @param {Boolean} [force] - a boolean (not just truthy/falsy) value to determine whether the cell should be selected or deselected.
 * @returns {Object | Number | undefined} the result of lastSelected.push() or .pop().
 */
function selectCell($cell,force) {
  if (!state.multiSelect) {
    $allCells.removeClass("selected");
  }
  $cell.toggleClass("selected",force);
  // update lastSelected object
  if (force === true) {
    return lastSelected.push({$cell});
  } else if (force === false) {
    return lastSelected.pop();
  } else if ($cell.hasClass("selected")) {
    lastSelected.push({$cell});
  } else {
    return lastSelected.pop();
  }
}

/**
 * Toggles elimination on a candidate
 * @param {JQuery} $candidate - the candidate to toggle elimination on
 * @param {JQuery} $cell - the parent cell
 * @param {Boolean} [force] - a boolean (not just truthy/falsy) value to determine whether the candidate should be possible or eliminated.
 */
function toggleElimination($candidate,$parentCell,force) {
  const value = Number($candidate.data("value"));
  $candidate.toggleClass("possible",force);
  $candidate.toggleClass("eliminated",!force);
  let possibles = $parentCell.data("possibles");
  if (force === true) {
    possibles[value] = true;
  } else if (force === false) {
    possibles[value] = false;
  } else {
    possibles[value] = !possibles[value];
  }
}

function keyDownHandler(event) {
  const {key} = event;

}

function fillDigit($cell,key) {
  const $digit = $cell.find(".digit");
  const $candidates = $cell.find(".candidate");
  if ($cell.hasClass("show-candidates")) {
    display.show($digit);
    display.hide($candidates);
    $cell.toggleClass("show-candidates","show-digit");
  }
  $cell.data("value",key);
  $digit.data("value",key);
  $digit.text(key);
  eliminateConflicts($cell,key);
}

function deleteDigit($cell) {
  $cell.data("value","")
    .addClass("show-candidates")
    .removeClass("show-digit")
  display.hide($cell.find(".digit"));
  display.show($cell.find(".candidate"))
}

function arrowSelect(key) {
  
}

function highlightCandidatesHandler(event) {

}

function coloringHandler(event) {

}

function clearCandidates() {
  $allCandidates.removeClass("possible")
    .addClass("eliminated");
  $allCells.data("possibles",['',0,0,0,0,0,0,0,0,0]);
}

function showCandidates() {
  $allCandidates.addClass("possible")
    .removeClass("eliminated");
  $allCells.data("possibles",['',1,1,1,1,1,1,1,1,1]);
}

function toggleMouseTypeSelect() {
  state.selectCellsPrimary = !state.selectCellsPrimary;
  $toggleMouseTypeSelectBtn.toggleClass("btn-dark" , "btn-light");
  $toggleMouseTypeSelectBtn.text(state.selectCellsPrimary ? "Select Cells" : "Eliminate Candidates")
}

function eliminateConflicts($cell, value) {
  value = Number(value);
  const {block, row, col} = $cell.data();
  const $conflictCells = $allCells.filter(filterData({col,row,block},"or"));
  $conflictCells.each(function ($cell) {
    let possibles = $cell.data("possibles");
    possibles[value] = false;
    $cell.data({possibles});
    $cell.find(".candidate").filter({value})
      .addClass("eliminated")
      .removeClass("possible");
  })
}

// ************ utilities **********

/**
 * Used with the jQuery .filter() method, returns a filter function for elements with the matching data values
 * @param {Object} obj - An object of key-value pairs of data to filter for.
 * @param {String} opr - either "and" or "or".
 * @returns {Function} A function used as a test for each element in the set. this is the current DOM element.
 * 
 * Given a jQuery object that represents a set of DOM elements, the .filter() method constructs a new jQuery object from a subset of the matching elements. The supplied selector is tested against each element; all elements matching the selector will be included in the result.
 */
function filterData(obj,opr = "and") {
  if (opr === "and") {
    return ( function() {
      let match = true;
      for (const [key, value] of Object.entries(obj)) {
        match = match && $(this).data(key) === value;
        if (!match) { return false }
      }
      return true;
    })
  } else {
    return ( function() {
      let match = false;
      for (const [key, value] of Object.entries(obj)) {
        match = match || $(this).data(key) === value;
        if (match) { return true }
      }
      return true;
    })
  }
}

const display = { 
  show($el) {
    $el.addClass("show");
    $el.removeClass("hide");
  },
  hide($el) {
    $el.addClass("hide");
    $el.removeClass("show");
  }
}

// *********** build functions *************

/**
 * Attach the sudoku grid to div#sudoku-grid.
 * - Individual event functions get attached to each element
 */
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
            .data("possibles", (initialConditions.candidatesPossible ? ['',1,1,1,1,1,1,1,1,1] : ['',0,0,0,0,0,0,0,0,0,0] ))
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
                .css("gridColumn", candidateCol + 1)  // correctly positions
                .css("gridRow",candidateRow + 1)

              $cell.append($candidate);
            }
          }
          $cell.find("div").add($cell).data({row,col})
          $cell.on("click",cellMouseEventHandler($cell,"click"));
          $cell.on("contextmenu",cellMouseEventHandler($cell,"contextmenu"));
        }
      }
      $block.find("div").add($block).data({block});
    }
  }
}

function buildHighlightButtons() {

}

function buildColoringButtons() {

}


}



// // ********* Call function init ********

// init();