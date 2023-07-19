class Puzzle {
  static blank = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
  ]

  static copy(array) {
    let newCopy = [];
    try {
      for (let row = 0; row < 9 ; row++) {
        newCopy[row] = [];
        for (let col = 0; col <9 ; col++) {
          newCopy[row][col] = {
            value: array[row][col].value,
            possibles: new Set(array[row][col].possibles),
          }
        }
      }
    } catch {
      for (let row = 0; row < 9 ; row++) {
        newCopy[row] = [];
        for (let col = 0; col <9 ; col++) {
          newCopy[row][col] = {
            value: array[row][col],
            possibles: new Set(),
          }
        }
      }     
    }
    return newCopy;
  }

  // 
  constructor(array) {
    // validate array size
    if (!array) {
      array = Puzzle.blank;
    } else if ( array.length !== 9 || array.some(x => x.length !== 9) ) {
      throw new Error("Array must be 9 by 9.")
    }
    try {
      this.id = crypto.randomUUID().slice(-4);
    } catch {
      this.id = String(new Date().getTime()).slice(-4);
    }
    this.stack = [];
    this.puzzle = Puzzle.copy(array);

  }

  toString() {
    let array = [];
    for (let row = 0; row < 9 ; row++) {
      array[row] = [];
      for (let col = 0; col <9 ; col++) {
        array[row][col] = this.puzzle[row][col].value ;
      }
      array[row] = JSON.stringify(array[row]);
    }
    return JSON.stringify(array,null,2);
  }

  setPuzzle(singleMove) {
    $("#coverscreen").addClass(".disable")
    let puzzle = singleMove || this.puzzle;
    let timestamp = new Date().getTime();
    this.stack.unshift(timestamp);
    localStorage.setItem(
      `puzzle${id}-${timestamp}`,
      JSON.stringify(
        puzzle,
        (k,v)=>{
          if (k==="possibles" && v instanceof Set){
            return Array.from(v).map(x => Number(x))
          }
        }
      )
    );
    $("#coverscreen").removeClass(".disable")
  }

  saveSingleMove($cells) {
    $("#coverscreen").addClass(".disable")
    let saveCells = [];
    $cells.each((index,cell) => {
      const $cell = $(cell);
      let {row,col} = $cell.data;
      let cellValue = $cell.data("value");
      let $candidates = $(`.candidate.row${row}.col${col}.possible`);
      let possibles = new Set()
      $candidates.each((index,candidate) => {
        possibles.add($(candidate).data("value"))
      })
      saveCells[index] = {row,col,value:cellValue,possibles}
    })
    this.save({singleMove:saveCells});
    $("#coverscreen").removeClass(".disable")
  }

  getPuzzle() {
    $("#coverscreen").addClass(".disable")
    let timestamp = this.stack.shift();
    let puzzle = JSON.parse(
      localStorage.getItem(`puzzle${id}-${timestamp}`),
      (k,v)=>{
        if (k==="possibles" && Array.isArray(v)){
          return new Set(v)
        }
      }
    );
    if (!puzzle.hasOwnProperty("singleMove")) {
      this.puzzle = puzzle;
    } else {
      const saveCells = puzzle.singleMove();
      saveCells.forEach(cell => {
        const {row,col,value,possibles} = cell;
        this.puzzle[row][col]={value,possibles};
      });
    }
    $("#coverscreen").removeClass(".disable")

  }

  fill(saveCells) {
    $("#coverscreen").addClass(".disable")
    if (!saveCells) {
      $(".cell").removeClass("highlighted show-digit show-candidates");
      $(".cell").children().removeClass("show hide possible eliminated");
      for (let row = 0; row < 9 ; row++) {
        for (let col = 0; col <9 ; col++) {
          let $cell = $(`#cell-row${row}-col${col}`);
          let $digit = $cell.children(".digit");
          let $candidates = $cell.children(".candidate");

          let cellValue = this.puzzle[row][col].value;
          if (cellValue) {
            $cell.addClass('show-digit').attr("data-value",cellValue);
            $digit.addClass("show").text(cellValue).attr("data-value",cellValue)
            $candidates.addClass("hide")
          } else {
            $cell.addClass('show-candidates').attr("data-value","");
            $digit.addClass("hide").text("").attr("data-value","")
            $candidates.addClass("show")
          }

          /** * @type {Set<Number>} */
          let possibles = this.puzzle[row][col].possibles;
          let total = possibles.size;
          if (total === 9) {
            $candidates.addClass("possible");
          } else if (total === 0) {
            $candidates.addClass("eliminated")
          } else {
            for (let val = 1; val <=9; val++) {
              const $candidate = $candidates.filter(`.val${val}`);
              if (possibles.has(val)) {
                $candidate.addClass("possible");
                $cell.addclass(`possible-${val}`);
              } else {
                $candidate.addClass("eliminated");
                $cell.removeclass(`possible-${val}`);
              }
            }
          }
        }
      }
    } else {
      saveCells.forEach(cell => {
        const {row,col,value,possibles} = cell;
        let $cell = $(`#cell-row${row}-col${col}`).removeClass("highlighted show-digit show-candidates");
        let $digit = $cell.children(".digit").removeClass("show hide");
        let $candidates = $cell.children(".candidate").removeClass("show hide possible eliminated");

        let cellValue = value;
        if (cellValue) {
          $cell.addClass('show-digit').attr("data-value",cellValue);
          $digit.addClass("show").text(cellValue).attr("data-value",cellValue)
          $candidates.addClass("hide")
        } else {
          $cell.addClass('show-candidates').attr("data-value","");
          $digit.addClass("hide").text("").attr("data-value","")
          $candidates.addClass("show")
        }

        let total = possibles.size;
        if (total === 9) {
          $candidates.addClass("possible");
        } else if (total === 0) {
          $candidates.addClass("eliminated")
        } else {
          for (let val = 1; val <=9; val++) {
            const $candidate = $candidates.filter(`.val${val}`);
            if (possibles.has(val)) {
              $candidate.addClass("possible");
              $cell.addclass(`possible-${val}`);
            } else {
              $candidate.addClass("eliminated");
              $cell.removeclass(`possible-${val}`);
            }
          }
        }
      });
    }
    $("#coverscreen").removeClass(".disable")
  }

  save() {
    $("#coverscreen").addClass(".disable")
    for (let row = 0; row < 9 ; row++) {
      for (let col = 0; col <9 ; col++) {
      }
      let cellValue = $(`#cell-row${row}-col${col}`).attr("data-value");
      this.puzzle[row][col].value = (cellValue ? cellValue : 0);

      let possibles = new Set()
      for (let val = 1; val <=9; val++) {
        let $candidate = $(`#candidate-row${row}-col${col}-val${val}`);
        if ($candidate.hasClass("possible")) {
          possibles.add(val);
        }
      }
      this.puzzle[row][col].possibles = possibles;
    }
    this.setPuzzle();
    $("#coverscreen").removeClass(".disable")
  }

}

