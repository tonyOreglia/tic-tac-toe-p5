const {TicTacToeBoard, CROSS, CIRCLE, CATS_GAME} = require('./tictactoe');

test('generate initial moves', () => {
    const board = new TicTacToeBoard([], CIRCLE);
    expect(board.generateMoves().length).toBe(9);
    let mv = 0b100000000;
    board.makeMove(mv);
    expect(board.generateMoves().length).toBe(8);
    board.unMakeMove(mv);
    expect(board.generateMoves().length).toBe(9);
});

test('is not winning position', () => {
    const board = new TicTacToeBoard([], CIRCLE);
    board.makeMove(0b001000000);
    board.makeMove(0b100000000);
    board.makeMove(0b000100000);
    board.makeMove(0b000010000);
    board.makeMove(0b000000001);
    board.makeMove(0b000000100);
    // O - X
    // - X O
    // O - X
    expect(board.thisIsAWinningPosition()).toBe(false);
});

test('generate available moves after first move', () => {
    const board = new TicTacToeBoard(
        [
            {
                shape: 1,
                x: 1,
                y: 1
            }
        ],
        CIRCLE
    );
    const mvs = board.generateMoves();
    expect(mvs.length).toBe(8);
});

test('terminal node cats game', () => {
    const range3 = [...Array(3).keys()];
    const cats = [CIRCLE, CROSS, CIRCLE, CIRCLE, CROSS, CROSS, CROSS, CIRCLE, CROSS];
    const selectedSqs = [];
    range3.forEach((x) => {
        range3.forEach((y) => {
            selectedSqs.push({
                x,
                y,
                shape: cats[y + x * 3]
            });
            // O X O
            // O X X
            // X O X
        });
    });
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    expect(board.terminalNode()).toBe(true);
    expect(board.allSquaresAreFilled()).toBe(true);
});

test('terminal node CIRCLE win horizontal', () => {
    const range3 = [...Array(3).keys()];
    const selectedSqs = [];
    range3.forEach((x) => {
        selectedSqs.push({
            x,
            y: 0,
            shape: CIRCLE
        });
        // O O O
        // - - -
        // - - -
    });
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    expect(board.terminalNode()).toBe(true);
    expect(board.whichSideIsWinning()).toBe(CIRCLE);
});

test('terminal node CROSSES win vertical', () => {
    const range3 = [...Array(3).keys()];
    const selectedSqs = [];
    range3.forEach((y) => {
        // - - X
        // - - X
        // - - X
        selectedSqs.push({
            x: 2,
            y,
            shape: CROSS
        });
    });
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    expect(board.terminalNode()).toBe(true);
    expect(board.whichSideIsWinning()).toBe(CROSS);
});

test('make five moves resulting in win for white then unmake all the moves in order', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);

    board.makeMove(0b100000000);
    board.makeMove(0b000100000);
    board.makeMove(0b010000000);
    board.makeMove(0b000010000);
    board.makeMove(0b001000000);
    // O O O
    // X X -
    // - - -

    expect(board.terminalNode()).toBe(true);
    expect(board.whichSideIsWinning()).toBe(CIRCLE);

    board.unMakeMove(0b001000000);
    board.unMakeMove(0b000010000);
    board.unMakeMove(0b010000000);
    board.unMakeMove(0b000100000);
    board.unMakeMove(0b100000000);

    expect(board.terminalNode()).toBe(false);
    expect(board.takenSquares()).toBe(0);
});

test('game tree from root position', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    const result = board.minMaxMoveSearch(1);
    expect(result).toBe(-1);
    expect(board.computerMove).not.toBe(undefined);
});

test('game tree with next move victories available', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    board.makeMove(0b100000000);
    board.makeMove(0b000100000);
    board.makeMove(0b010000000);
    board.makeMove(0b000010000);
    // O O -
    // X X -
    // - - -

    expect(board.minMaxMoveSearch(1)).toBe(CIRCLE);
    expect(board.computerMove).toBe(0b001000000);

    board.makeMove(0b000000001);
    // O O -
    // X X -
    // - - O
    expect(board.sideToMove).toBe(CROSS);
    expect(board.position[CIRCLE]).toBe(0b110000001);
    expect(board.position[CROSS]).toBe(0b000110000);
    expect(board.minMaxMoveSearch(1)).toBe(CROSS);
    expect(board.computerMove).toBe(0b000001000);
});

test('game tree with forced win in two moves', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    board.makeMove(0b100000000);
    board.makeMove(0b000010000);
    board.makeMove(0b010000000);
    board.makeMove(0b000001000);
    board.makeMove(0b000100000);
    // O O -
    // O X X
    // - - -

    expect(board.minMaxMoveSearch(1)).toBe(CIRCLE);
});

test('game tree with forced win in three moves if CIRCLE makes right move', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    board.makeMove(0b100000000);
    board.makeMove(0b000100000);
    board.makeMove(0b000010000);
    board.makeMove(0b000000001);
    // O - -
    // X O -
    // - - X

    expect(board.minMaxMoveSearch(1)).toBe(CIRCLE);
    expect(board.computerMove).toBe(0b001000000);
});

test('should stop opponent from winning', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    board.makeMove(0b100000000);
    board.makeMove(0b000010000);
    board.makeMove(0b010000000);
    // O O -
    // - X -
    // - - -
    expect(board.sideToMove).toBe(CROSS);
    expect(board.minMaxMoveSearch(1)).toBe(CATS_GAME);
    expect(board.computerMove).toBe(0b001000000);
});

test('should play some reasonable move in lost game', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    board.makeMove(0b100000000);
    board.makeMove(0b000100000);
    board.makeMove(0b010000000);
    // O O -
    // X - -
    // - - -

    // possible continuation of game -- Cirlce has forced win from above position
    // O O X
    // X O -
    // - O X

    expect(board.sideToMove).toBe(CROSS);
    expect(board.minMaxMoveSearch(1)).toBe(CIRCLE);
    expect(board.computerMove).not.toBe(undefined);
});

test('calculate multiple moves from same position', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    board.makeMove(0b100000000);
    board.makeMove(0b000100000);
    board.makeMove(0b000010000);
    board.makeMove(0b000000001);
    // O - -
    // X O -
    // - - X

    expect(board.minMaxMoveSearch(1)).toBe(CIRCLE);
    expect(board.computerMove).toBe(0b001000000);
    board.makeMove(board.computerMove);
    board.makeMove(0b010000000);

    expect(board.minMaxMoveSearch(1)).toBe(CIRCLE);
    expect(board.computerMove).toBe(0b000000100);
});

test('game tree with forced win next move', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CIRCLE);
    board.makeMove(0b100000000);
    board.makeMove(0b000100000);
    board.makeMove(0b000010000);
    board.makeMove(0b000000001);
    board.makeMove(0b001000000);
    // O - O
    // X O -
    // - - X

    expect(board.minMaxMoveSearch(1)).toBe(CIRCLE);
    expect(board.computerMove).not.toBe(undefined);
});

test('game tree with forced win in two moves', () => {
    const selectedSqs = [];
    const board = new TicTacToeBoard(selectedSqs, CROSS);
    board.makeMove(0b100000000);
    board.makeMove(0b010000000);
    board.makeMove(0b001000000);
    board.makeMove(0b000100000);
    board.makeMove(0b000010000);
    // X O X
    // O X -
    // - - -

    expect(board.minMaxMoveSearch(1)).toBe(CROSS);
});
