import Spinner from 'react-bootstrap/Spinner';

export default function Loading() {
  return (<div className="container-fluid" style={{padding:'2rem',textAlign:'center'}}>
    <h1>Building your game...</h1>
    <Spinner variant="primary" animation="border" role="status"/>
  </div>)
}