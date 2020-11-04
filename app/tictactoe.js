const ROW0 = 0b111000000;
const ROW1 = 0b000111000;
const ROW2 = 0b000000111;
const DIAG = 0b100010001;
const CROSS = 1;
const CIRCLE = 2;
const CATS_GAME = -1;

class TicTacToeBoard {
    constructor(selectedSquares, sideToMove) {
        this.position = {};
        this.sideToMove = sideToMove;
        this.position[CROSS] = 0b000000000;
        this.position[CIRCLE] = 0b000000000;
        this.computerMove = null;
        if (!selectedSquares || !sideToMove) {
            throw new Error('invalid contructor call');
        }
        if (selectedSquares.length === 0) {
            return;
        }
        selectedSquares.forEach((sq) => {
            this.position[sq.shape] = this.position[sq.shape] | selectedSqToBitBoard(sq.x, sq.y);
        });
    }

    takenSquares() {
        return (this.position[CIRCLE] | this.position[CROSS]) & 0b111111111;
    }

    generateMoves() {
        const availableSqs = ~this.takenSquares();
        let moves = [];
        for (let i = 0; i < 9; i++) {
            if (((0b1 << i) & availableSqs) !== 0) {
                moves.push(0b1 << i);
            }
        }
        return moves;
    }

    makeMove(move) {
        this.moveIntegrity(move);
        this.position[this.sideToMove] = (this.position[this.sideToMove] | move) & 0b111111111;
        this.sideToMove = this.otherSide(this.sideToMove);
        this.integrity(move);
    }

    unMakeMove(move) {
        this.moveIntegrity(move);
        this.position[this.otherSide(this.sideToMove)] =
            (this.position[this.otherSide(this.sideToMove)] ^ move) & 0b111111111;
        this.sideToMove = this.otherSide(this.sideToMove);
        this.integrity(move);
    }

    otherSide(side) {
        return side === CIRCLE ? CROSS : CIRCLE;
    }

    sideThatJustMoved() {
        return this.otherSide(this.sideToMove);
    }

    // we want to search the tree and label each terminal node as win for circles, crosses, or cat's game
    // the next node up will take the color of the side to move; if there is a terminal with this option; else cat's game
    // and so on to the top of the game tree
    minMaxMoveSearch(depth) {
        if (depth === 1) {
            this.computerMove = null;
        }
        let mv;
        const controllingPlayer = this.sideToMove;
        const passivePlayer = this.otherSide(controllingPlayer);
        // initiate score to the passive player
        // if any move is a cats game or win for controlling player, this will be overwritten
        let nodeScore = passivePlayer;
        const legalMoves = this.generateMoves();
        // we'll remove from this list as we find moves that allow opponent to win
        let goodMoves = legalMoves;
        for (let i = 0; i < legalMoves.length; i++) {
            mv = legalMoves[i];
            this.makeMove(mv);
            // if this is the end of the game then we want to score the node
            if (this.terminalNode()) {
                // if this is a winning position
                if (this.thisIsAWinningPosition()) {
                    if (this.whichSideIsWinning() !== this.sideThatJustMoved()) {
                        throw new Error('Should never get here -- players move creates win for opposition');
                    }
                    // if the side that has control can create a win; we can return because the node
                    // above will take this value. return position to parent node
                    this.unMakeMove(mv);
                    // if this is the root call; this represents the move the player should make as it is a win
                    if (depth === 1) {
                        this.computerMove = mv;
                    }
                    // node score is a win for controlling side
                    return controllingPlayer;
                }
                // terminal node that is not winning; must be a cats game
                nodeScore = CATS_GAME;
                this.unMakeMove(mv);
                continue;
            }
            // not end of game; check the next round of moves
            // node score can only take on value of passive player if there has been no
            // differing result at this level of the game tree yet
            const result = this.minMaxMoveSearch(depth + 1);
            if (result === passivePlayer) {
                goodMoves = goodMoves.filter((moveFromList) => moveFromList != mv);
                if (nodeScore === passivePlayer) {
                    this.unMakeMove(mv);
                    continue;
                }
            }
            // if the search returns a win for the currently controlling player
            // then the move made creates a forced win
            if (result === controllingPlayer) {
                this.unMakeMove(mv);
                if (depth === 1) {
                    this.computerMove = mv;
                }
                return result;
            }
            // result is a cat's game; if this is the first cats game we need to overwrite the
            nodeScore = CATS_GAME;
            this.unMakeMove(mv);
        }
        if (depth === 1 && this.computerMove === null) {
            this.computerMove =
                goodMoves.length > 0
                    ? goodMoves[getRandomInt(goodMoves.length)]
                    : legalMoves[getRandomInt(legalMoves.length)];
        }
        // either CATS game or win for passive player
        return nodeScore;
    }

    terminalNode() {
        return this.thisIsAWinningPosition() || this.allSquaresAreFilled();
    }

    allSquaresAreFilled() {
        return (~this.takenSquares() & 0b111111111) === 0;
    }

    thisIsAWinningPosition() {
        return this.whichSideIsWinning() !== CATS_GAME;
    }

    whichSideIsWinning() {
        if (this.isWinning(CIRCLE)) {
            return CIRCLE;
        }
        if (this.isWinning(CROSS)) {
            return CROSS;
        }
        return CATS_GAME;
    }
    // O - X
    // - X O
    // O - X

    isWinning(side) {
        return (
            this.checkWinningLine(ROW0, side) ||
            this.checkWinningLine(ROW1, side) ||
            this.checkWinningLine(ROW2, side) ||
            this.checkWinningLine(DIAG, side) ||
            this.checkWinningLine(rotatePosition(ROW0), side) ||
            this.checkWinningLine(rotatePosition(ROW1), side) ||
            this.checkWinningLine(rotatePosition(ROW2), side) ||
            this.checkWinningLine(rotatePosition(DIAG), side)
        );
    }

    checkWinningLine(line, side) {
        return (line & this.position[side] & 0b111111111) === (line & 0b111111111);
    }

    sqOwnerForPrinting(sq) {
        if ((this.position[CIRCLE] & (0b1 << sq) & 0b111111111) === 0b000000001 << sq) {
            return 'O';
        }
        if ((this.position[CROSS] & (0b1 << sq) & 0b111111111) === 0b000000001 << sq) {
            return 'X';
        }
        return '-';
    }

    integrity(mv) {
        let integrity = true;
        let reason = '';
        if ((this.position[CIRCLE] & this.position[CROSS] & 0b111111111) !== 0) {
            reason = 'overlapping positions!';
            integrity = false;
        }
        if (Math.abs(bitCount(this.position[CIRCLE]) - bitCount(this.position[CROSS])) > 1) {
            reason = `one side has too many moves!\
            ${bitCount(this.position[CIRCLE])} vs ${bitCount(this.position[CROSS])}`;
            integrity = false;
        }
        if (!integrity) {
            console.log(new Error(reason));
            this.print();
            printBitBoard(this.position[CROSS], 'printing crosses');
            printBitBoard(this.position[CIRCLE], 'printing circles');
            this.printMove(mv);
            throw new Error('Stop script');
        }
    }

    moveIntegrity(mv) {
        const integrity = bitCount(mv) === 1;
        if (!integrity) {
            console.log(new Error('move integrity failed!'));
            this.printMove(mv);
            throw new Error('Stop script');
        }
    }

    printMove(mv) {
        printBitBoard(mv, `printing mv ${mv}`);
    }

    printBitBoard(mv, message) {
        console.log(message);
        let board = '';
        for (var i = 2; i >= 0; i--) {
            board += `
            ${bitValue(mv, i * 3 + 2)} ${bitValue(mv, i * 3 + 1)} ${bitValue(mv, i * 3)}
            `;
        }
        console.log(board);
    }

    print() {
        let board = '';
        for (var i = 2; i >= 0; i--) {
            board += `
${this.sqOwnerForPrinting(i * 3 + 2)} ${this.sqOwnerForPrinting(i * 3 + 1)} ${this.sqOwnerForPrinting(i * 3)}
            `;
        }
        console.log(board);
    }
}

// 0 1 2 --> 2 5 8
// 3 4 5 --> 1 4 7
// 6 7 8 --> 0 3 6
function rotatePosition(p) {
    const rotated =
        ((p & 0b000000001) << 6) |
        ((p & 0b000000010) << 2) |
        ((p & 0b000000100) >>> 2) |
        ((p & 0b000001000) << 4) |
        (p & 0b000010000) |
        ((p & 0b000100000) >>> 4) |
        ((p & 0b001000000) << 2) |
        ((p & 0b010000000) >>> 2) |
        ((p & 0b100000000) >>> 6);
    return rotated;
}

function bitCount(mv) {
    let count = 0;
    let n = mv;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function selectedSqToBitBoard(x, y) {
    return (0b1 << Math.abs(x - 2)) << (Math.abs(y - 2) * 3);
}

function printBitBoard(mv, message) {
    console.log(message);
    let board = '';
    for (var i = 2; i >= 0; i--) {
        board += `
        ${bitValue(mv, i * 3 + 2)} ${bitValue(mv, i * 3 + 1)} ${bitValue(mv, i * 3)}
        `;
    }
    console.log(board);
}

function bitValue(bitboard, sq) {
    return (bitboard & (0b1 << sq) & 0b111111111) === 0b000000001 << sq ? 1 : 0;
}

if (typeof exports !== 'undefined') {
    module.exports = {TicTacToeBoard, CROSS, CIRCLE, CATS_GAME};
}
