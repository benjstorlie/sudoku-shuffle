/**
 * @description 
 * Table of Contexts (sort of)
 * (Since most of the functions are local to GameProvider, linking them from here doesn't work, but if you highlight and search, you can jump to it.)
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
 * @prop {{show:boolean,message:React.JSX.Element}} overlay - show overlay over sudoku grid
 * @prop {Dispatch<SetStateAction<{show:boolean,message:React.JSX.Element}>>} setOverlay - set if overlay is shown over sudoku grid, set overlay.message to be a react component
 * @prop {(digit: number) => void} enterDigit - enter a digit to be the value for all selected cells
 * @prop {(color: string) => void} enterColor - change background color for all selected cells.
 * @prop {(candidate: number, cellRef?:string) => void} toggleCandidate - The optional cellRef parameter is so you don't have to wait for a cell to be added to the selected list.
 * @prop {(options?:{all:boolean})=>void} clearCandidates - clear candidates in selected cells, or, if {all: true}, clear candidates from all cells
 * @prop {(options?:{all:boolean})=>void} fillCandidates - fill in all candidates in selected cells, or, if {all: true}, fill in candidates in all cells
 * @prop {(cell: string, force?: boolean) => void} toggleSelected - if included, if force is true, this cell will be selected, if force is false, it will not
 * @prop {(*)=>*} saveNewGame - create new game in database, with mutation {@link ADD_GAME}, returns response from server, which includes the new gameId
 * @prop {(*)=>*} saveGameState - update current game in database, with mutation {@link UPDATE_GAME}
 * @prop {() => void} resetGame - resets most game variables, including gameId and gameArray, to their blank, initial values
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
  const [overlay, setOverlay] = useState({show:false,message:<p></p>});

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

    if (!gameId || gameId === 'test') {
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
          const {  data, error } = await updateGame({
            variables: {
              gameId,
              gameData: JSON.stringify({gameArray:sudokuArray}, (key, val) => (key === 'candidates' ? [...val] : val)),
              elapsedTime,
              isSolved: true,
            },
          });
          if (data?.updateGame.stats.length) {
            setMessage('You won!\n'+JSON.stringify(data?.updateGame.stats, (key, val) => (key[0]==='_' ? undefined : val)))
            // *TODO* Perform whatever needs to happen when a game is solved, and display new stats.
            // On the other hand, maybe it's a useEffect() that checks if isSolved === true.
            // So that component could have the stats as its own useState() variable, so it will show that you won,
            // and then show loading while the stats come in.
          }
          console.log( data, (error || 'No error saving winning game.'))
          return data;
        } catch (err) {
          setMessage('Error saving game.');
          console.error(err);
          return;
        }
      }
    }
    // This is just regular saving the game.  It runs if !check or if !isCorrect. 
    try {
      const { data, error } = await updateGame({
        variables: {
          gameId,
          gameData: JSON.stringify({gameArray:sudokuArray}, (key, val) => (key === 'candidates' ? [...val] : val)),
          elapsedTime
        },
      });
      console.log(data,(error || 'No error received.'));
      return data;
    } catch (err) {
      setMessage('Error saving game.');
      console.error(err);
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
          gameData: JSON.stringify({gameArray:sudokuArray}, (key, val) => (key === 'candidates' ? [...val] : val)),
          difficulty
        },
      });
      if (data.addGame._id) {
        setGameId(data.addGame._id);
      } else {
        setMessage('Something went wrong saving new game. (Open dev console for help.)');
        console.log(data); // Do Not Erase
      }
      console.log(data);
      return data
    } catch {
      setMessage('You need to be logged in to save your game.');
    }
  }

// ***** start definition of functions or anything else to pass as game context props

const toggleSelected = toggleSelectedHandler(setSelected, modeMultiselect);
const enterColor = enterColorHandler(gameArray,setGameArray,selected);

function resetGame() {
  setGameArray(blankGameArray());
  setDifficulty('');
  setGameId('');
  setElapsedTime(0);
  setIsSolved(false);
}

async function shuffle() {
  const updatedArray = shuffleHandler(gameArray);
  setGameArray(updatedArray)
  await saveGameState(updatedArray);
}

async function toggleCandidate(candidate, cellRef) {
  const updatedArray = toggleCandidateHandler(gameArray,selected,modeMultiselect,candidate,cellRef) ;
  await saveGameState(updatedArray);
}

async function clearCandidates(options) {
  // Create shallow copy of previous gameArray
  const updatedArray = gameArray.map((rows) => [...rows]);
  if (options?.all) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        updatedArray[row][col].candidates.clear();
      }
    }
  } else {
    for (const [,row,,col] of selected ) {
      updatedArray[row][col].candidates.clear();
    }
  }
  await saveGameState(updatedArray);
}

async function fillCandidates(options) {
  // Create shallow copy of previous gameArray
  const updatedArray = gameArray.map((rows) => [...rows]);
  if (options?.all) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        updatedArray[row][col].candidates = new Set([1,2,3,4,5,6,7,8,9]);
      }
    }
  } else {
    for (const [,row,,col] of selected ) {
      updatedArray[row][col].candidates = new Set([1,2,3,4,5,6,7,8,9]);;
    }
  }
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
  // show loading message (you can put whatever react component in 'message', I'm sure)
  setOverlay({show:true, message:<h1>loading...</h1>})
  getBoardByDifficulty(difficulty).then(async (board) =>{
    const updatedArray = blankGameArray();
    if (board?.newboard?.grids?.[0]?.value && board?.newboard?.grids?.[0]?.solution) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          let newValue = board.newboard.grids[0].value[row][col];
          let newSolution = board.newboard.grids[0].solution[row][col];
          const newCell = {
            ...updatedArray[row][col],
            value: newValue,
            candidates: modeAuto ? new Set([1,2,3,4,5,6,7,8,9]) : new Set() ,
            given: !!newValue,
            solution: newSolution,
          };
          updatedArray[row][col] = newCell;
        }
      }
    } else {
      setOverlay({show:true, message:<h1>Error loading game.</h1>})
      console.error("Invalid board structure:", board);
    }
    const shuffledArray = shuffleHandler(updatedArray)
    setGameArray(shuffledArray);
    setOverlay({show:false,message:<p></p>})
    await saveNewGame(shuffledArray,difficulty);
  })
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
      overlay, setOverlay,
      toggleCandidate,
      clearCandidates,
      fillCandidates,
      enterDigit,
      toggleSelected,
      enterColor,
      loadDifficulty,
      shuffle,
      resetGame,
      saveNewGame, saveGameState
    }

  return (
    <GameContext.Provider value = { contextProps }>
      { children }
    </GameContext.Provider>
  )
}