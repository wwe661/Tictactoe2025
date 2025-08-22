// src/App.js
import React from 'react';
import TicTacToe from './TicTacToe';
import EasyAiTic from './EasyAiTic';
function App() {
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      {/* <TicTacToe /> */}
      <EasyAiTic />
    </div>
  );
}

export default App;
