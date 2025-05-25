const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
const highScore = document.getElementById('high-score');
const score = document.getElementById('score');
const c = canvas.getContext('2d');

let rows = 8;
let cols = 8;

// window dimensions are usable window to user
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let canvasWidth = (windowWidth / 3) * 2;
let canvasHeight = (windowHeight / 3) * 2;

console.log(Math.floor(canvasHeight));

let newCanvasHeight = Math.floor(canvasHeight);
let newCanvasWidth = newCanvasHeight

console.log({newCanvasHeight})
console.log({newCanvasWidth})

console.log(newCanvasHeight / 8);

let newCellSize = newCanvasHeight / 8;

for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
        const isEven = (i + j) % 2 === 0;
        let color = isEven ? '#00ccff48' : '#eeff0048';
        
        // board color
        c.fillStyle = color;
        c.fillRect(newCellSize * i, newCellSize * j, newCellSize, newCellSize);

    }
};

console.log({canvasWidth});
console.log({canvasHeight});

// outer is window + everything else
const outerWidth = window.outerWidth;
const outerHeight = window.outerHeight;

console.log({windowWidth});
console.log({windowHeight});
console.log({outerWidth});
console.log({outerHeight});

console.log('canvas width: ', canvas.width);
console.log('canvas height: ', canvas.height);

//

let cellSize = 60;

canvas.width = rows * cellSize;
canvas.height = cols * cellSize;

//


// bejewled snake 💎
// bejewled snake 💎
// bejewled snake 💎

// apple is a jewel 🟥
// apple is a jewel 🔷
// apple is a jewel 🔶

// score will be points based on jewel
// seperate score will also be just jewels eaten

// // draw board
// for (let i=0; i<rows; i++) {
//     for (let j=0; j<cols; j++) {
//         const isEven = (i + j) % 2 === 0;
//         let color = isEven ? '#00ccff48' : '#eeff0048';
        
//         // board color
//         c.fillStyle = color;
//         c.fillRect(cellSize * i, cellSize * j, cellSize, cellSize);

//     }
// };

// draw shadow
for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {

    }
}

// test