# Unblocked Games Hub

A collection of classic browser-based games that run entirely locally in your browser. No external dependencies or network requests needed!

## 🎮 Available Games

1. **Snake** - Classic snake game where you eat food to grow longer
2. **Pong** - The original tennis game against the computer
3. **Breakout** - Break all the bricks with your ball
4. **Tic Tac Toe** - Classic X's and O's against the computer
5. **Memory Game** - Find matching pairs of cards
6. **Clicker Game** - Test your clicking speed in 30 seconds

## 🚀 How to Run

### Option 1: Using Python (Recommended)
```bash
cd /workspace/unblocked-games
python3 -m http.server 8080
```
Then open http://localhost:8080 in your browser.

### Option 2: Direct File Access
Simply open `index.html` in any modern web browser.

### Option 3: Using Node.js
```bash
cd /workspace/unblocked-games
npx http-server -p 8080
```

## ✨ Features

- **No External Dependencies**: All games run completely offline
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Easy to Extend**: Add more games by following the existing pattern
- **Privacy-Friendly**: No tracking, no ads, no data collection

## 🛠️ Adding New Games

To add a new game:

1. Create a function in `games.js` that returns the game's HTML as a string
2. Add a case in the `openGame()` switch statement
3. Add a new game card in `index.html`

Example:
```javascript
function getNewGame() {
    return `
        <!DOCTYPE html>
        <html>
        <!-- Your game code here -->
        </html>
    `;
}
```

## 📁 File Structure

```
unblocked-games/
├── index.html      # Main page with game selection
├── games.js        # All game logic and implementations
└── README.md       # This file
```

## 🎯 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📝 License

Free to use and modify for personal and educational purposes.

Enjoy playing! 🎉
