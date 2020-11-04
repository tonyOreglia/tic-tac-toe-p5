const width = 600;
const height = 600;
const bgColor = 220;
let turn = CIRCLE;
const computerPlaysAs = CROSS;
let selectedSquares = [];
let ttt;

function setup() {
    createCanvas(width, height);
    ttt = new TicTacToeBoard(selectedSquares, turn);
}

function mousePressed() {
    if (turn === computerPlaysAs) {
        return;
    }
    const index = mousePositionToIndex();
    if (indexIsTaken(index)) {
        return;
    }
    selectedSquares.push({...index, shape: turn});
    ttt.makeMove(selectedSqToBitBoard(index.x, index.y));
    toggleTurn();
}

function indexIsTaken(index) {
    return selectedSquares.some((sq) => `${sq.x}${sq.y}` === `${index.x}${index.y}`);
}

function toggleTurn() {
    turn = turn - 1;
    if (turn === 0) {
        turn = 2;
    }
}

function mousePositionToIndex() {
    let x = Math.floor(mouseX / (width / 3));
    let y = Math.floor(mouseY / (height / 3));
    return {x, y};
}

function draw() {
    background(bgColor);
    drawGrid();
    if (ttt.terminalNode()) {
        noLoop();
        selectedSquares = [];
        turn = CIRCLE;
        ttt = new TicTacToeBoard(selectedSquares, CIRCLE);
        loop();
    }
    if (turn === computerPlaysAs) {
        noLoop();
        ttt.minMaxMoveSearch(1);
        selectedSquares.push(bitboardToSelectedSquare(ttt.computerMove));
        ttt.makeMove(ttt.computerMove);
        toggleTurn();
        loop();
    }
    if (selectedSquares.length > 0) {
        fillSquares(selectedSquares);
    }
}

function drawGrid() {
    push();
    strokeWeight(5);
    stroke('black');
    line(width / 3, 0, width / 3, height);
    line((width / 3) * 2, 0, (width / 3) * 2, height);
    line(0, height / 3, width, height / 3);
    line(0, (height / 3) * 2, width, (height / 3) * 2);
    pop();
}

function fillSquares(selectedSquares) {
    for (let i = 0; i < selectedSquares.length; i++) {
        const sq = selectedSquares[i];
        if (sq.shape === CIRCLE) {
            drawCircle(sq.x, sq.y);
            continue;
        }
        drawX(sq.x, sq.y);
    }
}

function drawX(x, y) {
    push();
    stroke('blue');
    strokeWeight(3);
    translate(width / 6, height / 6);
    translate(x * (width / 3), y * (height / 3));
    angleMode(DEGREES);
    rotate(45);
    line(-width / 12, 0, width / 12, 0);
    line(0, -height / 12, 0, height / 12);
    pop();
}

function drawCircle(x, y) {
    push();
    stroke('red');
    strokeWeight(3);
    fill(bgColor);
    translate(x * (width / 3), y * (height / 3));
    circle(width / 6, height / 6, width / 6);
    pop();
}

function bitboardToSelectedSquare(bb) {
    const col0 = bb & rotatePosition(ROW0);
    const col1 = bb & rotatePosition(ROW1);
    // const col0 = bb & rotatePosition(ROW1);
    const row0 = bb & ROW0;
    const row1 = bb & ROW1;
    const row2 = bb & ROW2;
    const selectedSq = {
        x: col0 ? 0 : col1 ? 1 : 2,
        y: row0 ? 0 : row1 ? 1 : 2
    };
    return selectedSq;
}
