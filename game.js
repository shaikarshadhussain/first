const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;

const PLAYER_X = 20;
const AI_X = WIDTH - PADDLE_WIDTH - 20;

let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '40px Arial';
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle within bounds
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT;
});

function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

let playerScore = 0;
let aiScore = 0;

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY *= -1;
    }

    // Left paddle collision
    if (collision(ballX, ballY, BALL_SIZE, BALL_SIZE, PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
        ballSpeedX *= -1;
        // Add some spin based on where the ball hits the paddle
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.25;
        ballX = PLAYER_X + PADDLE_WIDTH;
    }

    // Right paddle (AI) collision
    if (collision(ballX, ballY, BALL_SIZE, BALL_SIZE, AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
        ballSpeedX *= -1;
        // Add some spin based on where the ball hits the paddle
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.25;
        ballX = AI_X - BALL_SIZE;
    }

    // AI movement
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += 5;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= 5;
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > HEIGHT) aiY = HEIGHT - PADDLE_HEIGHT;

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + BALL_SIZE > WIDTH) {
        playerScore++;
        resetBall();
    }
}

function render() {
    // Clear
    drawRect(0, 0, WIDTH, HEIGHT, '#111');

    // Net
    for (let i = 0; i < HEIGHT; i += 30) {
        drawRect(WIDTH / 2 - 2, i, 4, 20, '#444');
    }

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');

    // Ball
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, '#fff');

    // Score
    drawText(playerScore, WIDTH / 2 - 60, 50, '#fff');
    drawText(aiScore, WIDTH / 2 + 30, 50, '#fff');
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();