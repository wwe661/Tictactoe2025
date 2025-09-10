import React, { useState, useEffect, useMemo } from 'react';
import precomputedSituations from './backend/precomputedSituations.json';
import './Hard_TTT.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('Choose who goes first');
  const [moveHistory, setMoveHistory] = useState([]);
  const [stats, setStats] = useState({ games: 0, wins: 0, losses: 0, draws: 0 });
  const [playerFirst, setPlayerFirst] = useState(null);
  const [showPayoff, setShowPayoff] = useState(false);

  // ---------- calculate Winner ----------
  const calculateWinner = (squares) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => squares.every(s => s !== null);

  // ---------- Minimax from PLAYER (X) perspective ----------
  // returns { score: number, index: number } where score >0 favors PLAYER (X),
  // score <0 favors AI (O), score==0 draw. Higher absolute values prefer faster results.
  const minimaxPlayer = (curBoard, depth, isPlayerTurnParam) => {
    const winner = calculateWinner(curBoard);
    if (winner === 'X') return { score: 10 - depth, index: -1 };
    if (winner === 'O') return { score: depth - 10, index: -1 };
    if (isBoardFull(curBoard)) return { score: 0, index: -1 };

    if (isPlayerTurnParam) { // player's (X) move -> maximize
      let bestScore = -Infinity;
      let bestMove = -1;
      for (let i = 0; i < 9; i++) {
        if (curBoard[i] === null) {
          curBoard[i] = 'X';
          const result = minimaxPlayer(curBoard, depth + 1, false).score;
          curBoard[i] = null;
          if (result > bestScore) {
            bestScore = result;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    } else { // AI's (O) move -> minimize (from player's perspective)
      let bestScore = Infinity;
      let bestMove = -1;
      for (let i = 0; i < 9; i++) {
        if (curBoard[i] === null) {
          curBoard[i] = 'O';
          const result = minimaxPlayer(curBoard, depth + 1, true).score;
          curBoard[i] = null;
          if (result < bestScore) {
            bestScore = result;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    }
  };

  // ---------- Minimax from AI (O) perspective (keeps original AI logic) ----------
  // returns {score, index} where score >0 favors AI (O), <0 favors Player (X)
  const minimaxAI = (curBoard, depth, isMaximizing) => {
    const winner = calculateWinner(curBoard);
    if (winner === 'O') return { score: 10 - depth, index: -1 };
    if (winner === 'X') return { score: depth - 10, index: -1 };
    if (isBoardFull(curBoard)) return { score: 0, index: -1 };

    if (isMaximizing) { // AI's move -> maximize
      let bestScore = -Infinity;
      let bestMove = -1;
      for (let i = 0; i < 9; i++) {
        if (curBoard[i] === null) {
          curBoard[i] = 'O';
          const s = minimaxAI(curBoard, depth + 1, false).score;
          curBoard[i] = null;
          if (s > bestScore) {
            bestScore = s;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    } else { // Player's move -> minimize (from AI perspective)
      let bestScore = Infinity;
      let bestMove = -1;
      for (let i = 0; i < 9; i++) {
        if (curBoard[i] === null) {
          curBoard[i] = 'X';
          const s = minimaxAI(curBoard, depth + 1, true).score;
          curBoard[i] = null;
          if (s < bestScore) {
            bestScore = s;
            bestMove = i;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    }
  };

  // ---------- Payoff & suggestions (PLAYER perspective) ----------
  // Returns payoff from player's perspective roughly between -1 and 1 (depth normalized)
  const getPayoffValue = (move, currentBoard, history) => {
    const testHistory = [...history, String.fromCharCode(97 + move)].join(',');
    if (precomputedSituations.hasOwnProperty(testHistory)) {
      const aiPayoff = precomputedSituations[testHistory]; // AI perspective: 1 AI win, 0 draw, -1 AI lose
      return -aiPayoff; // invert -> player's perspective
    }
    // fallback to minimaxPlayer: simulate placing 'X' then compute score
    const testBoard = [...currentBoard];
    testBoard[move] = 'X';
    const result = minimaxPlayer(testBoard, 0, false).score; // numeric roughly [-9..9]
    return result / 10; // normalize to roughly [-1..1] for display
  };

  // Return array of payoff values (player's perspective) or null for occupied cells
  const getAllPayoffValues = () => {
    const arr = Array(9).fill(null);
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) arr[i] = getPayoffValue(i, board, moveHistory);
    }
    return arr;
  };

  // ---------- Best player move (guaranteed non-loss when possible) ----------
  const getBestPlayerMove = () => {
    const avail = board.map((v,i) => (v === null ? i : null)).filter(i => i !== null);
    if (avail.length === 0) return null;

    // preference order for tie-breaking: center, corners, edges
    const preferOrder = [4,0,2,6,8,1,3,5,7];

    let candidates = [];
    for (const move of avail) {
      const key = [...moveHistory, String.fromCharCode(97 + move)].join(',');
      let playerScore;
      if (precomputedSituations.hasOwnProperty(key)) {
        const aiPayoff = precomputedSituations[key]; // AI perspective (-1..1)
        playerScore = -aiPayoff * 10; // convert to same scale as minimaxPlayer (approx)
      } else {
        const tb = [...board];
        tb[move] = 'X';
        playerScore = minimaxPlayer(tb, 0, false).score; // numeric in [-9..9]
      }
      candidates.push({ move, score: playerScore });
    }

    // Find safe moves (score >= 0 means player guarantees at least a draw)
    const safe = candidates.filter(c => c.score >= 0);
    const pickFrom = (safe.length > 0) ? safe : candidates; // prefer safe moves, otherwise best available

    // Choose the move with highest score; if tie, choose by preferOrder
    pickFrom.sort((a,b) => {
      if (b.score !== a.score) return b.score - a.score;
      return preferOrder.indexOf(a.move) - preferOrder.indexOf(b.move);
    });

    return pickFrom[0] ? pickFrom[0].move : null;
  };

  // ---------- AI move selection using precomputed + minimaxAI ----------
  const getAIMove = (currentBoard, history) => {
    const availableMoves = currentBoard
      .map((s, idx) => (s === null ? idx : null))
      .filter(i => i !== null);
    if (availableMoves.length === 0) return null;

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of availableMoves) {
      const testKey = [...history, String.fromCharCode(97 + move)].join(',');
      if (precomputedSituations.hasOwnProperty(testKey)) {
        const score = precomputedSituations[testKey]; // AI perspective (-1..1)
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    // If precomputed didn't give a winning/dominant move, fallback to minimaxAI
    if (bestMove === null || bestScore < 1) {
      const mm = minimaxAI(currentBoard, 0, true).index;
      return mm;
    }
    return bestMove;
  };

  // ---------- Player action ----------
  const handleClick = (index) => {
    if (calculateWinner(board) || board[index] || !isPlayerTurn || playerFirst === null) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    const newHistory = [...moveHistory, String.fromCharCode(97 + index)];
    setMoveHistory(newHistory);

    const winner = calculateWinner(newBoard);
    if (winner) {
      setGameStatus('You win!');
      setStats(prev => ({ ...prev, games: prev.games + 1, wins: prev.wins + 1 }));
    } else if (isBoardFull(newBoard)) {
      setGameStatus('Draw game!');
      setStats(prev => ({ ...prev, games: prev.games + 1, draws: prev.draws + 1 }));
    } else {
      setGameStatus("AI's turn (O)");
      setIsPlayerTurn(false);
    }
  };

  // ---------- AI turn effect ----------
  useEffect(() => {
    if (!isPlayerTurn && playerFirst !== null) {
      const timer = setTimeout(() => {
        const winner = calculateWinner(board);
        if (winner || isBoardFull(board)) return;

        const aiMove = getAIMove(board, moveHistory);
        if (aiMove !== null && aiMove !== undefined) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);

          const newHistory = [...moveHistory, String.fromCharCode(97 + aiMove)];
          setMoveHistory(newHistory);

          const newWinner = calculateWinner(newBoard);
          if (newWinner) {
            setGameStatus('AI wins!');
            setStats(prev => ({ ...prev, games: prev.games + 1, losses: prev.losses + 1 }));
          } else if (isBoardFull(newBoard)) {
            setGameStatus('Draw game!');
            setStats(prev => ({ ...prev, games: prev.games + 1, draws: prev.draws + 1 }));
          } else {
            setGameStatus('Your turn (X)');
            setIsPlayerTurn(true);
          }
        }
      }, 300); // small thinking delay
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, moveHistory, playerFirst]);

  // ---------- Controls ----------
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(playerFirst);
    setGameStatus(playerFirst ? 'Your turn (X)' : "AI's turn (O)");
    setMoveHistory([]);
  };

  const startPlayerFirst = () => {
    setPlayerFirst(true);
    setIsPlayerTurn(true);
    setGameStatus('Your turn (X)');
    setBoard(Array(9).fill(null));
    setMoveHistory([]);
  };

  const startAIFirst = () => {
    setPlayerFirst(false);
    setIsPlayerTurn(false);
    setGameStatus("AI's turn (O)");
    setBoard(Array(9).fill(null));
    setMoveHistory([]);
  };

  // ---------- Memoized suggestions & payoffs ----------
  // memoize payoffs so they aren't recalculated for every square render
  const payoffs = useMemo(() => getAllPayoffValues(), [board, moveHistory]);
  const bestSuggestedMove = useMemo(() => {
    if (!isPlayerTurn || playerFirst === null || calculateWinner(board)) return null;
    return getBestPlayerMove();
  }, [board, moveHistory, isPlayerTurn, playerFirst]);

  // convert index to human cell label (optional)
  const cellLabel = (idx) => {
    if (idx === null || idx === undefined) return '-';
    return (idx + 1).toString(); // 1..9
  };

  // ---------- Render single square ----------
  const renderSquare = (index) => {
    const isBest = isPlayerTurn && bestSuggestedMove === index;
    return (
      <button
        key={index}
        className={`square ${board[index] === 'X' ? 'x' : board[index] === 'O' ? 'o' : ''} ${isBest ? 'best-move' : ''}`}
        onClick={() => handleClick(index)}
        disabled={!isPlayerTurn || board[index] || calculateWinner(board) || playerFirst === null}
      >
        {board[index]}
        {/* small payoff number inside square if requested */}
      </button>
    );
  };

  // ---------- Payoff table rendering ----------
  const renderPayoffTable = () => {
    return (
      <div className="payoff-table">
        <h3>Payoff Values (Player's Perspective)</h3>
        <p className="payoff-instruction">Suggested move guarantees no loss when possible. Values are normalized [-1..1].</p>
        <table className="payoff-grid">
          <tbody>
            {[0,1,2].map(r => (
              <React.Fragment key={r}>
                <tr>
                  {[0,1,2].map(c => {
                    const idx = r * 3 + c;
                    const p = payoffs[idx];
                    return (
                      <td key={c} className="payoff-cell">
                        <div className="cell-content">
                          {board[idx] || ""}
                          {p !== null && board[idx] === null && (
                            <div className="payoff-value">{p.toFixed(1)}</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                {r < 2 && <tr><td colSpan={3}><div className="grid-divider"></div></td></tr>}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="payoff-legend">
          <div className="legend-item"><span className="legend-color win"></span><span>1.0 = Win</span></div>
          <div className="legend-item"><span className="legend-color draw"></span><span>0.0 = Draw</span></div>
          <div className="legend-item"><span className="legend-color lose"></span><span>-1.0 = Lose</span></div>
        </div>
      </div>
    );
  };

  return (
    <div className="game">
      <h1>Tic-Tac-Toe with Optimal Play</h1>

      {playerFirst === null ? (
        <div className="start-screen">
          <h2>Choose who goes first</h2>
          <div className="start-buttons">
            <button className="start-btn player-first" onClick={startPlayerFirst}>Player Goes First</button>
            <button className="start-btn ai-first" onClick={startAIFirst}>AI Goes First</button>
          </div>
        </div>
      ) : (
        <>
          <div className="status">{gameStatus}</div>

          <div className="board">
            <div className="board-row">
              {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
            </div>
            <div className="board-row">
              {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
            </div>
            <div className="board-row">
              {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
            </div>
          </div>

          <div className="controls">
            <button className="control-btn" onClick={resetGame}>New Game</button>
            <button className={`control-btn ${showPayoff ? 'active' : ''}`} onClick={() => setShowPayoff(!showPayoff)}>
              {showPayoff ? 'Hide' : 'Show'} Payoff Table
            </button>
          </div>

          {isPlayerTurn && bestSuggestedMove !== null && (
            <div className="suggestion">
              Suggested move (guaranteed non-loss if possible): <strong>Cell {cellLabel(bestSuggestedMove)}</strong>
            </div>
          )}

          {showPayoff && renderPayoffTable()}

          <div className="stats">
            <h3>Game Statistics</h3>
            <p>Games: {stats.games}</p>
            <p>Wins: {stats.wins}</p>
            <p>Losses: {stats.losses}</p>
            <p>Draws: {stats.draws}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TicTacToe;
