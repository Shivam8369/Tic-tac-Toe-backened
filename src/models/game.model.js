const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  board: {
    type: [[String]],
    default: [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  isDraw: {
    type: Boolean,
    default: false
  },
  moves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Move'
  }],
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentTurn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);