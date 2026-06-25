function gameBoard(){
    const board = []
    for(let i = 0; i < 9; i++){
        board.push(gameSpot());
    }

    const getBoard = () => board;

    const printBoard = () => {
        let boardString = `\n`;
        for(let i = 0; i < 9; i += 3){
            boardString += ` ${board[i].getValue()} | ${board[i + 1].getValue()} | ${board[i + 2].getValue()}\n`;
            if ((i < 6)) boardString += "-----------\n";
        };
        console.log(boardString += `\n`);
    }

    const writeSpot = (number, symbol) => {
        const spot = board[number - 1];
        spot.changeValue(symbol);
    }

    const spotIsBlank = (number) => {
        const spot = board[number - 1];
        return spot.getValue() === " " ? true : false
    }
    return {getBoard, printBoard, writeSpot, spotIsBlank};
}

function gameSpot(){
    let value = " "; // Instance variable???

    const changeValue = (symbol) => {
        value = symbol;
    };

    const getValue = () => value; // Implicit return like in Ruby???

    return {changeValue, getValue};
}

function gameController(playerOne = "Red X", playerTwo = "Big O"){
    console.log("Welcome to Console Tic-Tac-Toe!!!");
    console.log("To play your turn, please type \"game.playTurn(boardSpot)\"");
    const players = [{name: playerOne, symbol: 'X'}, {name: playerTwo, symbol: 'O'}];
    const board = gameBoard();
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const checkWinConditions = (playerSymbol, currentBoard) => {
        let won = false;
        winningCombos.forEach((combo) => {
            if (combo.every(currentSpot => currentBoard[currentSpot].getValue() === playerSymbol)) won = true;
        });
        if (won) console.log(`${activePlayer.name} has won!!! To play again, refresh the page.`);
        return won;
    }

    const checkTieCondition = (currentBoard) => {
        if (!currentBoard.some(spot => spot.getValue() === " ")) {
            console.log('Tie!!! To play again, refresh the page.');
            return true;
        }
    }

    const checkEndConditions = (playerSymbol) => {
        let returnValue = false;
        const currentBoard = board.getBoard();
        returnValue = checkWinConditions(playerSymbol, currentBoard);
        if (returnValue) return true;
        returnValue = checkTieCondition(currentBoard);
        return returnValue;
    }

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const playTurn = (spot) => {
        if (isNaN(spot)) return;
        if (checkEndConditions(activePlayer.symbol)) return;
        if (!board.spotIsBlank(spot)) {
            console.log('Spot is already filled, please try another spot.');
            return;
        }
        board.writeSpot(spot, activePlayer.symbol);
        board.printBoard();
        if (checkEndConditions(activePlayer.symbol)) return;
        switchPlayer();
    };

    return {playTurn};
};

const game = gameController();