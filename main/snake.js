const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
const highScore = document.getElementById('high-score');
const score = document.getElementById('score');
const c = canvas.getContext('2d');

let rows = 17;
let cols = 15;
let cellSize = 50;

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

// draw board
for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
        const isEven = (i + j) % 2 === 0;
        let color = isEven ? '#00ccff48' : '#eeff0048';
        
        // board color
        c.fillStyle = color;
        c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);

    }
};

// draw shadow
for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {

    }
}

// test