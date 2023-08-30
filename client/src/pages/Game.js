import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SudokuGrid from '../components/game/SudokuGrid';
import GameProvider from '../utils/GameContext';
import Controls from '../components/game/Controls';

export default function Game() {
  return (
    <GameProvider>
      <Row>
        <Col xs={12} lg={9}>
          <SudokuGrid />
        </Col>
        <Col>
          <Controls />
        </Col>
      </Row>
    </GameProvider>
  )
}