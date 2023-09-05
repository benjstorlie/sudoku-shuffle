
import React from "react";
import logo from "../../logo.svg";
import "../../index.css";
export default function Footer() {
  return (

    <footer className="border-dark text-dark py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <img
              src="https://i.imgur.com/pqnPw4E.png"
              className="img-fluid"
              alt="Sudoku-Shuffle header"
            />
          </div>
          <div className="col-md-6 col-lg-8">
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <p className="mb-3">
                  <b>
                    In classic Sudoku, the objective is to fill a 9 &times; 9
                    grid with digits so that each column, each row, and each of
                    the nine 3 &times; 3 subgrids that compose the grid (also
                    called "boxes", "blocks", or "regions") contain all of the
                    digits from 1 to 9. The puzzle setter provides a partially
                    completed grid, which for a well-posed puzzle has a single
                    solution. The modern Sudoku has a modern design and method.
                    Click the links to find out more!
                  </b>
                </p>
              </div>
              <div className="d-flex justify-content-between">
                <h1>
                  <img src={logo} className="logo" alt="logo" />
                </h1>
                <div>
                  <a
                    href="https://sudoku.com/how-to-play/sudoku-rules-for-complete-beginners/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-light btn-lg m-2"
                  >
                    How to play Sudoku?
                  </a>
                  <a
                    href="https://www.seniorlifestyle.com/resources/blog/5-tips-sudoku-beginners/#:~:text=The%20rules%20for%20sudoku%20are,have%20any%20repeat%20numbers%20either."
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-light btn-lg m-2"
                  >
                    Sudoku Best Tips!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
