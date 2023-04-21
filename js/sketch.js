let groundY; // Y position of the ground
let obstacleWidth = 15; // Width of each obstacle
let obstacleGap = 50; // Gap between obstacles
let obstacles = []; // Array to hold all obstacles
let obstacleSpeed = 4; // Speed at which obstacles move
let obstacleTexts = ["ECHO CHAMBERS", "TOXICITY", "BIAS", "HARASSMENT", "DISCRIMINATION", "CHEATING", "UNFAIRNESS", "MANIPULATION"]; // Texts to display on obstacles
let obstaclesUsed = []; // Array to hold all used obstacles

let player; // Object to hold player position and size
let playerJumping = false; // Flag to check if player is jumping
let playerJumpHeight = 150; // Increased jump height
let playerJumpSpeed = 15; // Reduced jump speed
let playerJumpDuration = 0;
let playerGravity = 0.8; // Increased gravity strength

let spacePressed = false; // Flag to check if spacebar is pressed

let gameState = 'start'; // Set initial game state to 'start'

let score = 0;

var pScore = 0;

let happyCodingFont;

function preload() {
  happyCodingFont = loadFont('https://happycoding.io/fonts/happycoding/happycoding.ttf');
  PixelColeco = loadFont('https://fonts.cdnfonts.com/s/32398/TheGoodMonolith.woff'); 

}

function setup() {
  textFont(happyCodingFont);

  var divHeight = document.getElementById('welcome').clientHeight;
  var divWidth = document.getElementById('welcome').clientWidth;
  
  var canvas = createCanvas(divWidth*0.9, divHeight);
  canvas.parent("sketch-container");
  var c = select('#sketch-container');

  canvas.mousePressed( function() {
    if (gameState === 'start') {
      gameState = 'playing';
      c.addClass('playing');
      loop(); // Start the game loop
    } else if (gameState === 'playing') {
      // Mouseclick / Tap controls
      if (!playerJumping && !spacePressed) {
        playerJumping = true;
        spacePressed = true;
        player.vy = -playerJumpHeight/10; // Set player velocity to jump height
      }

    }
  });

  groundY = divHeight - 25; // Set ground Y position
  rectMode(CENTER);
  strokeWeight(0.0);

  // Initialize player object
  player = new Player(100, groundY - 75, 20, 20, 0);
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
    fill(100,100,100);

    textAlign(CENTER);
    textSize(38);
    text("CLICK TO START", width/2, height/2);
    return; // Exit draw function without running rest of code
  } else if (gameState === 'playing') {

    // display the score
    push();
    fill(52,52,52);
    textAlign(CENTER, TOP);
    textSize(16);
    textStyle(BOLD);
    scoreText = "SCORE: ";
    textFont(PixelColeco);
    text(scoreText + score, 40, 5);
    pop();

    // Draw the ground
    fill(192,192,192);
    rect(width/2, groundY, width, 50);
    
    // Add a new obstacle if necessary
    if (frameCount % obstacleGap == 0) {
      let obstacleHeight = random(35, 70);
      let obstacleText = getRandomObstacleText();
      // {x: width + obstacleWidth/2, y: groundY - obstacleHeight/2, h: obstacleHeight,  text: obstacleText, passed: false}
      obstacles.push( new Obstacle( width + obstacleWidth/2, groundY - obstacleHeight/2, obstacleWidth, obstacleHeight, obstacleText) );
    }
    
    // Move and draw all obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let o = obstacles[i];
      o.x -= obstacleSpeed;
      o.show();
      // increment score if obstacle behind player
      if (o.x < player.x && o.passed === false) {
        o.passed = true;
        score++;
      }
      // Remove obstacles that are off the screen
      if (o.x < -obstacleWidth/2) {
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
    player.show();

    // Check for collisions
    if (checkCollisions()) {
      // Handle collision
      fill(100, 100, 100);

      textSize(64);
      textAlign(CENTER, CENTER);
      text("GAME OVER", width/2, height/2.5);
      textSize(36);
      text("CLICK TO RESTART", width/2, height/2 + 10);
      gameState = 'start';
      obstacles = [];
      score = 0;
      spacePressed = false;
      var c = select('#sketch-container');

      c.removeClass('playing');

      noLoop();
    }

  }
  
}

function keyPressed() {
    // Check for player jump
    if (keyCode === 32 && !playerJumping && !spacePressed) {
      playerJumpDuration = 0;
      playerJumping = true;
      spacePressed = true;
      player.vy = -playerJumpSpeed; // Set player velocity to jump speed
    }
    // return false;
}

function keyReleased() {
  if (keyCode === 32 && playerJumping) {
    playerJumping = false;
    playerJumpHeight = map(playerJumpDuration, 0, 500, 0, 20);
    // player.jump(jumpHeight);
  }
  return false
}

function getRandomObstacleText() {
  // Check if all obstacles have been used
  if (obstaclesUsed.length === obstacleTexts.length) {
    // Reset used obstacles array
    obstaclesUsed = [];
  }
  
  // Get a random obstacle text that has not been used yet
  let obstacleText;
  do {
    obstacleText = obstacleTexts[floor(random(obstacleTexts.length))];
  } while (obstaclesUsed.includes(obstacleText));
  
  // Add used obstacle to array
  obstaclesUsed.push(obstacleText);
  
  return obstacleText;
}

function windowResized() {
  var divHeight = document.getElementById('welcome').clientHeight;
  var divWidth = document.getElementById('welcome').clientWidth;
  resizeCanvas(divWidth*0.9, divHeight);
  groundY = divHeight - 25; // Set ground Y position

}

class Player {

  constructor(x, y, w, h, vy) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vy = vy; // Y velocity of the player
  }

  show() {
    // Draw the player
    push();
    fill(175); // Player colour fill
    strokeWeight(0.1); // Outline thickness
    stroke(0); // Outline colour
    ellipse(this.x, this.y, this.w, this.h); // Player shape
    pop();
  }
}
// {x: width + obstacleWidth/2, y: groundY - obstacleHeight/2, h: obstacleHeight,  text: obstacleText, passed: false}
class Obstacle {

  constructor(x, y, w, h, text) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.passed = false;
  }

  show() {
    // Draw the obstacle
    fill(128,128,128);
    rect(this.x, this.y, this.w, this.h);
    textSize(18);
    textAlign(CENTER, TOP);
    fill(0);
    text(this.text, this.x, this.y + this.h/2 + 8);
  }
}