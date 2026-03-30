require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const path = require('path');

const gameRoutes = require('./server/routes/gameRoutes');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for iframe game embedding
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : '*',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// XSS protection
app.use(xss());

// Compression
app.use(compression());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/client', express.static(path.join(__dirname, '../client')));

// API routes
app.use('/api/games', gameRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PlayZone API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/playzone');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial games if database is empty
    const Game = require('./server/models/Game');
    const count = await Game.countDocuments();
    if (count === 0) {
      await seedGames();
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Continue without database for demo purposes
    console.log('Running in demo mode without database');
  }
};

// Seed initial games data
const seedGames = async () => {
  const Game = require('./server/models/Game');
  
  const games = [
    {
      title: 'Voxel Sandbox Game',
      description: 'Build and explore infinite voxel worlds. Create structures, mine resources, and let your imagination run wild in this creative sandbox experience.',
      thumbnail: 'https://picsum.photos/seed/voxel/400/300',
      category: 'Sandbox',
      gameUrl: '/client/games/voxel-sandbox.html',
      gameType: 'html5',
      tags: ['building', 'creative', '3d'],
      featured: true,
      controls: 'WASD to move, Mouse to build/break, Space to jump, E to toggle build mode'
    },
    {
      title: 'Platform Adventure',
      description: 'Jump through challenging levels filled with obstacles and enemies. Collect coins and reach the flag to complete each level!',
      thumbnail: 'https://picsum.photos/seed/platform/400/300',
      category: 'Platformer',
      gameUrl: '/client/games/platform-adventure.html',
      gameType: 'html5',
      tags: ['jumping', 'coins', 'levels'],
      featured: true,
      controls: 'Arrow keys or WASD to move, Space to jump, P to pause'
    },
    {
      title: 'Retro Racing',
      description: 'Classic top-down racing action! Race against time on challenging tracks. Avoid obstacles and collect speed boosts.',
      thumbnail: 'https://picsum.photos/seed/racing/400/300',
      category: 'Racing',
      gameUrl: '/client/games/retro-racing.html',
      gameType: 'html5',
      tags: ['racing', 'retro', 'arcade'],
      featured: true,
      controls: 'Arrow keys to steer, Space for boost, R to restart'
    },
    {
      title: 'Puzzle Blocks',
      description: 'Match and clear colorful blocks in this addictive puzzle game. Plan your moves carefully to achieve high scores!',
      thumbnail: 'https://picsum.photos/seed/puzzle/400/300',
      category: 'Puzzle',
      gameUrl: '/client/games/puzzle-blocks.html',
      gameType: 'html5',
      tags: ['matching', 'strategy', 'casual'],
      featured: false,
      controls: 'Click to select blocks, Match 3 or more to clear'
    },
    {
      title: 'Space Shooter',
      description: 'Defend Earth from alien invaders! Pilot your spaceship through waves of enemies and epic boss battles.',
      thumbnail: 'https://picsum.photos/seed/space/400/300',
      category: 'Action',
      gameUrl: '/client/games/space-shooter.html',
      gameType: 'html5',
      tags: ['shooting', 'space', 'arcade'],
      featured: true,
      controls: 'Arrow keys to move, Space to shoot, P to pause'
    },
    {
      title: 'Mystery Quest',
      description: 'Embark on an epic adventure through mysterious lands. Solve puzzles, defeat enemies, and discover hidden treasures.',
      thumbnail: 'https://picsum.photos/seed/adventure/400/300',
      category: 'Adventure',
      gameUrl: '/client/games/mystery-quest.html',
      gameType: 'html5',
      tags: ['rpg', 'exploration', 'story'],
      featured: false,
      controls: 'WASD to move, Mouse to interact, I for inventory'
    }
  ];

  await Game.insertMany(games);
  console.log('Initial games seeded successfully');
};

// Start server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  // Start anyway for static file serving
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (static mode)`);
    console.log(`Visit http://localhost:${PORT}`);
  });
});
