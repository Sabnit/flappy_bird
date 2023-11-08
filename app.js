//Element reference
const playAgain = document.getElementById("overlay");
const scoreNumber = document.getElementById("score-number");
const bestNumber = document.getElementById("best-number");

//Constants
const velocityX = -3; //pipe moving left speed
const gravity = 0.4;

//Variables
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let velocityY = 0;
let gameOver = false;
let score = 0;
let highscore = 0;

//Bird variables
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

//Pipe variables
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//Sound variables
let mysound = new Audio("./audio/sound.wav");

//Bird object
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//Initialization Function
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //load image
  birdImg = new Image();
  birdImg.src = "./images/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./images/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

// Function for updating the game state
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);

  if (bird.y > boardHeight) {
    gameOver = true;
  }

  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    //Adding score
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }
    if (pipe.passed) {
      mysound.play();
    }
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }
  //score
  context.fillStyle = "black";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  //function to display gameover dashboard
  if (gameOver) {
    context.fillText("Gameover", boardWidth / 4, 100);
    playAgain.style.display = "block";
    scoreNumber.innerHTML = score;
    if (score > highscore) {
      highscore = score;
      bestNumber.innerHTML = score;
    }
  }
}

//function for placing pipes
function placePipes() {
  //if gameover it stops the placePipes function
  if (gameOver) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let toppipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(toppipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

//Function for moving bird
function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp") {
    velocityY = -6;
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
      playAgain.style.display = "none";
    }
  }
}

//function for collision detection
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

//function for what happens when it's gameover
function startGame() {
  bird.y = birdY;
  pipeArray = [];
  score = 0;
  gameOver = false;
  playAgain.style.display = "none";
}
