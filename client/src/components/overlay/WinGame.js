import Table from 'react-bootstrap/Table';

const difficulties = { easy: 0, medium: 1, hard: 2 };

export default function WinGame({elapsedTime, difficulty, loading, stats}) {

  return (
    <div>
      <h1>You won!</h1>
      <h2>Time: {elapsedTime} seconds</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Difficulty</th>
          <th>Num Solved</th>
          <th>Best Time</th>
          <th>Avg Time</th>
        </tr>
      </thead>
      <tbody>
        {loading && <tr><td colSpan={4}>Loading your current stats!</td></tr>}
        {stats.sort((a,b) => difficulties[a.difficulty]-difficulties[b.difficulty]).map((stat, index) => (
          <tr key={index} style={stat.difficulty === difficulty && {fontStyle:'bold'}}>
            <td>{stat.difficulty}</td>
            <td>{stat.numSolved}</td>
            <td>{stat.bestTime}</td>
            <td>{stat.avgTime}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
}

