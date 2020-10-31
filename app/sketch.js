const width = 600;
const height = 600;
const bgColor = 220;
const CROSS = false;
const CIRCLE = true;
let turn = CIRCLE;
const selectedSquares = []

function setup() {
  createCanvas(width, height);
}

function mousePressed() {
  const index = mousePositionToIndex();
  if (indexIsTaken(index)) {
    return;
  }
  selectedSquares.push({...index, shape: turn});
  toggleTurn();
}

function indexIsTaken(index) {
  return selectedSquares.some(sq => `${sq.x}${sq.y}` === `${index.x}${index.y}`)
}

function toggleTurn() {
  turn = !turn;
}

function mousePositionToIndex() {
  let x = Math.floor(mouseX / (width / 3));
  let y = Math.floor(mouseY / (height / 3));
  return { x, y }
}

function draw() {
  background(bgColor);
  strokeWeight(5); // Defa
  stroke('black')
  line(width / 3, 0, width / 3, height);
  line(width / 3 * 2, 0, width / 3 * 2, height);
  line(0, height / 3, width, height / 3);
  line(0, height / 3 * 2, width, height / 3 * 2);
  fill(bgColor);
  console.log('selected squares: ', selectedSquares);
  if (selectedSquares.length > 0) {
    fillSquares(selectedSquares);
  }
}

function fillSquares(selectedSquares) {
  for (let i=0;i<selectedSquares.length; i++) {
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
  translate(width / 6, height / 6);
  translate(x*(width / 3), y * (height / 3));
  angleMode(DEGREES);
  rotate(45);
  line(-width / 12, 0,width / 12, 0);
  line(0,-height / 12, 0, height / 12);
  pop();
}

function drawCircle(x, y) {
  push();
  stroke('red');
  translate(x*(width / 3), y * (height / 3))
  circle((width / 6), (height / 6), width/6);
  pop();
}