const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WHITE = '#FFFFFF';
const RED = '#FF0000';
const GREEN = '#00FF00';
const BLUE = '#0000FF';
const ORANGE = '#FFA500'; // For messages

const WIDTH = 640;
const HEIGHT = 480;

const GRID_SIZE = 20;
const GRID_WIDTH = WIDTH / GRID_SIZE;
const GRID_HEIGHT = HEIGHT / GRID_SIZE;

let lives = 3; // Player starts with 3 lives

class Snake {
    constructor() {
        this.positions = [{x: 5, y: 5}];
        this.direction = {x: 0, y: 1};
        this.grow = false;
    }

    update() {
        let head = {...this.positions[0]};
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Make snake wrap around the screen
        if (head.x >= GRID_WIDTH) head.x = 0;
        if (head.y >= GRID_HEIGHT) head.y = 0;
        if (head.x < 0) head.x = GRID_WIDTH - 1;
        if (head.y < 0) head.y = GRID_HEIGHT - 1;

        if (this.grow) {
            this.positions.unshift(head);
            this.grow = false;
        } else {
            this.positions.unshift(head);
            this.positions.pop();
        }
    }


        changeDirection(newDirection) {
            if (this.direction.x + newDirection.x === 0 && this.direction.y + newDirection.y === 0) {
                return;
            }
            this.direction = newDirection;
        }

        growSnake() {
            this.grow = true;
        }

        collidesWithItself() {
            for (let i = 1; i < this.positions.length; i++) {
                if (this.positions[i].x === this.positions[0].x && this.positions[i].y === this.positions[0].y) {
                    return true;
                }
            }
            return false;
        }
    }

    class Food {
        constructor() {
            this.position = {x: getRandomInt(0, GRID_WIDTH - 1), y: getRandomInt(0, GRID_HEIGHT - 1)};
            this.randomize();
        }

        randomize() {
            while (snake.positions.some(pos => pos.x === this.position.x && pos.y === this.position.y)) {
                this.position = {x: getRandomInt(0, GRID_WIDTH - 1), y: getRandomInt(0, GRID_HEIGHT - 1)};
            }
        }
    }

    function drawGrid() {
        for (let x = 0; x < WIDTH; x += GRID_SIZE) {
            ctx.strokeStyle = WHITE;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, HEIGHT);
            ctx.stroke();
        }

        for (let y = 0; y < HEIGHT; y += GRID_SIZE) {
            ctx.strokeStyle = WHITE;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(WIDTH, y);
            ctx.stroke();
        }
    }

    function drawSnake() {
        for (let segment of snake.positions) {
            ctx.fillStyle = GREEN;
            ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    function drawFood() {
        ctx.fillStyle = RED;
        ctx.fillRect(food.position.x * GRID_SIZE, food.position.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    window.snake = new Snake();
    window.food = new Food();

    const DIRECTION_MAP = {
        ArrowUp: {x: 0, y: -1},
        ArrowDown: {x: 0, y: 1},
        ArrowLeft: {x: -1, y: 0},
        ArrowRight: {x: 1, y: 0}
    };

    let score = 0;
    let level = 1;

    let message = null; // Holds the current message to be displayed
    let messageTimeout = null; // Timer to clear the message

    function drawInitialState() {
        ctx.fillStyle = BLUE;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        drawGrid();
        drawFood(); // Snake will be drawn once the game starts
    }
    
    
    function showMessage(message, duration) {
        return new Promise(resolve => {
            ctx.fillStyle = BLUE;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
            // Display the initial game state
            drawInitialState();
    
            // Display the message
            ctx.font = '48px Arial';
            ctx.fillStyle = WHITE;
            ctx.textAlign = 'center';
            ctx.fillText(message, WIDTH / 2, HEIGHT / 2);
    
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }
    
    
    function drawMessage() {
        if (message) {
            ctx.fillStyle = message.color;
            ctx.font = "30px Arial";
            ctx.fillText(message.text, WIDTH/2 - ctx.measureText(message.text).width/2, HEIGHT/2);
        }
    }
    
    function gameLoop() {
        ctx.fillStyle = BLUE;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
        drawGrid();
        drawSnake();
        drawFood();
        drawMessage(); // Draw the current message if there's any
    
        snake.update();
    
        if (snake.positions[0].x === food.position.x && snake.positions[0].y === food.position.y) {
            snake.growSnake();
            food.randomize();
            score += 10;
    
            if (score >= level * 100) {
                level += 1;
                if (level > 10) {
                    level = 10;
                }
                showMessage(`Level Up! Level: ${level}`, ORANGE);
            }
    
            document.title = `Azure Bytes: Pixel Pursuit | Score: ${score} | Level: ${level}`;
        }
    
        if (snake.collidesWithItself()) {
            lives--;
            if (lives <= 0) {
                showMessage("Game Over!", RED);
                return; // Game over, stop updating
            } else {
                showMessage(`Lost a life! Lives left: ${lives}`, RED);
                snake = new Snake();
                food = new Food();
                score = 0;
                level = 1;
            }
        }
    
        setTimeout(gameLoop, 1000 / (10 + level));
    }

    document.addEventListener('keydown', event => {
        if (DIRECTION_MAP[event.key]) {
            snake.changeDirection(DIRECTION_MAP[event.key]);
        }
    });

    function startGame() {
        drawInitialState();
        showMessage("Ready", 1000)
        .then(() => showMessage("Start!", 1000))
        .then(() => gameLoop());
    }

    startGame();