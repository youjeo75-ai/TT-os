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
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(xss());
app.use(compression());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'client')));

// API routes
app.use('/api/games', gameRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'PlayZone API is running', timestamp: new Date().toISOString() });
});

// Serve frontend pages
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(__dirname, 'client/pages/index.html')));
app.get('/games.html', (req, res) => res.sendFile(path.join(__dirname, 'client/pages/games.html')));
app.get('/player.html', (req, res) => res.sendFile(path.join(__dirname, 'client/pages/player.html')));
app.get('/favorites.html', (req, res) => res.sendFile(path.join(__dirname, 'client/pages/favorites.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'client/pages/admin.html')));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Mock games data for demo
const mockGames = [
  { _id: '1', title: 'Voxel Sandbox Game', description: 'Build and explore infinite voxel worlds.', thumbnail: 'https://picsum.photos/seed/voxel/400/300', category: 'Sandbox', gameUrl: '/games/voxel-sandbox.html', gameType: 'html5', tags: ['building', 'creative'], featured: true, controls: 'WASD to move, Mouse to build/break', rating: 45, ratingCount: 10, plays: 15234 },
  { _id: '2', title: 'Platform Adventure', description: 'Jump through challenging levels!', thumbnail: 'https://picsum.photos/seed/platform/400/300', category: 'Platformer', gameUrl: '/games/platform-adventure.html', gameType: 'html5', tags: ['jumping', 'coins'], featured: true, controls: 'Arrow keys to move, Space to jump', rating: 38, ratingCount: 8, plays: 12456 },
  { _id: '3', title: 'Retro Racing', description: 'Classic top-down racing action!', thumbnail: 'https://picsum.photos/seed/racing/400/300', category: 'Racing', gameUrl: '/games/retro-racing.html', gameType: 'html5', tags: ['racing', 'retro'], featured: true, controls: 'Arrow keys to steer', rating: 32, ratingCount: 7, plays: 9876 },
  { _id: '4', title: 'Puzzle Blocks', description: 'Match and clear colorful blocks.', thumbnail: 'https://picsum.photos/seed/puzzle/400/300', category: 'Puzzle', gameUrl: '/games/puzzle-blocks.html', gameType: 'html5', tags: ['matching', 'strategy'], featured: false, controls: 'Click to select blocks', rating: 28, ratingCount: 6, plays: 8765 },
  { _id: '5', title: 'Space Shooter', description: 'Defend Earth from alien invaders!', thumbnail: 'https://picsum.photos/seed/space/400/300', category: 'Action', gameUrl: '/games/space-shooter.html', gameType: 'html5', tags: ['shooting', 'space'], featured: true, controls: 'Arrow keys to move, Space to shoot', rating: 42, ratingCount: 9, plays: 11234 },
  { _id: '6', title: 'Mystery Quest', description: 'Embark on an epic adventure.', thumbnail: 'https://picsum.photos/seed/adventure/400/300', category: 'Adventure', gameUrl: '/games/mystery-quest.html', gameType: 'html5', tags: ['rpg', 'exploration'], featured: false, controls: 'WASD to move', rating: 25, ratingCount: 5, plays: 7654 }
];

// Database connection with fallback to mock data
let useMockData = true;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/playzone', { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected');
    useMockData = false;
  } catch (error) {
    console.log('Running in demo mode (no MongoDB)');
  }
};

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PlayZone server running on http://localhost:${PORT}`);
  console.log('Demo mode: Using mock game data');
});
