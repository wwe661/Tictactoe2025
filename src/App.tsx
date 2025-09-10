// src/App.js
import AI_TTT from './Hard_TTT';
import React from 'react';
import TicTacToe from './TicTacToe';
import EasyAiTic from './EasyAiTic';
import EasyTic from './EasyTic';
function App() {
  return (
    <div className="App">
      {/* <h1>Tic Tac Toe</h1> */}
      {/* <TicTacToe /> */}
      <AI_TTT />
      <EasyAiTic />
      {/* <EasyTic /> */}
    </div>
  );
}

export default App;