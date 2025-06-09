const canvas = document.getElementById('canvas-1');
const c = canvas.getContext('2d');

canvas.setAttribute('tabindex', 1);
canvas.focus();

const rows = 10;
const cols = 10;

const cellSize = 50;

function grid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            c.fillStyle = 'white';
            c.fillRect(j*cellSize, i*cellSize, cellSize, cellSize);
            c.strokeStyle = 'blue';
            c.strokeRect(j*cellSize, i*cellSize, cellSize, cellSize)
        }
    };
};

grid();

let snake = [{x: 200, y: 200}];
let apple = [{x: 100, y: 100}];

c.fillStyle = 'green';
c.fillRect(snake[0].x, snake[0].y, cellSize, cellSize);

function placeApple() {
    c.fillStyle = 'red';
    c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);
};

placeApple();


let interval;
let direction = 'right';

function checkForJewel(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true;
    }
    return false;
}

function move() {

    // based on direction, prepare a head that will be one tile away from the snakes actual head

    // test that prepared head, then if its an apple. just change the square to a snake, and record the apple coordinates to the front of the snake array body

    
    
};

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
        move();
    }
})