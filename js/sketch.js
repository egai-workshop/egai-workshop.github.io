let groundY; // Y position of the ground
let obstacleWidth = 15; // Width of each obstacle
let obstacleGap = 50; // Gap between obstacles
let obstacles = []; // Array to hold all obstacles
let obstacleSpeed = 4; // Speed at which obstacles move
let obstacleTexts = ["ECHO CHAMBERS", "TOXICITY", "BIAS", "HARASSMENT", "DISCRIMINATION", "CHEATING", "METAGAMING"]; // Texts to display on obstacles


let player; // Object to hold player position and size
let playerJumping = false; // Flag to check if player is jumping
let playerJumpHeight = 100; // Height of player jump
let playerJumpSpeed = 50; // Speed of player jump
let playerGravity = 0.5; // Strength of gravity

let spacePressed = false; // Flag to check if spacebar is pressed
let gameState = 'start'; // Set initial game state to 'start'


let happyCodingFont;

function preload() {
  happyCodingFont = loadFont('https://happycoding.io/fonts/happycoding/happycoding.ttf');

}

function windowResized() {
  var divHeight = document.getElementById('welcome').clientHeight;
  var divWidth = document.getElementById('welcome').clientWidth;
  resizeCanvas(divWidth*0.9, divHeight);
  groundY = divHeight - 25; // Set ground Y position

}

function setup() {
  var divHeight = document.getElementById('welcome').clientHeight;
  var divWidth = document.getElementById('welcome').clientWidth;
  
  var canvas = createCanvas(divWidth*0.9, divHeight);
  canvas.parent("sketch-container");

  canvas.mouseClicked( function() {
    if (gameState === 'start') {
      gameState = 'playing';
      loop(); // Start the game loop
    } 
  });
  
  groundY = divHeight - 25; // Set ground Y position
  rectMode(CENTER);
  strokeWeight(0.0);

  // Initialize player object
  player = {
    x: 100,
    y: groundY - 75,
    w: 20,
    h: 20,
    vy: 0 // Y velocity of the player
  };
}

function checkCollisions() {
  // Check for collisions between player and obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];
    if (player.x + player.w/2 >= o.x - obstacleWidth/2 && player.x - player.w/2 <= o.x + obstacleWidth/2) {
      if (player.y + player.h/2 >= o.y - o.h/2) {
        // Collision detected
        return true;
      }
    }
  }
  return false;
}

function draw() {
  background(220);

  // Draw "Click to start" message if game has not started
  if (gameState === 'start') {
    textFont(happyCodingFont);
    fill(100,100,100);

    textAlign(CENTER);
    textSize(38);
    text("CLICK TO START", width/2, height/2);
    return; // Exit draw function without running rest of code
  } else if (gameState === 'playing') {

     // Draw the ground
    fill(192,192,192);
    rect(width/2, groundY, width, 50);
    
    // Add a new obstacle if necessary
    if (frameCount % obstacleGap == 0) {
      let obstacleHeight = random(35, 70);
      let obstacleText = obstacleTexts[floor(random(obstacleTexts.length))];

      obstacles.push({x: width + obstacleWidth/2, y: groundY - obstacleHeight/2, h: obstacleHeight,  text: obstacleText});
    }
    
    // Move and draw all obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= obstacleSpeed;
      fill(128,128,128);
      rect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacles[i].h);
      textSize(18);
      textAlign(CENTER, TOP);
      fill(0);
      text(obstacles[i].text, obstacles[i].x, obstacles[i].y + obstacles[i].h/2 + 8);
      // Remove obstacles that are off the screen
      if (obstacles[i].x < -obstacleWidth/2) {
        obstacles.splice(i, 1);
      }
    }

    // Apply gravity to player
    player.vy += playerGravity;
    player.y += player.vy;
    
    // Prevent player from going through the ground
    if (player.y >= groundY - player.h/2) {
      player.y = groundY - player.h/2;
      playerJumping = false;
      player.vy = 0; // Reset player velocity when hitting the ground
      spacePressed = false; // Allow spacebar press after landing
    }

    // Draw the player
    push();
    fill(175);
    strokeWeight(0.1 );
    stroke(0);
    ellipse(player.x, player.y, player.w, player.h);
    pop();

    // Check for collisions
    if (checkCollisions()) {
      textFont(happyCodingFont);

      // Handle collision
      fill(100, 100, 100);

      textSize(64);
      textAlign(CENTER, CENTER);
      text("GAME OVER", width/2, height/2.5);
      textSize(36);
      text("CLICK TO RESTART", width/2, height/2 + 10);
      gameState = 'start';
      obstacles = [];
      // player = {
      //   x: 100,
      //   y: groundY - 75,
      //   w: 30,
      //   h: 30
      // };
      score = 0;
      spacePressed = false;
      noLoop();
    }
  }
  
}

function keyPressed() {
    // Check for player jump
    if (keyCode === 32 && !playerJumping && !spacePressed) {
      playerJumping = true;
      spacePressed = true;
      player.vy = -playerJumpHeight/10; // Set player velocity to jump height
    }
    return false;
}