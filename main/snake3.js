//

// level 1: 500 points to win
// level 2: 1250 points to win
// level 3: 1500 points to win
// level 4: 1750 points to win
// level 5: 2000 points to win

// things from concept:
// board background chagning for each level (bejewled backgrounds)
// left side - current level
// left side - level orb
// left side - how to play
// right side - legend
// bottom side - current level progress bar
// on level completion -> play level up sound (possibly use same sound as game), play small animation each level, play larger animation when user wins entire game (most likely level 5)

// make snake more round (less blocky)

// give snake some type of head (not a face, too cheesy)

// have jewel pulsate (increase and decrease size, slightly move up and down to simulate gem moving on each interval)

// bjt gem does -> ???

// every level up:
// increases interval speed (game runs faster)
// increases board size (makes gameboard bigger)
// require more points to go to the next level

// possible point tracker bar on side or bottom to show how far you are in the level

// every level up increases points gained by 5x

// need audio track to play in background
// could possibly be 5 different songs for every level

// can mess around with changing the background of the board for each level (like the real game)

//

const playButton = document.getElementById('play-btn');
const highScore = document.getElementById('highscore-num');
const gameOverButton = document.getElementById('game-over-btn');
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
gameOverButton.style.fontSize = `${cellSize / 2}px`;

let interval;
let jewelImgs;
let isGameRunning = false;
let direction = 'right';
let directionTick = false;
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

function loadImage(name, src) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.src = src;
        img.height = cellSize;
        img.width = cellSize;
        img.id = name;

        img.onload = () => res(img);
        img.onerror = rej;
    })
};

async function preloadImages() {
    try {
        const jewelEntries = Object.entries(jewels);
        const imagePromises = jewelEntries.map(([name, src]) => loadImage(name, src));

        imagePromises.push(loadImage('bjt', '/assets/gems/BJT_NDS_ICON2.png'));

        imagePromises.push(loadImage('space', '/assets/bj-background.webp'));

        const loadedImgs = await Promise.all(imagePromises);
        const spaceImage = loadedImgs.pop();
        const bjtImage = loadedImgs.pop();

        ourJewel = loadedImgs[0];
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

function updateScore() {
    let localScore = Number(score.innerText);
    let localHighScore = Number(localStorage.getItem('high-score'));
    const ourJewelId = ourJewel.id;

    if (ourJewelId === 'green') {
        localScore += 20;
    } else if (ourJewelId === 'red') {
        localScore += 30;
    } else if (ourJewelId === 'yellow') {
        localScore += 40;
    } else if (ourJewelId === 'white') {
        localScore += 50;
    } else if (ourJewelId === 'blue') {
        localScore += 75;
    };

    score.innerText = localScore;

    if (localScore > localHighScore) {
        highScore.innerText = localScore;
        localStorage.setItem('high-score', `${localScore}`);
    }
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
    c.drawImage(ourJewel, apple[0].x, apple[0].y, cellSize, cellSize);

    snake = [];
    snake[0] = { x: cellSize * 3, y: cellSize * 4 };
    snake[1] = { x: cellSize * 2, y: cellSize * 4 };
    c.fillStyle = 'green';
    c.fillRect(snake[0].x, snake[0].y, cellSize, cellSize);
    c.fillRect(snake[1].x, snake[1].y, cellSize, cellSize);

    let x1 = snake[0].x;
    let y1 = snake[0].y;

    drawHead(x1, y1);

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

    let jewelRoll = Math.floor(Math.random() * 100) + 1;

    if (jewelRoll >= 1 && jewelRoll <= 30) {
        ourJewel = jewelImgs[0];
    } else if (jewelRoll >= 31 && jewelRoll <= 50) {
        ourJewel = jewelImgs[1];
    } else if (jewelRoll >= 51 && jewelRoll <= 65) {
        ourJewel = jewelImgs[2];
    } else if (jewelRoll >= 66 && jewelRoll <= 85) {
        if (snake.length === 1) {
            ourJewel = jewelImgs[0]
        } else {
            ourJewel = jewelImgs[3];
        }
    } else if (jewelRoll >= 86 && jewelRoll <= 100) {
        ourJewel = jewelImgs[4];
    };

    console.log(ourJewel);

    apple[0].x = x1;
    apple[0].y = y1;
    c.drawImage(ourJewel, x1, y1, cellSize, cellSize);
};

function move() {
    let head = { ...snake[0] };

    console.log({ ourJewel });

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
        const ourJewelId = ourJewel.id;

        if (ourJewelId === 'white') {
            snake.splice(-2);
        } else if (ourJewelId === 'blue') {
            snake.pop();
        }

        grid();
        updateScore();
        placeApple();

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        };
    } else {
        snake.pop();
        grid();

        c.drawImage(ourJewel, apple[0].x, apple[0].y, cellSize, cellSize);

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        }
    };
    directionTick = false;
};

function drawHead(x, y) {

    if (direction === 'right') {

        console.log('direction is right')

        // // Set fill style (optional)
        c.fillStyle = 'violet';
        // // Set stroke style and line width (optional)
        // ctx.strokeStyle = "red";
        // ctx.lineWidth = 2;

        // ctx.beginPath();
        // ctx.moveTo(150, 50);  // Top vertex
        // ctx.lineTo(50, 150);  // Bottom-left vertex
        // ctx.lineTo(250, 150); // Bottom-right vertex
        // ctx.closePath();

        // drawing the triangle (get coords based off cellSize)
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(cellSize + x, (cellSize / 2) + y);
        c.lineTo(0, cellSize + y);
        c.closePath();

        c.fill();

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
    console.log({ ourJewel })
    console.log({ isGameRunning });
    console.log({ direction });
    console.log({ apple });
    console.log({ snake });
    console.log({ space });
    console.log({ bjt });
};

canvas.addEventListener('keydown', (e) => {
    if (directionTick) {
        return;
    };

    if (e.key === 'ArrowRight' && direction != 'left') {
        direction = 'right';
        directionTick = true;
    } else if (e.key === 'ArrowLeft' && direction != 'right') {
        direction = 'left';
        directionTick = true;
    } else if (e.key === 'ArrowUp' && direction != 'down') {
        direction = 'up';
        directionTick = true;
    } else if (e.key === 'ArrowDown' && direction != 'up') {
        direction = 'down';
        directionTick = true;
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

    console.log({ jewelImgs });

    setupGame();
};
