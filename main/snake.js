const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
const border = document.getElementById('border');
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

// set background border size to canvas size (so that it lays underneath)
// -> you can have a canvas , but don't need to draw the cells out, since the image has them
border.width = canvas.width;
border.height = canvas.height;


console.log(border.width);
console.log(border.height);

console.log(canvas.width);
console.log(canvas.height);


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

// border.addEventListener('load', () => {
//     c.drawImage(border, 0, 0, canvas.width, canvas.height);

// })

// create game board on space image load
space.addEventListener('load', () => {
    // creating copy of space img
    let newSpaceImage = new Image();

    newSpaceImage.src = space.src;
    newSpaceImage.height = 300;
    newSpaceImage.width = 300;



    c.drawImage(newSpaceImage, 0, 0, canvas.width, canvas.height);

    // nested loop to draw game grid ontop of canvas image
    // for (let i=0; i<rows; i++) {
    //     for (let j=0; j<cols; j++) {
    //         const isEven = (i + j) % 2 === 0;
    //         let color = isEven ? '#ffffff18' : '#eeff0048';
            
    //         // fill in grids
    //         c.fillStyle = color;
    //         c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);
    //     }
    // };
});
