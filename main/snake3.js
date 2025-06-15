const canvas = document.getElementById('canvas-1');
const c = canvas.getContext('2d');

const rows = 10;
const cols = 10;
const cellSize = Math.floor(((window.innerHeight / 3) * 2) / cols);
console.log({ cellSize });

canvas.height = cellSize * rows;
canvas.width = cellSize * cols;
canvas.setAttribute('tabindex', 1);
canvas.focus();

let interval;
let direction = 'right';
let gameRunning = false;

// 

function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true;
    } else {
        return false;
    }
};

function grid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            c.fillStyle = 'white';
            c.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            c.strokeStyle = 'purple';
            c.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize)
        }
    };
};

function fillBoard() {

};

function placeApple() {

};

function checkBounds(x, y) {

};

function move() {

};

//

grid();

//

canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        console.log(e.key);
        direction = 'right';
    } else if (e.key === 'ArrowLeft') {
        console.log(e.key);
        direction = 'left';
    } else if (e.key === 'ArrowUp') {
        console.log(e.key);
        direction = 'up';
    } else if (e.key === 'ArrowDown') {
        console.log(e.key);
        direction = 'down';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!gameRunning) {
            gameRunning = true;
            interval = setInterval(move, 500);
        } else {
            gameRunning = false;
            clearInterval(interval);
        }
    }
});
