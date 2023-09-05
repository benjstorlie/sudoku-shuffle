import React from "react";
import logo from "../../logo.svg";
import "../../index.css";

export default function Footer() {
  return (
    <footer className="bg-info text-dark mb-4 py-3">
        <div className="container">
      <div className="row align-items-center"> 
      <div className="col-md-6 col-lg-4 d-flex align-items-center">
<div className="bg-info text-dark mb-4 py-3">
     <section className="sub-header">
        <img src="https://i.imgur.com/pqnPw4E.png" width="fill" length="fill" alt="Sudoku-Shuffle header" />
        
      
      </section>




      <section>
        <b>In classic Sudoku, the objective is to fill a 9 &times; 9 grid with digits so that each column, each row, and each of the nine 3 &times; 3 subgrids that compose the grid (also called "boxes", "blocks", or "regions") contain all of the digits from 1 to 9. The puzzle setter provides a partially completed grid, which for a well-posed puzzle has a single solution. The modern Sudoku has a modern design and method. Click the links to find out more!</b>
       
      </section>
      <div className="d-flex justify-content-between">
      <h1> <img src={logo} className="logo" alt="logo"/></h1> 
      <button className="btn btn-lg btn-light m-2">  
   <a href="https://sudoku.com/how-to-play/sudoku-rules-for-complete-beginners/" target="_blank"  rel="noreferrer" alt="How to play Sudoku link">How to play Sudoku?</a>
      </button>
    
      <button className="btn btn-lg btn-light m-2"><a href="https://www.seniorlifestyle.com/resources/blog/5-tips-sudoku-beginners/#:~:text=The%20rules%20for%20sudoku%20are,have%20any%20repeat%20numbers%20either." target="_blank"  rel="noreferrer" alt="Sudoku Tips">Sudoku Best Tips!</a>
      </button>
      </div>


      </div>
      </div>
      </div>
      </div>
    </footer>
  );
}
