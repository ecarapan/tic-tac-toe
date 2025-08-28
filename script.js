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

const Player = (name, mark) => {
    let score = 0;

    const getName = () => name;
    const getMark = () => mark;
    const getScore = () => score;
    const incrementScore = () => score++;
    const resetScore = () => score = 0;

    return { 
        getName,
        getMark, 
        getScore, 
        incrementScore,
        resetScore
    }
};

const GameController = (function() {
    let round = 1;

    const assignPlayers = (nameX, nameO) => {
        playerX = Player( nameX || "Player X", "X");
        playerO = Player( nameO || "Player O", "O");
        activePlayer = playerX; // Set the first active player
    };

    const switchPlayerTurn = () => {
        if (activePlayer === playerX) {
            activePlayer = playerO;
        } else {
            activePlayer = playerX;
        }
    };

    const getActivePlayer = () => activePlayer;

    const getRound = () => round;

    const playRound = (index) => {
        if (!Gameboard.placeToken(index, activePlayer)) {
            return;
        }
        
        const winner = Gameboard.getWinner();
        if (winner) {
           if (winner === "X") {
                playerX.incrementScore();
                return `${playerX.getName()} wins!`;
            } else if (winner === "O") {
                playerO.incrementScore();
                return `${playerO.getName()} wins!`;
            } else if (winner === "tie") {
                return "It's a tie!";
            }
        }
            
        switchPlayerTurn();
    };

    const nextRound = () => {
        Gameboard.resetBoard();
        round++;
        activePlayer = playerX;
    }

    const restartGame = () => {
        Gameboard.resetBoard();
        round = 1;
        activePlayer = playerX;
        playerX.resetScore();
        playerO.resetScore();
    }

    return {
        nextRound,
        getRound,
        assignPlayers,
        getActivePlayer,
        playRound,
        restartGame
    };
})();

const ScreenController = (function() {
    const turnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const announcementDiv = document.querySelector(".announcement")
    const startMenuDiv = document.querySelector(".start-menu");
    const playerXInput = document.querySelector(".player-X-name");
    const playerOInput = document.querySelector(".player-O-name");
    const startGameButton = document.querySelector(".start-game");
    const xScoreDiv = document.querySelector(".X-score");
    const oScoreDiv = document.querySelector(".O-score");
    const roundDiv = document.querySelector(".round");
    const nextRoundButton = document.querySelector(".next-round");
    const restartGameButton = document.querySelector(".restart-game");
    const gameInfoDiv = document.querySelector(".game-info");
    
    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = Gameboard.getBoard();
        const activePlayer = GameController.getActivePlayer();

        turnDiv.textContent = `${activePlayer.getName()} with ${activePlayer.getMark()}'s turn`;
        xScoreDiv.textContent = `Player X Score: ${playerX.getScore()}`;
        oScoreDiv.textContent = `Player O Score: ${playerO.getScore()}`;
        roundDiv.textContent = `Round: ${GameController.getRound()}`;

        board.forEach((cell, index) => {
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            cellButton.dataset.index = index;
            cellButton.textContent = cell;

            boardDiv.appendChild(cellButton);
        });
    };

    function clickHandlerBoard(e) { 
        const cellIndex = e.target.dataset.index

        if (!cellIndex) return;

        const result = GameController.playRound(cellIndex);
        updateScreen();

        if (result) {
            boardDiv.classList.add("disabled");
            nextRoundButton.style.display = "grid";
            announcementDiv.textContent = result;
        }
        
    };
    boardDiv.addEventListener("click", clickHandlerBoard);

    const startGame = () => {
        const nameX = playerXInput.value.trim();
        const nameO = playerOInput.value.trim();

        GameController.assignPlayers(nameX, nameO);

        startMenuDiv.style.display = "none"; 
        boardDiv.style.display = "grid"; 
        gameInfoDiv.style.display = "grid";

        updateScreen();
    };
    startGameButton.addEventListener("click", startGame);

    const nextRoundHandler = () => {
        GameController.nextRound();
        boardDiv.classList.remove("disabled");
        announcementDiv.textContent = "";
        nextRoundButton.style.display = "none";
        updateScreen();
    };
    nextRoundButton.addEventListener("click", nextRoundHandler);

    const restartGameHandler = () => {
        GameController.restartGame();
        boardDiv.classList.remove("disabled");
        announcementDiv.textContent = "";
        nextRoundButton.style.display = "none";
        updateScreen();
    };
    restartGameButton.addEventListener("click", restartGameHandler);
})();



