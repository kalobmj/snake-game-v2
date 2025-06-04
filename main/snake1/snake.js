const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas-2');
// const border = document.getElementById('border');
const space = document.getElementById('space');
const highScore = document.getElementById('high-score');
const score = document.getElementById('score');
const c = canvas.getContext('2d');
const c2 = canvas.getContext('2d');

// ***

// possible idea for game:
// there are multiple levels, each time user beats level, their score goes up.
// with each level, the snake speed (interval) increases, making the game harder and harder
// also can possibly increase the board size each level, making the game bigger

// vvv game runs in this order vvv
// background img loads
// snake loads
// gem loads

// ***

// 8x8 board
let rows = 10;
let cols = 10;

// focus on canvas
canvas.setAttribute('tabindex', 1);
canvas.focus();

// get user window height
const windowHeight = window.innerHeight;

// calculate canvas height to be 2/3 size of useable window
const canvasHeight = Math.floor((windowHeight / 3) * 2);
const cellSize = canvasHeight / rows;

// snakeSize takes up half the size of a cell
let snakeSize = cellSize / 2;

// snake coordinates
let snakeCoordinates = [];
let jewelCoordinates = [];

// player direction (right by default);
let dir = 'right';
let lastDir = '';

// var to keep track of if game is running
let gameRunning = false;

// arr used to store each jewel as an img
let jewelImgs = [];

// set canvas height and width
canvas.width = rows * cellSize;
canvas.height = cols * cellSize;

// set canvas 2 height and width to cellSize (canvas 2 is our jewel)
canvas2.width = cellSize;
canvas2.height = cellSize;

// set space background maxHeight to the height of canvas
space.style.maxHeight = `${canvasHeight}px`;

// bejewled snake 💎
// bejewled snake 💎
// bejewled snake 💎

// apple is a jewel 🟥
// apple is a jewel 🔷
// apple is a jewel 🔶

// we will have 5 types of jewels:
// green 🟢 (octogon) -> 20 points
// red 🔴 (square) -> 30 points
// yellow 🟨 (rect) -> 40 points
// white 🤍 (decagon) -> 50 points (this jewel takes 1 off snake body length)
// blue 💎 (blue diamond) -> 75 points (the only jewel that doesn't length to snake body)

// jewel will act as the apple, eating the green, red, or yellow jewels will at +1 to snake length, white -1, and blue does neither (keeps same).

// score will be points based on jewel
// seperate score will also be just jewels eaten

let pointsArr = [
    'green',
    'red',
    'yellow',
    'white',
    'blue'
];

// jewel names and their locations
const jewels = {
    green: '/assets/gems/green-octogon.png',
    red: '/assets/gems/red-square.png',
    yellow: '/assets/gems/yellow-rect.png',
    white: '/assets/gems/white-decagon.png',
    blue: '/assets/gems/blue-diamond.png'
};

function createImages() {
    // jewel image array
    let jewelsArr = Object.entries(jewels);

    // loop to get image sources and push them into our array
    for (let i = 0; i < jewelsArr.length; i++) {
        const img = new Image();
        img.id = jewelsArr[i][0]; // jewel name
        img.src = jewelsArr[i][1]; // jewel src
        jewelImgs.push(img)
    };

    console.log({ jewelImgs });
};

// util function to check collisions
function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true;
    } else {
        return false;
    }
};

// interval to test jewel placing function
// let interval = setInterval(placeJewelStart, 100);

// load game onto canvas once space image loads
space.addEventListener('load', () => {
    c.drawImage(space, 0, 0, canvas.width, canvas.height);

    // nested loop to draw game grid ontop of canvas image
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isEven = (i + j) % 2 === 0;
            let color = isEven ? '#ffffff00' : '#00000040';

            // fill in grids
            c.fillStyle = color;
            c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    };

    // after image load, place snake, then jewel
    createImages();
    placeSnakeStart();
    placeJewelStart();
});

// function to place snake on board (at game start)
function placeSnakeStart() {
    // cellSize: 58.5
    console.log({ cellSize });

    // snake color
    c.fillStyle = 'red';

    // snake tail & head
    c.fillRect(cellSize, (cellSize * 6), cellSize, cellSize);
    c.fillRect(cellSize * 2, (cellSize * 6), cellSize, cellSize);

    // push coords of snake to snakeCoordinates arr
    snakeCoordinates.push({ x: (cellSize * 2), y: (cellSize * 6) });
    snakeCoordinates.push({ x: cellSize, y: (cellSize * 6) });

    console.log({ snakeCoordinates });
};

// function to place jewel on board, avoiding snake's body (on game start)
function placeJewelStart() {
    let x1, y1, collision;

    // get random place for jewel, do checking collision while there are collisions
    do {

        // if collision found, will return true -> loop keeps running
        collision = false;

        x1 = Math.floor(Math.random() * cols) * cellSize;
        y1 = Math.floor(Math.random() * rows) * cellSize;

        for (let i = 0; i < snakeCoordinates.length; i++) {
            let snakeCellX = snakeCoordinates[i].x;
            let snakeCellY = snakeCoordinates[i].y;
            if (checkCollision(x1, y1, snakeCellX, snakeCellY)) {
                console.log('there was a collision');
                collision = true;
                console.log({ collision });

                // clearInterval(interval);

                break;
            }
        };

    } while (collision);

    // plot jewel (apple) coordinates
    jewelCoordinates.push({ x: x1, y: y1 });

    // how to update vals:
    // jewelCoordinates[0].x = 9000;
    // jewelCoordinates[0].y = 9000;

    // 5 jewels
    // 1st jewel 1-30 (30%)
    // 2nd jewel 31-50 (20%)
    // 3rd jewel 51-65 (15%)
    // 4th jewel 66-85 (15%)
    // 5th jewel 86-100 (15%)

    // roll random num from 1-100 to determine which jewel will spawn
    let jewelRoll = Math.floor(Math.random() * 100) + 1;

    // var to store our selected jewel image
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

    console.log({ ourJewel });

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

// funciton to move snake
function moveSnake() {

    // moving snake

    console.log({ snakeCoordinates });
    console.log({ jewelCoordinates });

    // saving snakeTail (for if snake gets jewel)
    let snakeTail = snakeCoordinates[snakeCoordinates.length - 1];
    console.log({ snakeTail });

    // snakeHead
    let snakeHead = { ...snakeCoordinates[0] };
    console.log({ snakeHead });

    // updating snakeHead location based on direction
    if (dir === 'right' && lastDir != 'left') {
        console.log('dir was right');
        snakeHead.x += cellSize;
        lastDir = 'right';
    } else if (dir === 'down' && lastDir != 'up') {
        console.log('dir was down');
        snakeHead.y += cellSize;
        lastDir = 'down';
    } else if (dir === 'left' && lastDir != 'right') {
        console.log('dir was left');
        snakeHead.x -= cellSize;
        lastDir = 'left';
    } else if (dir === 'up' && lastDir != 'down') {
        console.log('dir was up');
        snakeHead.y -= cellSize;
        lastDir = 'up';
    };

    // remove snakeTail and move new snakehead to front
    snakeCoordinates.pop();
    snakeCoordinates.unshift(snakeHead)

    // testing if new snakeHead is on the same spot as an jewel (apple)
    if (checkCollision(snakeHead.x, snakeHead.y, jewelCoordinates.x, jewelCoordinates.y)) {
        // if new snakeHead is on top of jewel, add old tail back on (snake grows)
        snakeCoordinates.shift(snakeTail)
    };

    // we will place drawing background and grid into a util function

    // re-draw background
    c.drawImage(space, 0, 0, canvas.width, canvas.height);

    // nested loop to draw game grid ontop of canvas image
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isEven = (i + j) % 2 === 0;
            let color = isEven ? '#ffffff00' : '#00000040';

            // fill in grids
            c.fillStyle = color;
            c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    };

    console.log({ snakeCoordinates });

    // moving snake (drawing it)
    for (let i = 0; i < snakeCoordinates.length; i++) {

        // snake color
        c.fillStyle = 'red';


        // fillRect(x, y, width, height)
        // drawing snake
        c.fillRect(snakeCoordinates[i].x, snakeCoordinates[i].y, cellSize, cellSize);

    };

    // drawing snake is fine, but since snake is skinnier than the cell, need to draw different based on directions
    // might have to keep track of cells direction, then color based on that


};

// function to place new jewel on board (apple)
function placeJewelNew() {

    console.log('placing jewel...')

};



// function to start game
function runGame() {

    gameRunning = true;
    console.log('game is running');
    console.log({ gameRunning });

    moveSnake();
    placeJewelNew();

}

// function to stop game
function stopGame() {

}

// function to reset game
function resetGame() {

}

let interval;

// test game by pressing enter
document.addEventListener('keydown', (e) => {
    
    if (e.key === 'Enter') {
        
        if (!gameRunning) {
            interval = setInterval(runGame, 200);
        } else if (gameRunning) {
            clearInterval(interval)
        }

    };

});

// user arrowkey event listeners
canvas.addEventListener('keydown', (e) => {

    console.log('we are in canvas addeventlistner')

    if (gameRunning) {
        if (e.key === 'ArrowRight' && dir != 'left') {
            console.log('right arrow key pressed');
            console.log(e.key);
            dir = 'right';
        } else if (e.key === 'ArrowLeft' && dir != 'right') {
            console.log('left arrow key pressed');
            dir = 'left';
        } else if (e.key === 'ArrowUp' && dir != 'down') {
            console.log('up arrow key pressed');
            dir = 'up';
        } else if (e.key === 'ArrowDown' && dir != 'up') {
            console.log('down arrow key pressed');
            dir = 'down';
        }
    }
});
