//

// fonts are not transfering on vercel, look into that

// test game board size at home (the game board is fine on the laptop, but might be to large on bigger screens)

// see if stockimage word is on background space text, if it is try to find a copy background or just change it

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
const musicButton = document.getElementById('music-toggle');
const purpleNote = document.getElementById('purple-note');
const noSymbol = document.getElementById('no-symbol');

// sizing progress bar depending on canvas size
fillBar.style.width = `${canvas.width + 30}px`;

// remove this to retain high score even you reload the window
localStorage.removeItem('high-score');
localStorage.setItem('high-score', '0');

if (localStorage.getItem('high-score') != undefined) {
    highScore.innerText = localStorage.getItem('high-score');
};

// size of game board, and calculating size of each cell
let rows = 10;
let cols = 10;
let cellSize = Math.floor(((window.innerHeight / 3) * 2) / cols);

// sizing music toggle button depending on cellSize
purpleNote.width = cellSize;
purpleNote.height = cellSize;
noSymbol.width = cellSize;
noSymbol.height = cellSize;
noSymbol.style.visibility = 'hidden';

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
let musicPlaying = true;
let currentSong;
let endingInterval;
let endingTick = 0;
let direction = 'right';
let gameIsOver = false;
let isGameRunning = false;
let directionTick = false;
let doublePoints = false;
let doublePointsTracker = 0;

// store user music button setting in localStorage
if (localStorage.getItem('musicPlaying') === 'false') {
    noSymbol.style.visibility = 'visible';
    musicPlaying = false;
} else if (localStorage.getItem('musicPlaying') === undefined) {
    noSymbol.style.visibility = 'hidden';
    musicPlaying = true;
    localStorage.setItem('musicPlaying', true);
};

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
    neptune: '/assets/planet-backgrounds/Neptune-II.jpg'
};

// this function will check if user has passed level, if user has completed level, call updateLevel.
function checkLevel() {
    let currentScore = Number(score.innerText);

    // if user passes level -> call updateLevel
    if (level === 1 && currentScore >= 400 || level === 2 && currentScore >= 800 || level === 3 && currentScore >= 1200 || level === 4 && currentScore >= 1600 || level === 5 && currentScore >= 2000) {
        console.log('we have passed the level!');

        clearInterval(interval);
        updateLevel();
    };

    if (level === 6) {
        console.log('you have beaten the game!');

        updateLevel();
    };
};

// this will stop game interval, update gameboard, update maxPoints, and update level
function updateLevel() {
    gameOverButton.style.background = '#FFC300';
    gameOverButton.innerText = 'LEVEL UP!';
    isGameRunning = false;

    if (level != 6) {
        gameOverButton.style.visibility = 'visible';
    };

    // resetting double points (don't carry over to next round)
    doublePoints = false;
    doublePointsTracker = 0;

    endAudio();

    if (level === 6) {
        // give some time before making button visible
        setTimeout(() => {
            gameOverButton.style.background = 'violet';
            gameOverButton.innerText = 'YOU WIN!'
            currentSong = audioTracks.finalDestination;
            playAudio();

            setTimeout(() => {
                gameOverButton.style.visibility = 'visible';
            }, 100);
        }, 100);

        setTimeout(() => {
            // play confetti at end (every 10 seconds)
            runConfetti();

            endingInterval = setInterval(runConfetti, 10000);
        }, 300);

        return;
    };

    // after some time, play track in-between levels if not level 6
    setTimeout(() => {
        if (level != 6) {
            currentSong = audioTracks.newBeginning;
            playAudio();
        }
    }, 250);

    // update game speed, board, and background
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

        direction = 'right';
        currentLevel.innerText = `${level}/5`
        playButton.innerText = 'continue';
        playButton.style.visibility = 'visible';

        grid();
        fillBoard();
    }, 1000);

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

        // each interval decreases the number of turns with double points by one ( -1)
        if (doublePointsTracker >= 1) {
            doublePointsTracker--;
        };

        if (doublePointsTracker === 0) {
            doublePoints = false;
        };

        if (ourJewelId === 'green') {
            localScore += 40;
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
    };

    // update displayed score
    score.innerText = localScore;

    // if current score is higher than the high score, replace it
    if (localScore > localHighScore) {
        highScore.innerText = localScore;
        localStorage.setItem('high-score', `${localScore}`);
    };

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
    // if ourJewel is white, change to green so player doesn't start the game with just a head
    if (ourJewel.id === 'white') {
        ourJewel = jewelImgs[0];
    };

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
            if (snake.length < 3) {
                ourJewel = jewelImgs[0];
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

    let [x1, x2, x3, x4, x5, x6] = Array(6).fill(x);
    let [y1, y2, y3, y4, y5, y6] = Array(6).fill(y);

    if (direction === 'right') {

        // getting coordinates for snake eyes
        [x1, x2] = [x + cellSize / 2, x + cellSize / 2];
        [y2, y3] = [y + cellSize / 2, y + cellSize * .25];
        [x4, x6] = [x + cellSize / 2, x + cellSize / 2];
        [y4, y5, y6] = [y + cellSize / 2, y + cellSize * .75, y + cellSize];

        // filling in snake nostrils
        c.fillRect(x + (cellSize * .75), y + (cellSize * .25), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + (cellSize * .75), y + ((cellSize * .75) - cellSize / 10), (cellSize / 10), (cellSize / 10));

    } else if (direction === 'left') {

        [x1, x2, x3] = [x + cellSize / 2, x + cellSize, x + cellSize / 2];
        [y2, y3] = [y + cellSize / 4, y + cellSize / 2];
        [x4, x5, x6] = [x + cellSize / 2, x + cellSize, x + cellSize / 2];
        [y4, y5, y6] = [y + cellSize / 2, y + cellSize * .75, y + cellSize];

        c.fillRect(x + (cellSize * .25), y + (cellSize * .25), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + (cellSize * .25), y + ((cellSize * .75) - cellSize / 10), (cellSize / 10), (cellSize / 10));

    } else if (direction === 'up') {

        [x2, x3] = [x + cellSize / 2, x + cellSize * .25];
        [y1, y2, y3] = [y + cellSize / 2, y + cellSize / 2, y + cellSize];
        [x4, x5, x6] = [x + cellSize / 2, x + cellSize, x + cellSize * .75];
        [y4, y5, y6] = [y + cellSize / 2, y + cellSize / 2, y + cellSize];

        c.fillRect(x + (cellSize * .25), y + (cellSize * .125), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + ((cellSize * .75) - cellSize / 10), y + (cellSize * .125), (cellSize / 10), (cellSize / 10));

    } else if (direction === 'down') {

        [x2, x3] = [x + cellSize * .25, x + cellSize / 2];
        [y1, y3] = [y + cellSize / 2, y + cellSize / 2];
        [x4, x5, x6] = [x + cellSize / 2, x + cellSize * .75, x + cellSize];
        [y4, y6] = [y + cellSize / 2, y + cellSize / 2];

        c.fillRect(x + (cellSize * .25), y + (cellSize * .75), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + ((cellSize * .75) - (cellSize / 10)), y + (cellSize * .75), (cellSize / 10), (cellSize / 10));

    };

    // drawing left eye
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineTo(x3, y3);
    c.closePath();
    c.fill();

    // drawing right eye
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
    endAudio();

    setTimeout(() => {
        gameOverButton.innerText = 'game over';
        gameOverButton.style.background = 'red';
        gameOverButton.style.visibility = 'visible';

        currentSong = audioTracks.jewelsOfDenial;
        playAudio();

    }, 100);

    // player beats game
    if (level === 6) {
        currentSong = audioTracks.finalDestination;
        playAudio();
    };
};

function resetGame() {
    // resetting game stats to level 1
    let apple = [];
    let snake = [];
    level = 1;
    direction = 'right';
    score.innerText = '0';
    isGameRunning = false;
    directionTick = false;
    currentBackground = space;
    currentSong = audioTracks.bejeweledTheme;
    playButton.innerText = 'play';
    currentPlanet.innerText = 'TAU HEXIMUS';
    fill.style.background = 'linear-gradient(to bottom, #f259f1 35%, #e590f6)';
    gameIsOver = false;
    currentLevel.innerText = '1/5';
    endingInterval = '';
    endingTick = 0;

    setupGame();
};

// get current stats for game
function getStats() {
    console.log('*start of game stats*');
    console.log({ isGameRunning });
    console.log({ apple });
    console.log({ snake });
    console.log({ cellSize });
    console.log({ direction });
    console.log('canvas width', canvas.width);
    console.log('canvas height', canvas.height);
    console.log('*end of game stats*');
};

// user can use arrow keys or wasd to move snake
canvas.addEventListener('keydown', (e) => {
    if (directionTick) {
        return
    };

    // tick to keep snake to 1 turn per interval
    directionTick = true;

    if ((e.key === 'ArrowRight' || e.key === 'd') && direction != 'left') {
        direction = 'right';
    } else if ((e.key === 'ArrowLeft' || e.key === 'a') && direction != 'right') {
        direction = 'left';
    } else if ((e.key === 'ArrowUp' || e.key === 'w') && direction != 'down') {
        direction = 'up';
    } else if ((e.key === 'ArrowDown' || e.key === 's') && direction != 'up') {
        direction = 'down';
    };
});

playButton.addEventListener('click', () => {
    // focus user on game board
    canvas.setAttribute('tabindex', 1);
    canvas.focus();

    // resets progress bar, removes buttons, sets game running to true
    isGameRunning === true;
    fill.style.width = '0%';
    gameOverButton.style.visibility = 'hidden';
    playButton.style.visibility = 'hidden';
    endAudio();

    // setup game depending on players current level
    if (level === 1 || gameIsOver) {
        endAudio();
        resetGame();
        startGame();
        playAudio();
        return
    } else if (level === 2) {
        // speeding up game
        interval = setInterval(move, 400);
        fill.style.background = 'linear-gradient(to bottom,rgb(116,208,231) 35%,rgb(178,223,239))';

        // update current planet song
        currentSong = audioTracks.journeyBegins

    } else if (level === 3) {
        interval = setInterval(move, 300);
        fill.style.background = 'linear-gradient(to bottom,rgb(176, 135, 99) 35%,rgb(228, 197, 134))';

        currentSong = audioTracks.seaOfAmorphity;

    } else if (level === 4) {
        interval = setInterval(move, 200);
        fill.style.background = 'linear-gradient(to bottom,rgb(215,229,239) 35%,rgb(76,147,207))';

        currentSong = audioTracks.tunnelSociety;

    } else if (level === 5) {
        interval = setInterval(move, 100);
        fill.style.background = 'linear-gradient(to bottom,rgb(9,67,133) 35%,rgb(71,194,241))';

        currentSong = audioTracks.rainOfLight;

    } else if (level === 6) {
        // player has won, setup new game
        gameOverButton.style.visibility = 'hidden';

        endAudio();
        playAudio();
        resetGame();
        startGame();
    };

    playAudio();
});

// user clicks music button
musicButton.addEventListener('click', () => {
    if (musicPlaying) {
        noSymbol.style.visibility = 'visible';
        musicPlaying = false;
        localStorage.setItem('musicPlaying', false);

        endAudio();
    } else {
        noSymbol.style.visibility = 'hidden';
        musicPlaying = true;
        localStorage.setItem('musicPlaying', true);

        endAudio();
        playAudio();
    };

    // refocus player back on canvas
    canvas.focus();
});

// background music
const audioTracks = {
    bejeweledTheme: new Audio('/assets/music/01 - Bejeweled 2 Theme.mp3'),
    journeyBegins: new Audio('/assets/music/03 - The Journey Begins.mp3'),
    rainOfLight: new Audio('/assets/music/04 - Rain of Lights.mp3'),
    seaOfAmorphity: new Audio('/assets/music/06 - Sea of Amorphity.mp3'),
    tunnelSociety: new Audio('/assets/music/09 - Tunnel Society V2.mp3'),
    newBeginning: new Audio('/assets/music/10 - A New Beginning (Intro 2).mp3'),
    jewelsOfDenial: new Audio('/assets/music/15 - Jewels of Denial.mp3'),
    finalDestination: new Audio('/assets/music/16 - Final Destination.mp3')
};

// prep audio tracks
function prepAudio() {
    let audioArr = Object.entries(audioTracks);

    audioArr.map((audio) => {
        audio[1].id = audio[0]
        audio[1].loop = true;
        audio[1].volume = 0.02;
    });
};

// change current audio track based on current level
function playAudio() {
    if (!musicPlaying) {
        endAudio();
    } else {
        currentSong.play();
    };
};

// helper to end current playing audio
function endAudio() {
    currentSong.currentTime = 0;
    currentSong.pause();
};

// when our first audio track loads -> handle all of the other tracks
audioTracks.bejeweledTheme.addEventListener('canplaythrough', () => {
    // setting current song to level 1 song
    currentSong = audioTracks.bejeweledTheme;

    prepAudio();
});

// play confetti animation with assorted jewels
function runConfetti() {
    endingTick++;

    confetti({
        spread: 360,
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
        particleCount: 100,
        scalar: 3,
        shapes: ["image"],
        shapeOptions: {
            image: [{
                src: "/assets/gems/green-octogon.png",
                width: 32,
                height: 32,
            },
            {
                src: "/assets/gems/red-square.png",
                width: 32,
                height: 32,
            },
            {
                src: "/assets/gems/yellow-rect.png",
                width: 32,
                height: 32,
            },
            {
                src: "/assets/gems/white-decagon.png",
                width: 32,
                height: 32,
            },
            {
                src: "/assets/gems/blue-diamond.png",
                width: 32,
                height: 32,
            }
            ],
        },
    });

    if (endingTick === 6) {
        clearInterval(endingInterval)
    };
};

// on window load, wait for images to load before setting up game
window.onload = async () => {
    await preloadImages();
    setupGame();
    getStats();
};
