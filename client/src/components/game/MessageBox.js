import React, {useState, useEffect} from 'react';
import { useGameContext } from '../../utils/GameContext';
import Card from 'react-bootstrap/Card';

export default function MessageBox() {
  const { message, setMessage } = useGameContext();
  const [messageBg, setMessageBg] = useState('light')

  useEffect(() => {
    if (message) {
      setMessageBg('danger');
      setTimeout(() => {
        setMessageBg('light'); // Reset to light
      }, 1000); // Adjust the delay as needed

      // Event listener to clear message when the mouse is clicked
      const handleClick = () => {
        setMessage('');
        setMessageBg('light')
      };
      
      // Event listener to clear message when a key is pressed
      const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
          setMessage('');
          setMessageBg('light')
        }
      };

      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyPress);

      return () => {
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [message, setMessage]);
  return (
    <Card id="message-box" bg={messageBg} style={{transition: 'all 0.5s', minHeight:'8rem'}}>
    <Card.Header>Message:</Card.Header>
    <Card.Body><Card.Text>{message}</Card.Text></Card.Body>
  </Card>
  )
}