// define GameOver and methods
var GameOver = function(game) {};
GameOver.prototype = {
	//preload() function preloads assetst
	preload: function() {

	},

	//create() places game over text into game space
	create: function() {
		if (!win){ //lose screen if you lose game
			game.stage.backgroundColor = "#000000"; //background color
			let titleText = game.add.text(35, 150, 'Game Over: You were killed.', { fontSize: '90px', fill: '#8A0303', font: 'Bahianita'});
			let creditText = game.add.text(35, 420, 'Credits: \nMaxwell Burkhart: Programming and Sound Design\nDeo Joshi: Programming and Art\nAttie Sit: Programming and Art\n\nBackground music: From bensound at https://www.bensound.com\nMain menu art: Theseus and the Minosaur by Edward Burne-Jones 1861', {fill: '#ffffff', fontSize: '45px', font: 'Bahianita'});
			let restartText = game.add.text(300, 320,'Press SPACEBAR to restart', {fill: '#aa8717ff', fontSize: '45px', font: 'Bahianita'});
		}
		if (win){ //win screen if you win game
			game.stage.backgroundColor = "#000000"; //background color
			let titleText = game.add.text(30, 150, 'Game Over: You made it out alive!!!', { fontSize: '100px', fill: '#1cb377ff', font: 'Bahianita'});
			let creditText = game.add.text(35, 420, 'Credits: \nMaxwell Burkhart: Programming and Sound Design\nDeo Joshi: Programming and Art\nAttie Sit: Programming and Art\n\nBackground music: From bensound at https://www.bensound.com\nMain menu art: Theseus and the Minosaur by Edward Burne-Jones 1861', {fill: '#ffffff', fontSize: '45px', font: 'Bahianita'});
			let restartText = game.add.text(300, 320,'Press SPACEBAR to restart', {fill: '#aa8717ff', fontSize: '45px', font: 'Bahianita'});
		}
	},

	//update() runs game-over loop
	update: function() {
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { //if space is pressed, restart back to Play
			win = false; //reset win/lose state
			game.state.start('Play'); //return to playstate
		}
	},
};
