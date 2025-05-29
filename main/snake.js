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

console.log(jewels.green);
console.log(jewels.red);
console.log(jewels.yellow);
console.log(jewels.white);
console.log(jewels.blue);

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
    placeSnakeStart();
    placeJewelStart();
    
    // let interval = setInterval(placeJewelStart, 100);

    // setInterval(() => {
    //     placeJewelStart();
    // }, 1000);

});

// function to place snake on board (at game start)
function placeSnakeStart() {
    // cellSize: 58.5
    console.log({ cellSize });

    // snakeSize takes up half the size of a cell
    let snakeSize = cellSize / 2;

    // snake color
    c.fillStyle = 'red';

    // snake tail & head
    c.fillRect(cellSize, (cellSize * 6) + (snakeSize / 2), cellSize, snakeSize);
    c.fillRect(cellSize * 2, (cellSize * 6) + (snakeSize / 2), cellSize, snakeSize);

    // push coords of snake to snakeCoordinates arr
    snakeCoordinates.push({ x: cellSize, y: (cellSize * 6) });
    snakeCoordinates.push({ x: (cellSize * 2), y: (cellSize * 6) });

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
                console.log({collision});
                // clearInterval(interval);
                break;
            }
        };

    } while (collision);

    let jewel = document.getElementById('jewel');

    let jewelRoll = Math.floor(Math.random() * 100) + 1;
    console.log(jewelRoll);

    // 5 jewels
    // 1st jewel 1-30 (30%)
    // 2nd jewel 31-50 (20%)
    // 3rd jewel 51-65 (15%)
    // 4th jewel 66-85 (15%)
    // 5th jewel 86-100 (15%)

    console.log({jewelRoll})

    // determining jewel img src based on jewelRoll
    if (jewelRoll >= 1 && jewelRoll <= 30) {
        jewel.src = jewels.green;
    } else if (jewelRoll >= 31 && jewelRoll <= 50) {
        jewel.src = jewels.red;
    } else if (jewelRoll >= 51 && jewelRoll <= 65) {
        jewel.src = jewels.yellow;
    } else if (jewelRoll >= 66 && jewelRoll <= 85) {
        jewel.src = jewels.white;
    } else if (jewelRoll >= 86 && jewelRoll <= 100) {
        jewel.src = jewels.blue;
    };

    // wait for jewel image to load, then start drawing on the canvas
    jewel.onload = () => {
        // coords of jewel for testing
        console.log({ x1 });
        console.log({ y1 });

        // draw jewel on our 2nd canvas
        c2.drawImage(jewel, x1, y1, canvas2.width, canvas2.height);

        // draw 2nd canvas onto original canvas
        c.drawImage(canvas2, x1, y1);
    };
};

// funciton to move snake
function moveSnake() {



};

// function to place newe jewel on board
function placeJewelNew() {



};

// util function to check collisions
function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        console.log({x1})
        console.log({y1})
        console.log({x2})
        console.log({y2})
        return true;
    } else {
        return false;
    }
};
