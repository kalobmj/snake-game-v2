const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
// const border = document.getElementById('border');
const space = document.getElementById('space');
const highScore = document.getElementById('high-score');
const score = document.getElementById('score');
const c = canvas.getContext('2d');

// ***

    // possible idea for game:
        // there are multiple levels, each time user beats level, their score goes up.
        // with each level, the snake speed (interval) increases, making the game harder and harder

// ***

// 8x8 board
let rows = 8;
let cols = 8;

// get user window height
const windowHeight = window.innerHeight;

// calculate canvas height to be 2/3 size of useable window
const canvasHeight = Math.floor((windowHeight / 3) * 2);
const cellSize = canvasHeight / rows;

// snake coordinates
let snakeCoordinates = [];

// set canvas height and width
canvas.width = rows * cellSize;
canvas.height = cols * cellSize;

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

// score will be points based on jewel
// seperate score will also be just jewels eaten

let pointsArr = [
    'green',
    'red',
    'yellow',
    'white',
    'blue'
];

// jewel will act as the apple, eating the green, red, or yellow jewels will at +1 to snake length, white -1, and blue does neither (keeps same).

// create game board on space image load (can wrap all of this into a wrapper function)
space.addEventListener('load', () => {
    // creating copy of space img
    let newSpaceImage = new Image();

    newSpaceImage.src = space.src;
    newSpaceImage.height = 300;
    newSpaceImage.width = 300;

    c.drawImage(newSpaceImage, 0, 0, canvas.width, canvas.height);

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

    placeSnake();
    placeJewel();

});

// function to place snake on board (at game start)
function placeSnake() {
    // cellSize: 58.5
    console.log({ cellSize });

    // snakeSize takes up half the size of a cell
    let snakeSize = cellSize / 2;

    // snake color
    c.fillStyle = 'red'

    // snake tail & head
    c.fillRect(cellSize, (cellSize * 6) + (snakeSize / 2), cellSize, snakeSize);
    c.fillRect(cellSize*2, (cellSize * 6) + (snakeSize / 2), cellSize, snakeSize);

    // push coords of snake to snakeCoordinates arr
    snakeCoordinates.push({x: cellSize, y: (cellSize * 6)});
    snakeCoordinates.push({x: (cellSize * 2), y: (cellSize * 6)});

    console.log({snakeCoordinates});
};

// function to placeJewel on board
function placeJewel() {
    let x1, y1, collison;

    // get random place for jewel, do checking collision while there are collisions
    do {

        // if collision found, will return true -> loop keeps running
        let collision = false;

        x1 = Math.floor(Math.random() * cols) * cellSize;
        y1 = Math.floor(Math.random() * rows) * cellSize;

        for (let i = 0; i < snakeCoordinates.length; i++) {
            let snakeCellX = snakeCoordinates[i].x;
            let snakeCellY = snakeCoordinates[i].y;
            if (checkCollision(x1, y1, snakeCellX, snakeCellY)) {
                collision = true;
                break;
            }
        }

    } while (collison);

    // at this point, we have found a spot for our apple, and we can draw it

    // jewel placeHolder (jewels are 70 x 70, so they will scale)
    let newJewel = new Image();

    newJewel.src = '/assets/gems/blue-diamond.png';
    newJewel.height = cellSize;
    newJewel.width = cellSize;

    console.log({x1});
    console.log({y1});

    console.log('max dimensions');
    console.log(cellSize * cols);
    console.log(cellSize * rows);

    // draw jewel on board using updated coords that do not collide with any parts of the snake body
    c.drawImage(newJewel, x1, y1);
};

// funciton to move snake
function moveSnake() {



};

// util function to check collisions
function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 || y1 === y2) {
        return true
    }
    return false;
};
