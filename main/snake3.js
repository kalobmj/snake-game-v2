const playButton = document.getElementById('play-btn');
const canvas = document.getElementById('canvas-1');
const c = canvas.getContext('2d');

const rows = 10;
const cols = 10;
const cellSize = Math.floor(((window.innerHeight / 3) * 2) / cols);
console.log({ cellSize });

canvas.height = cellSize * rows;
canvas.width = cellSize * cols;

let interval;
let isGameRunning;
let direction = 'right';
let apple = [];
let snake = [];

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
    apple.push({ x: cellSize * 6, y: cellSize * 6 });
    c.fillStyle = 'red';
    c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);

    snake.push({ x: cellSize * 3, y: cellSize * 4 });
    snake.push({ x: cellSize * 2, y: cellSize * 4 });
    c.fillStyle = 'green';
    c.fillRect(snake[0].x, snake[0].y, cellSize, cellSize);
    c.fillRect(snake[1].x, snake[1].y, cellSize, cellSize);
};

function placeApple() {
    let x1, y1, collision;

    do {
        collision = true;

        x1 = Math.floor(Math.random() * rows) * cellSize;
        y1 = Math.floor(Math.random() * cols) * cellSize;

        for (const cell of snake) {
            if (!checkCollision(snake[0].x, snake[0].y, x1, y1)) {
                collision = false;
                break;
            }
        }
    } while (collision);

    apple[0].x = x1;
    apple[0].y = y1;
    c.fillStyle = 'red';
    c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);
};

function checkBounds(x, y) {
    if (x < 0 || y < 0 || x > cellSize * rows || y > cellSize * cols) {
        return true;
    } else {
        return false;
    };
};

function move() {
    let head = { ...snake[0] };

    if (checkBounds(head.x, head.y)) {
        clearInterval(interval);
        return;
    };

    if (direction === 'right') {
        head.x += cellSize;
    } else if (direction === 'left') {
        head.x -= cellSize;
    } else if (direction === 'up') {
        head.y -= cellSize;
    } else if (direction === 'down') {
        head.y += cellSize;
    };

    for (let i = 0; i < snake.length; i++) {
        if (checkCollision(head.x, head.y, snake[i].x, snake[i].y)) {
            clearInterval(interval);
            return;
        };
    };

    snake.unshift(head);

    if (checkCollision(head.x, head.y, apple[0].x, apple[0].y)) {
        grid();
        placeApple();

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        };
    } else {
        snake.pop();
        grid();

        c.fillStyle = 'red';
        c.fillRect(apple[0].x, apple[0].y, cellSize, cellSize);

        for (let i = 0; i < snake.length; i++) {
            c.fillStyle = 'green';
            c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
        }
    };
};

//

grid();

fillBoard();

//

canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && direction != 'left') {
        direction = 'right';
    } else if (e.key === 'ArrowLeft' && direction != 'right') {
        direction = 'left';
    } else if (e.key === 'ArrowUp' && direction != 'down') {
        direction = 'up';
    } else if (e.key === 'ArrowDown' && direction != 'up') {
        direction = 'down';
    }
});

playButton.addEventListener('click', () => {
    canvas.setAttribute('tabindex', 1);
    canvas.focus();

    if (!isGameRunning) {
        interval = setInterval(move, 500);
        isGameRunning = true;
    } else {
        clearInterval(interval);
        isGameRunning = false;
    }
});
