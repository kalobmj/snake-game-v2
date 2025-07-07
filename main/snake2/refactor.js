// draw snake's face onto snake head, depending on snake's direction
function drawHead(x, y) {
    c.fillStyle = 'black';

    let [x1, x2, x3, x4, x5, x6] = Array(6).fill(x);
    let [y1, y2, y3, y4, y5, y6] = Array(6).fill(y);

    if (direction === 'right') {

        // getting coordinates for snake eyes
        [x1, x2] = [x + cellSize / 2, x + cellSize / 2];
        [y2, y3] = [y + cellSize / 2,y + cellSize * .25];
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

