import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { useGameContext } from '../../utils/GameContext';

export default function NewGame({className}) {

  const { loadDifficulty } = useGameContext();

  return (
    <div id="new-game">
      <h4>Start New Game</h4>
        <ButtonGroup size='lg' className={className}>
    <Button variant='success' onClick={() => loadDifficulty('easy')}>Easy</Button>
    <Button variant='warning' onClick={() => loadDifficulty('medium')} >Medium</Button>
    <Button variant='danger' onClick={() => loadDifficulty('hard')} >Hard</Button>
  </ButtonGroup>
    </div>
  )
}