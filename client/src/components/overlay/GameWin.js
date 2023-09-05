import Table from 'react-bootstrap/Table';

const difficulties = { easy: 0, medium: 1, hard: 2 };

export default function WinGame({elapsedTime, difficulty, stats}) {

  function styleRow(statDifficulty) {
    if (statDifficulty === difficulty) {
      return ({
        backgroundColor: 'rgb(255, 137, 137)',
        fontWeight:'bold'
      })
    } else {
      return {}
    }
  }

  return (
    <div className='container-fluid'>
      <div id="you-won" style={{backgroundImage:'var(--rainbow-light)',borderRadius:'20px',textAlign:'center',padding:'0.5rem',marginBottom:'1rem'}}>
        <h1>You won!</h1>
        {/* <h2>Time: {elapsedTime} seconds</h2> */}
        <h2>{elapsedTime} moves!</h2>
        <h6>Use the control panel to start a new game!</h6>
      </div>
    <Table bordered>
      <thead>
        <tr>
          <th>Difficulty</th>
          <th>Num Solved</th>
          <th>Best Moves</th>
          <th>Average Moves</th>
        </tr>
      </thead>
      <tbody>
      { stats.sort((a,b)=> difficulties[a.difficulty]-difficulties[b.difficulty]).map((stat, index) => (
          <tr key={index} >
            <td style={styleRow(stat.difficulty)}>{stat.difficulty}</td>
            <td style={styleRow(stat.difficulty)}>{stat.numSolved}</td>
            <td style={styleRow(stat.difficulty)}>{stat.bestTime}</td>
            <td style={styleRow(stat.difficulty)}>{stat.averageTime}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
}

