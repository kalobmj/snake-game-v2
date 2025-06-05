const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas-2');
const c = canvas.getContext('2d');
const c2 = canvas2.getContext('2d');
const space = document.getElementById('space');

// focus on canvas
canvas.setAttribute('tabindex', 1);
canvas.focus();

// 8x8 board (can change)
let rows = 16;
let cols = 16;

// jewel names and their locations
const jewels = {
    green: '/assets/gems/green-octogon.png',
    red: '/assets/gems/red-square.png',
    yellow: '/assets/gems/yellow-rect.png',
    white: '/assets/gems/white-decagon.png',
    blue: '/assets/gems/blue-diamond.png'
};

// calculate canvas height to be 2/3 size of useable window
const canvasHeight = Math.floor((window.innerHeight / 3) * 2);
const cellSize = canvasHeight / rows;

// set canvas height and width
canvas.width = rows * cellSize;
canvas.height = cols * cellSize;

console.log({ canvasHeight });
console.log({ cellSize });

// vars to keep track of images
let imgs;
let jewelImgs = [];

// vars to keep track of snake and jewel locations
let snake = [];
let jewel = [];

// function to import all images
function getImages() {
    let jewelsArr = Object.entries(jewels);
    imgs = document.querySelectorAll('img');

    console.log({jewelsArr})

    console.log({imgs})

    for (let i = 0; i < jewelsArr.length; i++) {
        const img = new Image();
        img.id = jewelsArr[i][0]; // jewel name
        img.src = jewelsArr[i][1]; // jewel src
        jewelImgs.push(img)
    }

    console.log({jewelImgs})

};

console.log('testing out of bounds');
console.log(cellSize * rows);
console.log(cellSize * cols);

// util for checking out of bounds
function checkBounds(x, y) {
    let maxWidth = cellSize * cols;
    let maxHeight = cellSize * rows;

    if (x < 0 || y < 0 || x > maxWidth || y > maxHeight) {
        return true
    } else {
        return false
    };
};

// util for checking collisions
function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true
    } else {
        return false;
    };
};

// util to draw game board background and grid (will need to use this on every interval)
function drawBoard() {
    // draw background
    c.drawImage(space, 0, 0, canvas.width, canvas.height);

    // draw game board
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isEven = (i + j) % 2 === 0;
            let color = isEven ? '#ffffff10' : '#00000040';

            // fill in grids
            c.fillStyle = color;
            c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    };
};

// this function sets up the game on page load
function setupGame() {
    getImages();

    // wait for space background to load
    space.addEventListener('load', () => {
        drawBoard();
        // 29.25
        console.log({ cellSize })
        let snakeStart = rows - Math.floor(rows / 3);
        console.log(snakeStart);
        c.fillStyle = 'violet';
        c.fillRect(cellSize, cellSize * snakeStart, cellSize, cellSize);
        c.fillRect(cellSize * 2, cellSize * snakeStart, cellSize, cellSize);

        // push snakes coordinates to array
        snake.push({ x: cellSize, y: cellSize * snakeStart });
        snake.push({ x: cellSize * 2, y: cellSize * snakeStart });

        console.log({ snake });

        // place first jewel
        placeJewel();
    });



};

// this function gets game going
function runGame() {

};

// this function ends the game
function endGame() {

};

// function to move snake
function moveSnake() {

};

// function to place jewel (apple) on board
function placeJewel() {

    let x1, y1, collision;

    do {

        collision = false;

        x1 = Math.floor(Math.random() * cols) * cellSize;
        y1 = Math.floor(Math.random() * rows) * cellSize;

        for (let i = 0; i < snake.length; i++) {
            let snakeX = snake[i].x;
            let snakeY = snake[i].y;
            if (checkCollision(x1, y1, snakeX, snakeY)) {
                console.log('there was a collision');
                collision = true;
                console.log({ collision });
                break;
            }
        }

    } while (collision);

    jewel.push({ x: x1, y: y1 });

    let jewelRoll = Math.floor(Math.random() * 100) + 1;

    let ourJewel;

    if (jewelRoll >= 1 && jewelRoll <= 30) {
        ourJewel = jewelImgs[0];
    } else if (jewelRoll >= 31 && jewelRoll <= 50) {
        ourJewel = jewelImgs[1];
    } else if (jewelRoll >= 51 && jewelRoll <= 65) {
        ourJewel = jewelImgs[2];
    } else if (jewelRoll >= 66 && jewelRoll <= 85) {
        ourJewel = jewelImgs[3];
    } else if (jewelRoll >= 86 && jewelRoll <= 100) {
        ourJewel = jewelImgs[4];
    };

    console.log({ourJewel})

    // when our selected jewel loads, draw it on the canvas
    ourJewel.onload = () => {
        // coords of jewel for testing
        console.log({ x1 });
        console.log({ y1 });

        // draw jewel on our 2nd canvas
        c2.drawImage(ourJewel, x1, y1, canvas2.width, canvas2.height);

        // draw 2nd canvas onto original canvas
        c.drawImage(canvas2, x1, y1);
    }

};

// setting up the game on window load
setupGame();
