
window.onload=init;

function init() { // beginning of init function

let multiSelectOn = true;
let highlightedNumber="0";

const sudokuGrid = $("#sudoku-grid");
const controls = $("#controls");
const highlighterBtnGrid = $("#highlighter-btn-grid");
const multiSelectBtn = $("#multi-select-btn");
multiSelectBtn.addClass(multiSelectOn ? "btn-dark" : "btn-light");
multiSelectBtn.on("click", toggleMultiSelect);

buildSudokuGrid();
const allCells = sudokuGrid.find(".cell");
const allCandidates = sudokuGrid.find(".cell .candidate");

buildHighlightButtons();

$(document).on("keydown", keyDownHandler);

function selectCell(event) {
  event.preventDefault();
  if (!multiSelectOn) {
    allCells.removeClass("selected");
  }
  $( event.target ).toggleClass("selected");
}

function buildSudokuGrid() {
  for (let bigRow=0; bigRow <3 ; bigRow++ ) {
    for (let bigCol=0; bigCol <3 ; bigCol++ ) {

      const box = $("div")
        .addClass("box-"+ (3*bigRow+bigCol),"box");
      box.appendTo(sudokuGrid);

      for (let smRow=0; smRow <3 ; smRow++ ) {
        for (let smCol=0; smCol <3 ; smCol++ ) {

          const cell = $("div")
            .addClass("cell-"+(3*smRow + smCol),"cell","show-candidates")
            .data("box", (3*bigRow + smRow))
            .data("row",(3*bigCol + smCol))
            .data("col",(3*bigRow + bigCol))
            .on("contextmenu",selectCell);
          cell.appendTo(box);

          const digit = $("div")
            .addClass("digit hide")
            .text(3*smRow + smCol)
            .data("box", (3*bigRow + smRow))
            .data("row",(3*bigCol + smCol))
            .data("col",(3*bigRow + bigCol));
          
          cell.append(digit);

          for (let candidateRow=0; candidateRow <3 ; candidateRow++ ) {
            for (let candidateCol=0; candidateCol <3 ; candidateCol++ ) {
              const value = (3*candidateRow + candidateCol + 1);
              const candidate=$("div")
                .text(value)
                .addClass("candidate show possible")
                .data("box", (3*bigRow + smRow))
                .data("row",(3*bigCol + smCol))
                .data("col",(3*bigRow + bigCol))
                .data("value",value)
                .attr("data-value",value)
                .css("gridColumn", candidateCol + 1)
                .css("gridRow",candidateRow + 1)
                .on("click",toggleEliminationHandler);

              candidate.appendTo(cell);
            }
          }
        }
      }
    }
  }
}

function toggleMultiSelect() {
  multiSelectBtn.toggleClass("btn-dark","btn-light");
  multiSelectOn = !multiSelectOn;
}

function toggleEliminationHandler(event) {
  if (!multiSelectOn) {
    event.target.toggleClass("eliminated","possible");
  } else {
    const value = event.target.data("value");
    const selectedCandidates = $(`.cell.selected .candidate[data-value="${value}"]`);
    selectedCandidates.toggleClass("eliminated","possible");
  }
}

function keyDownHandler(event) {
  const key = event.key;
  if (key >= '1' && key <= '9') {
    const selectedCells = $(".cell.selected");
    try {
      selectedCells.forEach((cell) => {
        const value = cell.data("value");
        const digit = cell.find(".digit");
        if (!value) {
          display.show(digit);
          display.hide(cell.find(".candidate"));
          cell.addClass("show-digit");
          cell.removeClass("show-candidates");
        }
        cell.data("value",num);
        digit.data("value",num).text(num);

        eliminateConflicts(cell,num);
      })
    } catch {
      console.log("error filling cells",selectedCells);
    }
      highlightCandidates();
  }
}

function buildHighlightButtons() {
  for (let value=1; value<=9; value++) {
    const button = $("button")
      .addClass("btn btn-primary highlighter")
      .data("value",value)
      .text(value)
      .on("click",highlightCandidatesHandler)
    button.appendTo(highlighterBtnGrid)
  }
}

function highlightCandidatesHandler(event) {
  const value = $(event.target).data("value");
  if (highlightedNumber != value) {
    highlightedNumber = value;
    highlightCandidates(value);
  } else {
    highlightedNumber="0";
    allCells.removeClass("highlighted");
  }
}

function highlightCandidates(value=highlightedNumber) {
  allCells.removeClass("highlighted");
  $(`.cell.show-candidates>.candidate.possible[data-value="${value}"]`).parent().addClass("highlighted")
}

function clearCandidates() {
  utils.each(allCandidates,utils.addRemoveClass,"eliminated","possible");
}

function showCandidates() {
  utils.each(allCandidates,utils.addRemoveClass,"eliminated","possible");
}

function eliminateConflicts(cell, value) {
  const box = cell.data("box");
  const row = cell.data("row");
  const col = cell.data("col");

  $(`.cell[data-box="${box}"] .candidate[data-value="${value}"]`).removeClass("eliminated").addClass("possible");
  $(`.cell[data-row="${row}"] .candidate[data-value="${value}"]`).removeClass("eliminated").addClass("possible");
  $(`.cell[data-col="${col}"] .candidate[data-value="${value}"]`).removeClass("eliminated").addClass("possible");
}






} // end of the "init" function