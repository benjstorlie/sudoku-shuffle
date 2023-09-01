/**
 * @description 
 * @see GameContextProps - describe all the functions and variabled that can be accessed with `useGameContext`.
 * @see useGameContext - Initialize context with `createContext` and `useContext
 * @see GameProvider - Defining the actual react component that's exported. The rest of the file is what's inside this function.
 * useState - There are many variables related to the game and its behavior, and they are all initialized here.
 * ## Mutations
 * useMutation - This is for creating functions that do mutations, like add and update game.
 * saveGameState - To be used inside other functions -- function that saves the game state and handles errors. @see UPDATE_GAME
 * saveNewGAme - To be used inside other functions -- function that creates a new game in the database. @see ADD_GAME 
 * ## Game Action functions.  Many components use these, with user input.
 * toggleSelected, enterColor - These functions don't need to save, so they're more simply defined in {@link ./gameUtils.js}
 * shuffle
 * toggleCandidate
 * enterDigit
*/



import React, { createContext, useContext, useState,
  // eslint-disable-next-line
  Dispatch, SetStateAction
} from 'react';

// import things for communication with server
import { useMutation } from '@apollo/client';
import { ADD_GAME, UPDATE_GAME } from './mutations';

// import game actions from game utils, to be able to pass them along as game context props.
import { 
  // eslint-disable-next-line
  Cell,
  blankGameArray,
  isSolutionCorrect,
  toggleCandidateHandler,
  toggleSelectedHandler,
  enterColorHandler,
  shuffleHandler
} from './gameUtils'
import { getBoardByDifficulty } from "./api";


/**
 * *TODO* Make sure everything being included in the game context is included here, and add a description
 * - it's confusing, because it would be nice if the descriptions from where they originally got defined got passed along
 * - but this is at least a short description that can be read in the other files that use {@linkcode useGameContext}
 * @typedef GameContextProps
 * @prop {Cell[][]} gameArray - Holds the game data for all cells. This is the object that will be saved to database
 * @prop {Dispatch<SetStateAction<Cell[][]>>} setGameArray - update game data
 * @prop {string[]} selected - Selected cells, written as `R${row}C${col}` strings. Operates as a stack.
 * @prop {Dispatch<SetStateAction<string[]>>} setSelected - update selected cells array. Most recent cell selected is first.
 * @prop {number} highlightedDigit - highlight cells with candidates that include this digit
 * @prop {Dispatch<SetStateAction<number>>} setHighlightedDigit - set candidate digit to highlight
 * @prop {boolean} modeMultiselect - if true, multiple cells can be selected, else one one cell selected at a time
 * @prop {Dispatch<SetStateAction<boolean>>} setModeMultiselect - set multi-select mode
 * @prop {boolean} modeAuto - auto-solve mode. Eliminates candidates and fills in obvious cells
 * @prop {Dispatch<SetStateAction<boolean>>} setModeAuto - set auto-solve mode.
 * @prop {boolean} modeMouse - if false, primary click selects cells, if true, primary click toggles candidates
 * @prop {Dispatch<SetStateAction<boolean>>} setModeMouse - if false, primary click selects cells, if true, primary click toggles candidates
 * @prop {string} gameId - The id of the current game in the database. Is empty if no game started.
 * @prop {Dispatch<SetStateAction<string>>} setGameId - reset gameId. Used when starting or resuming a game.
 * @prop {string} difficulty - Difficulty level of current game, like 'medium'. Empty if no game started.
 * @prop {Dispatch<SetStateAction<string>>} setDifficulty - reset difficulty. Used when starting or resuming a game.
 * @prop {number} elapsedTime - elapsed time for this game
 * @prop {number} setElapsedTime - update current elapsed time for this game
 * @prop {(digit: number) => void} enterDigit - enter a digit to be the value for all selected cells
 * @prop {(color: string) => void} enterColor - change background color for all selected cells.
 * @prop {(candidate: number, cellRef?:string) => void} toggleCandidate - The optional cellRef parameter is so you don't have to wait for a cell to be added to the selected list.
 * @prop {(cell: string, force?: boolean) => void} toggleSelected - if included, if force is true, this cell will be selected, if force is false, it will not
*/

// Initialize new context for game
const GameContext = createContext();

/**
 * A custom hook to provide immediate usages of the game context in other components
 * @returns {GameContextProps}
*/ 
export const useGameContext = () => useContext(GameContext)

/**
 * GameProvider component that holds initial state, returns provider component
 */
export default function GameProvider( {children}) {
  
  // ****** define useState hooks ********

  const [gameArray , setGameArray] = useState(blankGameArray());
  const [selected, setSelected] = useState(['R0C0']);
  const [highlightedDigit, setHighlightedDigit] = useState(0);
  const [modeMultiselect, setModeMultiselect] = useState(false);
  const [modeAuto, setModeAuto] = useState(false);
  const [modeMouse, setModeMouse] = useState(false);
  const [gameId, setGameId] = useState('test');
  const [difficulty, setDifficulty] = useState('test');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [message, setMessage] = useState('');

  // ***** define GraphQL hooks

  const [addGame] = useMutation(ADD_GAME)
  const [updateGame] = useMutation(UPDATE_GAME);

  // ****************  These functions are used by the game actions for saving to database

  /**
   * Saves the game to the database
   * @param {Cell[][]} [updatedArray] - the array to save to the database. If not included, will use the current gameArray
   * @param {boolean} [check] - enter true if you want to check to see if the game is solved
   * @returns 
   */
  async function saveGameState(updatedArray, check=false) {

    if (!gameId) {
      setMessage('This game cannot be saved.');
      return;
    }

    const sudokuArray = updatedArray || gameArray;

    if (check) {
      const { isCorrect, error } = isSolutionCorrect(sudokuArray);
      if (error) {
        setMessage(error)
      } else {
        if (isCorrect) {
          setIsSolved(true)
        }
      }

      if (isCorrect) {
        try {
          const { data } = await updateGame({
            variables: {
              gameId,
              gameData: JSON.stringify(sudokuArray),
              elapsedTime,
              isSolved: true,
            },
          });
          if (data.stats) {
            setMessage('You won!'+JSON.stringify(data.stats))
            // *TODO* Perform whatever needs to happen when a game is solved, and display new stats.
            // On the other hand, maybe it's a useEffect() that checks if isSolved === true.
            // So that component could have the stats as its own useState() variable, so it will show that you won,
            // and then show loading while the stats come in.
          }
          return data;
        } catch {
          setMessage('You need to be logged in to save your game.');
          return;
        }
      }
    }
    // This is just regular saving the game.  It runs if !check or if !isCorrect. 
    try {
      const { data } = await updateGame({
        variables: {
          gameId,
          gameData: JSON.stringify(sudokuArray),
          elapsedTime
        },
      });
      return data;
    } catch {
      setMessage('You need to be logged in to save your game.');
      return;
    }
  }
  
  /**
   * This is for creating a new game.  This will add the new game to the database
   * @param {Cell[][]} sudokuArray - array to save
   * @param {string} difficulty - difficulty level to save
   */
  async function saveNewGame(sudokuArray,difficulty) {
    try {
      const { data } = await addGame({
        variables: {
          gameData: JSON.stringify(sudokuArray),
          difficulty
        },
      });
      setGameId(data.game.gameId);
    } catch {
      setMessage('You need to be logged in to save your game.');
    }
  }

// ***** start definition of functions or anything else to pass as game context props

const toggleSelected = toggleSelectedHandler(setSelected, modeMultiselect);
const enterColor = enterColorHandler(gameArray,setGameArray,selected);

async function shuffle() {
  const updatedArray = shuffleHandler(gameArray);
  await saveGameState(updatedArray);
}

async function toggleCandidate(candidate, cellRef) {
  const updatedArray = toggleCandidateHandler(gameArray,selected,modeMultiselect,candidate,cellRef) ;
  await saveGameState(updatedArray);
}

async function enterDigit(digit) {
  // Create shallow copy of previous gameArray
  const updatedArray = gameArray.map((rows) => [...rows]);
  for (const [,row,,col] of selected) {
    if (!gameArray[row][col].given) {updatedArray[row][col].value = digit}
  }
  setGameArray(updatedArray);
  await saveGameState(updatedArray,true);
}

async function loadDifficulty(difficulty){
  const updatedArray = getBoardByDifficulty(difficulty).then((board) =>{
    console.log(difficulty);
    const updatedArray = blankGameArray();
    if (board?.newboard?.grids?.[0]?.value && board?.newboard?.grids?.[0]?.solution) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          let newValue = board.newboard.grids[0].value[row][col];
          let newSolution = board.newboard.grids[0].solution[row][col];
          const newCell = {
            ...gameArray[row][col],
            value: newValue,
            candidates: new Set(),
            given: !!newValue,
            solution: newSolution,
          };
          updatedArray[row][col] = newCell;
          console.log("HUGE!!" + newCell.value);
        }
      }
    } else {
      console.error("Invalid board structure:", board);
    }
    console.log("Done: " + updatedArray);
    setGameArray(updatedArray);
    return updatedArray;
  })
  await saveGameState(updatedArray);
  
  
}

// ************ End define game functions

  
  /** 
   * Everything the children of GameProvider get access to using `useGameContext()`
   * @type {GameContextProps} 
   */
  const contextProps = {
      gameArray, setGameArray,
      selected, setSelected,
      highlightedDigit, setHighlightedDigit,
      modeMultiselect, setModeMultiselect,
      modeAuto, setModeAuto,
      modeMouse, setModeMouse,
      difficulty, setDifficulty,
      elapsedTime, setElapsedTime,
      gameId, setGameId,
      isSolved, setIsSolved,
      message, setMessage,
      toggleCandidate,
      enterDigit,
      toggleSelected,
      enterColor,
      loadDifficulty,
      shuffle,
    }

  return (
    <GameContext.Provider value = { contextProps }>
      { children }
    </GameContext.Provider>
  )
}