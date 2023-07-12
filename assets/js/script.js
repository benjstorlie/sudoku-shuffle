
let multiSelectOn = false;

const sudokuGrid = document.getElementById("sudoku-grid");
const controls = document.getElementById("controls");
const highlighterBtnGrid = document.getElementById("highlighter-btn-grid")
const multiSelectBtn = document.getElementById("multi-select-btn");
multiSelectBtn.addEventListener("click",toggleMultiSelect);

buildSudokuGrid();

const allCells = sudokuGrid.querySelectorAll(".cell");

buildHighlightButtons();

document.addEventListener("keydown",keyDownHandler);


function selectCell(event) {
  event.preventDefault();
  if (!multiSelectOn) {
    utils.each(allCells,"classList.remove","selected")
  }
  event.currentTarget.classList.toggle("selected");
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
          cell.addEventListener("contextmenu",selectCell);
          block.append(cell);

          const digit = document.createElement("div");
          utils.addClass(digit,"digit hide");
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
              utils.addClass(candidate,"candidate show uneliminated");

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
  utils.toggleClasses(multiSelectBtn,"btn-dark","btn-light");
  multiSelectOn = !multiSelectOn;
}

function toggleEliminationHandler(event) {
  if (!multiSelectOn) {
    utils.toggleClasses(event.target,"eliminated","uneliminated");
  } else {
    const value = event.target.getAttribute("data-value");
    const selectedCandidates = document.querySelectorAll(`.cell.selected .candidate[data-value="${value}"]`);
    utils.each(selectedCandidates,utils.toggleClasses,"eliminated","uneliminated");
  }
}

const display = { 
  show(el) {
    el.classList.add("show");
    el.classList.remove("hide");
  },
  hide(el) {
    el.classList.add("hide");
    el.classList.remove("show");
  }
}

function keyDownHandler(event) {
  const key = event.key;
  if (key >= '1' && key <= '9') {
    const selectedCells = document.querySelectorAll(".cell.selected");
    try {
      utils.each(selectedCells,fillCell,key);
    } catch {
      console.log("error filling cells",selectedCells);
    }
  }
}

function fillCell(cell,num) {
  const value = cell.getAttribute("data-value");
  const digit = cell.querySelector(".digit");
  if (!value) {
    display.show(digit);
    utils.each(cell.querySelectorAll(".candidate"),display.hide);
  }
  utils.each([cell,digit],"setAttribute","data-value", num)
  digit.textContent = num;
}

function buildHighlightButtons() {
  for (let value=1; value<=9; value++) {
    const button = document.createElement("button");
    utils.addClass(button,"btn btn-primary highlighter");
    button.setAttribute("data-value",value);
    button.textContent = value;
    highlighterBtnGrid.append(button);
  }
}

function highlightCandidates(event) {
  const value = event.target.getAttribute("data-value");
  const candidateCells = sudokuGrid.querySelectorAll(`.cell .candidate.uneliminated[data-value="${value}"]`);

}

