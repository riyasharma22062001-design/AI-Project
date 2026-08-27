const board = Array(9).fill(nul);
let currentPlayer = 'X'; 
let gameActive = true;
let status = document.getElementById('status');
let cells = document.querySelectorAll('.cell');
let restartBtn = document.getElementById('restart');
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols  
    [0, 4, 8], [2, 4, 6] 
];
function checkWinner(player) {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}
function isTie() {
    return board.every(cell => cell !== null);
}
function updateStatus() {
    if (!gameActive) return;
    if (checkWinner('X')) {
        status.textContent = 'You win!';
        highlightWinner('X');
        gameActive = false;
    } else if (checkWinner('O')) {
        status.textContent = `AI wins!`;
        highlightWinner('O');
        gameActive = false;
    } else if (isTie()) {
        status.textContent = 'Tie game!';
        gameActive = false;
    } else if (currentPlayer === 'X') {
        status.textContent = 'Your turn (X)';
    } else {
        status.textContent = 'AI thinking...';
        setTimeout(aiMove, 500); // Slight delay for UX
    }
}
function highlightWinner(player)
{
    for (let condition of winningConditions) {
        if (condition.every(index => board[index] === player)) {
            condition.forEach(index => cells[index].classList.add('winner'));
            return;
        }
    }
}
function handleClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;
    if (board[index] || currentPlayer !== 'X' || !gameActive) return;
    board[index] = 'X';
    cell.textContent = 'X';
    cell.classList.add('x');
    currentPlayer = 'O';
    updateStatus();
}
function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(0, false, -Infinity, Infinity);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}
function minimax(depth, isMaximizing, alpha, beta) {
if (checkWinner('O')) return 10 - depth;

if (checkWinner('X')) return depth - 10;

    if (isTie()) return 0;

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(depth + 1, false, alpha, beta);
                board[i] = null;
                maxScore = Math.max(score, maxScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(depth + 1, true, alpha, beta);
                board[i] = null;
                minScore = Math.min(score, minScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }
        return minScore;
  
    }
}
function aiMove() {
    if (!gameActive || currentPlayer !== 'O') return;
    const moveIndex = bestMove();
    board[moveIndex] = 'O';
    cells[moveIndex].textContent = 'O';
    cells[moveIndex].classList.add('o');
    currentPlayer = 'X';
    updateStatus();
}
function restartGame() {
    board.fill(null);
    currentPlayer = 'X';
    gameActive = true;
    status.textContent = 'Your turn (X)';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    }); 
}
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
updateStatus(); 
