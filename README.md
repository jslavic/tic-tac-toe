This game has been made as a part of my own Javascript studying and serves as an additional practice of HTML and CSS (flexbox especially).

It practices using factory functions, objects, closures and dynamically manipulating DOM elements.

The game has a 2-player option where the user can play as both players. However, players can also choose to play against an "Unbeatable AI" which uses the minimax algorithm (ref. https://en.wikipedia.org/wiki/Minimax) where it calculates the next optimal move by recursively exhausting all possible AI and player moves and evaluating each of them (while assuming the player is going to make the optimal move). The evaluation uses a score of +10 in the case where the AI wins and a score of -10 in the case of AI losing the game. The minimax function also subtracts the depth from its winning score in order to win the game in the shortest amout of moves possible. 

