
let multiSelectOn = false;
let highlightedNum = "0";

const sudokuGrid = document.getElementById("sudoku-grid");
let lastSelected = {
  list: [],
  length: this.list.length,
  labels: [0,1,2,"0","1","2"],
  get() {
    return this.list[this.length - 1];
  },
  pop() {
    if (!this.length) {
      return {row:0,col:0,cell: sudokuGrid.querySelector(".cell[data-row='0'][data-col='0']")}
    } else {
      return this.list.pop();
    }
  },
  push({row, col, cell}) {
    if (cell && (this.labels.includes(row) || this.labels.includes(col))) {
      throw new Error("Only push {row, col} or {cell} to lastSelected")
    } else if (cell) {
      row = cell.getAttribute("data-row");
      col = cell.getAttribute("data-col");
      if (!multiSelectOn) {
        this.list=[];
        return this.list.push({row,col,cell});
      } else {
        return this.list.push({row,col,cell});
      }
    } else if (this.labels.includes(row) && this.labels.includes(col)) {
      cell = sudokuGrid.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      if (!multiSelectOn) {
        this.list=[];
        return this.list.push({row,col,cell});
      } else {
        return this.list.push({row,col,cell});
      }
    } else {
      throw new Error("Only push {row, col} or {cell} to lastSelected.");
    }
  }
};

const controls = document.getElementById("controls");
const highlighterBtnGrid = document.getElementById("highlighter-btn-grid");
const coloringBtnGrid = document.getElementById("coloring-btn-grid");

const multiSelectBtn = document.getElementById("multi-select-btn");
multiSelectBtn.addEventListener("click",toggleMultiSelect);

buildSudokuGrid();

const allCells = sudokuGrid.querySelectorAll(".cell");
const allCandidates = sudokuGrid.querySelectorAll(".candidate");
const allDigits = sudokuGrid.querySelectorAll(".digit");

// Initital status
utils.each(allCells,utils.addClass,"show-candidates");
utils.each(allCandidates,utils.addClass,"show");
utils.each(allDigits,utils.addClass,"hide");
utils.each(allCandidates,toggleElimination,true);  // 

buildHighlightButtons();
buildColoringButtons();

document.addEventListener("keydown",keyDownHandler);

function selectCellHandler(event) {
  event.preventDefault();
  selectCell(event.target);
}

function selectCell(cell,force) {
  if (!multiSelectOn) {
    utils.each(allCells,"classList.remove","selected")
  }
  cell.classList.toggle("selected",force);
  if (cell.classList.contains("selected")) {
    pushLastSelected(cell);  // This function already checks for repeats.
  } else {
    popLastSelected();
  }
}

function buildSudokuGrid() {
  for (let bigRow=0; bigRow <3 ; bigRow++ ) {
    for (let bigCol=0; bigCol <3 ; bigCol++ ) {

      const block = document.createElement("div");
      utils.addClass(block,"block-"+ (3*bigRow+bigCol),"block");
      sudokuGrid.append(block)

      for (let smRow=0; smRow <3 ; smRow++ ) {
        for (let smCol=0; smCol <3 ; smCol++ ) {

          const cell = document.createElement("div");
          utils.addClass(cell,"cell-"+(3*smRow + smCol),"cell");
          cell.addEventListener("contextmenu",selectCellHandler);
          block.append(cell);

          const digit = document.createElement("div");
          utils.addClass(digit,"digit");
          digit.textContent = (3*smRow + smCol);
          utils.each([digit,cell],
            utils.setDataAttributes,
            ["block", (3*bigRow + smRow)],
            ["row",(3*bigCol + smCol)],
            ["col",(3*bigRow + bigCol)]
          );
          cell.append(digit);

          for (let candidateRow=0; candidateRow <3 ; candidateRow++ ) {
            for (let candidateCol=0; candidateCol <3 ; candidateCol++ ) {
              const value = (3*candidateRow + candidateCol + 1);
              const candidate=document.createElement("div");
              candidate.textContent = value;
              utils.addClass(candidate,"candidate");

              utils.setDataAttributes(candidate,
                ["block", (3*bigRow + smRow)],
                ["row",(3*bigCol + smCol)],
                ["col",(3*bigRow + bigCol)],
                ["value",value]);
              candidate.style.gridColumn = candidateCol + 1;
              candidate.style.gridRow = candidateRow + 1;
              candidate.addEventListener("click",toggleEliminationHandler);

              cell.append(candidate);
            }
          }
        }
      }
    }
  }
}

function toggleMultiSelect() {
  utils.toggleClass(multiSelectBtn,"btn-dark","btn-light");
  multiSelectOn = !multiSelectOn;
}

function toggleEliminationHandler(event) {
  selectCell(event.target.parentElement,true);
  if (!multiSelectOn) {
    toggleElimination(event.target);
  } else {
    const value = event.target.getAttribute("data-value");
    let selectedCandidates = document.querySelectorAll(`.cell.selected .candidate[data-value="${value}"]`);
    selectedCandidates=Array.from(selectedCandidates);
    if (selectedCandidates.some(isPossible) && selectedCandidates.some(x => !isPossible(x))) {
      utils.each(selectedCandidates,toggleElimination,true);
    } else {
      utils.each(selectedCandidates,toggleElimination);
    }
  }
}

function toggleElimination(candidate,force) {
  let status = "data-status";
  if (force === true) {
    candidate.setAttribute(status,"possible");
  } else if (force === false) {
    candidate.setAttribute(status,"eliminated");
  } else {
    if (candidate.getAttribute(status)==="possible") {
      candidate.setAttribute(status,"eliminated");
    } else if (candidate.getAttribute(status)==="eliminated") {
      candidate.setAttribute(status,"possible");
    }
  }
}

function isPossible(candidate) {
  const status = candidate.getAttribute("data-status");
  return (status === "possible");
}

function keyDownHandler(event) {
  const {key} = event;
  if (key >= '1' && key <= '9') {
    const selectedCells = sudokuGrid.querySelectorAll(".cell.selected");
    try {
      utils.each(selectedCells,fillCell,key);
    } catch {
      console.log("error filling cells",selectedCells);
    }
    highlightCandidates();
  } else if (key === "Backspace" || key === "Delete") {
    const selectedCells = sudokuGrid.querySelectorAll(".cell.selected");
    utils.each(selectedCells,deleteDigit);
  } else if (["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"].includes(key)) {
    arrowSelect(key);
  }
}

function fillCell(cell,num) {
  const value = cell.getAttribute("data-value");
  const digit = cell.querySelector(".digit");
  const candidates = cell.querySelectorAll(".candidate");
  if (!value) {
    display.show(digit);
    utils.each(candidates,display.hide);
    utils.addRemoveClass(cell,"show-digit","show-candidates");
  }
  cell.setAttribute("data-value",num);
  digit.setAttribute("data-value",num);
  eliminateConflicts(cell,num);
  digit.textContent = num;
}

function deleteDigit(cell) {
  const digit = cell.querySelector(".digit");
  const candidates = cell.querySelectorAll(".candidate");
  digit.setAttribute("data-value","");
  display.hide(digit);
  utils.each(candidates,display.show);
  utils.addRemoveClass(cell,"show-candidates","show-digit");
}

function buildHighlightButtons() {
  for (let value=1; value<=9; value++) {
    const button = document.createElement("button");
    utils.addClass(button,"btn btn-secondary highlighter");
    button.setAttribute("data-value",value);
    button.textContent = value;
    highlighterBtnGrid.append(button);
    button.addEventListener("click",highlightCandidatesHandler);
  }
}

function buildColoringButtons() {
  const colors = ["blue","purple","pink","red","orange","yellow","green","teal","cyan"];
  
  for (let c=0; c<colors.length; c++) {
    const button = document.createElement("div");
    utils.addClass(button,"btn coloring");
    button.setAttribute("data-color",colors[c]);
    coloringBtnGrid.append(button);
    button.addEventListener("click",coloringHandler);
  }
}

function coloringHandler(event) {
  console.log(event.target.getAttribute("data-color"));
}

function highlightCandidatesHandler(event) {
  event.stopPropagation();
  utils.each(allCells,"classList.remove","highlighted");
  utils.each(highlighterBtnGrid.querySelectorAll("button"),utils.addRemoveClass,"btn-secondary","btn-warning")
  const value = event.target.getAttribute("data-value");
  utils.addRemoveClass(event.target,"btn-warning","btn-secondary");
  highlightedNum = value;
  highlightCandidates(value);
}

function highlightCandidates(value=highlightedNum) {
  utils.each(allCells,"classList.remove","highlighted");
  if (value != "0") {
    const candidateCells = sudokuGrid.querySelectorAll(`.cell.show-candidates .candidate.possible[data-value="${value}"]`);
    candidateCells.forEach((candidate) => {
    candidate.parentElement.classList.add("highlighted");
  })
  }
  
}

function arrowSelect(key) {
  console.log(key);
  const {row, col} = getLastSelected;
  switch (key) {
    case "ArrowLeft":

    case "ArrowRight":
    case "ArrowDown":
    case "ArrowDown":
  }
}

function clearCandidates() {
  utils.each(allCandidates,utils.setDataAttributes,"status","eliminated");
}

function showCandidates() {
  utils.each(allCandidates,utils.setDataAttributes,"status","possible");
}

function eliminateConflicts(cell, value) {
  const block = cell.getAttribute("data-block");
  const row = cell.getAttribute("data-row");
  const col = cell.getAttribute("data-col");

  utils.each(sudokuGrid.querySelectorAll(`.cell[data-block="${block}"] .candidate[data-value="${value}"]`),
    utils.setDataAttributes,"status","eliminated");
  utils.each(sudokuGrid.querySelectorAll(`.cell[data-col="${col}"] .candidate[data-value="${value}"]`),
    utils.setDataAttributes,"status","eliminated");
  utils.each(sudokuGrid.querySelectorAll(`.cell[data-row="${row}"] .candidate[data-value="${value}"]`),
    utils.setDataAttributes,"status","eliminated");
}