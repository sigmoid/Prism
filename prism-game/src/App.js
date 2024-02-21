import './App.css';
import Game from './Components/Game.js';

const App = () =>
{
  return (
    <div className="App">
      <div className="App-header">
        <div>
          <h2>Project PRISM</h2>
        </div>
      </div>
      <Game></Game>
      <footer className="App-footer">
        <h6 className="m-3">Created by <a href="https://www.absurdwalls.com">ABSURD WALLS</a> | Inspired by <a href="https://adarkroom.doublespeakgames.com/">A Dark Room</a></h6>
      </footer>
    </div>
  );
}

export default App;
