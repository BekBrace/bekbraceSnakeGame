// Chapter 1: Declaration and Initialization
// Chapter 2: Sound Effects and HTML Elements
// Chapter 3: Setup Event Listeners [computer, smart]
// Chapter 4: Start and End Game Functions
// Chapter 5: Main Loop Function

//This line gets a reference to the HTML5 Canvas element in your HTML document.
const canvas = document.getElementById('game');

// This line retrieves the 2D rendering context of the Canvas. 
const context = canvas.getContext('2d');

// Sound variables
const collisionSound = document.getElementById('collisionSound');
const eatingSound = document.getElementById('eatingSound');

let gameRunning = false;

let gamePaused = false;

let grid = 16;

let count = 0;

let score = 0;

let gemEaten = false;

let allowanceCounter = 0;

let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4 
};

let gem = {
    x: 320,
    y: 320
};

// FPS - Frames Per Second [the higher the better]
// requestAnimationFrame(loop)
let animationFrame;
let startButton = document.querySelector('.start-button');
let gameOverScreen = document.querySelector('.game-over');
let scoreDisplay = document.querySelector('.score-display');

// This is a function that helps us generate a random position for the gem on the grid.
// It takes a min and a max number, and then we invoque it by feeding a minimim number(0) and a maximum number(25).
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

// Start Game event listener
startButton.addEventListener('click', function(){
    // sanity check
    // console.log("Button is clicked!")
    startGame();
});

// Restart game when game is over
gameOverScreen.querySelector('.start-button').addEventListener('click', function(){
    startGame();
});

// Event Listeners for the computer version
document.addEventListener('keydown', function(e){
    if (!gameRunning){
        return;
    }
    // 37 for Left key, 38 for up key, 39 for right key, 40 for down key and 32 for Spacebar key.
    // Arrow keys for moving the snake
    if (e.which === 37 && snake.dx === 0){
        snake.dx = -grid;
        snake.dy = 0;
    }else if (e.which === 38 && snake.dy === 0){
        snake.dy = -grid;
        snake.dx = 0;
    }else if (e.which === 39 && snake.dx ===0){
        snake.dx = grid;
        snake.dy = 0;
    }else if (e.which === 40 && snake.dy ===0){
        snake.dy = grid;
        snake.dx=0;
    }
    // Spacebar for pausing the game
    if (e.which === 32){
        gamePaused = !gamePaused; // ! = NOT
        context.fillStyle = '#fff';
        context.font = 'bold 30px Arial';
        if (gamePaused){
            context.fillText('Game Paused', canvas.width / 2 - 100, canvas.height / 2);
        }else{
            // Resume the game
            animationFrame = requestAnimationFrame(loop);
        }
    } 
});

// //////////////////////////////MEMBERS//////////////////////////////////
// Event listeners for the smartphone version [Exclusive: YT Vid for Memebers]
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e){
    if (!gameRunning){
        return;
    }
    // Initial points for the snake to move on the screen
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', function(e){
    if (!gameRunning){
        return;
    }
    
    e.preventDefault();
    
    // Swipe detection and snake movement
    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)){
        // Right swipe
        if (dx > 0 && snake.dx ===0){
            snake.dx = grid;
            snake.dy = 0;
        // Left swipe
        } else if (dx < 0 && snake.dx === 0){
            snake.dx = -grid;
            snake.dy = 0;
        }
    }else{
        // Down Swipe
        if (dy > 0 && snake.dy === 0){
            snake.dy = grid;
            snake.dx = 0;
        // Up Swipe
        }else if (dy<0 && snake.dy === 0){
            snake.dy = -grid;
            snake.dx = 0;
        }
    }
});
// //////////////////////////////END-MEMBERS//////////////////////////////////

// Main loop function
function loop(){
    if (!gameRunning || gamePaused){
        return;
    }
    // The allowance period for the snake to turn yellow for a few seconds then returns back to black (dark green)
    if (gemEaten){
        allowanceCounter++;
        if (allowanceCounter >=50){
                gemEaten = false;
                allowanceCounter = 0;
        }
    }
 
    animationFrame = requestAnimationFrame(loop);
    
    // Control game loop speed
    if (++count < 100){
        return;
    }
    count = 90; // speed

    //NOTE: There was a typo in the tutorial, canvas.clientWidth, it should be canvas.width
    context.clearRect(0,0, canvas.width, canvas.height);
    
    snake.x += snake.dx;
    
    snake.y += snake.dy;

    // Wrap the snake position on screen edges
    if (snake.x < 0){
        snake.x = canvas.width - grid
    } else if (snake.x >= canvas.width){
        snake.x = 0;
    }
    if (snake.y < 0){
        snake.y = canvas.height - grid
    } else if (snake.y >= canvas.height){
        snake.y = 0;
    }


    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells){
        snake.cells.pop();
    }

    // Draw the gems and the snake
    context.fillStyle = "#fff"
    context.fillRect(gem.x, gem.y, grid - 1, grid - 1);
    context.shadowColor = 'rgba(0,0,0,0.5)';
    context.shadowBlur = 5;
    context.shadowOffetX = 2;
    context.shadowOffetY = 2;

    context.fillStyle = gemEaten ? '#ffff00' : '#061138';


    // Drawing the snake and eating the gem
    snake.cells.forEach(function(cell, index){
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        if (cell.x === gem.x && cell.y === gem.y){
            //Snake eats gem: cells increase, scores increases, scoredisplay is being updated with the actual score.
            snake.maxCells++;
            score++;
            scoreDisplay.textContent = score;
            // Playing eating sound
            eatingSound.play();
            //Generate a new random gem position
            gem.x = getRandomInt(0,25) * grid;
            gem.y = getRandomInt(0,25) * grid;
            gemEaten = true;
        }

        // Check collision with snake's own body (game is over!)
        for (let i = index + 1; i < snake.cells.length; i++){
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y){
                // invoking the endGame method
                endGame();
                // play the hitting sound
                collisionSound.play();
            }
        }
    });
}

// Start Game function
function startGame(){
    if (gameRunning){
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
    gem.x = getRandomInt(0,25) * grid;
    gem.y = getRandomInt(0,25) * grid;
    startButton.style.display = 'none';
    gameOverScreen.style.display = 'none';
    scoreDisplay.textContent = score;
    if (animationFrame){
        cancelAnimationFrame(animationFrame);
    }animationFrame = requestAnimationFrame(loop);
}

// End game function
function endGame(){
    gameRunning = false;
    gamePaused = true;
    gameOverScreen.style.display = 'block';
    document.querySelector('.game-over .score-display').textContent = score;
    if (animationFrame){
        cancelAnimationFrame(animationFrame);
    }
}
