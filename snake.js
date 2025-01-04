const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById('score');
const highScoretext = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = "right";
let nextDirection = "right"; // New variable to prevent abrupt direction changes
let gameInterval;
let gameSpeedDelay = 400;
let gameStarted = false;
let highScore = 0;


// Draw game map, snake, food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw Snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if(gameStarted){const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);}
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };

  // Update direction based on the nextDirection
  direction = nextDirection;

  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }

  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    gameSpeedDelay = Math.max(100, gameSpeedDelay - 20); // Speed up but cap at a minimum delay
    clearInterval(gameInterval); // Clear the existing interval
    gameInterval = setInterval(() => {
      move();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }

  // Check for collisions with walls or itself
  checkCollision();
}

// Collision detection
function checkCollision() {
  const head = snake[0];

  // Check wall collision
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  // Check self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}


// Start Game function
function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    draw();
  }, gameSpeedDelay);
}

// Keypress listener
function handleKeyPress(event) {
  if (!gameStarted && event.code === "Space") {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "down") nextDirection = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") nextDirection = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") nextDirection = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") nextDirection = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function resetGame (){
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
 direction = "right";
 nextDirection = "right"; 
 gameSpeedDelay = 400;

 updateScore();
}


//to update hight scoore
function updateScore(){
  const currentScore = snake.length -1;
  score.textContent = currentScore.toString().padStart(3,'0');

}

function stopGame(){
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";logo.style.display = "block";

}

//hight score
function updateHighScore(){
  const currentScore = snake.length -1;
  if (currentScore > highScore){
    highScore = currentScore
    highScoretext.textContent = highScore.toString().padStart(3,'0');
  }
  highScoretext.style.display = 'block';
}

