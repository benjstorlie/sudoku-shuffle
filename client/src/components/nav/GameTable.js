import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_UNSOLVED_GAMES } from "../../utils/queries";
import { REMOVE_GAME } from "../../utils/mutations";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useGameContext } from "../../utils/GameContext";
import { useNavigate } from "react-router-dom";

export default function GameTable({ profilePage }) {
  // refetch will ask it to query again and re-render the componenent.
  const { loading, error, data, refetch } = useQuery(QUERY_UNSOLVED_GAMES);
  const [removeGame] = useMutation(REMOVE_GAME);
  const navigate = useNavigate();

  const {
    gameId: currentGameId,
    setGameId,
    setDifficulty,
    setElapsedTime,
    setGameArray,
    setIsSolved,
    resetGame,
  } = useGameContext();

  useEffect(() => {
    refetch(); // Refetch when the current gameId changes
  }, [currentGameId, refetch]);

  const handleResumeGame = (game) => {
    setGameId(game._id);
    setDifficulty(game.difficulty);
    setElapsedTime(game.elapsedTime);
    setIsSolved(false);
    const parsedGameData = JSON.parse(game.gameData, (key, val) =>
      key === "candidates" ? new Set(val) : val
    );
    const newArray = parsedGameData.gameArray || parsedGameData;
    setGameArray(newArray);

    // Redirect to the game page after setting context
    navigate("/");
  };

  const handleRemoveGame = async (gameId) => {
    try {
      if (gameId === currentGameId) {
        resetGame();
      }
      await removeGame({ variables: { gameId } });
      // Refetch the data to update the table after deleting the game
      refetch();
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Game</th>
          <th>Difficulty</th>
          <th>Elapsed Time</th>
          <th>Resume Game</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={5}>Loading games...</td>
          </tr>
        ) : null}
        {error ? (
          <tr>
            <td colSpan={5}>
              {error.message === "You need to be logged in!"
                ? "Log in to resume your saved games."
                : `Error: ${error.message}`}
            </td>
          </tr>
        ) : null}
        {!error && !data?.games.length ? (
          <tr>
            <td colSpan={5}>No games to resume</td>
          </tr>
        ) : null}
        {data?.games?.map(
          (game) =>
            (game._id !== currentGameId || profilePage) && (
              <tr key={game._id}>
                <td>
                  <GameSVG gameData={game.gameData} inputString={game._id} />
                </td>
                <td>{game.difficulty}</td>
                <td>{game.elapsedTime} seconds</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleResumeGame(game)}
                  >
                    Resume Game
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveGame(game._id)}
                  >
                    X
                  </Button>
                </td>
              </tr>
            )
        )}
      </tbody>
    </Table>
  );
}

function GameSVG({ gameData, color, inputString, width = 90, padding = 3 }) {
  color = color || stringToColor(inputString);
  /* Squares based on array values */
  function Squares() {
    try {
      const parsedGameData = JSON.parse(gameData);
      const gameArray = parsedGameData.gameArray || parsedGameData;
      return (
        <>
          {gameArray.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
              cell.value ? (
                <rect
                  key={`${rowIndex}-${colIndex}`}
                  y={(width / 9) * rowIndex}
                  x={(width / 9) * colIndex}
                  width={width / 9}
                  height={width / 9}
                  fill={color}
                />
              ) : null
            )
          )}
        </>
      );
    } catch {
      return <></>;
    }
  }

  const lines = [
    [
      [0, width / 3],
      [width, width / 3],
    ],
    [
      [0, (2 * width) / 3],
      [width, (2 * width) / 3],
    ],
    [
      [width / 3, 0],
      [width / 3, width],
    ],
    [
      [(2 * width) / 3, 0],
      [(2 * width) / 3, width],
    ],
  ];

  return (
    <svg
      width={width + 2 * padding}
      height={width + 2 * padding}
      viewBox={`${-padding} ${-padding} ${width + 2 * padding} ${
        width + 2 * padding
      }`}
    >
      {/* Rectangle outlining the SVG */}
      <rect
        x="0"
        y="0"
        width={width}
        height={width}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />

      {/* Vertical and horizontal lines */}
      {lines.map(([[x1, y1], [x2, y2]], index) => (
        <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} />
      ))}

      <Squares />
    </svg>
  );
}

// ChatGPT gave me this hash function to turn a string into a color
// I thought it made sense to have difficulty levels have the same colors, but I was afraid of not including every difficulty level.
// This way, every string gets a different color!
// I'm sure there's a more visually appealing solution, though
function stringToColor(inputString, lightness = 40, saturation = 100) {
  let hue;
  if (inputString) {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      hash = inputString.charCodeAt(i) + (hash << 5) - hash;
    }

    // Convert the hash to a positive integer and map it to a hue value (0 to 360 degrees)
    hue = ((hash % 360) + 360) % 360;
  } else {
    // Generate random hue (0 to 360 degrees)
    hue = Math.floor(Math.random() * 361);
  }
  // Combine the values to create an hsl color string
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
