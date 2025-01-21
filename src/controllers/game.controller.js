const Game = require('../models/game.model');
const Move = require('../models/move.model');
const User = require('../models/user.model');

exports.createGame = async (req, res) => {
  try {
    const { player2Id } = req.body;
    const player1Id = req.user._id;

    if (player1Id.toString() === player2Id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot play against yourself'
      });
    }

    const game = await Game.create({
      player1: player1Id,
      player2: player2Id,
      currentTurn: player1Id
    });

    await game.populate(['player1', 'player2']);

    res.status(201).json({
      success: true,
      game
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.makeMove = async (req, res) => {
  try {
    const { gameId, row, col } = req.body;
    const userId = req.user._id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Validate move
    if (game.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Game is already completed'
      });
    }

    if (game.currentTurn.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Not your turn'
      });
    }

    if (game.board[row][col] !== '') {
      return res.status(400).json({
        success: false,
        message: 'Invalid move'
      });
    }

    // Make move
    const symbol = game.player1.toString() === userId.toString() ? 'X' : 'O';
    game.board[row][col] = symbol;

    // Create and save move
    const move = await Move.create({
      game: game._id,
      player: userId,
      position: { row, col },
      symbol,
      moveNumber: game.moves.length + 1
    });

    game.moves.push(move._id);

    // Check for winner
    const winner = checkWinner(game.board);
    if (winner) {
      game.status = 'completed';
      game.winner = userId;
      await updateUserStats(userId, 'win');
      await updateUserStats(
        game.player1.toString() === userId.toString() ? game.player2 : game.player1,
        'loss'
      );
    } else if (isBoardFull(game.board)) {
      game.status = 'completed';
      game.isDraw = true;
      await updateUserStats(game.player1, 'draw');
      await updateUserStats(game.player2, 'draw');
    } else {
      // Switch turns
      game.currentTurn = game.currentTurn.toString() === game.player1.toString()
        ? game.player2
        : game.player1;
    }

    await game.save();
    await game.populate(['player1', 'player2', 'currentTurn', 'winner', 'moves']);

    res.json({
      success: true,
      game
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getGameHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const games = await Game.find({
      $or: [{ player1: userId }, { player2: userId }],
      status: 'completed'
    })
      .populate(['player1', 'player2', 'winner', 'moves'])
      .sort('-createdAt');

    res.json({
      success: true,
      games
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getGameMoveTimeline = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId)
      .populate([
        {
          path: 'moves',
          populate: {
            path: 'player',
            select: 'username'
          },
          options: { sort: { moveNumber: 1 } }
        },
        'player1',
        'player2'
      ]);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Format the timeline
    const timeline = game.moves.map(move => ({
      player: {
        id: move.player._id,
        username: move.player.username
      },
      position: move.position,
      symbol: move.symbol,
      moveNumber: move.moveNumber,
      timestamp: move.timestamp
    }));

    res.json({
      success: true,
      game: {
        id: game._id,
        player1: {
          id: game.player1._id,
          username: game.player1.username
        },
        player2: {
          id: game.player2._id,
          username: game.player2.username
        },
        status: game.status,
        isDraw: game.isDraw,
        timeline
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions
function checkWinner(board) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] !== '' && 
        board[i][0] === board[i][1] && 
        board[i][1] === board[i][2]) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (board[0][i] !== '' && 
        board[0][i] === board[1][i] && 
        board[1][i] === board[2][i]) {
      return true;
    }
  }

  // Check diagonals
  if (board[0][0] !== '' && 
      board[0][0] === board[1][1] && 
      board[1][1] === board[2][2]) {
    return true;
  }

  if (board[0][2] !== '' && 
      board[0][2] === board[1][1] && 
      board[1][1] === board[2][0]) {
    return true;
  }

  return false;
}

function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== ''));
}

async function updateUserStats(userId, result) {
  const user = await User.findById(userId);
  user.gamesPlayed += 1;
  
  if (result === 'win') {
    user.gamesWon += 1;
  } else if (result === 'draw') {
    user.gamesDraw += 1;
  }
  
  await user.save();
}