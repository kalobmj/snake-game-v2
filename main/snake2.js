const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas-2');
const c = canvas.getContext('2d');
const c2 = canvas.getContext('2d');
const space = document.getElementById('space');
const play = document.getElementById('play');

// ***

// check browser loading (clear cache and test)

// ***

// focus on canvas
canvas.setAttribute('tabindex', 1);
canvas.focus();

// 8x8 board (can change)
let rows = 10;
let cols = 10;

// direction
let direction = 'right';

// var to track current jewel
let ourJewel;

// keep track of game state
let gameRunning = false;

// jewel names and their locations
const jewels = {
    green: '/assets/gems/green-octogon.png',
    red: '/assets/gems/red-square.png',
    yellow: '/assets/gems/yellow-rect.png',
    white: '/assets/gems/white-decagon.png',
    blue: '/assets/gems/blue-diamond.png'
};

// calculate canvas height to be 2/3 size of useable window
const canvasHeight = Math.floor((window.innerHeight / 3) * 2);
const cellSize = canvasHeight / rows;

// set canvas height and width
canvas.width = rows * cellSize;
canvas.height = cols * cellSize;

// set canvas 2 height and width to cellSize (canvas 2 is our jewel)
canvas2.width = cellSize;
canvas2.height = cellSize;

console.log({ canvasHeight });
console.log({ cellSize });

// vars to keep track of images
let imgs;
let jewelImgs = [];

// vars to keep track of snake and jewel locations
let snake = [];
let jewel = [];

// function to import all images
function getImages() {
    let jewelsArr = Object.entries(jewels);
    imgs = document.querySelectorAll('img');

    console.log({ jewelsArr })

    console.log({ imgs })

    for (let i = 0; i < jewelsArr.length; i++) {
        const img = new Image();
        img.id = jewelsArr[i][0]; // jewel name
        img.src = jewelsArr[i][1]; // jewel src
        jewelImgs.push(img)
    }

    console.log({ jewelImgs })

};

console.log('testing out of bounds');
console.log(cellSize * rows);
console.log(cellSize * cols);

// util for checking out of bounds
function checkBounds(x, y) {
    let maxWidth = cellSize * cols;
    let maxHeight = cellSize * rows;

    if (x < 0 || y < 0 || x > maxWidth || y > maxHeight) {
        return true
    } else {
        return false
    };
};

// util for checking collisions
function checkCollision(x1, y1, x2, y2) {
    if (x1 === x2 && y1 === y2) {
        return true
    } else {
        return false;
    };
};

// util to draw game board background and grid (will need to use this on every interval)
function drawBoard() {
    // draw background
    c.drawImage(space, 0, 0, canvas.width, canvas.height);

    // draw game board
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const isEven = (i + j) % 2 === 0;
            let color = isEven ? '#ffffff10' : '#00000040';

            // fill in grids
            c.fillStyle = color;
            c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    };
};

// this function sets up the game on page load
function setupGame() {
    getImages();

    // wait for space background to load
    space.addEventListener('load', () => {
        drawBoard();
        // 29.25
        console.log({ cellSize })
        let snakeStart = rows - Math.floor(rows / 3);
        console.log(snakeStart);
        c.fillStyle = 'violet';
        c.fillRect(cellSize, cellSize * snakeStart, cellSize, cellSize);
        c.fillRect(cellSize * 2, cellSize * snakeStart, cellSize, cellSize);

        // push snakes coordinates to array
        snake.push({ x: cellSize, y: cellSize * snakeStart });
        snake.push({ x: cellSize * 2, y: cellSize * snakeStart });

        console.log({ snake });

        // place first jewel
        placeJewel();
    });

};

// this function gets game going
function runGame() {

    // let runInterval = setInterval(moveSnake, 200);

    moveSnake();

    // placeJewel();

    console.log({ direction });

    // moveSnake();

};

// this function ends the game
function endGame() {

};

// function to move snake
function moveSnake() {

    // if snake head is out of bounds, end game
    if (checkBounds(snake[0].x, snake[0].y)) {
        window.location.reload();
    }

    console.log({ snake });
    console.log({ jewel });

    let tail = snake[snake.length - 1];
    console.log({ tail });

    let head = { ...snake[0] };
    console.log({ head });

    
    // updating snakeHead location based on direction
    if (direction === 'right') {
        console.log('direction was right');
        head.x += cellSize;
    } else if (direction === 'down') {
        console.log('direction was down');
        head.y += cellSize;
    } else if (direction === 'left') {
        console.log('direction was left');
        head.x -= cellSize;
    } else if (direction === 'up') {
        console.log('direction was up');
        head.y -= cellSize;
    };
    
    snake.pop();
    
    // if snake head collides with any part of the snake body, end game
    for (let cell of snake) {
        console.log(head.x);
        console.log(head.y);
        console.log(cell.x);
        console.log(cell.y);
        if (checkCollision(head.x, head.y, cell.x, cell.y)) {
            window.location.reload();
        }
    };
    
    // if (checkCollision(head.x, head.y, jewel.x, jewel.y)) {
    //     snake.shift(tail)
    // };

    // re-draw board so we can place new snake and jewel
    drawBoard();

    console.log({ourJewel})

    console.log(jewel[0].x)
    console.log(jewel.y)

    // re-draw jewel
    // draw jewel on our 2nd canvas
    c2.drawImage(ourJewel, jewel[0].x, jewel[0].y, canvas2.width, canvas2.height);

    // draw 2nd canvas onto original canvas
    c.drawImage(canvas2, jewel[0].x, jewel[0].y);

    console.log({ snake });

    console.log({ head })
    console.log('head x', head.x);
    console.log('head y', head.y);
    console.log('jewel x', jewel[0].x);
    console.log('jewel y', jewel[0].y);

    // if snake eats the apple 😋
    if (checkCollision(Math.round(head.x), Math.round(head.y), Math.round(jewel[0].x), Math.round(jewel[0].y))) {
        console.log('we hit an apple');
        snake.unshift(head);
        snake.push(tail);
        placeJewel();

        console.log({jewel})

    } else {
        snake.unshift(head);
    }

    console.log({ snake });

    // drawing new snake
    for (let i = 0; i < snake.length; i++) {
        c.fillStyle = 'violet';
        c.fillRect(snake[i].x, snake[i].y, cellSize, cellSize);
    };


};

// function to place jewel (apple) on board
function placeJewel() {

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

    jewel.push({ x: x1, y: y1 });

    let jewelRoll = Math.floor(Math.random() * 100) + 1;

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

    console.log({ ourJewel })

    // coords of jewel for testing
    console.log({ x1 });
    console.log({ y1 });

    // draw jewel on our 2nd canvas
    c2.drawImage(ourJewel, x1, y1, canvas2.width, canvas2.height);

    // draw 2nd canvas onto original canvas
    c.drawImage(canvas2, x1, y1);

};

play.addEventListener('click', () => {
    runGame();
})

// setting up the game on window load
setupGame();

// user arrowkey event listeners
canvas.addEventListener('keydown', (e) => {

    console.log('we are in canvas addeventlistner')

    if (gameRunning) {
        if (e.key === 'ArrowRight' && direction != 'left') {
            console.log('right arrow key pressed');
            console.log(e.key);
            direction = 'right';
        } else if (e.key === 'ArrowLeft' && direction != 'right') {
            console.log('left arrow key pressed');
            direction = 'left';
        } else if (e.key === 'ArrowUp' && direction != 'down') {
            console.log('up arrow key pressed');
            direction = 'up';
        } else if (e.key === 'ArrowDown' && direction != 'up') {
            console.log('down arrow key pressed');
            direction = 'down';
        }
    }
});



let interval;
let game = false;

// ***
``
    // hey so the worm is exiiting game when it is on the border, not out of bounds, fix this lul ;)



// ***

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        console.log('enter pressed');

        if (!game) {
            interval = setInterval(runGame, 200);
            game = true;
            gameRunning = true;
        } else if (game) {
            clearInterval(interval);
            game = false;
            gameRunning = false;
        }

    }
});


