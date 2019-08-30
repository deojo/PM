// define GameOver and methods
var GameOver = function(game) {};
GameOver.prototype = {
	init: function(level) {
		this.level = level;
	},
	//preload() function preloads assets
	preload: function() {

	},

	//create() places game over text into game space
	create: function() {		
		if (win){ //win screen if you win game
			game.add.image(0, 0, 'win'); //win screen
			this.level++;
		}else{ //lose screen if you lose game
			game.add.image(0, 0, 'lose'); //lose screen
		}
	},

	//update() runs game-over loop
	update: function() {
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { //if space is pressed, restart back to Play
			win = false; //reset win/lose state
			game.state.start('Play', true, false, this.level); //return to playstate
		}
	},
};