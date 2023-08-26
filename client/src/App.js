import Header from './components/nav/Header';
import Footer from './components/nav/Footer';
import SudokuGrid from './components/game/SudokuGrid';
import GameProvider from './utils/GameContext'

function App() {
  return (
    <div className="App">
      <Header />
      <GameProvider>
        <SudokuGrid />
      </GameProvider>
      <Footer />
    </div>
  );
}

export default App;
