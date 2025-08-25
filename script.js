const Gameboard = (function() {
    const board = ["", "", "", "", "", "", "", "", ""];
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    const getBoard = () => {
        for (let i = 0; i < board.length; i+=3) {
            console.log(board[i] + " | " + board[i + 1] + " | " + board[i + 2]);
        }
    };

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

    const printNewRound = () => {
        Gameboard.getBoard();
        console.log(`${getActivePlayer().getMark()}'s turn.`);
    };

    const playRound = (index) => {
        if (!Gameboard.placeToken(index, activePlayer)) {
            return;
        }
        
        const winner = Gameboard.getWinner();
        if (winner) {
            return winner;
        }
            
        switchPlayerTurn();
        printNewRound();
    };

    return {
        getActivePlayer,
        printNewRound,
        playRound
    };
})();

const ScreenController = (function() {
    GameController.printNewRound();
    let complete = false;
    while (!complete) {
        let input = Number(prompt(`${GameController.getActivePlayer().getMark()}, choose a spot (0–8):`));

        let result = GameController.playRound(input)
        if (result) {
            complete = true;
            Gameboard.getBoard();
            if (result === "tie") {
                console.log("Tie!")
            } else {
                console.log(`${GameController.getActivePlayer().getMark()} is the winner`);
            }
        }
    }
})();

