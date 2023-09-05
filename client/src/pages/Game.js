import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SudokuGrid from "../components/game/SudokuGrid";
import Controls from "../components/game/Controls";
import GameTable from "../components/nav/GameTable";
import Timer from "../components/game/Timer";

export default function Game() {
  return (
    <Row>
      <Col xs={12} lg={7}>
        <SudokuGrid />
      </Col>
      <Col>
        <Controls />
      </Col>
      <Row>
        <Timer />
        <GameTable />
      </Row>
    </Row>
  );
}
