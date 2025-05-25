const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
const highScore = document.getElementById('high-score');
const score = document.getElementById('score');
const c = canvas.getContext('2d');

// 8x8 board
let rows = 8;
let cols = 8;

// get user window height
const windowHeight = window.innerHeight;

// calculate canvas height to be 2/3 size of useable window
const canvasHeight = Math.floor((windowHeight / 3) * 2);
const cellSize = canvasHeight / 8;

// set canvas height and width
canvas.width = rows * cellSize;
canvas.height = cols * cellSize;

// bejewled snake 💎
// bejewled snake 💎
// bejewled snake 💎

// apple is a jewel 🟥
// apple is a jewel 🔷
// apple is a jewel 🔶

// score will be points based on jewel
// seperate score will also be just jewels eaten

// draw board loop
for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
        const isEven = (i + j) % 2 === 0;
        let color = isEven ? '#00ccff48' : '#eeff0048';

        // fill in grid
        c.fillStyle = color;
        c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
    }
};

// test