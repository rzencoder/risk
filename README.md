# Risk

Demo: https://rzencoder.github.io/risk/

SVG map adapted from https://commons.wikimedia.org/wiki/File:Risk_board.svg

Built using svg, sass and plain javascript

### Instructions

Aim: To control all the areas on the map
You control the dark blue areas

Every turn you get additional troops to place on the map. 
The number of troops is increased by:
  * Owning more areas
  * Increases slightly after each turn
  * Controlling all areas on a continent
To place a troop click on an area you control when it's the fortify stage 
  
Once your reserve is 0 the stage changes to the battle stage.

To attack an opponent select an area you control to attack from and a neighbouring opponent to attack
You must have a least one troop to attack an opponent.
If you win the opponents territory will become yours and remaining troops will split between the two areas
If you lose the troops in your area will become 0

Click 'End Turn' to continue the game and pass control to the AI
