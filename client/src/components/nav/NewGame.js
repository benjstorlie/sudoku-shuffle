import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import { useGameContext } from "../../utils/GameContext";

export default function NewGame({ className }) {
  const { loadDifficulty } = useGameContext();

  return (
    <Card
      bg="secondary"
      id="new-game"
      className="pt-2m-2 border border-white"
      style={{ minWidth: "fit-content" }}
    >
      <Card.Title
        className="text-white"
        style={{ textAlign: "center", fontFamily: "Black Ops One" }}
      >
        Start New Game
      </Card.Title>
      <ButtonGroup size="lg" className={className}>
        <Button variant="success" onClick={() => loadDifficulty("easy")}>
          Easy
        </Button>
        <Button variant="warning" onClick={() => loadDifficulty("medium")}>
          Medium
        </Button>
        <Button variant="danger" onClick={() => loadDifficulty("hard")}>
          Hard
        </Button>
      </ButtonGroup>
    </Card>
  );
}
