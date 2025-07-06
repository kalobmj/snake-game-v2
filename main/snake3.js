//

// mostly done, just need sounds on level completion and level up and music in background

// on level completion -> play level up sound (possibly use same sound as game), play small animation each level, play larger animation when user wins entire game (most likely level 5)

// need audio track to play in background
// could possibly be 5 different songs for every level

//

const canvas = document.getElementById('canvas-1');
const c = canvas.getContext('2d');
const score = document.getElementById('score-num');
const highScore = document.getElementById('highscore-num');
const playButton = document.getElementById('play-btn');
const gameOverButton = document.getElementById('game-over-btn');
const currentLevel = document.getElementById('current-level');
const currentPlanet = document.getElementById('current-planet');
const orb = document.getElementById('orb');
const fill = document.getElementById('fill');
const fillBar = document.getElementById('progress-bar-container');

// sizing progress bar depending on canvas size
fillBar.style.width = `${canvas.width + 30}px`;

// remove this to retain high score even you reload the window
localStorage.clear();
localStorage.setItem('high-score', '0');

// size of game board, and calculating size of each cell
let rows = 10;
let cols = 10;
let cellSize = Math.floor(((window.innerHeight / 3) * 2) / cols);

// sizing orb 
orb.width = cellSize * 2;
orb.height = cellSize * 2;

// sizing canvas
canvas.height = cellSize * rows;
canvas.width = cellSize * cols;

// sizing gameOverButton based on cellSize
gameOverButton.style.height = `${cellSize * 1.5}px`;
gameOverButton.style.width = `${cellSize * 3.5}px`;
gameOverButton.style.fontSize = `${cellSize / 2}px`;

// variables
let interval;
let ourJewel;
let bjtImage;
let jewelImgs;
let planetImgs;
let currentBackground;
let level = 1;
let apple = [];
let snake = [];
let direction = 'right';
let gameIsOver = false;
let isGameRunning = false;
let directionTick = false;
let doublePoints = false;
let doublePointsTracker = 0;

// jewels
const jewels = {
    green: '/assets/gems/green-octogon.png',
    red: '/assets/gems/red-square.png',
    yellow: '/assets/gems/yellow-rect.png',
    white: '/assets/gems/white-decagon.png',
    blue: '/assets/gems/blue-diamond.png'
};

// planets level 2-5
const planets = {
    aqua: '/assets/planet-backgrounds/Aqua-Aeon-XI.jpg',
    vermithrax: '/assets/planet-backgrounds/Vermithrax-II.jpg',
    frostara: '/assets/planet-backgrounds/Frostara-Glace-VI.jpg',
    neptune: '/assets/planet-backgrounds/Neptune-II.jpg',
};

// this function will check if user has passed level, if user has completed level, call updateLevel.
function checkLevel() {
    let currentScore = Number(score.innerText);

    // if user passes level -> call updateLevel
    if (level === 1 && currentScore >= 400 || level === 2 && currentScore >= 800 || level === 3 && currentScore >= 1200 || level === 4 && currentScore >= 1600 || level === 5 && currentScore >= 2000) {
        console.log('we have passed the level!');

        // stop game from running (clearing interval)
        clearInterval(interval);

        // calling updateLevel
        updateLevel();
    }

    if (level === 6) {
        console.log('you have beaten the game!');
        // logic for winning game here:

        // ending game will happen here
        updateLevel();
    }
};

// this will stop game interval, update gameboard, update maxPoints, and update level
function updateLevel() {
    gameOverButton.style.background = '#FFC300';
    gameOverButton.innerText = 'LEVEL UP!';
    isGameRunning = false;

    // resetting double points (don't carry over to next round)
    doublePoints = false;
    doublePointsTracker = 0;

    // after 4 seconds, update game speed, board, and background
    setTimeout(() => {
        if (level === 2) {
            currentPlanet.innerText = 'AQUA AEON XI'
            currentBackground = planetImgs[0];
        } else if (level === 3) {
            currentPlanet.innerText = 'VERMITHRAX II'
            currentBackground = planetImgs[1];
        } else if (level === 4) {
            currentPlanet.innerText = 'FROSTARA GLACE VI'
            currentBackground = planetImgs[2];
        } else if (level === 5) {
            currentPlanet.innerText = 'NEPTUNE II'
            currentBackground = planetImgs[3];
        } else if (level === 6) {
            playButton.innerText = 'play again';
            playButton.style.visibility = 'visible';

            return;
        };

        grid();
        fillBoard();

        direction = 'right';
        currentLevel.innerText = `${level}/5`
        playButton.innerText = 'continue';
        playButton.style.visibility = 'visible';
    }, 1000);

    // give some time before making button visible
    setTimeout(() => {
        if (level === 6) {
            gameOverButton.style.background = 'violet';
            gameOverButton.innerText = 'YOU WIN!'
        };

        setTimeout(() => {
            gameOverButton.style.visibility = 'visible';

        }, 100);
    }, 100);

    // if level is not the last level, add +1 to current level
    if (level != 6) {
        level += 1;
    };
};

// image loader helper
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

// setup function to preload planet and jewel images before game starts
async function preloadImages() {
    try {
        const jewelEntries = Object.entries(jewels);
        const planetEntries = Object.entries(planets);
        const imagePromises = jewelEntries.map(([name, src]) => loadImage(name, src));
        const planetPromises = planetEntries.map(([name, src]) => loadImage(name, src));

        imagePromises.push(loadImage('bjt', '/assets/gems/BJT_NDS_ICON2.png'));

        imagePromises.push(loadImage('space', '/assets/bj-background.webp'));

        const loadedImgs = await Promise.all(imagePromises);
        const loadedPlanets = await Promise.all(planetPromises);
        const spaceImage = loadedImgs.pop();

        currentBackground = spaceImage;
        ourJewel = loadedImgs[0];
        jewelImgs = loadedImgs;
        planetImgs = loadedPlanets;

        console.log({ planetImgs });
    } catch (err) {
        console.error('Image had problem loading...', err);
    }
};

// checks for body cell and jewel collisions
function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true;
    } else {
        return false;
    }
};

// check if cell is out of bounds of the game board
function checkBounds(x, y) {
    if (x < 0 || y < 0 || x >= (cellSize * rows) || y >= (cellSize * cols)) {
        endGame();
        return true;
    } else {
        return false;
    };
};

// updates game score based on current jewel
function updateScore() {
    let localScore = Number(score.innerText);
    let localHighScore = Number(localStorage.getItem('high-score'));
    let ourJewelId = ourJewel.id;

    if (doublePoints) {
        console.log('we are getting double points');

        // each interval decrease the number of turns with double points by one ( -1)
        if (doublePointsTracker >= 1) {
            doublePointsTracker--;
        };

        // if we are out of double point turns, set points back to regular 
        if (doublePointsTracker === 0) {
            doublePoints = false;
        };

        if (ourJewelId === 'green') {
            localScore += 20;
        } else if (ourJewelId === 'red') {
            localScore += 60;
        } else if (ourJewelId === 'yellow') {
            localScore += 80;
        } else if (ourJewelId === 'white') {
            localScore += 100;
        } else if (ourJewelId === 'blue') {
            localScore += 150;
        };
    } else {
        console.log('we are not getting double points');

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
        } else if (ourJewelId === 'bjt') {
            // double points last 5 gems, after return to normal points
            doublePointsTracker = 5;
            doublePoints = true;
        };
    }

    // update displayed score
    score.innerText = localScore;

    // if current score is higher than the high score, replace it
    if (localScore > localHighScore) {
        highScore.innerText = localScore;
        localStorage.setItem('high-score', `${localScore}`);
    }

    // logic for filling progress bar
    if (level === 1) {
        setProgress(localScore, 0, 400);
    } else if (level === 2) {
        setProgress(localScore, 400, 800);
    } else if (level === 3) {
        setProgress(localScore, 800, 1200);
    } else if (level === 4) {
        setProgress(localScore, 1200, 1600);
    } else if (level === 5) {
        setProgress(localScore, 1600, 2000);
    }

    checkLevel();
};

// draws planet image onto board, places grid on top
function grid() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(currentBackground, 0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isEven = (i + j) % 2 === 0;
            let color = isEven ? '#ffffff15' : '#00000040';

            c.fillStyle = color;
            c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    };
};

// fills board with our snake and current apple (jewel)
function fillBoard() {
    // apple
    apple = [];
    apple[0] = { x: cellSize * 6, y: cellSize * 6 };
    c.drawImage(ourJewel, apple[0].x, apple[0].y, cellSize, cellSize);

    // snake
    snake = [];
    snake[0] = { x: cellSize * 3, y: cellSize * 4 };
    snake[1] = { x: cellSize * 2, y: cellSize * 4 };
    c.fillStyle = 'green';
    c.fillRect(snake[0].x, snake[0].y, cellSize, cellSize);
    c.fillRect(snake[1].x, snake[1].y, cellSize, cellSize);

    // snake face
    let x1 = snake[0].x;
    let y1 = snake[0].y;

    drawHead(x1, y1);
};

// place apple on game board
function placeApple() {
    let x1, y1, collision;

    // loop to find an apple that does not collide with snake body
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

    // roll for which jewel will spawn, roll again for a bjt jewel (jewel that gives double points)
    let jewelRoll = Math.floor(Math.random() * 100) + 1;
    let bjtRoll = Math.floor(Math.random() * 5) + 1;

    if (bjtRoll === 5 && !doublePoints) {
        ourJewel = jewelImgs[5];
    } else {
        if (jewelRoll >= 1 && jewelRoll <= 30) {
            ourJewel = jewelImgs[0];
        } else if (jewelRoll >= 31 && jewelRoll <= 50) {
            ourJewel = jewelImgs[1];
        } else if (jewelRoll >= 51 && jewelRoll <= 65) {
            ourJewel = jewelImgs[2];
        } else if (jewelRoll >= 66 && jewelRoll <= 85) {
            if (snake.length <= 3) {
                ourJewel = jewelImgs[0]
            } else {
                ourJewel = jewelImgs[3];
            }
        } else if (jewelRoll >= 86 && jewelRoll <= 100) {
            ourJewel = jewelImgs[4];
        };
    }

    // record apple coordinates and draw
    apple[0].x = x1;
    apple[0].y = y1;
    c.drawImage(ourJewel, x1, y1, cellSize, cellSize);
};

// move the snake
function move() {
    let head = { ...snake[0] };

    // check if snakehead exits the game board
    if (checkBounds(head.x, head.y)) {
        endGame();
        return;
    };

    // position new head based on direction
    if (direction === 'right') {
        head.x += cellSize;
    } else if (direction === 'left') {
        head.x -= cellSize;
    } else if (direction === 'up') {
        head.y -= cellSize;
    } else if (direction === 'down') {
        head.y += cellSize;
    };

    // check if our new snake head collides with any part of our snake's body
    for (let i = 0; i < snake.length; i++) {
        if (checkCollision(head.x, head.y, snake[i].x, snake[i].y)) {
            endGame();
            return;
        };
    };

    // add snake head to snake array
    snake.unshift(head);

    // check if snakehead collides with the apple
    if (checkCollision(head.x, head.y, apple[0].x, apple[0].y)) {
        const ourJewelId = ourJewel.id;

        // special rules for white and blue jewel, white takes away one from body, blue keeps snake body the same length
        if (ourJewelId === 'white') {
            snake.splice(-2);
        } else if (ourJewelId === 'blue') {
            snake.pop();
        };

        // re-draw board so that we can draw snake again, and place a new apple
        grid();
        updateScore();
        placeApple();

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        };

        drawHead(snake[0].x, snake[0].y);
    } else {
        // we did not hit an apple, so we will remove the tail from snake, and re-draw grid
        snake.pop();
        grid();

        // place old apple
        c.drawImage(ourJewel, apple[0].x, apple[0].y, cellSize, cellSize);

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        };

        drawHead(snake[0].x, snake[0].y);
    };
    directionTick = false;
};

// draw snake's face onto snake head, depending on snake's direction
function drawHead(x, y) {
    c.fillStyle = 'black';

    let x1 = x,
        x2 = x,
        x3 = x,
        x4 = x,
        x5 = x,
        x6 = x;

    let y1 = y,
        y2 = y,
        y3 = y,
        y4 = y,
        y5 = y,
        y6 = y;

    if (direction === 'right') {
        console.log('direction is right');

        x1 += (cellSize / 2);
        x2 += (cellSize / 2);

        y2 += (cellSize / 2);
        y3 += (cellSize * .25);

        x4 += (cellSize / 2);
        x6 += (cellSize / 2);

        y4 += (cellSize / 2);
        y5 += (cellSize * .75);
        y6 += cellSize;

        c.fillRect(x + (cellSize * .75), y + (cellSize * .25), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + (cellSize * .75), y + ((cellSize * .75) - cellSize / 10), (cellSize / 10), (cellSize / 10));
    } else if (direction === 'left') {
        console.log('direction is left');

        x1 += (cellSize / 2);
        x2 += cellSize;
        x3 += (cellSize / 2);

        y2 += (cellSize / 4);
        y3 += (cellSize / 2);

        x4 += (cellSize / 2);
        x5 += cellSize;
        x6 += (cellSize / 2);

        y4 += (cellSize / 2);
        y5 += (cellSize * .75);
        y6 += cellSize;

        c.fillRect(x + (cellSize * .25), y + (cellSize * .25), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + (cellSize * .25), y + ((cellSize * .75) - cellSize / 10), (cellSize / 10), (cellSize / 10));
    } else if (direction === 'up') {
        console.log('direction is up');

        x2 += (cellSize / 2);
        x3 += (cellSize * .25);

        y1 += (cellSize / 2);
        y2 += (cellSize / 2);
        y3 += cellSize;

        x4 += (cellSize / 2);
        x5 += cellSize;
        x6 += (cellSize * .75);

        y4 += (cellSize / 2);
        y5 += (cellSize / 2);
        y6 += cellSize;

        c.fillRect(x + (cellSize * .25), y + (cellSize * .125), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + ((cellSize * .75) - cellSize / 10), y + (cellSize * .125), (cellSize / 10), (cellSize / 10));
    } else if (direction === 'down') {
        console.log('direction is down');

        x2 += (cellSize * .25);
        x3 += (cellSize / 2);

        y1 += (cellSize / 2);
        y3 += (cellSize / 2);

        x4 += (cellSize / 2);
        x5 += (cellSize * .75);
        x6 += cellSize;

        y4 += (cellSize / 2);
        y6 += (cellSize / 2);

        c.fillRect(x + (cellSize * .25), y + (cellSize * .75), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + ((cellSize * .75) - (cellSize / 10)), y + (cellSize * .75), (cellSize / 10), (cellSize / 10));
    };

    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineTo(x3, y3);
    c.closePath();
    c.fill();

    c.beginPath();
    c.moveTo(x4, y4);
    c.lineTo(x5, y5);
    c.lineTo(x6, y6);
    c.closePath();
    c.fill();
};

// fill progress bar depending on player's current points
function setProgress(pts, minPts, maxPts) {
    pointsThisRound = pts - minPts;
    pointsRequired = maxPts - minPts;

    fill.style.width = `${(pointsThisRound / pointsRequired) * 100}%`;
};

// setup game by drawing board, filling it with the snake and apple, then display game stats (check console)
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
    playButton.innerText = 'play';
    playButton.style.visibility = 'visible';
    gameIsOver = true;

    setTimeout(() => {
        gameOverButton.innerText = 'game over';
        gameOverButton.style.background = 'red';
        gameOverButton.style.visibility = 'visible';
    }, 100);

    // player beats game
    if (level === 6) {

        // logic for player beating game

        // audio will play here

    };
};

function resetGame() {
    // resetting game stats to level 1
    let apple = [];
    let snake = [];
    isGameRunning = false;
    directionTick = false;
    level = 1;
    direction = 'right';
    score.innerText = '0';
    playButton.innerText = 'play';
    currentBackground = space;
    currentPlanet.innerText = 'TAU HEXIMUS';
    fill.style.background = 'linear-gradient(to bottom, #f259f1 35%, #e590f6)';
    gameIsOver = false;
    currentLevel.innerText = '1/5';

    setupGame();
};

// get current stats for game
function getStats() {
    console.log('*start of game stats*');
    console.log({ rows });
    console.log({ cols });
    console.log({ cellSize });
    console.log({ isGameRunning });
    console.log({ direction });
    console.log({ apple });
    console.log({ snake });
    console.log('canvas width', canvas.width);
    console.log('canvas height', canvas.height);
    console.log('*end of game stats*');
};

canvas.addEventListener('keydown', (e) => {
    if (directionTick) {
        return;
    };

    // stop game if press enter (testing)
    if (e.key === "Enter") {
        clearInterval(interval)
    };

    // user can use arrow keys or wasd to move snake
    if ((e.key === 'ArrowRight' || e.key === 'd') && direction != 'left') {
        direction = 'right';
        directionTick = true;
    } else if ((e.key === 'ArrowLeft' || e.key === 'a') && direction != 'right') {
        direction = 'left';
        directionTick = true;
    } else if ((e.key === 'ArrowUp' || e.key === 'w') && direction != 'down') {
        direction = 'up';
        directionTick = true;
    } else if ((e.key === 'ArrowDown' || e.key === 's') && direction != 'up') {
        direction = 'down';
        directionTick = true;
    }
});

playButton.addEventListener('click', () => {
    // resets progress bar at the start of each level
    fill.style.width = '0%';

    // focus user on game board
    canvas.setAttribute('tabindex', 1);
    canvas.focus();

    // if game is over, reset and start game
    if (gameIsOver) {
        resetGame();
        startGame();
        return
    };

    // if user presses play, start game depending on player's current level
    if (level === 1) {
        if (!isGameRunning) {
            resetGame();
            startGame();
        };
        return
    } else if (level === 2) {
        // speeding up game
        isGameRunning === true;
        interval = setInterval(move, 400);
        fill.style.background = 'linear-gradient(to bottom,rgb(116,208,231) 35%,rgb(178,223,239))';
    } else if (level === 3) {
        isGameRunning === true;
        interval = setInterval(move, 300)
        fill.style.background = 'linear-gradient(to bottom,rgb(176, 135, 99) 35%,rgb(228, 197, 134))';
    } else if (level === 4) {
        isGameRunning === true;
        interval = setInterval(move, 200);
        fill.style.background = 'linear-gradient(to bottom,rgb(215,229,239) 35%,rgb(76,147,207))';
    } else if (level === 5) {
        isGameRunning === true;
        interval = setInterval(move, 100);
        fill.style.background = 'linear-gradient(to bottom,rgb(9,67,133) 35%,rgb(71,194,241))';
    } else if (level === 6) {
        // player has won, pressing play button again will start a new game
        gameOverButton.style.visibility = 'hidden';
        resetGame();
        return;
    };

    gameOverButton.style.visibility = 'hidden';
    playButton.style.visibility = 'hidden';
});

// on window load, wait for images to load before setting up game
window.onload = async () => {
    await preloadImages();
    setupGame();
    getStats();
};
