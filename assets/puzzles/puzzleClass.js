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
            possibles: array[row][col].possibles
          }
        }
      }
    } catch {
      for (let row = 0; row < 9 ; row++) {
        newCopy[row] = [];
        for (let col = 0; col <9 ; col++) {
          newCopy[row][col] = {
            value: array[row][col],
            possibles: []
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

  setPuzzle() {
    let timestamp = new Date().getTime();
    this.stack.unshift(timestamp);
    localStorage.setItem(`puzzle${id}-${timestamp}`,JSON.stringify(this.puzzle));
  }

  getPuzzle() {
    let timestamp = this.stack.shift();
    this.puzzle = JSON.parse(localStorage.getItem(`puzzle${id}-${timestamp}`))
  }

  build() {
    for (let row = 0; row < 9 ; row++) {
      for (let col = 0; col <9 ; col++) {
        let $cell = $(`cell-row${row}-col${col}`);
        let showDigit = !!this.puzzle[row][col].value;
      }
    }
  }

  save() {

  }

}

