const scoreDisplay = document.querySelector(".high-score");
const reset = document.querySelector(".reset");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

let score = 0;
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 8, 20);
}

let highScore = parseInt(localStorage.getItem("highScore"));

if (isNaN(highScore)) {
  highScore = 0;
}

scoreDisplay.innerHTML = `High Score: ${highScore}`;

reset.addEventListener("click", () => {
  localStorage.setItem("highScore", "0");
  score = 0;
  scoreDisplay.innerHTML = `High Score: 0`;
  drawBricks();
});

//////Making the Paddle move////
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownMover);
document.addEventListener("keyup", keyUpMover);

function keyDownMover(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpMover(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function movePaddle() {
  if (rightPressed) {
    paddle.x += 7;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  } else if (leftPressed) {
    paddle.x -= 7;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}

/////Ball Making////

let speed = 4;

let ball = {
  x: canvas.height / 2,
  y: canvas.height - 50,
  dx: speed,
  dy: -speed + 1,
  radius: 7,
  speed: 9,
  draw: function () {
    const drawImage = () => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
    };
    ctx.beginPath();
    //ctx.fillStyle = randomColor();
    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  },
};

/////Paddle Making////

let paddle = {
  height: 10,
  width: 70,
  x: canvas.width / 2 - 76 / 2,
  draw: function () {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    //ctx.fillStyle = randomColor();
    ctx.fillStyle = "black";
    ctx.closePath();
    ctx.fill();
  },
};

////PLAY FUNCTION///

function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  ball.draw();
  paddle.draw();
  movePaddle();
  collisionDetection();
  levelUp();
  drawScore();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // reset score
  if (ball.y + ball.radius > canvas.height) {
    if (score > parseInt(localStorage.getItem("highScore"))) {
      localStorage.setItem("highScore", score.toString());
      scoreDisplay.innerHTML = `High Score: ${score}`;
    }
    score = 0;
    generateBricks();
    ball.dx = speed;
    ball.dy = -speed + 1;
  }

  // Bounce off paddle
  if (
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.y + ball.radius >= canvas.height - paddle.height
  ) {
    ball.dy *= -1;
  }

  requestAnimationFrame(play);
}

//////Making Bricks/////
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 20;
let brickOffsetTop = 30;
let brickOffsetLeft = 35;

let bricks = [];

function generateBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.fillStyle = randomColor();
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
        //ctx.fillStyle = ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          ball.x >= b.x &&
          ball.x <= b.x + brickWidth &&
          ball.y >= b.y &&
          ball.y <= b.y + brickHeight
        ) {
          ball.dy *= -1;
          b.status = 0;
          score++;
        }
      }
    }
  }
}

function levelUp() {
  if (score % 15 == 0 && score != 0) {
    if (ball.y > canvas.height / 2) {
      generateBricks();
    }

    if (gameLevelUp) {
      if (ball.dy > 0) {
        ball.dy += 1;
        gameLevelUp = false;
      } else {
        ball.dy -= 1;
        gameLevelUp = false;
      }
      console.log(ball.dy);
    }
  }

  if (score % 15 != 0) {
    gameLevelUp = true;
  }
}

///////Execution of Code /////
generateBricks();
play();

function randomColor() {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  console.log(bgColor);
  return bgColor;
}

function setBg() {
  document.body.style.background = randomColor();
}

setInterval(setBg, 1000);

random_bg_color();

/////////////////////////////////
