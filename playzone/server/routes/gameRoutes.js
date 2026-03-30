const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const gameController = require('../controllers/gameController');
const validate = require('../middleware/validate');
const { apiLimiter, strictLimiter } = require('../middleware/rateLimiter');

// Validation rules for creating/updating games
const gameValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('thumbnail').notEmpty().withMessage('Thumbnail is required'),
  body('category').isIn(['Sandbox', 'Platformer', 'Action', 'Puzzle', 'Racing', 'Multiplayer', 'Retro', 'Adventure'])
    .withMessage('Invalid category'),
  body('gameUrl').notEmpty().withMessage('Game URL is required'),
  body('gameType').optional().isIn(['external', 'html5', 'webgl', 'iframe']),
  body('controls').optional().isLength({ max: 500 }),
  validate
];

// Public routes with rate limiting
router.get('/', apiLimiter, gameController.getGames);
router.get('/categories', apiLimiter, gameController.getCategories);
router.get('/featured', apiLimiter, gameController.getFeaturedGames);
router.get('/:id', apiLimiter, gameController.getGame);

// Rating route
router.post('/:id/rate', strictLimiter, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validate
], gameController.rateGame);

// Admin routes (in production, add authentication middleware here)
router.post('/', strictLimiter, gameValidation, gameController.createGame);
router.put('/:id', strictLimiter, gameValidation, gameController.updateGame);
router.delete('/:id', strictLimiter, gameController.deleteGame);

module.exports = router;
