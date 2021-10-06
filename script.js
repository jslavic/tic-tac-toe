// Store player info (type represents X or O inside the game)
const Player = (name, type) => {
    return {name, type, score: 0, isBot: false};
};

const Game = (() => {
    // Contains all the game logic
    const GameLogic = (() => {

        // Creates the player variables that will be set on initial screen
        const pOne = Player();
        const pTwo = Player();

        // Keeps track of players turns
        let currentTurn = null;
        const getTurn = () => currentTurn;
        const getAiType = () => pTwo.isBot ? pTwo.type : null;
        const isBot = () => pTwo.isBot;
        let turns = 0;

        // Check if the spot is free to make a move
        const isFree = (board, x, y) => {
            return (board[y][x] === null);
        };

        // Checks for possible win
        const checkWin = (board, type, x, y) => {
            
            if (board[y][0] == type && board[y][1] == type &&
                board[y][2] == type) {
                currentTurn.score++;
                return true;
            }

            if (board[0][x] == type && board[1][x] == type && 
                board[2][x] == type) {
                currentTurn.score++;
                return true;
            }

            if (board[0][0] == type && board[1][1] == type && 
                board[2][2] == type) {
                currentTurn.score++;
                return true;
            }

            if (board[0][2] == type && board[1][1] == type && 
                board[2][0] == type) {
                currentTurn.score++;
                return true;
            }

            return false;
        };

        // Check if game is tied (and over)
        const checkTie = () => {
            turns++;
            return turns >= 9;
        };

        // Add the result message below the board if game is finished
        const showResult = resultMsg => {

            const board = document.querySelector(".body");

            const resultDiv = document.createElement("div");
            resultDiv.classList.add("result", "text");
            resultDiv.textContent = `${resultMsg} The score is now ${pOne.score} : ${pTwo.score}`;

            board.appendChild(resultDiv);
        };

        // Switches the current turn player
        const switchPlayer = () => {
            currentTurn = currentTurn == pOne ? pTwo : pOne;
        };

        // Function that is ran at the end of the turn and checks for possible
        // win or tie and if none of those are the case, it switches the current turn
        const endTurn = (board, type, x, y) => {

            if (checkWin(board, type, x, y)) {
                showResult(`The game has been won by ${currentTurn.name}!`);
                GameBoard.disableBoard();
                showButtons();
                return true;

            }

            if (checkTie()) {
                showResult("The game has been tied!");
                GameBoard.disableBoard();
                showButtons();
                return true;
            }

            switchPlayer();
            displayTurn();
            return false;
        };

        // Add the play again and restart buttons below the board
        const showButtons = () => {

            const buttonRow = document.createElement("div");
            buttonRow.classList.add("buttonRow");

            const playAgainButton = document.createElement("button");
            playAgainButton.textContent = "Play again";
            playAgainButton.addEventListener("click", playAgain);
            buttonRow.appendChild(playAgainButton);

            const resetGameButton = document.createElement("button");
            resetGameButton.textContent = "Reset game";
            resetGameButton.addEventListener("click", resetGame);
            buttonRow.appendChild(resetGameButton);

            const body = document.querySelector(".body");  
            body.appendChild(buttonRow);

        }
        
        // Function to start new game with a game board
        const startGame = () => {
            let playerName = null;
            while (playerName == null) {
                playerName = prompt("Please enter your name");
            }
            pOne.name = playerName;

            const type = document.querySelector(".type .active").textContent;
            pOne.type = type;
            
            const opponent = document.querySelector(".player .active");
            pTwo.type = pOne.type == "X" ? "O" : "X";
           
            setP2(opponent);

            currentTurn = pOne.type == "X" ? pOne : pTwo;
            turns = 0;
            pOne.score = 0;
            pTwo.score = 0;

            destroyBoardElements();
            GameBoard.createBoard();
            displayTurn();
        };

        // Creates opponent based on users pick
        const setP2 = opponent => {
            if (opponent.textContent == "Unbeatable AI") {
                pTwo.name = "Unbeatable AI";
                pTwo.isBot = true;
            } else {
                let playerName = null;
                while (playerName == null) {
                    playerName = prompt("Please enter your name");
                }
                pTwo.name = playerName;
                pTwo.isBot = false;
            }
        }

        // Function simmilar to showInitialScreen() but removes all existing elemts
        // since the DOM tree will contain game board and its buttons
        const resetGame = () => {
            destroyBoardElements();
            showInitialScreen();
        };


        // This button creates a new board without reseting any stats
        const playAgain = () => {

            destroyBoardElements();
            switchPlayer();
            
            // Switch types of players
            switchType();
            currentTurn = pOne.type == "X" ? pOne : pTwo;

            turns = 0;
            GameBoard.createBoard();
            displayTurn();
        };

        // Switches players types when another round is played
        const switchType = () => {

            let temp = pOne.type;
            pOne.type = pTwo.type;
            pTwo.type = temp;

        };

        // Removes the board and any button that might appear
        const destroyBoardElements = () => {

            const body = document.querySelector(".body")    
            while (body.firstChild) {
                body.removeChild(body.firstChild);
            }
        };

        // Shows the current players turn
        const displayTurn = () => {

            let turnText = document.querySelector(".turn");

            if (turnText) {
                turnText.textContent = `Current turn: ${currentTurn.name} (${currentTurn.type})`;
            } else {
                const body = document.querySelector(".body");
                turnText = document.createElement("div");
                turnText.classList.add("turn", "text");
                turnText.textContent = `Current turn: ${currentTurn.name} (${currentTurn.type})`;
                body.appendChild(turnText);
            }
        };

        // Create the initial screen to set the players
        const showInitialScreen = () => {

            const playButton = document.createElement("button");
            playButton.textContent = "Play game";
            playButton.classList.add("play");
            playButton.addEventListener("click", startGame);

            // Buttons for type selection (X or O)
            const selectType = document.createElement("div");
            selectType.textContent = "Please select your type:";
            selectType.classList.add("text")

            const xType = document.createElement("button");
            xType.classList.add("active");
            xType.textContent = "X";
            xType.addEventListener("click", setActive);

            const oType = document.createElement("button");
            oType.textContent = "O";
            oType.addEventListener("click", setActive);

            const typeSelectionRow = document.createElement("div");
            typeSelectionRow.classList.add("type");
            typeSelectionRow.append(xType, oType);

            // Buttons for player selection (single or two)
            const selectPlayers = document.createElement("div");
            selectPlayers.textContent = "Please select your opponent:";
            selectPlayers.classList.add("text")

            const botPlay = document.createElement("button");
            botPlay.classList.add("active");
            botPlay.textContent = "Unbeatable AI";
            botPlay.addEventListener("click", setActive);

            const twoPlay = document.createElement("button");
            twoPlay.textContent = "Second Player";
            twoPlay.addEventListener("click", setActive);

            const playerSelectionRow = document.createElement("div");
            playerSelectionRow.classList.add("player");
            playerSelectionRow.append(botPlay, twoPlay);

            const body = document.querySelector(".body");
            body.append(selectType, typeSelectionRow, 
                selectPlayers, playerSelectionRow, playButton);

        };

        // Set the selected button to active
        const setActive = e => {
            Array.from(e.target.parentElement.children).forEach(sib => sib.classList.remove("active"));
            e.target.classList.add("active");
        };


        // --------------------- BOT FUNCTIONS ---------------------
        // This bot uses minimax algorithm to find the optimal move
        // ---------------------------------------------------------

        // Function used to determine possible base case for algo
        const isMovesLeft = board => {

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == null) {
                        return true;
                    }
                }
            }

            return false;
        }

        // Evaluates the new move made on board
        // If the move wins AI the game it returns a score 10
        // If it loses the game it gets a score of negative 10
        // A tie is worth 0
        const eval = board => {

            for (let i = 0; i < 3; i++) {
                
                // Iterate over rows
                if (board[i][0] == board [i][1] && 
                    board[i][1] == board [i][2]) {
                        if (board[i][0] == pTwo.type) {
                            // Case where AI wins
                            return +10;
                        } 
                        else if (board[i][0] == pOne.type) {
                            // Case where player wins
                            return -10;
                        }
                }

                // Iterate over columns
                if (board[0][i] == board [1][i] && 
                    board[1][i] == board [2][i]) {
                        if (board[0][i] == pTwo.type) {
                            // Case where AI wins
                            return +10;
                        } 
                        else if (board[0][i] == pOne.type) {
                            // Case where player wins
                            return -10;
                        }
                }

            }

            // Check for diagonals
            if (board[0][0] == board[1][1] &&
                board[1][1] == board[2][2]) {
                    if (board[0][0] == pTwo.type) {
                        // Case where AI wins
                        return +10;
                    } 
                    else if (board[0][0] == pOne.type) {
                        // Case where player wins
                        return -10;
                    }
            }

            if (board[0][2] == board[1][1] &&
                board[1][1] == board[2][0]) {
                    if (board[0][2] == pTwo.type) {
                        // Case where AI wins
                        return +10;
                    } 
                    else if (board[0][2] == pOne.type) {
                        // Case where player wins
                        return -10;
                    }
            }

            // The game is tied
            return 0;
        };

        // Counts score based on evaluation function and its next possible moves
        // This algo assumes other player will use the optimal move, which is why
        // isMax bool takes into account weather its AIs turn (which will try to
        // maximize its value) or players (who will aim to minimize it in theory)
        const minimax = (board, depth, isMax) => {

            let score = eval(board);

            // Maximizer wins
            if (score == 10) {
                return score - depth;
            }

            // Minimizer wins
            if (score == -10) {
                return score + depth;       
            }

            if (!isMovesLeft(board)) {
                return 0;
            }

            // Maximizers move case 
            if (isMax) {

                let best = -Infinity;

                for (let i = 0; i < 3; i++) {
                    
                    for (let j = 0; j < 3; j++) {

                        if (board[j][i] == null) {

                            board[j][i] = pTwo.type;
                            best = Math.max(best, 
                                minimax(board, depth + 1, false));
                            board[j][i] = null;
                        }
                    }
                }
                return best;

            // Minimizers move case
            } else {

                let best = Infinity;

                for (let i = 0; i < 3; i++) {
                    
                    for (let j = 0; j < 3; j++) {

                        if (board[j][i] == null) {

                            board[j][i] = pOne.type;
                            best = Math.min(best, 
                                minimax(board, depth + 1, true));
                            board[j][i] = null;
                        }
                    }
                }
                return best;
            }
        };

        // Initial function that will start the minimax recursion calls and 
        // return the coordinates of the optimal move
        const makeBestMove = (board) => {

            let bestVal = -Infinity;
            let coords = {x: -1, y: -1}

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    
                    if (board[j][i] == null) {
                        
                        board[j][i] = pTwo.type;
                        let value = minimax(board, 0, false);
                        board[j][i] = null;

                        if (value > bestVal) {
                            coords.y = j;
                            coords.x = i;
                            bestVal = value;
                        }
                    }
                }
            }
            return coords
        };

        return {getTurn, getAiType, isFree, 
            isBot, endTurn, showInitialScreen, makeBestMove}

    })();

    // Manipulate DOM elements to create board and add pieces
    const GameBoard = (() => {

        let board = [
            [null, null, null], 
            [null, null ,null], 
            [null, null, null]
        ];

        // Function that creates a board of 3x3 nodes in DOM
        const createBoard = () => {

            const body = document.querySelector(".body");
            const boardDiv = document.createElement("div");
            boardDiv.classList.add("board");
            board = [
                [null, null, null], 
                [null, null ,null], 
                [null, null, null]
            ];
            
            for (let i = 0; i < 3; i++) {
                const boardRow = document.createElement("div");
                boardRow.classList.add("row");

                for (let j = 0; j < 3; j++) {

                    const boardNode = document.createElement("div");
                    boardNode.classList.add("node");

                    // Create data attributes to easily identify x & y coords
                    boardNode.setAttribute("data-x", j);
                    boardNode.setAttribute("data-y", i);

                    boardNode.addEventListener("click", addPiece);
                    boardRow.appendChild(boardNode);
                }

                boardDiv.appendChild(boardRow);
            }

            body.appendChild(boardDiv);

            // Game will start with AIs move if he is X
            if (GameLogic.getAiType()== "X" && GameLogic.isBot()) {
                aiMove(board)
            }
        };

        // Function to add X or O on a node in board
        const addPiece = (e) => {

            const x = e.target.getAttribute("data-x");
            const y = e.target.getAttribute("data-y");

            if (!GameLogic.isFree(board, x, y)) {
                return;
            }

            const type = GameLogic.getTurn().type;

            // Add piece to the game board array
            board[y][x] = type;

            // Add the piece to the divs hthml
            e.target.textContent = type;

            // Ends game if it's over or just finishes turn
            let isEnded = GameLogic.endTurn(board, type, x, y);
            
            if (GameLogic.isBot() && !isEnded) {
                aiMove(board);
            }

        };

        // Creates AI move and displays it on the board
        const aiMove = (board) => {

            // Get the most optimal move
            let coords = GameLogic.makeBestMove(board);
            
            // Select the node and the type that will go into selected node
            let nodeDiv = document.querySelector(`[data-x ="${coords.x}"][data-y = "${coords.y}"]`);
            const type = GameLogic.getTurn().type;

            // Add piece to the game board array and div
            board[coords.y][coords.x] = type;
            nodeDiv.textContent = type;

            // Ends game if it's over or just finishes turn
            GameLogic.endTurn(board, type, coords.x, coords.y);

        };

        // Disable all board nodes by replacing a board with it's clone where all
        // event listeners are disabled
        const disableBoard = () => {

            const board = document.querySelector(".board");
            const boardClone = board.cloneNode(true);

            board.parentNode.replaceChild(boardClone, board);
        };

        return {createBoard, disableBoard};

    })();

    const startGame = () => {
        GameLogic.showInitialScreen();
    }

    return {startGame}
})();

Game.startGame();