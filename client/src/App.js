import Header from './components/nav/Header';
import Footer from './components/nav/Footer';
import SudokuGrid from './components/game/SudokuGrid';

function App() {
  return (
    <div className="App">
      <Header />
      <SudokuGrid />
      <Footer />
    </div>
  );
}

export default App;
