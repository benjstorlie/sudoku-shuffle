
/** This function returns an object containing a temporary template board for easy, medium, and hard difficulties.
* It is a one-to-one representation of the object returned by using the /sudoku-api.vercel.app/ api.

* This function is temporary and will be replaced by a function which actually gets data directly from the api 
* 

* Example:

* board = temporaryGetBoard("hard")

* board values are at: board.newboard.grids[0].value 
* as list of list of 9 numbers. 

* solution values are at: board.newboard.grids[0].solution 
* as list of list of 9 numbers. **/
function temporaryGetBoard(difficulty){
    var board = {};
    if (difficulty === "easy"){
        board = {
            "newboard": {
                "grids": [
                    {
                        "value": [
                            [ 2, 0, 0, 0, 1, 0, 0, 6, 0 ], 
                            [ 0, 0, 0, 0, 2, 0, 0, 0, 8 ], 
                            [ 0, 0, 0, 3, 0, 7, 2, 0, 5 ], 
                            [ 0, 1, 8, 0, 5, 0, 0, 2, 7 ], 
                            [ 0, 2, 0, 7, 8, 6, 9, 3, 0 ], 
                            [ 3, 0, 7, 0, 0, 0, 0, 0, 4 ], 
                            [ 0, 0, 0, 9, 0, 0, 5, 7, 6 ], 
                            [ 6, 0, 0, 2, 7, 5, 1, 8, 3 ], 
                            [ 0, 5, 3, 8, 6, 1, 4, 0, 0 ]
                        ],
                        "solution": [
                            [ 2, 3, 4, 5, 1, 8, 7, 6, 9 ], 
                            [ 5, 7, 1, 6, 2, 9, 3, 4, 8 ], 
                            [ 8, 9, 6, 3, 4, 7, 2, 1, 5 ], 
                            [ 9, 1, 8, 4, 5, 3, 6, 2, 7 ], 
                            [ 4, 2, 5, 7, 8, 6, 9, 3, 1 ], 
                            [ 3, 6, 7, 1, 9, 2, 8, 5, 4 ], 
                            [ 1, 8, 2, 9, 3, 4, 5, 7, 6 ], 
                            [ 6, 4, 9, 2, 7, 5, 1, 8, 3 ], 
                            [ 7, 5, 3, 8, 6, 1, 4, 9, 2 ]
                        ],
                        "difficulty": "Easy"
                    }
                ],
                "results": 1,
                "message": "All Ok"
            }
        }
    }
    if (difficulty === "medium"){
        board = {
            "newboard": {
                "grids": [
                    {
                        "value": [
                            [ 7, 0, 0, 0, 6, 0, 3, 8, 0 ], 
                            [ 0, 0, 3, 7, 0, 8, 0, 0, 0 ], 
                            [ 0, 0, 0, 0, 0, 0, 0, 0, 7 ], 
                            [ 0, 0, 5, 2, 9, 0, 0, 3, 0 ], 
                            [ 0, 9, 2, 5, 0, 3, 0, 6, 1 ], 
                            [ 0, 0, 0, 1, 0, 0, 0, 0, 0 ], 
                            [ 0, 0, 0, 0, 0, 7, 0, 0, 8 ], 
                            [ 0, 0, 4, 9, 0, 1, 0, 0, 0 ], 
                            [ 0, 0, 6, 0, 0, 0, 0, 0, 3 ]
                        ],
                        "solution": [
                            [ 7, 2, 1, 4, 6, 5, 3, 8, 9 ], 
                            [ 9, 4, 3, 7, 1, 8, 5, 2, 6 ], 
                            [ 5, 6, 8, 3, 2, 9, 1, 4, 7 ], 
                            [ 8, 1, 5, 2, 9, 6, 7, 3, 4 ], 
                            [ 4, 9, 2, 5, 7, 3, 8, 6, 1 ], 
                            [ 6, 3, 7, 1, 8, 4, 2, 9, 5 ], 
                            [ 2, 5, 9, 6, 3, 7, 4, 1, 8 ], 
                            [ 3, 8, 4, 9, 5, 1, 6, 7, 2 ], 
                            [ 1, 7, 6, 8, 4, 2, 9, 5, 3 ]
                        ],
                        "difficulty": "Medium"
                    }
                ],
                "results": 1,
                "message": "All Ok"
            }
        }
    }
    if (difficulty === "hard"){
        board = {
            "newboard": {
                "grids": [
                    {
                        "value": [
                            [ 6, 0, 0, 0, 0, 0, 0, 0, 0 ], 
                            [ 0, 1, 0, 0, 0, 0, 0, 8, 0 ], 
                            [ 4, 0, 8, 0, 0, 0, 6, 5, 0 ], 
                            [ 0, 3, 0, 0, 0, 0, 0, 0, 0 ], 
                            [ 0, 0, 0, 0, 0, 0, 0, 7, 0 ], 
                            [ 1, 0, 0, 7, 0, 0, 0, 0, 6 ], 
                            [ 3, 0, 0, 0, 0, 0, 0, 0, 8 ], 
                            [ 0, 0, 0, 1, 0, 8, 0, 0, 0 ], 
                            [ 8, 0, 0, 5, 0, 0, 1, 0, 0 ]
                        ],
                        "solution": [
                            [ 6, 5, 3, 4, 8, 1, 9, 2, 7 ], 
                            [ 7, 1, 9, 2, 5, 6, 3, 8, 4 ], 
                            [ 4, 2, 8, 3, 7, 9, 6, 5, 1 ], 
                            [ 5, 3, 7, 8, 6, 4, 2, 1, 9 ], 
                            [ 2, 8, 6, 9, 1, 3, 4, 7, 5 ], 
                            [ 1, 9, 4, 7, 2, 5, 8, 3, 6 ], 
                            [ 3, 7, 1, 6, 4, 2, 5, 9, 8 ], 
                            [ 9, 4, 5, 1, 3, 8, 7, 6, 2 ], 
                            [ 8, 6, 2, 5, 9, 7, 1, 4, 3 ]
                        ],
                        "difficulty": "Hard"
                    }
                ],
                "results": 1,
                "message": "All Ok"
            }
        }
    }
    
    return board;
}

var apiUrl = "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:5){grids{value,solution,difficulty},results,message}}"

/** This function calls the api at 
 * https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:5){grids{value,solution,difficulty},results,message}} 
 * **/
/*export function getBoardByDifficulty(difficulty){
    if (difficulty === "easy"){
        return getBoardEasy();
    }
    if (difficulty === "medium"){
        return getBoardMedium();
    }
    if (difficulty === "hard"){
        return getBoardHard();
    }
}*/

function getBoardEasy(){
    let board = temporaryGetBoard("easy");
    return board;
}

function getBoardMedium(){
    let board = temporaryGetBoard("medium");
    return board;
}

function getBoardHard(){
    let board = temporaryGetBoard("hard");
    return board;
}

async function getBoard(){
    const response = await fetch(apiUrl);
    try{
        return await response.json();
    }
    catch{
        return null;

    }
}

async function getBoardByDifficulty(difficulty){
    for( let i = 0; i < 10; i++){
        let board = await getBoard();
        if (board && board.newboard.grids[0].difficulty === difficulty){
            console.log("Found board with difficulty "+ board.newboard.grids[0].difficulty + difficulty)
            return board;
        }
    }
    if (difficulty === "easy"){
        console.log("fetching from template");
        return getBoardEasy();
    }
    if (difficulty === "medium"){
        console.log("fetching from template");
        return getBoardMedium();
    }
    if (difficulty === "hard"){
        console.log("fetching from template");
        return getBoardHard();
    }
}

getBoardByDifficulty("hard").then((data)=>{
    console.log(data.newboard.grids[0].difficulty);
});
