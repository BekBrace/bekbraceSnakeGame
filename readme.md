# Snake Game

This is a recreation of the retro-style Nokia 3310 Snake game implemented in JavaScript, using HTML5 Canvas for rendering. 

This is the online demo deployed on Netlify: https://retrosnakenokia.netlify.app

Original Game coded in November - Version 1.1

![stream everyday 715 to 900 warsaw time zone](https://github.com/BekBrace/nokia3310-snake/assets/60483846/33c73fdd-5149-4165-92de-353d0c4edc4e)

More changes applied on December 25th, 2023 - Version 1.2

![snake v1 2](https://github.com/BekBrace/nokia3310-snake/assets/60483846/07371046-5d3a-4ff0-bfcf-1f8a7e3abf57)

The game includes basic functionalities such as snake movement, collision detection, and apple consumption.

Latest commits [adding gridline, score below the grid, and add sound for paused game]

![3](https://github.com/BekBrace/bekbraceSnakeGame/assets/60483846/b82d9f13-81a6-4f34-b66c-fbe7b783a965)


## Getting Started
To run the Snake game, follow these steps:
1. Open the `index.html` file in a web browser.
2. Click on the "Start Game" button to begin playing.

## Game Controls
- **Arrow Keys:** Control the direction of the snake (up, down, left, right).
- **Touch Gestures:** Swipe on the screen to control the snake's direction.

## Game Rules
- The snake starts with a length of 4 cells.
- Move the snake to consume apples, increasing its length and score.
- Avoid collisions with the snake's own body to prevent game over.
- The game ends when the snake collides with the screen edges.

## Features

- Responsive design for both keyboard and touch controls.
- Random generation of apples on the game grid.
- Score tracking and display.
- Game over screen with the option to restart.

## Code Structure

- **Initialization:** Setting up the HTML5 Canvas and initializing game variables.
- **Event Listeners:** Handling keyboard and touch events for controlling the snake.
- **Main Loop:** The game loop responsible for updating game state and rendering.
- **Start Game Function:** Initiating the game and resetting variables.
- **End Game Function:** Ending the game and displaying the game over screen.

## Contributors

- Amir Bekhit | Bek Brace Channel

## License
The MIT License (MIT)

Copyright (c) 2024 Amir Bekhit

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Feel free to contribute or provide feedback to enhance the game as mentionned in the video [Fork the game, modify and submit a merge request for review].

