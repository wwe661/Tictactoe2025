import React, { useState } from "react";
import precomputedSituations from "./backend/precomputedSituations.json";

type Player = "X" | "O" | null;
type Board = Player[];

// Encode board as a string key for lookup
function encodeBoard(board: Board): string {
  return board.map((cell, i) => (cell ? i + cell : "")).filter(Boolean).join(",");
}

// Determine best move using precomputed outcomes
function getBestMove(board: Board, currentPlayer: Player): number | null {
  const availableMoves = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((v) => v !== null) as number[];

  let bestMove: number | null = null;
  let bestScore = -2;

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = currentPlayer;
    const newState = encodeBoard(newBoard);
    const score = precomputedSituations[newState];

    if (score !== undefined) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }
  return bestMove;
}

// Payoff tables (Player 1 vs Player 2)
function generatePayoffTables(board: Board, currentPlayer: Player) {
  const availableMoves = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((v) => v !== null) as number[];

  const p1Table: { move: number; payoff: number }[] = [];
  const p2Table: { move: number; payoff: number }[] = [];

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = currentPlayer;
    const newState = encodeBoard(newBoard);
    const score = precomputedSituations[newState];

    if (currentPlayer === "X") {
      p1Table.push({ move, payoff: score ?? 0 });
    } else {
      p2Table.push({ move, payoff: score ?? 0 });
    }
  }

  return { p1Table, p2Table };
}

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = "X"; // Player 1 move
    setBoard(newBoard);
    setXIsNext(false);

    setTimeout(() => {
      const aiMove = getBestMove(newBoard, "O");
      if (aiMove !== null) {
        const boardAfterAI = [...newBoard];
        boardAfterAI[aiMove] = "O";
        setBoard(boardAfterAI);
      }
      setXIsNext(true);
    }, 500);
  };

  const winner = calculateWinner(board);
  const { p1Table, p2Table } = generatePayoffTables(board, xIsNext ? "X" : "O");

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold">Tic-Tac-Toe with Payoff Tables</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-16 h-16 text-xl font-bold border rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && <h2 className="text-xl font-semibold">Winner: {winner}</h2>}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Player 1 payoff table */}
        <div>
          <h3 className="font-semibold text-lg">Player 1 (X) Payoffs</h3>
          <table className="border border-gray-400 mt-2">
            <thead>
              <tr>
                <th className="border px-2">Move</th>
                <th className="border px-2">Payoff</th>
              </tr>
            </thead>
            <tbody>
              {p1Table.map((row) => (
                <tr key={row.move}>
                  <td className="border px-2">{row.move}</td>
                  <td className="border px-2">{row.payoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Player 2 payoff table */}
        <div>
          <h3 className="font-semibold text-lg">Player 2 (O) Payoffs</h3>
          <table className="border border-gray-400 mt-2">
            <thead>
              <tr>
                <th className="border px-2">Move</th>
                <th className="border px-2">Payoff</th>
              </tr>
            </thead>
            <tbody>
              {p2Table.map((row) => (
                <tr key={row.move}>
                  <td className="border px-2">{row.move}</td>
                  <td className="border px-2">{row.payoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple winner checker
function calculateWinner(board: Board): Player {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default TicTacToe;
