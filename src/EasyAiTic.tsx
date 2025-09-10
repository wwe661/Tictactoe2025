// src/AiTic.tsx
import React, { useEffect, useState } from "react";
// import "./TicTacToe.css";
import "./EasyTic.css";

const posToLetter = ["a", "d", "g", "b", "e", "h", "c", "f", "i"];
const letterToIndex: Record<string, number> = {
  a: 0, b: 3, c: 6,
  d: 1, e: 4, f: 7,
  g: 2, h: 5, i: 8,
};

const EasyAiTic: React.FC = () => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const [aiSymbol, setAiSymbol] = useState<"X" | "O" | null>(null);
  const [lastStats, setLastStats] = useState<any>(null);
  const [aiFirst, setAiFirst] = useState(false);
    const [player1Score, setPlayer1Score] = useState<number>(0);
    const [player2Score, setPlayer2Score] = useState<number>(0);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setMoveHistory([]);
    setWinner(null);
    // setPlayerSymbol(null);
    // setAiSymbol(null);
    setLastStats(null);
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !playerSymbol) return;

    // Player move
    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    let letter = posToLetter[index];
    const updatedHistory = [...moveHistory, letter];

    setBoard(newBoard);
    setMoveHistory(updatedHistory);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }

    // Ask AI for move
    askAiToMove(updatedHistory, newBoard);
  };

  const askAiToMove = async (history: string[], currentBoard: (string | null)[]) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/next-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: history }),
      });
      const data = await res.json();
      console.log("history",history)
      console.log("AI response:", data);

      const moveLetter: string = data.best_move;
      const moveIndex: number = letterToIndex[moveLetter];

      if (moveIndex !== undefined && currentBoard[moveIndex] === null) {
        const newBoard = [...currentBoard];
        newBoard[moveIndex] = aiSymbol;
        const updatedHistory = [...history, moveLetter];
        console.log("moveLetter", moveLetter);
        console.log("moveIndex", moveIndex);
        console.log("currentBoard", currentBoard);
        console.log("aiSymbol", aiSymbol);
        console.log("newboard",newBoard);
        console.log("updatedHistory",updatedHistory);

        setBoard(newBoard);
        setMoveHistory(updatedHistory);
        setLastStats(data.stats[moveLetter]); // keep stats for UI

        const win = calculateWinner(newBoard);
        if (win) {
          setWinner(win);
        }
      }
    } catch (err) {
      console.error("Error asking AI:", err);
    }
  };

  const renderSquare = (index: number) => (
    <button  onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const play = (choice: number) => () => {
    if (choice === 0) {
      // AI goes first as O
      setPlayerSymbol("X");
      setAiSymbol("O");
      setAiFirst(true);
      // Reset game state
      resetGame();
      // Optionally, you could ask AI to make the first move immediately
      askAiToMove([], Array(9).fill(null));
    } else if (choice === 1) {
      // Player goes first as X
      setPlayerSymbol("O");
      setAiSymbol("X");
      resetGame();
    } else {
      // Random
      const coin = Math.random() < 0.5 ? 0 : 1;
      play(coin)();
    }
  };
  useEffect(() => {
    if (aiFirst && moveHistory.length === 0) {
      // AI goes first
          askAiToMove([], Array(9).fill(null))
          setAiFirst(false);  // reset so it doesn’t keep firing
    }
  }, [aiFirst]);
  
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
        {/* <div className="tictactoe-header">
          <h1>
            THE 
            TIC-TAC-TOE 
            GAME
          </h1>
        </div> */}
        {/* Game layout */}
        <div className="game-layout">
          {/* Player 1 Score */}
          {/* <div className="score-board">
            <div>Player 1</div>
            <div>Score</div>
            <div className="score-value">{player1Score}</div>
          </div> */}
      
      {/* Game Board */}
          <div className="game-board">
            
            <div>
            <div className="status">
        {winner
          ? `Winner: ${winner}`
          : `Next: ${playerSymbol ? "Playing..." : "Choose O/X"}`}
      </div>
      <div className="board-grid">
      {/* <div className="board"> */}
        {/* <div className="board-row"> */}
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        {/* </div> */}
        {/* <div className="board-row"> */}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        {/* </div> */}
        {/* <div className="board-row"> */}
          {renderSquare(6)}
          {renderSquare(7)}   
          {renderSquare(8)}
        {/* </div> */}
      </div></div>
<div className="actions">
<button className="reset" onClick={resetGame}>
        ⟳
      </button>
      <button className="reset" onClick={play(0)}>Ai[O]<span className="toggle">AI First</span> </button>
      <button className="reset" onClick={play(1)}>P[X]<span className="toggle">Player First</span> </button>
      <button className="reset" onClick={play(2)}>O/X<span className="toggle"> Random</span></button>
      </div>
      
      {/* {lastStats && (
        <div className="stats">
          <h4>AI Move Stats</h4>
          <p>Win Rate: {(lastStats.win_rate * 100).toFixed(1)}%</p>
          <p>Draw Rate: {(lastStats.draw_rate * 100).toFixed(1)}%</p>
          <p>Loss Rate: {(lastStats.loss_rate * 100).toFixed(1)}%</p>
        </div>
      )} */}
      </div>
      {/* Player 2 Score */}
          {/* <div className="score-board-2">
            <div>Player 2</div>
            <div>Score</div>
            <div className="score-value">{player2Score}</div>
          </div> */}

        </div>
        </div>
    </>
  );
};

export default EasyAiTic;