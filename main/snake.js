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

    // c.drawImage(newSpaceImage, 0, 0, canvas.width, canvas.height);

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

});

// function to place snake on board (at game start)
function placeSnake() {

    console.log({ cellSize });

    console.log (cellSize / 2);

    
    // For odd-width (aka thickness) lines (1px, 3px, etc.), position the line on half-pixel coordinates
    // For even-width (aka thickness) lines (2px, 4px, etc.), position the line on whole-pixel coordinates


    // snakeSize takes up half the size of a cell
    let snakeSize = cellSize / 2;

    // snake color
    c.fillStyle = 'red'

    // snake tail
    c.fillRect(cellSize, (cellSize * 6) + (snakeSize / 2), cellSize, snakeSize);
    
    // snake head
    c.fillRect(cellSize*2, (cellSize * 6) + (snakeSize / 2), cellSize, snakeSize);

    snakeCoordinates.push({x: cellSize, y: (cellSize * 6)});
    snakeCoordinates.push({x: (cellSize * 2), y: (cellSize * 6)})

    let blueDiamond = new Image();

    blueDiamond.src = '/assets/gems/blue-diamond.png';
    blueDiamond.id = 'blue-diamond';
    blueDiamond.height = '300';
    blueDiamond.width = '300';

    console.log({blueDiamond})

    // 5/27 uncomment background img, figure out why this is not working

    c.drawImage(blueDiamond, 100, 100);

    // you don't need exact y coordinates, because we are only accounting for the cell area (any part of the snake and jewel cannot take up the same cell)
    console.log({snakeCoordinates});

};

// test call
// placeSnake();

// function to placeJewel on board
function placeJewel() {

    // logic for jewel, might be able to use images from game as jewel. if not we can make and use our own

};

// funciton to move snake
function moveSnake() {



};
