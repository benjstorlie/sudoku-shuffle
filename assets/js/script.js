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
 * @prop {Number} highlightedNum - for use while multi-highlight is under development
 * @prop {Object} highlight - conditions about highlighting
 * @prop {String[] | Number[]} highlight.list - This value changes when different candidates are highlighted.
 * @prop {String} highlight.operator - one of "single", "and", ...
 */
const state = {
  multiSelect: true,
  selectCellsPrimary: true,
  solve: true,
  highlightedNum: 0,
  highlight: {
    list: [],

  }
};
const initialConditions = {
  showDigit: false,
  candidatesPossible: false,
}
const lastSelected = new LastSelected();


loadjquery(init);

// *************** define functions **********


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

function init() {

const $sudokuGrid = $( "#sudoku-grid" );
const $controls = $( "#controls" );
const $highlighterBtnGrid = $( "#highlighter-btn-grid" );
const $coloringBtnGrid = $("#coloring-btn-grid");
const $multiSelectBtn = $("#multi-select-btn");
const $mouseTypeEliminateCandidatesBtn = $("#mousetype-eliminate-candidates-btn");
const $mouseTypeSelectCellsBtn = $("#mousetype-select-cells-btn");
const $clearCandidatesBtn = $("#clear-candidates-btn");
const $showCandidatesBtn = $("#show-candidates-btn");
const $autoSolveBtn = $("#auto-solve-btn");

$multiSelectBtn.addClass(state.multiSelect ? "btn-dark" : "btn-light");
$multiSelectBtn.on("click", toggleMultiSelect);
$clearCandidatesBtn.on("click",clearCandidates);
$showCandidatesBtn.on("click",showCandidates);

$mouseTypeEliminateCandidatesBtn.on("click",mouseTypeEliminateCandidates);
$mouseTypeSelectCellsBtn.on("click",mouseTypeSelectCells);
if (state.selectCellsPrimary) {
  $mouseTypeEliminateCandidatesBtn.addClass("btn-light").removeClass("btn-dark").attr("disabled",false);
  $mouseTypeSelectCellsBtn.addClass("btn-dark").removeClass("btn-light").attr("disabled",true);
} else {
  $mouseTypeSelectCellsBtn.addClass("btn-light").removeClass("btn-dark").attr("disabled",false);
  $mouseTypeEliminateCandidatesBtn.addClass("btn-dark").removeClass("btn-light").attr("disabled",true);
}
$autoSolveBtn.addClass(state.solve ? "btn-dark" : "btn-light");
$autoSolveBtn.on("click",() => {state.solve=!state.solve; $autoSolveBtn.toggleClass("btn-light btn-dark")})

buildSudokuGrid();
const $allCells = $sudokuGrid.find(".cell");
const $allCandidates = $sudokuGrid.find(".cell .candidate");

buildHighlightButtons();
buildColoringButtons();

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
      selectCell($cell,true);
      if ($(event.target).hasClass("candidate")) {
        if (state.multiSelect) {
          toggleEliminationHandler($(event.target).data("value"),$allCells.filter(".selected"));
        } else {
          toggleEliminationHandler($(event.target).data("value"),$cell);
        }
      }
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

function toggleEliminationHandler(value,$cells) {
  const $candidates = $cells.find(".candidate.val"+value);
  if ($cells.length > 1) {
    if ($candidates.filter(".eliminated").length) {
      toggleElimination(value,$candidates,$cells,true);
    } else {
      toggleElimination(value,$candidates,$cells,false);
    }
  } else {
    toggleElimination(value,$candidates,$cells);
  }
}

/**
 * Toggles elimination on a candidate
 * @param {JQuery} $candidate - the candidate to toggle elimination on
 * @param {JQuery} $cell - the parent cell
 * @param {Boolean} [force] - a boolean (not just truthy/falsy) value to determine whether the candidate should be possible or eliminated.
 */
function toggleElimination(value,$candidates,$cells,force) {
  if (force === true) {
    $cells.data(`possible-${value}`,true);
    $candidates.addClass("possible").removeClass("eliminated");
  } else if (force === false) {
    $cells.data(`possible-${value}`,false);
    $candidates.removeClass("possible").addClass("eliminated");
  } else {
    toggleElimination(value,$candidates,$cells,!$cells.data(`possible-${value}`))
  }
  highlightCandidates();
}

function possiblesList($cell) {
  let list = [];
  for (i=1;i<=9;i++) {
    if ($cell.data(`possible-${i}`)) {
      list.push(i)
    }
  }
  return list
}

function keyDownHandler(event) {
  const {key} = event;
  if (key >= '1' && key <= '9') {
    fillDigit(key);
    highlightCandidates();
  } else if (key === "Backspace" || key === "Delete") {
    deleteDigit();
  // } else if (["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"].includes(key)) {
  //   arrowSelect(key);
  }
}

function fillDigit(key) {
  const $cells = $(".cell.selected");
  try {
  const $cellsC = $(".cell.selected.show-candidates");
  const $digits = $(".cell.selected .digit")

  display.show($cellsC.find(".digit"));
  display.hide($cellsC.find(".candidate"));
  $cellsC.addClass("show-digit").removeClass("show-candidates");
  $cells.attr("data-value",key)
    .removeClass("highlighted");
  $digits.attr("data-value",key);
  $digits.text(key);
  } catch {
    console.log("error filling cells",$cells)
  }
  try {
    if (state.solve) {
      $cells.each((index,cell) => {eliminateConflicts($(cell),key)})
    };
  } catch {
    console.log("error eliminating candidates")
  }
}

function deleteDigit() {
  const $cells = $(".cell.selected");
  try {
  $cells.attr("data-value","")
    .addClass("show-candidates")
    .removeClass("show-digit")
  display.hide($cells.find(".digit"));
  display.show($cells.find(".candidate"));
  } catch {
    console.log("error deleting cells",$cells);
  }
}

function arrowSelect(key) {
  
}

function highlightCandidatesHandler($button,value) {
return (function (event) {
    $highlighterBtnGrid.children().removeClass("btn-warning").addClass("btn-secondary");
    if (state.highlightedNum == value) {
      state.highlightedNum = 0;
      highlightCandidates(0);
    } else {
      state.highlightedNum = value;
      highlightCandidates(value);
      $button.addClass("btn-warning");
    }
  })
}

function highlightCandidates(value) {
  value = (value ? value : state.highlightedNum);
  $allCells.removeClass("highlighted");
  if (value) {
    $(".cell.show-candidates .candidate.possible.val"+value).parent().addClass("highlighted");
  }
}

function clearCandidates() {
  $allCandidates.removeClass("possible")
    .addClass("eliminated");
  for (i=1;i<=9;i++) {
    $allCells.data(`possible-${i}`,false);
  }
  $allCells.removeClass("highlighted"); // No candidates need to be highlighted
}

function showCandidates() {
  $allCandidates.addClass("possible")
    .removeClass("eliminated");
  for (i=1;i<=9;i++) {
    $allCells.data(`possible-${i}`,true);
  }
  if (state.highlightedNum) {
    // if any number is highlighted, all cells should be highlighted now.
    $(".cell.show-candidates").addClass("highlighted");
  }
  if (state.solve) {
    $(".cell.show-digit").each((index,cell) => eliminateConflicts($(cell),$(cell).data("value")));
  }
}

function mouseTypeSelectCells() {
  state.selectCellsPrimary = true;
  $mouseTypeEliminateCandidatesBtn.toggleClass("btn-dark btn-light").attr("disabled",false);
  $mouseTypeSelectCellsBtn.toggleClass("btn-dark btn-light").attr("disabled",true);
}

function mouseTypeEliminateCandidates(){
  state.selectCellsPrimary = false;
  $mouseTypeSelectCellsBtn.toggleClass("btn-dark btn-light").attr("disabled",false);
  $mouseTypeEliminateCandidatesBtn.toggleClass("btn-dark btn-light").attr("disabled",true);
}


function eliminateConflicts($cell, value) {
  value = Number(value);

  const {row,box,col}=$cell.data();

  // const $conflictCells = $allCells.filter(filterData({col,row,box},"or"));
  const $conflictCells = $allCells.filter(".box"+box).add($allCells.filter(".row"+row).add($allCells.filter(".col"+col)));

    $conflictCells.data("possible-"+value,false)
    $conflictCells.find(".candidate.val"+value)
      .addClass("eliminated")
      .removeClass("possible");

  if (state.highlightedNum == value) {
    highlightCandidates(value);
  }
}

// ************ utilities **********

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
      const box = 3*bigRow + bigCol;
      const $box = $("<div>")
        .attr("id","box-"+ box)
        .addClass("box","box"+box)
        .css("gridColumn", bigCol + 1)  // correctly positions
        .css("gridRow",bigRow + 1);
      $sudokuGrid.append($box);

      for (let smRow=0; smRow <3 ; smRow++ ) {
        for (let smCol=0; smCol <3 ; smCol++ ) {

          const row = 3*bigRow+smRow;
          const col = 3*bigCol + smCol;

          const $cell = $("<div>")
            .attr("id", `cell-row${row}-col${col}`)
            .data({row,col,box})
            .css("gridColumn", smCol + 1)  // correctly positions
            .css("gridRow",smRow + 1)
            .addClass(["row"+row,"col"+col,"box"+box])
            .addClass(["cell",(initialConditions.showDigit ? "show-digit" : "show-candidates")]);
          if (initialConditions.candidatesPossible) {
            for (let i = 1; i<=9 ; i++) {
              $cell.data(`possible-${i}`,true);
            }
          } else {
            for (let i = 1; i<=9 ; i++) {
              $cell.data(`possible-${i}`,false);
            }
          }
          
          $box.append($cell);

          const $digit = $("<div>")
            .addClass("digit", (initialConditions.showDigit ? "show" : "hide"))
            .data({row,col,box})
            .addClass(["row"+row,"col"+col,"box"+box])
          
          $cell.append($digit)

          for (let candidateRow=0; candidateRow <3 ; candidateRow++ ) {
            for (let candidateCol=0; candidateCol <3 ; candidateCol++ ) {
              const value = (3*candidateRow + candidateCol + 1);
              const $candidate=$("<div>")
                .text(value)
                .attr("id",`candidate-row${row}-col${col}-val${value}`)
                .addClass([
                  "candidate",
                  (initialConditions.showDigit ? "hide" : "show"),
                  (initialConditions.candidatesPossible ? "possible" : "eliminated")
                ])
                .data({row,col,box,value})
                .addClass(["val"+value,"row"+row,"col"+col,"box"+box])
                .css("gridColumn", candidateCol + 1)  // correctly positions
                .css("gridRow",candidateRow + 1)

              $cell.append($candidate);
            }
          }
          $cell.on("click",cellMouseEventHandler($cell,"click"));
          $cell.on("contextmenu",cellMouseEventHandler($cell,"contextmenu"));
        }
      }
    }
  }
}

function buildHighlightButtons() {
  for (let value=1; value<=9; value++) {
    const $button = $("<button>");
    $button.addClass("btn btn-secondary highlighter")
      .data("value",value)
      .text( value);
    $highlighterBtnGrid.append($button);
    $button.on("click",highlightCandidatesHandler($button,value));
  }  
}

function buildColoringButtons() {
  const colors = ["blue","purple","pink","red","orange","yellow","green","teal","cyan"];
  
  for (let c=0; c<colors.length; c++) {
    const $button = $("<button>");
    $button.addClass("btn coloring");
    $button.addClass(colors[c]);
    $button.data("color",colors[c]);
    $button.css("background-color",`var(--color-${colors[c]})`)
    $button.append($("<div class='hide'>8</div>")) // to make the same size as highlight buttons. TODO: change to css height
    $coloringBtnGrid.append($button);
    $button.on("click",function (event) {
      const $selected = $allCells.filter(".selected");
      for (let x=0; x<colors.length; x++) {
        if (x !== c) {$selected.removeClass(colors[x]).removeClass("colored");}
      }
      if ($selected.length === $selected.filter(`.${colors[c]}`).length) {
        $selected.removeClass(colors[c]);
      } else {
        $selected.addClass(colors[c]).addClass("colored");
      }
      $coloringBtnGrid.children().removeClass("active");
      $button.toggleClass("active");
    });
  }

  const $clear = $("<button id='clear-coloring' class='btn btn-light'>")
    .text("Clear")
    .css("grid-column-start","span 3")
    .on("click",function (event) {
      for (let x=0; x<colors.length; x++) {
        $allCells.removeClass(colors[x]).removeClass("colored");
      }
      $coloringBtnGrid.children().removeClass("active");
    })
  $coloringBtnGrid.append($clear);

}


}



// // ********* Call function init ********

// init();