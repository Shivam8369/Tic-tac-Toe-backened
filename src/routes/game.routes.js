const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  createGame,
  makeMove,
  getGameHistory,
  getGameMoveTimeline
} = require('../controllers/game.controller');

const router = express.Router();

router.use(protect);

router.post('/create', createGame);
router.post('/move', makeMove);
router.get('/history', getGameHistory);
router.get('/:gameId/timeline', getGameMoveTimeline);

module.exports = router;