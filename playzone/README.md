# PlayZone - Unblocked Games Portal

A modern, responsive web-based games portal where users can browse and play browser-based games. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🎮 Features

- **Modern UI/UX**: Dark theme with smooth animations and responsive design
- **Game Library**: Browse games by category, search, sort by popularity/rating
- **Game Player**: Embedded game player with fullscreen support
- **Favorites System**: Save favorite games using localStorage
- **Recently Played**: Track recently played games
- **Rating System**: Rate games 1-5 stars
- **Admin Panel**: Add, edit, delete games
- **Categories**: Sandbox, Platformer, Action, Puzzle, Racing, Multiplayer, Retro, Adventure
- **SEO Friendly**: Clean URLs and semantic HTML

## 📁 Project Structure

```
playzone/
├── client/
│   ├── pages/
│   │   ├── index.html        # Homepage
│   │   ├── games.html        # Games library
│   │   ├── player.html       # Game player page
│   │   ├── favorites.html    # Favorites page
│   │   └── admin.html        # Admin panel
│   ├── components/
│   │   └── app.js            # Main application logic
│   ├── styles/
│   │   └── main.css          # All styles
│   ├── assets/               # Images and static files
│   └── games/                # HTML5 game files
│       ├── voxel-sandbox.html
│       └── platform-adventure.html
├── server/
│   ├── controllers/
│   │   └── gameController.js # Game CRUD operations
│   ├── models/
│   │   └── Game.js           # MongoDB schema
│   ├── routes/
│   │   └── gameRoutes.js     # API routes
│   └── middleware/
│       ├── rateLimiter.js    # Rate limiting
│       └── validate.js       # Input validation
├── uploads/                  # Uploaded thumbnails
├── server.js                 # Main server file
├── package.json
└── .env.example
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone/Navigate to the project directory:**
   ```bash
   cd playzone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/playzone
   PORT=3000
   NODE_ENV=development
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

7. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### For Users

1. **Browse Games**: Visit the homepage or games page to see all available games
2. **Search**: Use the search bar to find specific games
3. **Filter**: Filter by category or sort by popularity/rating
4. **Play**: Click "Play" on any game card to start playing
5. **Favorite**: Click the star icon to save games to favorites
6. **Rate**: Rate games after playing

### For Admins

1. Navigate to `/admin.html`
2. Fill out the game form:
   - Title, Description, Thumbnail URL
   - Category, Game URL, Game Type
   - Controls, Tags
   - Featured status
3. Click "Save Game"
4. Manage existing games in the table below

## 📋 API Endpoints

### Games API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games` | Get all games (with filters) |
| GET | `/api/games/:id` | Get single game |
| GET | `/api/games/featured` | Get featured games |
| GET | `/api/games/categories` | Get all categories |
| POST | `/api/games` | Create new game (Admin) |
| PUT | `/api/games/:id` | Update game (Admin) |
| DELETE | `/api/games/:id` | Delete game (Admin) |
| POST | `/api/games/:id/rate` | Rate a game |

### Query Parameters for GET /api/games

- `category`: Filter by category
- `search`: Text search
- `sort`: `newest`, `popular`, `rating`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

## 🎨 Customization

### Adding New Games

1. **Via Admin Panel**: Use the admin interface at `/admin.html`
2. **Via API**: Send POST request to `/api/games`
3. **Direct Database**: Insert into MongoDB collection

### Game Types Supported

- **iframe**: Embed external games via iframe
- **html5**: Local HTML5 games
- **webgl**: WebGL games
- **external**: Link to external game URLs

### Styling

All styles are in `client/styles/main.css`. CSS variables make theming easy:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --bg-dark: #0f172a;
  /* ... more variables */
}
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **XSS Protection**: Cleans potentially malicious scripts
- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests

## 📱 Responsive Design

The site is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚀 Deployment

### Local Testing
```bash
npm start
```

### Production Deployment

1. **Set up MongoDB** (MongoDB Atlas recommended):
   - Create cluster at https://cloud.mongodb.com
   - Get connection string
   - Update `MONGODB_URI` in `.env`

2. **Deploy to hosting** (Heroku, Railway, Render, etc.):
   ```bash
   # Example for Heroku
   heroku create playzone-games
   git push heroku main
   heroku config:set MONGODB_URI=your-mongo-uri
   ```

3. **Environment Variables for Production**:
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongo-uri
   PORT=$PORT
   ```

## 🧩 Adding Custom Games

### Example: Adding a Space Shooter Game

1. Create game file in `client/games/space-shooter.html`
2. Add game entry via admin panel:
   - Title: "Space Shooter"
   - Category: "Action"
   - Game URL: "/client/games/space-shooter.html"
   - Game Type: "html5"

### Game Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Game</title>
  <style>
    /* Game styles */
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script>
    // Game logic
  </script>
</body>
</html>
```

## 📊 Features Checklist

- ✅ Homepage with featured games
- ✅ Games library with grid layout
- ✅ Search and filter functionality
- ✅ Category system
- ✅ Game player with fullscreen
- ✅ Favorites system (localStorage)
- ✅ Recently played tracking
- ✅ Rating system
- ✅ Admin panel
- ✅ Responsive design
- ✅ Dark mode
- ✅ Smooth animations
- ✅ Lazy loading images
- ✅ Pagination
- ✅ Mock data fallback (works without database)

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Custom properties, Grid, Flexbox)
- JavaScript ES6+ (Classes, Async/Await)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose

**Security & Performance:**
- Helmet.js
- CORS
- Rate Limiting
- XSS Cleaning
- Compression

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues or questions, please open an issue on GitHub or contact support.

---

**Enjoy playing games on PlayZone! 🎮**
