const playButton = document.getElementById('play-btn');
const highScore = document.getElementById('highscore-num');
const gameOverButton = document.getElementById('game-over-btn');
const spaceBackground = document.getElementById('space');
const score = document.getElementById('score-num');
const canvas = document.getElementById('canvas-1');
const c = canvas.getContext('2d');

localStorage.clear();
localStorage.setItem('high-score', '0');

const rows = 10;
const cols = 10;
const cellSize = Math.floor(((window.innerHeight / 3) * 2) / cols);
console.log({ cellSize });

canvas.height = cellSize * rows;
canvas.width = cellSize * cols;

gameOverButton.style.height = `${cellSize * 1.5}px`;
gameOverButton.style.width = `${cellSize * 3.5}px`;
gameOverButton.style.fontSize = `${cellSize / 2}px`

let interval;
let isGameRunning = false;
let direction = 'right';
let ourJewel;
let apple = [];
let snake = [];

const jewels = {
    green: '/assets/gems/green-octogon.png',
    red: '/assets/gems/red-square.png',
    yellow: '/assets/gems/yellow-rect.png',
    white: '/assets/gems/white-decagon.png',
    blue: '/assets/gems/blue-diamond.png'
};

// 

function loadImage(src) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.src = src;

        img.onload = () => res(img);
        img.onerror = rej;
    })
};

async function preloadImages() {
    try {
        const jewelEntries = Object.entries(jewels);
        const imagePromises = jewelEntries.map(([name, src]) => loadImage(src));
        imagePromises.push(loadImage('/assets/bj-background.webp'));

        const loadedImgs = await Promise.all(imagePromises);
        const spaceImage = loadedImgs.pop();

        space.src = spaceImage.src;
        jewelImgs = loadedImgs;
    } catch (err) {
        console.error('Image had problem loading...', err);
    }
};

//

function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true;
    } else {
        return false;
    }
};

function checkBounds(x, y) {
    if (x < 0 || y < 0 || x >= (cellSize * rows) || y >= (cellSize * cols)) {
        return true;
    } else {
        return false;
    };
};

function grid() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(space, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isEven = (i + j) % 2 === 0;
            let color = isEven ? '#ffffff15' : '#00000040';

            c.fillStyle = color;
            c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    };
};

function fillBoard() {
    apple = [];
    apple[0] = { x: cellSize * 6, y: cellSize * 6 };
    c.fillStyle = 'red';
    c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);

    snake = [];
    snake[0] = { x: cellSize * 3, y: cellSize * 4 };
    snake[1] = { x: cellSize * 2, y: cellSize * 4 };
    c.fillStyle = 'green';
    c.fillRect(snake[0].x, snake[0].y, cellSize, cellSize);
    c.fillRect(snake[1].x, snake[1].y, cellSize, cellSize);
};

function placeApple() {
    let x1, y1, collision;

    do {
        collision = false;

        x1 = Math.floor(Math.random() * rows) * cellSize;
        y1 = Math.floor(Math.random() * cols) * cellSize;

        for (const cell of snake) {
            if (checkCollision(cell.x, cell.y, x1, y1)) {
                collision = true;
                break;
            }
        };
    } while (collision);

    //

        // logic for determining jewel goes here
        // we will copy this from snake 2

    //

    apple[0].x = x1;
    apple[0].y = y1;
    c.fillStyle = 'red';
    c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);
};

function move() {
    let head = { ...snake[0] };

    if (checkBounds(head.x, head.y)) {
        endGame();
        return;
    };

    if (direction === 'right') {
        head.x += cellSize;
    } else if (direction === 'left') {
        head.x -= cellSize;
    } else if (direction === 'up') {
        head.y -= cellSize;
    } else if (direction === 'down') {
        head.y += cellSize;
    };

    for (let i = 0; i < snake.length; i++) {
        if (checkCollision(head.x, head.y, snake[i].x, snake[i].y)) {
            endGame();
            return;
        };
    };

    snake.unshift(head);

    if (checkCollision(head.x, head.y, apple[0].x, apple[0].y)) {
        grid();
        placeApple();
        updateScore();

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        };
    } else {
        snake.pop();
        grid();

        c.fillStyle = 'red';
        c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        }
    };
};

function updateScore() {
    let localScore = Number(score.innerText);
    let localHighScore = Number(localStorage.getItem('high-score'));
    localScore++;
    score.innerText = localScore;

    if (localScore > localHighScore) {
        highScore.innerText = localScore;
        localStorage.setItem('high-score', `${localScore}`);
    }
};

//

function setupGame() {
    grid();
    fillBoard();
    getStats();
};

function startGame() {
    interval = setInterval(move, 500);
    isGameRunning = true;
    gameOverButton.style.visibility = 'hidden';
    playButton.style.visibility = 'hidden';
};

function endGame() {
    clearInterval(interval);
    isGameRunning = false;
    playButton.style.visibility = 'visible';
    gameOverButton.style.visibility = 'visible';
};

function resetGame() {
    let apple = [];
    let snake = [];
    direction = 'right';
    score.innerText = '0';
    setupGame();
};

//

function getStats() {
    console.log({ rows });
    console.log({ cols });
    console.log({ cellSize });
    console.log('canvas height', canvas.height);
    console.log('canvas width', canvas.width);
    console.log({ interval });
    console.log({ isGameRunning });
    console.log({ direction });
    console.log({ apple });
    console.log({ snake });
};

canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && direction != 'left') {
        direction = 'right';
    } else if (e.key === 'ArrowLeft' && direction != 'right') {
        direction = 'left';
    } else if (e.key === 'ArrowUp' && direction != 'down') {
        direction = 'up';
    } else if (e.key === 'ArrowDown' && direction != 'up') {
        direction = 'down';
    }
});

playButton.addEventListener('click', () => {
    canvas.setAttribute('tabindex', 1);
    canvas.focus();

    if (!isGameRunning) {
        resetGame();
        startGame();
    }
});

window.onload = async () => {
    await preloadImages();
    setupGame();
};
