// Hey guys, I have heavily commented snake.js file for you to undertand everything
// Please add your questions/comments/feedback in the comments below.
// 1. Initialization
//This line gets a reference to the HTML5 Canvas element in your HTML document.
const canvas = document.getElementById('game');
// This line retrieves the 2D rendering context of the Canvas. 
const context = canvas.getContext('2d');

 // Eating and Collision Sound added
// Updated for sound effects on December 18th, 2023.
const collisionSound = document.getElementById('collisionSound');
const eatingSound = document.getElementById('eatingSound');

// grid of the game canvas is composed of 16 square cells.
let grid = 16;
// count in the game loop initially set to 0
let count = 0;
// score also initially is set to zero
let score = 0;

// version 1.2 adding a boolean to track gem eaten
let gemEaten = false;

// version 1.2 adding allowance counter
let allowanceCounter = 0;

// This is a snake object created 
// x is the x coordination of the snake on the canvas, and initially is set to 160
// y is the y coordination of the snake on the canvas, and initially is set to 160
// dx is the horizontal velocity of the snake, this is set to grid: the snake moves by the size of one grid cell horizontally
// dy is the vertical velocity of the snake's velocity, and its value is set to zero, which means that the snake is currently is moving horizontally.
// cells is an empty array, where we will store inside it all of the snake segments [indivdual cells].
// The maxCells is set to 4, this is the maximum number of cells in the snake's body.
let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

// gem object has its x and y coordinates on the grid, both set to 320
let gem = {
  x: 320,
  y: 320
};

// Function to generate random integers
// between a min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// gameRunning is a boolean value set to false initially 
let gameRunning = false;
// gamePaused also is a boolean value set to false initially
let gamePaused = false;

//The requestAnimationFrame() method tells the browser to call an animation function and repeat it very fast, forever

//  (animationFrame) variable is used to store the ID returned by the requestAnimationFrame function, which is part of the game loop mechanism. 

//  This ID can be used later to cancel the animation frame if needed, for example, when the game ends or is paused.
let animationFrame;
let startButton = document.querySelector('.start-button');
let gameOverScreen = document.querySelector('.game-over');
let scoreDisplay = document.querySelector('.score-display');

// Actual game start even, and that should be the last thing
startButton.addEventListener('click', function() {
  // Sanity Check:
  // console.log("button is clicked!");
 startGame();
});

gameOverScreen.querySelector('.start-button').addEventListener('click', function() {
  // 4. Start Game Function (for restarting after game over)
  startGame();
});

// 2. Event Listeners Setup
let touchStartX = 0;
let touchStartY = 0;

//this part is an event listener attached to the keydown 
//event on the document object. 
//It listens for keyboard events, and the associated 
//callback function handles the 
//logic when a key is pressed.

document.addEventListener('keydown', function(e) {
    // 6. Event Listeners Callbacks (Keyboard)
  if (!gameRunning) {
    return;
  }
// Snake movement based on arrow keys. Here if the game is running, it checks the value of 
// e.which to determine whicha arrow key was pressed, not only which key was pressed, but also 
// the current direction of the snake dx and dy:
// it updates the snake's velocity the snake is restricted from moving in the opposite direction 
// immediately, it's not allowed to reverse direction
// CODE 37 : LEFT KEY
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
// CODE 38 : UP KEY
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
// CODE 39 : RIGHT KEY
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
// CODE 40 : DOWN KEY
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }

  // CODE 32: SPACEBAR
  if (e.which === 32) { // 32 is the keycode for the spacebar
    gamePaused = !gamePaused;
    // Optionally, you can display a pause message on the screen
    context.fillStyle = '#fff';
    context.font = 'bold 30px Arial';
    if (gamePaused) {
      context.fillText('Game Paused', canvas.width / 2 - 100, canvas.height / 2);
    } else {
      // Resume the game
      animationFrame = requestAnimationFrame(loop);
    }
  }
});


/////////////////////////////////////////////////////////////////////
// 6. Event Listeners Callbacks (Touch Screen For Smartphone Version)
/////////////////////////////////////////////////////////////////////

// This line says, "When a touchstart event happens on the document (webpage), do the following..."
// we're going to have a callback function that takes an event as input, and checks if 
// the game is not running, it returns and nothing of the following code will be executed.
// This is a safety check to ensure that touch events are happening when game is active.
document.addEventListener('touchstart', function(e) {
  if (!gameRunning) {
    return;
  }
//If the game is running, this part captures the x and y coordinates of the first touch point. e.touches[0] refers 
//to the first touch point in the touch event, and clientX and clientY give the horizontal and vertical coordinates of 
//where the touch occurred on the screen.
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  // "When someone touches the screen (touchstart event), and the game is running, remember where they started 
  // touching by storing the x and y coordinates of the first touch." 
  // This information is often used to track gestures or movements on touch devices, 
  //such as swiping or tapping, which can then be used in game controls or other interactions.
});

document.addEventListener('touchmove', function(e) {
  // 6. Event Listeners Callbacks (Touch)
  if (!gameRunning) {
    return;
  }

  // Swipe detection and snake movement
  let touchEndX = e.touches[0].clientX;
  let touchEndY = e.touches[0].clientY;
  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0 && snake.dx === 0) {
      snake.dx = grid;
      snake.dy = 0;
    } else if (dx < 0 && snake.dx === 0) {
      snake.dx = -grid;
      snake.dy = 0;
    }
  } else {
    // Vertical swipe
    if (dy > 0 && snake.dy === 0) {
      snake.dy = grid;
      snake.dx = 0;
    } else if (dy < 0 && snake.dy === 0) {
      snake.dy = -grid;
      snake.dx = 0;
    }
  }
});

////////////////////////////////////
//END of TOUCHSCREEN FUNCTIONALITIES
////////////////////////////////////

// 3. Main Loop Event / Function
function loop() {
  if (!gameRunning || gamePaused) {
    return;
  }
// version 1.2 - check if allowance period is over
if (gemEaten){
	allowanceCounter++;
	// check if the allowance period is over
	if (allowanceCounter >=100){
		gemEaten = false;
		allowanceCounter = 0;
	}
}	
  // Note about animation frame is in a seperate file
  animationFrame = requestAnimationFrame(loop);

  // Control game loop speed
  if (++count < 100) {
    return;
  }
  count = 95;

  // Game logic and rendering
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Wrap snake position on screen edges
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // Update snake cells and handle collisions
  // { x: snake.x, y: snake.y } represents the current position of the snake's head. 
  // The unshift() method is used to add this position to the front of the snake.
  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // Draw the gems and the snake
  context.fillStyle = '#fff';
  context.fillRect(gem.x, gem.y, grid - 1, grid - 1);
	
  // Set shadow properties
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 5;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  // Version 1.2 - when gem is eaten, changing the color from 138(white) to F00(yellow)	
  // context.fillStyle = '#061138';
 context.fillStyle = gemEaten ? '#FFFF00' : '#061138';

  // Eating the gem logic.
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    if (cell.x === gem.x && cell.y === gem.y) {
      // Snake eats gem
      snake.maxCells++;
      score++;
      scoreDisplay.textContent = score;
	    
      // Play eating sound
      eatingSound.play();
      
     // Generate a new random gem position
      gem.x = getRandomInt(0, 25) * grid;
      gem.y = getRandomInt(0, 25) * grid;
    // New - Set gemEaten to true to initiate the allowance period
      gemEaten = true;
    }

    // Check for collisions with the snake's own body
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        // End the game
        endGame();
	// Play sound of collision
	collisionSound.play();
      }
    }
  });
}

// 4. Start Game Function
function startGame() {
  if (gameRunning) {
    return;
  }
  gameRunning = true;
  gamePaused = false;
  score = 0;
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  gem.x = getRandomInt(0, 25) * grid;
  gem.y = getRandomInt(0, 25) * grid;
  startButton.style.display = 'none';
  gameOverScreen.style.display = 'none';
  scoreDisplay.textContent = score;

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  animationFrame = requestAnimationFrame(loop);
}

// 5. End Game Function
function endGame() {
  gameRunning = false;
  gamePaused = true;
  gameOverScreen.style.display = 'block';
  document.querySelector('.game-over .score-display').textContent = score;

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
}

/*
Version 1.2 - Adding Yellow Gems that give the snake allowance for 5 ` 10 seconds when yellow gems eaten, 
nothing affects the snake in case hit itself.

1- Add a new boolean variable to track whether the snake has eaten a gem, initially to false.
let gemEaten = false;

2- Modify the loop function to check tif the snake has eaten the gem, and if so, start a countdown for the allowance period.

let allowanceCounter = 0; // Counter for the allowance period

function loop() {
  if (!gameRunning || gamePaused) {
    return;
  }
  
  if (gemEaten) {
    allowanceCounter++;
    
    // Check if allowance period is over
    if (allowanceCounter >= 50) { // 50 frames * 100ms/frame = 5000ms (5 seconds)
      gemEaten = false;
      allowanceCounter = 0;
    }
  }

  // Rest of the loop function...

  // Draw the gems and the snake
  context.fillStyle = '#fff';
  context.fillRect(gem.x, gem.y, grid - 1, grid - 1);
  
  // Set shadow properties
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 5;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  context.fillStyle = gemEaten ? '#FFFF00' : '#061138'; // Yellow color during allowance period

  // Eating the gem logic.
  snake.cells.forEach(function(cell, index) {
    // Rest of the code...

    if (cell.x === gem.x && cell.y === gem.y) {
      // Snake eats gem
      snake.maxCells++;
      score++;
      scoreDisplay.textContent = score;
	    
      // Play eating sound
      eatingSound.play();
      
      // Generate a new random gem position
      gem.x = getRandomInt(0, 25) * grid;
      gem.y = getRandomInt(0, 25) * grid;

      // Set gemEaten to true to initiate the allowance period
      gemEaten = true;
    }

    // Rest of the code...
  });
}
*/
