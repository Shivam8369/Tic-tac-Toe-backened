const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    row: {
      type: Number,
      required: true
    },
    col: {
      type: Number,
      required: true
    }
  },
  symbol: {
    type: String,
    enum: ['X', 'O'],
    required: true
  },
  moveNumber: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Move', moveSchema);