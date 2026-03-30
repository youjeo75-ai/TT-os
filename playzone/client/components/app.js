/**
 * PlayZone - Main Application JavaScript
 * Handles all frontend functionality for the games portal
 */

class PlayZoneApp {
  constructor() {
    this.API_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api/games' 
      : '/api/games';
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.currentGames = [];
    
    // Initialize theme
    this.initTheme();
    
    // Initialize search
    this.initSearch();
  }

  // Theme Toggle
  initTheme() {
    const toggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      toggle.textContent = '☀️';
    }
    
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        toggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      });
    }
  }

  // Search Functionality
  initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const query = e.target.value.trim();
          if (query.length > 2) {
            window.location.href = `games.html?search=${encodeURIComponent(query)}`;
          }
        }, 500);
      });
    }
  }

  // API Helper
  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      // Return mock data for demo purposes when API is unavailable
      return this.getMockData(endpoint);
    }
  }

  // Mock Data for Demo (when no backend)
  getMockData(endpoint) {
    const mockGames = [
      {
        _id: '1',
        title: 'Voxel Sandbox Game',
        description: 'Build and explore infinite voxel worlds. Create structures, mine resources, and let your imagination run wild.',
        thumbnail: 'https://picsum.photos/seed/voxel/400/300',
        category: 'Sandbox',
        gameUrl: '../games/voxel-sandbox.html',
        gameType: 'html5',
        tags: ['building', 'creative', '3d'],
        featured: true,
        controls: 'WASD to move, Mouse to build/break, Space to jump',
        rating: 45,
        ratingCount: 10,
        plays: 15234
      },
      {
        _id: '2',
        title: 'Platform Adventure',
        description: 'Jump through challenging levels filled with obstacles and enemies. Collect coins and reach the flag!',
        thumbnail: 'https://picsum.photos/seed/platform/400/300',
        category: 'Platformer',
        gameUrl: '../games/platform-adventure.html',
        gameType: 'html5',
        tags: ['jumping', 'coins', 'levels'],
        featured: true,
        controls: 'Arrow keys or WASD to move, Space to jump',
        rating: 38,
        ratingCount: 8,
        plays: 12456
      },
      {
        _id: '3',
        title: 'Retro Racing',
        description: 'Classic top-down racing action! Race against time on challenging tracks.',
        thumbnail: 'https://picsum.photos/seed/racing/400/300',
        category: 'Racing',
        gameUrl: '../games/retro-racing.html',
        gameType: 'html5',
        tags: ['racing', 'retro', 'arcade'],
        featured: true,
        controls: 'Arrow keys to steer, Space for boost',
        rating: 32,
        ratingCount: 7,
        plays: 9876
      },
      {
        _id: '4',
        title: 'Puzzle Blocks',
        description: 'Match and clear colorful blocks in this addictive puzzle game.',
        thumbnail: 'https://picsum.photos/seed/puzzle/400/300',
        category: 'Puzzle',
        gameUrl: '../games/puzzle-blocks.html',
        gameType: 'html5',
        tags: ['matching', 'strategy', 'casual'],
        featured: false,
        controls: 'Click to select blocks, Match 3 or more',
        rating: 28,
        ratingCount: 6,
        plays: 8765
      },
      {
        _id: '5',
        title: 'Space Shooter',
        description: 'Defend Earth from alien invaders! Pilot your spaceship through waves of enemies.',
        thumbnail: 'https://picsum.photos/seed/space/400/300',
        category: 'Action',
        gameUrl: '../games/space-shooter.html',
        gameType: 'html5',
        tags: ['shooting', 'space', 'arcade'],
        featured: true,
        controls: 'Arrow keys to move, Space to shoot',
        rating: 42,
        ratingCount: 9,
        plays: 11234
      },
      {
        _id: '6',
        title: 'Mystery Quest',
        description: 'Embark on an epic adventure through mysterious lands. Solve puzzles and discover treasures.',
        thumbnail: 'https://picsum.photos/seed/adventure/400/300',
        category: 'Adventure',
        gameUrl: '../games/mystery-quest.html',
        gameType: 'html5',
        tags: ['rpg', 'exploration', 'story'],
        featured: false,
        controls: 'WASD to move, Mouse to interact',
        rating: 25,
        ratingCount: 5,
        plays: 7654
      }
    ];

    if (endpoint.includes('/featured')) {
      return { success: true, data: mockGames.filter(g => g.featured) };
    }
    
    return { success: true, data: mockGames, total: mockGames.length, page: 1, pages: 1 };
  }

  // Create Game Card HTML
  createGameCard(game) {
    const avgRating = game.ratingCount > 0 
      ? (game.rating / game.ratingCount).toFixed(1) 
      : 'N/A';
    
    const isFavorite = this.isFavorite(game._id);
    
    return `
      <div class="game-card fade-in" data-id="${game._id}">
        <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail" loading="lazy">
        <div class="game-info">
          <span class="game-category">${game.category}</span>
          <h3 class="game-title">${game.title}</h3>
          <p class="game-description">${game.description}</p>
          <div class="game-meta">
            <div class="game-rating">⭐ ${avgRating}</div>
            <div class="game-plays">▶️ ${game.plays?.toLocaleString() || 0}</div>
          </div>
          <div class="game-tags">
            ${(game.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div class="game-actions">
            <a href="player.html?id=${game._id}" class="btn btn-primary" style="flex: 1; justify-content: center;">
              ▶️ Play
            </a>
            <button class="btn-favorite ${isFavorite ? 'active' : ''}" onclick="app.toggleFavorite('${game._id}', '${game.title.replace(/'/g, "\\'")}', '${game.thumbnail}')">
              ${isFavorite ? '❤️' : '☆'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Load Games
  async loadGames(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: options.limit || this.itemsPerPage,
        sort: options.sort || 'newest',
        ...(options.category && options.category !== 'All' && { category: options.category })
      });

      const result = await this.fetchAPI(`?${params}`);
      
      if (result.success && result.data.length > 0) {
        container.innerHTML = result.data.map(game => this.createGameCard(game)).join('');
      } else {
        container.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center;">No games found.</p>';
      }
    } catch (error) {
      container.innerHTML = '<p style="color: var(--danger);">Failed to load games.</p>';
    }
  }

  // Load All Games with Filters
  async loadAllGames() {
    const category = document.getElementById('categoryFilter')?.value || 'All';
    const sort = document.getElementById('sortSelect')?.value || 'newest';
    const search = document.getElementById('gameSearch')?.value || '';
    
    const params = new URLSearchParams({
      page: this.currentPage,
      limit: this.itemsPerPage,
      sort,
      ...(category !== 'All' && { category }),
      ...(search && { search })
    });

    const result = await this.fetchAPI(`?${params}`);
    const container = document.getElementById('allGamesGrid');
    
    if (result.success && result.data.length > 0) {
      this.currentGames = result.data;
      container.innerHTML = result.data.map(game => this.createGameCard(game)).join('');
      this.renderPagination(result.page, result.pages);
    } else {
      container.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center;">No games found.</p>';
    }
  }

  // Render Pagination
  renderPagination(current, total) {
    const container = document.getElementById('pagination');
    if (!container || total <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let html = `
      <button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="app.changePage(${current - 1})">← Prev</button>
    `;

    for (let i = 1; i <= total; i++) {
      html += `
        <button class="page-btn ${i === current ? 'active' : ''}" onclick="app.changePage(${i})">${i}</button>
      `;
    }

    html += `
      <button class="page-btn" ${current === total ? 'disabled' : ''} onclick="app.changePage(${current + 1})">Next →</button>
    `;

    container.innerHTML = html;
  }

  changePage(page) {
    this.currentPage = page;
    this.loadAllGames();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load Featured Game
  async loadFeaturedGame() {
    const result = await this.fetchAPI('/featured');
    const banner = document.getElementById('featuredBanner');
    
    if (result.success && result.data.length > 0) {
      const game = result.data[0];
      document.getElementById('featuredTitle').textContent = game.title;
      document.getElementById('featuredDescription').textContent = game.description;
      document.getElementById('featuredImage').src = game.thumbnail;
      document.getElementById('featuredPlayBtn').href = `player.html?id=${game._id}`;
    }
  }

  // Load Game Player
  async loadGamePlayer(gameId) {
    const result = await this.fetchAPI(`/${gameId}`);
    
    if (result.success) {
      const game = result.data;
      
      document.getElementById('gameTitle').textContent = game.title;
      document.getElementById('gameCategory').textContent = game.category;
      document.getElementById('gameDescription').textContent = game.description;
      document.getElementById('gameControls').textContent = game.controls || 'No specific controls';
      
      const avgRating = game.ratingCount > 0 
        ? (game.rating / game.ratingCount).toFixed(1) 
        : '0.0';
      
      document.getElementById('ratingValue').textContent = avgRating;
      document.getElementById('ratingCount').textContent = game.ratingCount;
      document.getElementById('gamePlays').textContent = `▶️ ${game.plays?.toLocaleString() || 0} plays`;
      
      // Tags
      const tagsContainer = document.getElementById('gameTags');
      if (game.tags && game.tags.length > 0) {
        tagsContainer.innerHTML = game.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      }
      
      // Set game frame
      const gameFrame = document.getElementById('gameFrame');
      gameFrame.src = game.gameUrl;
      
      // Hide loading screen when loaded
      gameFrame.onload = () => {
        document.getElementById('loadingScreen').style.display = 'none';
      };
      
      // Update favorite button
      this.updateFavoriteButton(gameId, game.title, game.thumbnail);
      
      // Add to recently played
      this.addToRecentlyPlayed(game);
    }
  }

  // Favorites System
  getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  isFavorite(gameId) {
    const favorites = this.getFavorites();
    return favorites.some(f => f.id === gameId);
  }

  toggleFavorite(gameId, title, thumbnail) {
    let favorites = this.getFavorites();
    const index = favorites.findIndex(f => f.id === gameId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ id: gameId, title, thumbnail, addedAt: Date.now() });
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Refresh UI
    if (window.location.pathname.includes('favorites.html')) {
      this.loadFavorites();
    } else {
      // Update button icon
      event.target.textContent = this.isFavorite(gameId) ? '❤️' : '☆';
      event.target.classList.toggle('active');
    }
  }

  updateFavoriteButton(gameId, title, thumbnail) {
    const btn = document.getElementById('favoriteBtn');
    if (btn) {
      btn.textContent = this.isFavorite(gameId) ? '❤️' : '☆';
      btn.onclick = () => this.toggleFavorite(gameId, title, thumbnail);
    }
  }

  async loadFavorites() {
    const favorites = this.getFavorites();
    const container = document.getElementById('favoritesGrid');
    const noFavorites = document.getElementById('noFavorites');
    
    if (favorites.length === 0) {
      container.style.display = 'none';
      noFavorites.style.display = 'block';
      return;
    }
    
    container.style.display = 'grid';
    noFavorites.style.display = 'none';
    
    // Load full game data for each favorite
    const games = await Promise.all(
      favorites.map(async fav => {
        const result = await this.fetchAPI(`/${fav.id}`);
        return result.success ? result.data : fav;
      })
    );
    
    container.innerHTML = games.map(game => this.createGameCard(game)).join('');
  }

  // Recently Played
  addToRecentlyPlayed(game) {
    let recent = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    
    // Remove if already exists
    recent = recent.filter(r => r.id !== game._id);
    
    // Add to front
    recent.unshift({
      id: game._id,
      title: game.title,
      thumbnail: game.thumbnail,
      playedAt: Date.now()
    });
    
    // Keep only last 6
    recent = recent.slice(0, 6);
    
    localStorage.setItem('recentlyPlayed', JSON.stringify(recent));
  }

  loadRecentlyPlayed() {
    const recent = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    const container = document.getElementById('recentlyPlayedGrid');
    
    if (recent.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">Start playing games to see them here!</p>';
      return;
    }
    
    // Load full game data
    Promise.all(
      recent.map(async r => {
        const result = await this.fetchAPI(`/${r.id}`);
        return result.success ? result.data : r;
      })
    ).then(games => {
      container.innerHTML = games.map(game => this.createGameCard(game)).join('');
    });
  }

  // Admin Functions
  async loadAdminGames() {
    const result = await this.fetchAPI('?limit=100');
    const tbody = document.getElementById('gamesTableBody');
    
    if (result.success) {
      tbody.innerHTML = result.data.map(game => `
        <tr style="border-bottom: 1px solid var(--bg-hover);">
          <td style="padding: 1rem;"><img src="${game.thumbnail}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
          <td style="padding: 1rem;">${game.title}</td>
          <td style="padding: 1rem;"><span class="game-category">${game.category}</span></td>
          <td style="padding: 1rem;">${game.plays?.toLocaleString() || 0}</td>
          <td style="padding: 1rem;">⭐ ${(game.ratingCount > 0 ? (game.rating/game.ratingCount).toFixed(1) : 'N/A')}</td>
          <td style="padding: 1rem;">
            <button class="btn btn-secondary" onclick="app.editGame('${game._id}')" style="padding: 0.5rem 1rem;">✏️</button>
            <button class="btn btn-secondary" onclick="app.deleteGame('${game._id}')" style="padding: 0.5rem 1rem; margin-left: 0.5rem;">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
  }

  resetForm() {
    document.getElementById('gameForm').reset();
    document.getElementById('editGameId').value = '';
    document.getElementById('formTitle').textContent = '➕ Add New Game';
    document.getElementById('cancelEdit').style.display = 'none';
  }

  async saveGame() {
    const editId = document.getElementById('editGameId').value;
    const gameData = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      thumbnail: document.getElementById('thumbnail').value,
      category: document.getElementById('category').value,
      gameUrl: document.getElementById('gameUrl').value,
      gameType: document.getElementById('gameType').value,
      controls: document.getElementById('controls').value,
      tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
      featured: document.getElementById('featured').checked
    };

    try {
      if (editId) {
        await this.fetchAPI(`/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(gameData)
        });
      } else {
        await this.fetchAPI('', {
          method: 'POST',
          body: JSON.stringify(gameData)
        });
      }
      
      alert('Game saved successfully!');
      this.resetForm();
      this.loadAdminGames();
    } catch (error) {
      alert('Failed to save game: ' + error.message);
    }
  }

  editGame(gameId) {
    // In a real app, fetch the game data and populate the form
    alert('Edit functionality would load game data here. For demo, use the form to add new games.');
  }

  async deleteGame(gameId) {
    if (!confirm('Are you sure you want to delete this game?')) return;
    
    try {
      await this.fetchAPI(`/${gameId}`, { method: 'DELETE' });
      alert('Game deleted successfully!');
      this.loadAdminGames();
    } catch (error) {
      alert('Failed to delete game: ' + error.message);
    }
  }

  // Rate Game
  async rateGame(gameId, rating) {
    try {
      const result = await this.fetchAPI(`/${gameId}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating: parseInt(rating) })
      });
      
      if (result.success) {
        alert(`Thanks for rating! Average: ${result.averageRating}⭐`);
        this.loadGamePlayer(gameId); // Refresh ratings
      }
    } catch (error) {
      alert('Failed to submit rating');
    }
  }
}

// Initialize global app instance
const app = new PlayZoneApp();
