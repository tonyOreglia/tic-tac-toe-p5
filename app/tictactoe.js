declare function require(name:string);
let assert = require('assert');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const board: Array<string> = ['-', '-', '-', '-', '-', '-', '-', '-', '-']
const winningBoardO: Array<string> = ['x', 'o', '-', 'x', 'o', 'x', '-', 'o', '-']
const winningBoardX: Array<string> = ['x', 'o', '-', 'x', 'o', '-', 'x', '-', '-']
const cats: Array<string> = ['o', 'x', 'o', 'o', 'x', 'o', 'x', 'o', 'x']

function Print(board: string[]): void {
    console.log()
    for (let i = 0; i < 3; i++) {
        console.log(board[0 + i * 3], board[1 + i * 3], board[2 + i * 3]);
    }
    console.log()
}


function State(board: string[]): string {
    let winner = CheckSingleRotationForWinner(board)
    if (winner != '') {
        return winner
    }
    let temp = board;
    while (true) {
        winner = CheckSingleRotationForWinner(temp)
        if (winner != '') {
            return winner
        }
        temp = Rotate(temp)
        if (Equal(temp, board)) { break; }
    }
    return GameOver(board) ? 'cats' : 'undetermiend'
}

function GameOver(board: string[]): boolean {
    for (let i=0; i<9; i++) {
        if (board[i] == '-') { return false; }
    }
    return true
}

function CheckSingleRotationForWinner(board: string[]): string {
    if (board[0] != '-' && board[0] == board[1] && board[0] == board[2]) {
        return board[0]
    }
    if (board[3] != '-' && board[3] == board[4] && board[3] == board[5]) {
        return board[3]
    }
    if (board[0] != '-' && board[0] == board[4] && board[0] == board[8]) {
        return board[0]
    }
    return ''
}

function Valid(board: string[]): boolean {
    let o = 0;
    let x = 0;
    for(let i=0; i<9; i++) {
        if (board[i] == 'x') { x++; }
        if (board[i] == 'o') { o++; }
    }
    if ((x - o) > 1 || (x - o) < -1) { 
        return false
    }
    return true
}

function Equal(b1: string[], b2: string[]): boolean {
    return b1[0] == b2[0] &&
        b1[1] == b2[1] &&
        b1[2] == b2[2] &&
        b1[3] == b2[3] &&
        b1[4] == b2[4] &&
        b1[5] == b2[5] &&
        b1[6] == b2[6] &&
        b1[7] == b2[7] &&
        b1[8] == b2[8];
}

// 0 1 2 --> 2 5 8
// 3 4 5 --> 1 4 7
// 6 7 8 --> 0 3 6
function Rotate(board: string[]): string[] {
    return [board[2], board[5], board[8], board[1], board[4], board[7], board[0], board[3], board[6]]
}

if (!Valid(board) || !Valid(cats) || !Valid(winningBoardO) || !Valid(winningBoardX)) {
    console.log('not valid!!!!')
}

function MakeMove(move: number, board: string[], turn: string): string[] {
	assert(board[move] == '-');
	let newBoard = [...board];
	newBoard[move] = turn;
	assert(Valid(newBoard));
	return newBoard;
}

function DisplayBoardForHumanMove(board: string[], turn: string): void {
	Print(board);
	console.log(`It is ${turn}'s turn to move.`);
	readline.question(`What's your name?`, (name) => {
  		console.log(`Hi ${name}!`)
  		readline.close()
	})	

}

Print(winningBoardX);
console.log('state: ', State(winningBoardX));

Print(winningBoardO);
console.log('state: ', State(winningBoardO));
Print(board);
console.log('state: ', State(board));
let changedBoard = MakeMove(0, board, 'x');
changedBoard = MakeMove(1, changedBoard, 'o');
Print(changedBoard);

Print(cats);
console.log('state: ', State(cats));

