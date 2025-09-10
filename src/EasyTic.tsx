import React, { useState, useEffect } from "react";
import "./EasyTic.css";

type Player = "X" | "O" | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EasyTic: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);

  useEffect(() => {
    checkWinner();
  }, [board]);

  const checkWinner = () => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        board[a] === "X"
          ? setPlayer1Score(score => score + 1)
          : setPlayer2Score(score => score + 1);
        return;
      }
    }
    if (board.every(cell => cell !== null)) setWinner("Draw");
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer("X");
  };

  return (
    <>
      {/* Navbar outside game container */}
      <div className="navbar">
        <div className="logo">Tic Tac Toe</div>
        <div className="nav-links">
          <button>Docs</button>
          <button>Play</button>
          <button>About Us</button>
        </div>
      </div>

      <div className="tictactoe-container">
        {/* Header */}
        <div className="tictactoe-header">
          <h1>
            THE 
            TIC-TAC-TOE 
            GAME
          </h1>
        </div>

        {/* Game layout */}
        <div className="game-layout">
          {/* Player 1 Score */}
          <div className="score-board">
            <div>Player 1</div>
            <div>Score</div>
            <div className="score-value">{player1Score}</div>
          </div>

          {/* Game Board */}
          <div className="game-board">
            <div className="board-grid">
              {board.map((cell, idx) => (
                <button
                  key={idx}
                  onClick={() => handleClick(idx)}
                  disabled={!!board[idx] || !!winner}
                >
                  {cell}
                </button>
              ))}
            </div>

            <button className="new-game-btn" onClick={handleNewGame}>
              New Game
            </button>

            {winner && (
              <p className="winner-text">
                {winner === "Draw" ? "It's a draw!" : `Player ${winner} wins!`}
              </p>
            )}
          </div>

          {/* Player 2 Score */}
          <div className="score-board-2">
            <div>Player 2</div>
            <div>Score</div>
            <div className="score-value">{player2Score}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EasyTic;
