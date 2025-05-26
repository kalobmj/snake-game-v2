const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
const space = document.getElementById('space');
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

// set space background maxHeight to the height of canvas
space.style.maxHeight = `${canvasHeight}px`;

// bejewled snake 💎
// bejewled snake 💎
// bejewled snake 💎

// apple is a jewel 🟥
// apple is a jewel 🔷
// apple is a jewel 🔶

// score will be points based on jewel
// seperate score will also be just jewels eaten

// -> as of now: our game board should be responsive depending on user window size. This might not scale all the way with the background-image, but the grid canvas should be responsive

// -> need to make background image scale depending on if user window size is bigger (resizing)

// create game board on space image load
space.addEventListener('load', () => {
    // before we draw image on canvas, if the canvas is larger than the image, then scale it up. (giving it the same height will scale it up, having the same height as the canvas, we can start to calculate the areas on the side that need to be cut). Only changing height will maintain aspect ratio.

    console.log('space height', space.height);
    console.log('space width', space.width);

    let aspectRatio = space.width / space.height;

    console.log({aspectRatio})

    // if (space.height < canvas.height) {
    //     space.height = canvas.height
    // };

    // space.width = space.height * aspectRatio;

    let spaceWidthRemainder = space.width - canvas.width;
    let remainderBuffer = spaceWidthRemainder / 2;

    console.log({spaceWidthRemainder})
    console.log({remainderBuffer})

    // // tesing scaling
    // space.width = 1000;
    // space.height = 1000;

    // console.log('1k space height: ', space.height);
    // console.log('1k space width: ', space.width);

    // draw space background onto canvas
    // c.drawImage(space, remainderBuffer, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    // space.height = canvas.height;

    console.log('space height after', space.height)

    // we can change the space dimensions, then make a copy and create a new html element. then we can take that and use it in a drawImage, since it uses the original dimensions


    let newSpaceImage = new Image();

    newSpaceImage.src = space.src;

    newSpaceImage.height = 300;
    newSpaceImage.width = 300;

    console.log({newSpaceImage})

    c.drawImage(newSpaceImage, 0, 0, canvas.width, canvas.height)


    // draw image with copy of space instead of original
    // c.drawImage(spaceImgCopy, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    // c.drawImage(spaceImgCopy, 0, 0, canvas.width, canvas.height)

    // original draw image
    // c.drawImage(space, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    // nested loop to draw game grid ontop of canvas image
    for (let i=0; i<rows; i++) {
        for (let j=0; j<cols; j++) {
            const isEven = (i + j) % 2 === 0;
            let color = isEven ? '#ffffff18' : '#eeff0048';
            
            // fill in grids
            c.fillStyle = color;
            c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
        }
    };

});
