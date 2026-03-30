const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Game title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Sandbox', 'Platformer', 'Action', 'Puzzle', 'Racing', 'Multiplayer', 'Retro', 'Adventure']
  },
  gameUrl: {
    type: String,
    required: [true, 'Game URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v) || v.startsWith('/games/');
      },
      message: 'Please provide a valid URL or local game path'
    }
  },
  gameType: {
    type: String,
    enum: ['external', 'html5', 'webgl', 'iframe'],
    default: 'iframe'
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  plays: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  controls: {
    type: String,
    maxlength: [500, 'Controls cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search and sorting
gameSchema.index({ title: 'text', description: 'text', tags: 'text' });
gameSchema.index({ category: 1, plays: -1 });
gameSchema.index({ createdAt: -1 });

// Virtual for average rating
gameSchema.virtual('averageRating').get(function() {
  return this.ratingCount > 0 ? (this.rating / this.ratingCount).toFixed(1) : 0;
});

module.exports = mongoose.model('Game', gameSchema);
