const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let player = { x: 50, y: 300, width: 30, height: 30, speed: 5, dx: 0, dy: 0 };
let gravity = 1;
let jumpPower = -15;
let isJumping = false;
let level = 1;

const platforms = [
  // Array of levels with platforms
  [
    { x: 0, y: 350, width: 800, height: 20 },
    { x: 200, y: 250, width: 100, height: 20 },
    { x: 400, y: 200, width: 100, height: 20 },
    { x: 600, y: 150, width: 100, height: 20 },
  ],
  // Levels 2-10 can follow the same pattern with different platform configurations.
];

// Set up goal
let goal = { x: 700, y: 100, width: 20, height: 20 };

function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = 'green';
  platforms[level - 1].forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawGoal() {
  ctx.fillStyle = 'gold';
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

function movePlayer() {
  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Prevent going off-screen
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // Platform collision
  platforms[level - 1].forEach(platform => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y
    ) {
      if (player.dy > 0) {
        player.y = platform.y - player.height;
        player.dy = 0;
        isJumping = false;
      }
    }
  });

  // Goal collision
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    level++;
    if (level > platforms.length) {
      alert('You won the game!');
      level = 1;
    }
    resetLevel();
  }

  // Prevent falling off the screen
  if (player.y > canvas.height) {
    resetLevel();
  }
}

function resetLevel() {
  player.x = 50;
  player.y = 300;
  player.dx = 0;
  player.dy = 0;
}

function handleKeyDown(e) {
  if (e.key === 'ArrowRight') player.dx = player.speed;
  if (e.key === 'ArrowLeft') player.dx = -player.speed;
  if (e.key === 'ArrowUp' && !isJumping) {
    player.dy = jumpPower;
    isJumping = true;
  }
}

function handleKeyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawGoal();
  drawPlayer();
  movePlayer();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

update();
