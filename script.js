const Gameboard = (function() {
    const board = ["", "", "", "", "", "", "", "", ""];
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    const getBoard = () => board;
    
    const placeToken = (index, player) => {
        if (board[index] === "") {
            board[index] = player.getMark();
            return true;
        } else {
            return false;
        }
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    const getWinner = () => {
        for (let i = 0; i < winConditions.length; i++) {
            let countX = 0;
            let countO = 0;

            for (let j = 0; j < 3; j++) {
                let markAtIndex = board[winConditions[i][j]];
                if (markAtIndex === "X") {
                    countX++;
                } else if (markAtIndex === "O") {
                    countO++;
                }
            }  

            if (countX === 3) {
                return "X";
            } else if (countO === 3) {
                return "O";
            }
        }

        if (!board.includes("")) {
            return "tie";
        } 

        return null;
    };

    return { 
        getBoard, 
        placeToken, 
        resetBoard, 
        getWinner 
    };
})();

const Player = (mark) => {
    let score = 0;

    const getMark = () => mark;
    const getScore = () => score;
    const incrementScore = () => score++;

    return { 
        getMark, 
        getScore, 
        incrementScore 
    }
};

const GameController = (function() {
    const playerX = Player("X");
    const playerO = Player("O");

    let activePlayer = playerX;

    const switchPlayerTurn = () => {
        if (activePlayer === playerX) {
            activePlayer = playerO;
        } else {
            activePlayer = playerX;
        }
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (index) => {
        if (!Gameboard.placeToken(index, activePlayer)) {
            return;
        }
        
        const winner = Gameboard.getWinner();
        if (winner) {
           return winner;
        }
            
        switchPlayerTurn();
    };

    return {
        getActivePlayer,
        playRound
    };
})();

const ScreenController = (function() {
    const turnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const announcementDiv = document.querySelector(".announcement")
    
    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = Gameboard.getBoard();
        const activePlayer = GameController.getActivePlayer();

        turnDiv.textContent = `${activePlayer.getMark()}'s turn`

        board.forEach((cell, index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.index = index;
            cellButton.textContent = cell;

            boardDiv.appendChild(cellButton);
        });
    }

    function clickHandlerBoard(e) { 
        const cellIndex = e.target.dataset.index

        if (!cellIndex) return;

        const winner = GameController.playRound(cellIndex);
        updateScreen();

        if (winner) {
            if (winner === "tie") {
                announcementDiv.textContent = "Tie!"
            } else {
                announcementDiv.textContent = `${winner} wins!`
            }
        }
        
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
})();



