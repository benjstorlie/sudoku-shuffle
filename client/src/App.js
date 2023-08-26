import Header from './components/nav/Header';
import Footer from './components/nav/Footer';
import SudokuGrid from './components/game/SudokuGrid';
import GameProvider from './utils/GameContext'
import Controls from './components/game/Controls';

function App() {
  return (
    <div className="App">
      <Header />
      <GameProvider>
        <SudokuGrid />
        <Controls />
      </GameProvider>
      <Footer />
    </div>
  );
}

export default App;
