class Sudoku {
  constructor() {

  }
}

/**
 * 
 * @prop {JQuery} $candidates - jQuery object with the 9 div.candidate child elements of the div.cell
 * @prop {JQuery} $possibles - A subset of this.$candidates, with their value being possible in the cell
 * @prop {Number[] | String[]} possibles - possible candidate values for this cell
 * @prop {Boolean} selected - is selected
 * @prop {Boolean} highlighted - is highlighted
 * @prop {Number} row - from 0-8
 * @prop {Number} col - from 0-8
 * @prop {Number} block - from 0-8, calculated from row and col, cannot be set
 */
class Cell {
  static keys=["row","col","color","selected","highlighted"];
  static defaults = {
    color: "none",
    selected: false,
    highlighted: false,
  }
  /**
   * A single cell in the Sudoku grid
   * @param {JQuery} $cell - jQuery \<div\> object
   */
  constructor($cell,properties) {
    if ($cell.length === 1 ) {
      $cell.addClass("cell");
      this.$cell = $cell;
      this.$candidates = $cell.children(".candidate")
      this._initProperties(properties);
    } else {
      console.error($cell);
      throw new Error("A Cell object should only contain 1 cell");
    }
  }

  _initProperties(properties={}) {
    for (const key of Cell.keys) {
      this[key] = (properties[key] || this.$cell.data(key)) || Cell.defaults[key];
    }
  }

  getProperty(name) {
    if (this[name]) {
      return this[name];
    } else {
      let value = this.$cell.data(name);
      if (value) {
        this[name] = value;
        return value;
      } else {
        return undefined;
      }
    }
  }

  setProperty(name, value) {this[name] = value;  this.$cell.data(name, value);}

  get row() {return Number(this.getProperty("row"));}

  set row(row) {this.setProperty("row",Number(row))}

  get col() {return Number(this.getProperty("col"));}

  set col(col) {this.setProperty("col",Number(col))}

  get color() {return this.getProperty("color");}

  set color(color) {this.setProperty("color",color)}

  get $candidates() {return $cell.children(".candidate")}

  get $possibles() {
    return $possibles = this.$candidates.filter(() => $( this ).data("possible") == true)
  }

  get possibles() {
    return this.$possibles.map(() => $(this).data("value").get() )
  }

  select() {this.selected = true;}

  deselect() { this.selected = false;}

  toggleSelect() {this.selected = !this.selected;}

  highlight() {this.highlighted = true; }

  dehighlight() { this.highlighted = false;}

  clearColor() { this.color = "none"; }

}

class Candidate {
  static keys=["row","col","color","selected","highlighted"];
  static defaults = {
    color: "none",
    selected: false,
    highlighted: false,
  }
  /**
   * A single candidate in the Sudoku grid
   * @param {JQuery} $candidate - JQuery <div> object
   */
  constructor($candidate,properties) {
    $candidate.addClass("candidate");
    this.candidate = $candidate;
    this._initProperties(properties);
  }

  _initProperties(properties={}) {
    for (const key of Candidate.keys) {
      this[key] = (properties[key] || this.candidate.data(key)) || Candidate.defaults[key];
    }
  }

  getProperty(name) {
    if (this[name]) {
      return this[name];
    } else {
      let value = this.candidate.data(name);
      if (value) {
        this[name] = value;
        return value;
      } else {
        return undefined;
      }
    }
  }

  setProperty(name, value) {this[name] = value;  this.candidate.data(name, value);}

}