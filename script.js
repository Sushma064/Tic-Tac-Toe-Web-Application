const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");

const playerScoreElement = document.getElementById("playerScore");
const aiScoreElement = document.getElementById("aiScore");
const drawScoreElement = document.getElementById("drawScore");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let playerScore = 0;
let aiScore = 0;
let drawScore = 0;

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", playerMove);
});

function playerMove(event) {

    const index = event.target.dataset.index;

    if (!gameActive || board[index] !== "") {
        return;
    }

    board[index] = "X";

    event.target.textContent = "X";
    event.target.classList.add("x");

    if (checkWinner("X")) {
        playerScore++;
        playerScoreElement.textContent = playerScore;
        statusText.textContent = "🎉 You Win!";
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        drawScore++;
        drawScoreElement.textContent = drawScore;
        statusText.textContent = "🤝 It's a Draw!";
        gameActive = false;
        return;
    }

    statusText.textContent = "AI is thinking...";

    setTimeout(aiMove, 500);
}

function aiMove() {

    if (!gameActive) {
        return;
    }

    let emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    /*
       AI first tries to win.
    */

    let bestMove = findBestMove("O");

    /*
       If AI cannot win, block the player.
    */

    if (bestMove === -1) {
        bestMove = findBestMove("X");
    }

    /*
       If no winning/blocking move,
       choose a random empty cell.
    */

    if (bestMove === -1) {
        bestMove =
            emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    board[bestMove] = "O";

    cells[bestMove].textContent = "O";
    cells[bestMove].classList.add("o");

    if (checkWinner("O")) {
        aiScore++;
        aiScoreElement.textContent = aiScore;
        statusText.textContent = "🤖 AI Wins!";
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        drawScore++;
        drawScoreElement.textContent = drawScore;
        statusText.textContent = "🤝 It's a Draw!";
        gameActive = false;
        return;
    }

    statusText.textContent = "Your Turn";
}

function findBestMove(symbol) {

    for (let pattern of winningPatterns) {

        const [a, b, c] = pattern;

        const values = [
            board[a],
            board[b],
            board[c]
        ];

        const symbolCount =
            values.filter(value => value === symbol).length;

        const emptyCount =
            values.filter(value => value === "").length;

        if (symbolCount === 2 && emptyCount === 1) {

            if (board[a] === "") return a;
            if (board[b] === "") return b;
            if (board[c] === "") return c;
        }
    }

    return -1;
}

function checkWinner(symbol) {

    for (let pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] === symbol &&
            board[b] === symbol &&
            board[c] === symbol
        ) {

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            return true;
        }
    }

    return false;
}

function checkDraw() {

    return board.every(cell => cell !== "");
}

resetButton.addEventListener("click", resetGame);

function resetGame() {

    board = ["", "", "", "", "", "", "", ""];

    gameActive = true;

    statusText.textContent = "Your Turn";

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );
    });
}