//Client

var apiUrl = "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:5){grids{value,solution,difficulty},results,message}}"

//
function temporaryGetBoard(difficulty){
    var board = {};

    if (difficulty == "medium"){
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
        console.log(board.newboard.grids[0].solution )
    }
}

temporaryGetBoard("medium");