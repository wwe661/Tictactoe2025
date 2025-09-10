// src/App.js
import AI_TTT from './Hard_TTT';
import React from 'react';
import TicTacToe from './TicTacToe';
import EasyAiTic from './EasyAiTic';
import EasyTic from './EasyTic';
import HomePage from './HomePage';
function App() {
  return (
    <div className="App">
      {/* <h1>Tic Tac Toe</h1> */}
      {/* <TicTacToe /> */}
      {/* <AI_TTT /> */}
      <EasyAiTic />
      {/* <EasyTic />  */}
      {/* <HomePage /> */}
    </div>
  );
}

export default App;