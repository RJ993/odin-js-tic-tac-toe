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
        const spot = board[number];
        spot.changeValue(symbol);
    }

    const revertSpot = (number) => {
        const spot = board[number];
        spot.changeValue(" ");
    }

    const spotIsBlank = (number) => {
        const spot = board[number];
        return spot.getValue() === " " ? true : false
    }
    return {getBoard, printBoard, writeSpot, spotIsBlank, revertSpot};
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
    const conCode = 0
    const winCode = 1
    const tieCode = 2 
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
        let won = conCode;
        winningCombos.forEach((combo) => {
            if (combo.every(currentSpot => currentBoard[currentSpot].getValue() === playerSymbol)) won = winCode;
        });
        return won;
    }

    const checkTieCondition = (currentBoard) => {
        if (!currentBoard.some(spot => spot.getValue() === " ")) {
            console.log('Tie!!! To play again, refresh the page.');
            return tieCode;
        }
        return conCode;
    }

    const checkEndConditions = (playerSymbol) => {
        let returnValue = conCode;
        const currentBoard = board.getBoard();
        returnValue = checkWinConditions(playerSymbol, currentBoard);
        if (returnValue == winCode) return returnValue;
        returnValue = checkTieCondition(currentBoard);
        return returnValue;
    }

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const changePlayerName = (newPlayerName, symbol) => {
        player = players.find(player => player.symbol == symbol);
        player.name = newPlayerName;
    }

    const playTurn = (spot) => {
        if (isNaN(spot)) return conCode;
        let endCode = checkEndConditions(activePlayer.symbol);
        if (endCode != conCode) return endCode;
        if (!board.spotIsBlank(spot)) return 0;
        board.writeSpot(spot, activePlayer.symbol);
        endCode = checkEndConditions(activePlayer.symbol);
        if (endCode != conCode) return endCode;
        switchPlayer();
        return endCode;
    };

    const resetBoard = () => {
        for (let i = 0; i < 9; i++) {
            board.revertSpot(i);
        }
    }

    return {playTurn, getActivePlayer, getBoard: board.getBoard, changePlayerName, resetBoard};
};

function screenController() {
    const game = gameController();
    const boardInterface = document.querySelector(".board");
    const eventBanner = document.querySelector(".eventBanner");
    const playerNameButtons = document.querySelectorAll(".playerName");
    const restartButton = document.getElementById("restart");

    function reset(container){
        while (container.firstChild){
            container.removeChild(container.firstChild);
        }
    }


    const updateScreen = (gameState = 0) => {
        reset(boardInterface);
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        board.forEach((spot, index) => {
            const spotButton = document.createElement("button");
            spotButton.classList.add("spot");
            spotButton.dataset.number = index;
            spotButton.textContent = spot.getValue();
            boardInterface.appendChild(spotButton);
        })
        switch (gameState) {
            case 2:
                eventBanner.textContent = "Tie! Press the restart button to play again."
                restartButton.disabled = false;
                break;
            case 1:
                eventBanner.textContent = `${activePlayer.name} wins! Press the restart button to play again.`
                restartButton.disabled = false;
                break;
            default:
                eventBanner.textContent = `${activePlayer.name}'s turn.`
        }
    }

    const boardClickHandler = (e) => {
        const selectedSpot = e.target.dataset.number
        if (!selectedSpot) return;
        gameState = game.playTurn(selectedSpot);
        updateScreen(gameState);
    }

    const playerNameClickHandler = (e) => {
        const input = document.querySelector(`input[name=\"${e.target.name}\"]`);
        const newPlayerName = input.value;
        game.changePlayerName(newPlayerName, e.target.dataset.symbol);
        eventBanner.textContent = `Your name has been changed to ${newPlayerName}`;
    }

    const restartHandler = (e) => {
        game.resetBoard();
        updateScreen();
        restartButton.disabled = true;
    }
    boardInterface.addEventListener('click', boardClickHandler);
    playerNameButtons.forEach(button => button.addEventListener('click', playerNameClickHandler));
    restartButton.addEventListener('click', restartHandler);

    updateScreen();

}

screenController();