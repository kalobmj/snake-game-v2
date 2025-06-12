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

let snake = [{x: 200, y: 200}, {x: 250, y: 200}];
let apple = [{x: 100, y: 100}];

c.fillStyle = 'green';
c.fillRect(snake[0].x, snake[0].y, cellSize, cellSize);
c.fillRect(snake[1].x, snake[1].y, cellSize, cellSize);

c.fillStyle = 'red';
c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);

function placeApple() {
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

    c.fillStyle = 'red';
    apple[0].x = x1;
    apple[0].y = y1;
    c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);

};

let interval;
let direction = 'right';

function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true;
    }
    return false;
}

function move() {
    let head = { ...snake[0] };
    
    if (direction === 'right') {
        head.x += cellSize; 
    } else if (direction === 'left') { 
        head.x -= cellSize;
    } else if (direction === 'up') {
        head.y -= cellSize;
    } else if (direction === 'down') {
        head.y += cellSize;
    }

    let appleFound = false;

    if (checkCollision(head.x, head.y, apple[0].x, apple[0].y)) {
        snake.unshift(head);
        appleFound = true;
    } else {
        snake.unshift(head);
        snake.pop();
    };

    grid();

    if (appleFound) {
        placeApple();
    } else {
        c.fillStyle = 'red';
        c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);
    }

    for (let i = 0; i < snake.length; i++) {
        c.fillStyle = 'green';
        c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
    };
    
    console.log('move done');
};

// check collisons
// check bounds

// all inside of move function

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
        interval = setInterval(move, 500);
    }
});
