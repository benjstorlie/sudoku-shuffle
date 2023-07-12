
let multiSelectOn = false;

const sudokuGrid = document.getElementById("sudoku-grid");
const multiSelectBtn = document.getElementById("multi-select-btn");
multiSelectBtn.addEventListener("click",toggleMultiSelect);

buildSudokuGrid();

const allCells = document.querySelectorAll(".cell");

document.addEventListener("keydown",keyDownHandler);


function selectCell(event) {
  event.preventDefault();
  if (!multiSelectOn) {
    allCells.forEach(el => {
      el.classList.remove("selected");
    });
  }
  event.currentTarget.classList.toggle("selected");
}

function buildSudokuGrid() {
  for (let bigRow=0; bigRow <3 ; bigRow++ ) {
    for (let bigCol=0; bigCol <3 ; bigCol++ ) {

      const block = document.createElement("div");
      block.classList.add("block-"+ (3*bigRow+bigCol));
      block.classList.add("block");
      sudokuGrid.append(block)

      for (let smRow=0; smRow <3 ; smRow++ ) {
        for (let smCol=0; smCol <3 ; smCol++ ) {

          const cell = document.createElement("div");
          cell.classList.add("cell-"+(3*smRow + smCol));
          cell.classList.add("cell");
          cell.addEventListener("contextmenu",selectCell);
          addRowColBlockValueDataAttributes(cell,
            (3*bigRow + smRow),
            (3*bigCol + smCol),
            (3*bigRow + bigCol),
          );
          block.append(cell);

          const digit = document.createElement("div");
          digit.classList.add("digit");
          digit.classList.add("hide");
          digit.textContent = (3*smRow + smCol);
          addRowColBlockValueDataAttributes(digit,
            (3*bigRow + smRow),
            (3*bigCol + smCol),
            (3*bigRow + bigCol),
          );
          cell.append(digit);

          for (let candidateRow=0; candidateRow <3 ; candidateRow++ ) {
            for (let candidateCol=0; candidateCol <3 ; candidateCol++ ) {
              const value = (3*candidateRow + candidateCol + 1);
              const candidate=document.createElement("div");
              candidate.textContent = value;
              candidate.classList.add("candidate");
              candidate.classList.add("show");
              addRowColBlockValueDataAttributes(candidate,
                (3*bigRow + smRow),
                (3*bigCol + smCol),
                (3*bigRow + bigCol),
                value,
              );
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
  multiSelectBtn.classList.toggle("btn-dark");
  multiSelectBtn.classList.toggle("btn-light");
  multiSelectOn = !multiSelectOn;
}

function toggleEliminationHandler(event) {
  if (!multiSelectOn) {
    event.target.classList.toggle("eliminated");
  } else {
    //try {
      const value = event.target.getAttribute("data-value");
      const selectedCandidates = document.querySelectorAll(`.cell.selected .candidate[data-value="${value}"]`);
      console.log(selectedCandidates);
      selectedCandidates.forEach(element => {
        element.classList.toggle("eliminated");
      })
    // } catch {
    //   console.log("error eliminating multiple values")
    //   event.target.classList.toggle("eliminated");
    // }
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
      selectedCells.forEach(cell => {
        fillCell(cell,key);
      });
    } catch {
      console.log("error filling cells",selectedCells);
    }
  }
}

function addRowColBlockValueDataAttributes(element,row,col,block,value="") {
  element.setAttribute("data-block", block)
  element.setAttribute("data-row", row);
  element.setAttribute("data-col", col);
  element.setAttribute("data-value", value);
}

function fillCell(cell,num) {
  const value = cell.getAttribute("data-value");
  const digit = cell.querySelector(".digit");
  if (!value) {
    display.show(digit);
    cell.querySelectorAll(".candidate").forEach( candidate => {
      display.hide(candidate);
      }
    );
  }
  cell.setAttribute("data-value", num);
  digit.setAttribute("data-value", num);
  digit.textContent = num;
}