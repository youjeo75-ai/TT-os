const Game = require('../models/Game');

// @desc    Get all games with filtering, sorting, and pagination
// @route   GET /api/games
// @access  Public
exports.getGames = async (req, res) => {
  try {
    const {
      category,
      search,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { plays: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Game.countDocuments(query);

    const games = await Game.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: games.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
exports.getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Increment play count
    game.plays += 1;
    await game.save();

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new game
// @route   POST /api/games
// @access  Private (Admin)
exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);

    res.status(201).json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create game',
      error: error.message
    });
  }
};

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private (Admin)
exports.updateGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update game',
      error: error.message
    });
  }
};

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private (Admin)
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    await game.deleteOne();

    res.json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Rate a game
// @route   POST /api/games/:id/rate
// @access  Public
exports.rateGame = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    game.rating += parseInt(rating);
    game.ratingCount += 1;
    await game.save();

    res.json({
      success: true,
      message: 'Rating submitted',
      averageRating: (game.rating / game.ratingCount).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get featured games
// @route   GET /api/games/featured
// @access  Public
exports.getFeaturedGames = async (req, res) => {
  try {
    const games = await Game.find({ featured: true, isActive: true })
      .sort({ plays: -1 })
      .limit(6);

    res.json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get categories
// @route   GET /api/games/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Game.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
