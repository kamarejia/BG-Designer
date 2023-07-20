# BG-Designer

# Description
BG Designer is an application that allows users to design and test play board games easily on the web. Users can quickly test-play the games they design and easily make adjustments to the game. It also features a Python and Flask backend and data storage and loading through the Dropbox API.

# Usage
1. Create a new card on the Components screen. Set the card title, number of cards, size, color, image, and effects.
1. Place the created component on the component board. Copy, delete, or modify boards.
1. Save component boards to Dropbox or load existing boards.
1. Perform a test play on the gameplay screen. Check the balance of the game through this play.

# Handling 
tictactoe_game.py starts the game when you click on the difficulty level. The game can be played backwards and marks can be placed by clicking anywhere. 
After the winner is determined, click again to go to the difficulty selection screen. The escape key ends the game.

# Requirements
- flask      1.1.2
- dropbox     11.36.2

