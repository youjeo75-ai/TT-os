// Game management functions
let currentGame = null;

function openGame(gameName) {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    
    let gameHTML = '';
    
    switch(gameName) {
        case 'snake':
            gameHTML = getSnakeGame();
            break;
        case 'pong':
            gameHTML = getPongGame();
            break;
        case 'breakout':
            gameHTML = getBreakoutGame();
            break;
        case 'tictactoe':
            gameHTML = getTicTacToeGame();
            break;
        case 'memory':
            gameHTML = getMemoryGame();
            break;
        case 'clicker':
            gameHTML = getClickerGame();
            break;
    }
    
    gameFrame.innerHTML = gameHTML;
    modal.classList.add('active');
    currentGame = gameName;
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    
    modal.classList.remove('active');
    gameFrame.innerHTML = '';
    currentGame = null;
}

// Close modal when clicking outside
document.getElementById('gameModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeGame();
    }
});

// Snake Game
function getSnakeGame() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; font-family: Arial, sans-serif; }
                canvas { border: 3px solid #4CAF50; border-radius: 10px; }
                #score { position: absolute; top: 20px; color: white; font-size: 24px; }
                #instructions { position: absolute; bottom: 20px; color: white; text-align: center; }
            </style>
        </head>
        <body>
            <div id="score">Score: 0</div>
            <canvas id="gameCanvas" width="400" height="400"></canvas>
            <div id="instructions">Use Arrow Keys to Move</div>
            <script>
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const scoreElement = document.getElementById('score');
                
                const gridSize = 20;
                let snake = [{x: 200, y: 200}];
                let food = {x: 100, y: 100};
                let dx = gridSize;
                let dy = 0;
                let score = 0;
                
                function generateFood() {
                    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
                    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
                }
                
                function gameLoop() {
                    setTimeout(function() {
                        clearCanvas();
                        moveSnake();
                        drawFood();
                        drawSnake();
                        if (checkCollision()) {
                            alert('Game Over! Score: ' + score);
                            snake = [{x: 200, y: 200}];
                            dx = gridSize;
                            dy = 0;
                            score = 0;
                            scoreElement.textContent = 'Score: 0';
                        }
                        requestAnimationFrame(gameLoop);
                    }, 100);
                }
                
                function clearCanvas() {
                    ctx.fillStyle = '#1a1a2e';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                function drawSnake() {
                    ctx.fillStyle = '#4CAF50';
                    snake.forEach(segment => {
                        ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
                    });
                }
                
                function drawFood() {
                    ctx.fillStyle = '#ff4444';
                    ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
                }
                
                function moveSnake() {
                    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
                    snake.unshift(head);
                    
                    if (head.x === food.x && head.y === food.y) {
                        score += 10;
                        scoreElement.textContent = 'Score: ' + score;
                        generateFood();
                    } else {
                        snake.pop();
                    }
                }
                
                function checkCollision() {
                    const head = snake[0];
                    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
                        return true;
                    }
                    for (let i = 1; i < snake.length; i++) {
                        if (head.x === snake[i].x && head.y === snake[i].y) {
                            return true;
                        }
                    }
                    return false;
                }
                
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowUp' && dy === 0) {
                        dx = 0; dy = -gridSize;
                    } else if (e.key === 'ArrowDown' && dy === 0) {
                        dx = 0; dy = gridSize;
                    } else if (e.key === 'ArrowLeft' && dx === 0) {
                        dx = -gridSize; dy = 0;
                    } else if (e.key === 'ArrowRight' && dx === 0) {
                        dx = gridSize; dy = 0;
                    }
                });
                
                gameLoop();
            <\/script>
        </body>
        </html>
    `;
}

// Pong Game
function getPongGame() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; font-family: Arial, sans-serif; }
                canvas { border: 3px solid #fff; border-radius: 10px; }
                #score { position: absolute; top: 20px; color: white; font-size: 24px; }
                #instructions { position: absolute; bottom: 20px; color: white; text-align: center; }
            </style>
        </head>
        <body>
            <div id="score">Player: 0 | Computer: 0</div>
            <canvas id="gameCanvas" width="600" height="400"></canvas>
            <div id="instructions">Move mouse to control left paddle</div>
            <script>
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const scoreElement = document.getElementById('score');
                
                const paddleHeight = 80;
                const paddleWidth = 10;
                let playerY = (canvas.height - paddleHeight) / 2;
                let computerY = (canvas.height - paddleHeight) / 2;
                let ballX = canvas.width / 2;
                let ballY = canvas.height / 2;
                let ballSpeedX = 5;
                let ballSpeedY = 5;
                let playerScore = 0;
                let computerScore = 0;
                
                canvas.addEventListener('mousemove', function(e) {
                    const rect = canvas.getBoundingClientRect();
                    playerY = e.clientY - rect.top - paddleHeight / 2;
                });
                
                function update() {
                    ballX += ballSpeedX;
                    ballY += ballSpeedY;
                    
                    if (ballY <= 0 || ballY >= canvas.height) {
                        ballSpeedY = -ballSpeedY;
                    }
                    
                    if (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) {
                        ballSpeedX = -ballSpeedX;
                        ballSpeedY = (ballY - (playerY + paddleHeight / 2)) * 0.3;
                    }
                    
                    if (ballX >= canvas.width - paddleWidth && ballY >= computerY && ballY <= computerY + paddleHeight) {
                        ballSpeedX = -ballSpeedX;
                        ballSpeedY = (ballY - (computerY + paddleHeight / 2)) * 0.3;
                    }
                    
                    if (ballX < 0) {
                        computerScore++;
                        resetBall();
                    }
                    if (ballX > canvas.width) {
                        playerScore++;
                        resetBall();
                    }
                    
                    scoreElement.textContent = 'Player: ' + playerScore + ' | Computer: ' + computerScore;
                    
                    computerY += (ballY - (computerY + paddleHeight / 2)) * 0.1;
                }
                
                function resetBall() {
                    ballX = canvas.width / 2;
                    ballY = canvas.height / 2;
                    ballSpeedX = -ballSpeedX;
                    ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
                }
                
                function draw() {
                    ctx.fillStyle = '#1a1a2e';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
                    ctx.fillRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);
                    
                    ctx.beginPath();
                    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.setLineDash([10, 10]);
                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2, 0);
                    ctx.lineTo(canvas.width / 2, canvas.height);
                    ctx.stroke();
                }
                
                function gameLoop() {
                    update();
                    draw();
                    requestAnimationFrame(gameLoop);
                }
                
                gameLoop();
            <\/script>
        </body>
        </html>
    `;
}

// Breakout Game
function getBreakoutGame() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; font-family: Arial, sans-serif; }
                canvas { border: 3px solid #4CAF50; border-radius: 10px; }
                #score { position: absolute; top: 20px; color: white; font-size: 24px; }
                #instructions { position: absolute; bottom: 20px; color: white; text-align: center; }
            </style>
        </head>
        <body>
            <div id="score">Score: 0</div>
            <canvas id="gameCanvas" width="480" height="320"></canvas>
            <div id="instructions">Move mouse to control paddle</div>
            <script>
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const scoreElement = document.getElementById('score');
                
                let x = canvas.width / 2;
                let y = canvas.height - 30;
                let dx = 3;
                let dy = -3;
                const ballRadius = 10;
                const paddleHeight = 10;
                const paddleWidth = 75;
                let paddleX = (canvas.width - paddleWidth) / 2;
                const brickRowCount = 4;
                const brickColumnCount = 6;
                const brickWidth = 65;
                const brickHeight = 20;
                const brickPadding = 10;
                const brickOffsetTop = 30;
                const brickOffsetLeft = 35;
                let score = 0;
                
                const bricks = [];
                for (let c = 0; c < brickColumnCount; c++) {
                    bricks[c] = [];
                    for (let r = 0; r < brickRowCount; r++) {
                        bricks[c][r] = { x: 0, y: 0, status: 1 };
                    }
                }
                
                canvas.addEventListener('mousemove', function(e) {
                    const relativeX = e.clientX - canvas.offsetLeft;
                    if (relativeX > 0 && relativeX < canvas.width) {
                        paddleX = relativeX - paddleWidth / 2;
                    }
                });
                
                function collisionDetection() {
                    for (let c = 0; c < brickColumnCount; c++) {
                        for (let r = 0; r < brickRowCount; r++) {
                            const b = bricks[c][r];
                            if (b.status === 1) {
                                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                                    dy = -dy;
                                    b.status = 0;
                                    score += 10;
                                    scoreElement.textContent = 'Score: ' + score;
                                    if (score === brickRowCount * brickColumnCount * 10) {
                                        alert('YOU WIN!');
                                        document.location.reload();
                                    }
                                }
                            }
                        }
                    }
                }
                
                function drawBall() {
                    ctx.beginPath();
                    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
                    ctx.fillStyle = '#ff4444';
                    ctx.fill();
                    ctx.closePath();
                }
                
                function drawPaddle() {
                    ctx.beginPath();
                    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
                    ctx.fillStyle = '#4CAF50';
                    ctx.fill();
                    ctx.closePath();
                }
                
                function drawBricks() {
                    for (let c = 0; c < brickColumnCount; c++) {
                        for (let r = 0; r < brickRowCount; r++) {
                            if (bricks[c][r].status === 1) {
                                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                                bricks[c][r].x = brickX;
                                bricks[c][r].y = brickY;
                                ctx.beginPath();
                                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                                ctx.fillStyle = '#0095DD';
                                ctx.fill();
                                ctx.closePath();
                            }
                        }
                    }
                }
                
                function draw() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawBricks();
                    drawBall();
                    drawPaddle();
                    collisionDetection();
                    
                    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                        dx = -dx;
                    }
                    if (y + dy < ballRadius) {
                        dy = -dy;
                    } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
                        if (x > paddleX && x < paddleX + paddleWidth) {
                            dy = -dy;
                        } else if (y + dy > canvas.height - ballRadius) {
                            alert('GAME OVER');
                            document.location.reload();
                        }
                    }
                    
                    x += dx;
                    y += dy;
                    requestAnimationFrame(draw);
                }
                
                draw();
            <\/script>
        </body>
        </html>
    `;
}

// Tic Tac Toe Game
function getTicTacToeGame() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; font-family: Arial, sans-serif; flex-direction: column; }
                .board { display: grid; grid-template-columns: repeat(3, 100px); gap: 5px; margin: 20px; }
                .cell { width: 100px; height: 100px; background: #16213e; display: flex; justify-content: center; align-items: center; font-size: 48px; cursor: pointer; border-radius: 10px; }
                .cell:hover { background: #1f305a; }
                #status { color: white; font-size: 24px; margin: 20px; }
                #restart { padding: 10px 30px; font-size: 18px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
                #restart:hover { background: #45a049; }
            </style>
        </head>
        <body>
            <div id="status">Your Turn (X)</div>
            <div class="board" id="board"></div>
            <button id="restart">Restart Game</button>
            <script>
                const board = document.getElementById('board');
                const status = document.getElementById('status');
                const restartBtn = document.getElementById('restart');
                let cells = Array(9).fill(null);
                let gameActive = true;
                
                function createBoard() {
                    board.innerHTML = '';
                    cells.forEach((cell, index) => {
                        const cellDiv = document.createElement('div');
                        cellDiv.className = 'cell';
                        cellDiv.dataset.index = index;
                        cellDiv.textContent = cell || '';
                        cellDiv.addEventListener('click', handleCellClick);
                        board.appendChild(cellDiv);
                    });
                }
                
                function handleCellClick(e) {
                    const index = e.target.dataset.index;
                    if (cells[index] || !gameActive) return;
                    
                    cells[index] = 'X';
                    createBoard();
                    
                    if (checkWin('X')) {
                        status.textContent = 'You Win! 🎉';
                        gameActive = false;
                        return;
                    }
                    
                    if (cells.every(cell => cell)) {
                        status.textContent = "It's a Draw!";
                        gameActive = false;
                        return;
                    }
                    
                    status.textContent = 'Computer Thinking...';
                    setTimeout(computerMove, 500);
                }
                
                function computerMove() {
                    if (!gameActive) return;
                    
                    const emptyCells = cells.map((cell, index) => cell === null ? index : null).filter(i => i !== null);
                    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    cells[randomIndex] = 'O';
                    createBoard();
                    
                    if (checkWin('O')) {
                        status.textContent = 'Computer Wins! 💻';
                        gameActive = false;
                        return;
                    }
                    
                    if (cells.every(cell => cell)) {
                        status.textContent = "It's a Draw!";
                        gameActive = false;
                        return;
                    }
                    
                    status.textContent = 'Your Turn (X)';
                }
                
                function checkWin(player) {
                    const winPatterns = [
                        [0, 1, 2], [3, 4, 5], [6, 7, 8],
                        [0, 3, 6], [1, 4, 7], [2, 5, 8],
                        [0, 4, 8], [2, 4, 6]
                    ];
                    return winPatterns.some(pattern => 
                        pattern.every(index => cells[index] === player)
                    );
                }
                
                restartBtn.addEventListener('click', () => {
                    cells = Array(9).fill(null);
                    gameActive = true;
                    status.textContent = 'Your Turn (X)';
                    createBoard();
                });
                
                createBoard();
            <\/script>
        </body>
        </html>
    `;
}

// Memory Game
function getMemoryGame() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; font-family: Arial, sans-serif; flex-direction: column; }
                .game-board { display: grid; grid-template-columns: repeat(4, 80px); gap: 10px; margin: 20px; }
                .card { width: 80px; height: 80px; background: #4CAF50; display: flex; justify-content: center; align-items: center; font-size: 36px; cursor: pointer; border-radius: 10px; user-select: none; }
                .card.flipped { background: #fff; transform: rotateY(180deg); }
                .card.matched { background: #ffd700; visibility: hidden; }
                #stats { color: white; font-size: 20px; margin: 20px; }
                #restart { padding: 10px 30px; font-size: 18px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
            </style>
        </head>
        <body>
            <div id="stats">Moves: 0 | Time: 0s</div>
            <div class="game-board" id="gameBoard"></div>
            <button id="restart">Restart Game</button>
            <script>
                const gameBoard = document.getElementById('gameBoard');
                const stats = document.getElementById('stats');
                const restartBtn = document.getElementById('restart');
                
                const emojis = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🥝', '🍊'];
                let cards = [...emojis, ...emojis];
                let flippedCards = [];
                let matchedPairs = 0;
                let moves = 0;
                let startTime = Date.now();
                let timerInterval;
                
                function shuffle(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                }
                
                function createBoard() {
                    gameBoard.innerHTML = '';
                    shuffle(cards);
                    cards.forEach((emoji, index) => {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.dataset.index = index;
                        card.dataset.emoji = emoji;
                        card.textContent = '?';
                        card.addEventListener('click', flipCard);
                        gameBoard.appendChild(card);
                    });
                }
                
                function flipCard(e) {
                    const card = e.target;
                    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) return;
                    
                    card.classList.add('flipped');
                    card.textContent = card.dataset.emoji;
                    flippedCards.push(card);
                    
                    if (flippedCards.length === 2) {
                        moves++;
                        checkMatch();
                    }
                }
                
                function checkMatch() {
                    const [card1, card2] = flippedCards;
                    if (card1.dataset.emoji === card2.dataset.emoji) {
                        setTimeout(() => {
                            card1.classList.add('matched');
                            card2.classList.add('matched');
                            matchedPairs++;
                            if (matchedPairs === 8) {
                                clearInterval(timerInterval);
                                const time = Math.floor((Date.now() - startTime) / 1000);
                                stats.textContent = 'You Won! Moves: ' + moves + ' | Time: ' + time + 's 🎉';
                            }
                        }, 500);
                    } else {
                        setTimeout(() => {
                            card1.classList.remove('flipped');
                            card2.classList.remove('flipped');
                            card1.textContent = '?';
                            card2.textContent = '?';
                        }, 1000);
                    }
                    flippedCards = [];
                    updateStats();
                }
                
                function updateStats() {
                    const time = Math.floor((Date.now() - startTime) / 1000);
                    stats.textContent = 'Moves: ' + moves + ' | Time: ' + time + 's';
                }
                
                function startTimer() {
                    timerInterval = setInterval(updateStats, 1000);
                }
                
                restartBtn.addEventListener('click', () => {
                    matchedPairs = 0;
                    moves = 0;
                    flippedCards = [];
                    startTime = Date.now();
                    clearInterval(timerInterval);
                    startTimer();
                    createBoard();
                });
                
                createBoard();
                startTimer();
            <\/script>
        </body>
        </html>
    `;
}

// Clicker Game
function getClickerGame() {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a2e; font-family: Arial, sans-serif; flex-direction: column; }
                #clickBtn { width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(145deg, #4CAF50, #45a049); border: none; color: white; font-size: 24px; cursor: pointer; box-shadow: 0 10px 20px rgba(0,0,0,0.3); transition: transform 0.1s; }
                #clickBtn:active { transform: scale(0.95); }
                #clickBtn:disabled { background: #666; cursor: not-allowed; }
                #score { color: white; font-size: 48px; margin: 20px; }
                #timer { color: #ff4444; font-size: 32px; margin: 20px; }
                #message { color: white; font-size: 24px; margin: 20px; }
                #restart { padding: 15px 40px; font-size: 20px; background: #4CAF50; color: white; border: none; border-radius: 10px; cursor: pointer; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div id="score">Clicks: 0</div>
            <div id="timer">Time: 30s</div>
            <button id="clickBtn">CLICK ME!</button>
            <div id="message"></div>
            <button id="restart" style="display:none;">Play Again</button>
            <script>
                const clickBtn = document.getElementById('clickBtn');
                const scoreEl = document.getElementById('score');
                const timerEl = document.getElementById('timer');
                const messageEl = document.getElementById('message');
                const restartBtn = document.getElementById('restart');
                
                let clicks = 0;
                let timeLeft = 30;
                let gameActive = true;
                let timerInterval;
                
                clickBtn.addEventListener('click', () => {
                    if (!gameActive) return;
                    clicks++;
                    scoreEl.textContent = 'Clicks: ' + clicks;
                });
                
                function startTimer() {
                    timerInterval = setInterval(() => {
                        timeLeft--;
                        timerEl.textContent = 'Time: ' + timeLeft + 's';
                        if (timeLeft <= 0) {
                            endGame();
                        }
                    }, 1000);
                }
                
                function endGame() {
                    gameActive = false;
                    clearInterval(timerInterval);
                    clickBtn.disabled = true;
                    messageEl.textContent = 'Time\'s up! You clicked ' + clicks + ' times! (' + (clicks / 30).toFixed(1) + ' clicks/sec)';
                    restartBtn.style.display = 'block';
                }
                
                restartBtn.addEventListener('click', () => {
                    clicks = 0;
                    timeLeft = 30;
                    gameActive = true;
                    scoreEl.textContent = 'Clicks: 0';
                    timerEl.textContent = 'Time: 30s';
                    messageEl.textContent = '';
                    clickBtn.disabled = false;
                    restartBtn.style.display = 'none';
                    startTimer();
                });
                
                startTimer();
            <\/script>
        </body>
        </html>
    `;
}
