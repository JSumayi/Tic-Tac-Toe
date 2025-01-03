import React, { useState, useEffect } from 'react';
import Board from './Board';

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // True: Player's turn
  const [playerSymbol, setPlayerSymbol] = useState(null); // Player's chosen symbol
  const [computerSymbol, setComputerSymbol] = useState(null); // Computer's symbol

  useEffect(() => {
    if (!isXNext && !calculateWinner(squares) && playerSymbol) {
      makeComputerMove();
    }
  }, [isXNext, squares, playerSymbol]);

  const handleSquareClick = (index) => {
    if (squares[index] || calculateWinner(squares) || !isXNext) return;

    const newSquares = squares.slice();
    newSquares[index] = playerSymbol;
    setSquares(newSquares);
    setIsXNext(false); // Switch to computer's turn
  };

  const makeComputerMove = () => {
    const bestMove = getBestMove(squares, computerSymbol, playerSymbol);
    const newSquares = squares.slice();
    newSquares[bestMove] = computerSymbol;
    setSquares(newSquares);
    setIsXNext(true); // Switch back to player's turn
  };

  const chooseSymbol = (symbol) => {
    setPlayerSymbol(symbol);
    setComputerSymbol(symbol === 'X' ? 'O' : 'X');
    setIsXNext(symbol === 'X'); // Player starts if they choose 'X'
  };

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : squares.includes(null)
    ? `${isXNext ? "Player's Turn" : "Computer's Turn"}`
    : 'Draw!';

  return (
    <div className="game">
      {!playerSymbol ? (
        <div className="symbol-selection">
          <h2>Choose your symbol</h2>
          <button onClick={() => chooseSymbol('X')}>X</button>
          <button onClick={() => chooseSymbol('O')}>O</button>
        </div>
      ) : (
        <>
          <h2>{status}</h2>
          <Board squares={squares} onSquareClick={handleSquareClick} />
        </>
      )}
    </div>
  );
};

// Utility function to check for a winner
const calculateWinner = (squares) => {
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
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// Computer AI logic to find the best move
const getBestMove = (squares, computerSymbol, playerSymbol) => {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check if the computer can win in the next move
  for (let line of winningLines) {
    const [a, b, c] = line;
    if (
      squares[a] === computerSymbol &&
      squares[b] === computerSymbol &&
      !squares[c]
    ) {
      return c;
    }
    if (
      squares[a] === computerSymbol &&
      !squares[b] &&
      squares[c] === computerSymbol
    ) {
      return b;
    }
    if (
      !squares[a] &&
      squares[b] === computerSymbol &&
      squares[c] === computerSymbol
    ) {
      return a;
    }
  }

  // Check if the player can win in the next move and block it
  for (let line of winningLines) {
    const [a, b, c] = line;
    if (
      squares[a] === playerSymbol &&
      squares[b] === playerSymbol &&
      !squares[c]
    ) {
      return c;
    }
    if (
      squares[a] === playerSymbol &&
      !squares[b] &&
      squares[c] === playerSymbol
    ) {
      return b;
    }
    if (
      !squares[a] &&
      squares[b] === playerSymbol &&
      squares[c] === playerSymbol
    ) {
      return a;
    }
  }

  // Take the center if available
  if (!squares[4]) {
    return 4;
  }

  // Take a corner if available
  const corners = [0, 2, 6, 8];
  for (let corner of corners) {
    if (!squares[corner]) {
      return corner;
    }
  }

  // Take any remaining square
  const availableSquares = squares
    .map((square, index) => (square === null ? index : null))
    .filter((index) => index !== null);
  return availableSquares[0];
};

export default Game;
