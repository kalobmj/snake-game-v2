// draw snake's face onto snake head, depending on snake's direction
function drawHead(x, y) {
    c.fillStyle = 'black';

    let [x1, x2, x3, x4, x5, x6] = Array(6).fill(x);
    let [y1, y2, y3, y4, y5, y6] = Array(6).fill(y);

    if (direction === 'right') {

        // getting coordinates for snake eyes
        [x1, x2] = [x + cellSize / 2, x + cellSize / 2];
        [y2, y3] = [y + cellSize / 2, y + cellSize * .25];
        [x4, x6] = [x + cellSize / 2, x + cellSize / 2];
        [y4, y5, y6] = [y + cellSize / 2, y + cellSize * .75, y + cellSize];

        // filling in snake nostrils
        c.fillRect(x + (cellSize * .75), y + (cellSize * .25), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + (cellSize * .75), y + ((cellSize * .75) - cellSize / 10), (cellSize / 10), (cellSize / 10));

    } else if (direction === 'left') {

        [x1, x2, x3] = [x + cellSize / 2, x + cellSize, x + cellSize / 2];
        [y2, y3] = [y + cellSize / 4, y + cellSize / 2];
        [x4, x5, x6] = [x + cellSize / 2, x + cellSize, x + cellSize / 2];
        [y4, y5, y6] = [y + cellSize / 2, y + cellSize * .75, y + cellSize];

        c.fillRect(x + (cellSize * .25), y + (cellSize * .25), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + (cellSize * .25), y + ((cellSize * .75) - cellSize / 10), (cellSize / 10), (cellSize / 10));

    } else if (direction === 'up') {

        [x2, x3] = [x + cellSize / 2, x + cellSize * .25];
        [y1, y2, y3] = [y + cellSize / 2, y + cellSize / 2, y + cellSize];
        [x4, x5, x6] = [x + cellSize / 2, x + cellSize, x + cellSize * .75];
        [y4, y5, y6] = [y + cellSize / 2, y + cellSize / 2, y + cellSize];

        c.fillRect(x + (cellSize * .25), y + (cellSize * .125), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + ((cellSize * .75) - cellSize / 10), y + (cellSize * .125), (cellSize / 10), (cellSize / 10));

    } else if (direction === 'down') {

        [x2, x3] = [x + cellSize * .25, x + cellSize / 2];
        [y1, y3] = [y + cellSize / 2, y + cellSize / 2];
        [x4, x5, x6] = [x + cellSize / 2, x + cellSize * .75, x + cellSize];
        [y4, y6] = [y + cellSize / 2, y + cellSize / 2];

        c.fillRect(x + (cellSize * .25), y + (cellSize * .75), (cellSize / 10), (cellSize / 10));
        c.fillRect(x + ((cellSize * .75) - (cellSize / 10)), y + (cellSize * .75), (cellSize / 10), (cellSize / 10));

    };

    // drawing left eye
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.lineTo(x3, y3);
    c.closePath();
    c.fill();

    // drawing right eye
    c.beginPath();
    c.moveTo(x4, y4);
    c.lineTo(x5, y5);
    c.lineTo(x6, y6);
    c.closePath();
    c.fill();
};

//

playButton.addEventListener('click', () => {
    // focus user on game board
    canvas.setAttribute('tabindex', 1);
    canvas.focus();

    // resets progress bar, removes buttons, sets game running to true
    isGameRunning === true;
    fill.style.width = '0%';
    gameOverButton.style.visibility = 'hidden';
    playButton.style.visibility = 'hidden';

    // setup game depending on players current level
    if (level === 1 || gameIsOver) {
        resetGame();
        startGame();
        return
    } else if (level === 2) {
        // speeding up game
        interval = setInterval(move, 400);
        fill.style.background = 'linear-gradient(to bottom,rgb(116,208,231) 35%,rgb(178,223,239))';
    } else if (level === 3) {
        interval = setInterval(move, 300);
        fill.style.background = 'linear-gradient(to bottom,rgb(176, 135, 99) 35%,rgb(228, 197, 134))';
    } else if (level === 4) {
        interval = setInterval(move, 200);
        fill.style.background = 'linear-gradient(to bottom,rgb(215,229,239) 35%,rgb(76,147,207))';
    } else if (level === 5) {
        interval = setInterval(move, 100);
        fill.style.background = 'linear-gradient(to bottom,rgb(9,67,133) 35%,rgb(71,194,241))';
    } else if (level === 6) {
        // player has won, setup new game
        gameOverButton.style.visibility = 'hidden';
        resetGame();
        return
    };
});

//

// user can use arrow keys or wasd to move snake
canvas.addEventListener('keydown', (e) => {
    if (directionTick) {
        return
    };

    // tick to keep snake to 1 turn per interval
    directionTick = true;

    if ((e.key === 'ArrowRight' || e.key === 'd') && direction != 'left') {
        direction = 'right';
    } else if ((e.key === 'ArrowLeft' || e.key === 'a') && direction != 'right') {
        direction = 'left';
    } else if ((e.key === 'ArrowUp' || e.key === 'w') && direction != 'down') {
        direction = 'up';
    } else if ((e.key === 'ArrowDown' || e.key === 's') && direction != 'up') {
        direction = 'down';
    };
});

//

