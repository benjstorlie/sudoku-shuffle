import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SudokuGrid from '../components/game/SudokuGrid';
import Controls from '../components/game/Controls';
import GameTable from '../components/nav/GameTable';

export default function Game() {
  return (
      <Row>
        <Col className="flex-1">
          <SudokuGrid />
        </Col>
        <Col>
          <Controls />
        </Col>
        <Col>
         <GameTable />
        </Col>
      </Row>
  )
}