// team git hub https://github.com/MaxwellBurkhart/Polite-Minotaur-repo
"use strict";
// define game
var game = new Phaser.Game(4000, 4000, Phaser.AUTO); //maze size is 2400x2400 (actual maze is 7x7 tiles or 2100x2100px but I left a 8x8 border (1 tile thick border) around maze)
var dir = 0;
var dir1 = 0;
var six , seven;
var sound3;
var paths, walls;
var player, enemy, enemy2, win, item, trap;
var maze, nVisited;


// define MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	//preload() function preloads assets
	preload: function() {
		//preload tile image
		game.load.image('ground', 'assets/images/ground.png'); //gray ground tile (300x300px)
		game.load.image('wall', 'assets/images/leaf.png');

		//preload object assets
		game.load.image('item', 'assets/images/default-item.png'); //green default item (30x32px)
		game.load.image('trap', 'assets/images/default-trap.png'); //red default trap (50x51px)

		//preload character spritesheets
		game.load.image('player', 'assets/images/minotaur.png'); //minotaur player (80x55px)
		game.load.image('enemy', 'assets/images/enemy.png'); //red enemy (80x45px)

		//preload audio
/*		game.load.audio('shoot', 'assets/audio/Shoot(1).mp3');
		game.load.audio('die',['assets/audio/Die.mp3']);
    game.load.audio('score',['assets/audio/Score.mp3']);
    game.load.audio('song',['assets/audio/Song.mp3']);

 */
	},


	//create() places main menu assets into game space
	create: function() {

		let titleText = game.add.text(35, 100, 'The Polite Minotaur', { fontSize: '35px', fill: '#000'}); //title text
		let IntructionText = game.add.text(30, 230, 'Goal: \n\nInstructions:  \n\n\nPress SPACEBAR to begin.', { fontSize: '16px', fill: '#000'}); //instruction text
		game.stage.backgroundColor = "#7AD7F0"; //background color

	},


	//update() runs main menu loop
	update: function() {
		//transition to playstate when spacebar is pressed
		if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
			game.state.start('Playstate');
		}
	},
}

// define Playstate state and methods
var Playstate = function(game) {};
Playstate.prototype = {

	init: function(score) {
		console.log('Play: init');
		// created local variable score in this
		this.state = "Playstate";
		this.score = 0;
	},

	//preload() function preloads assets
	preload: function() {

		//sound3 = game.add.audio('shoot');

	},


	//create() places assets into game space
	create: function() {
		//sets world Size\

		game.world.setBounds(0, 0, 6600, 6600);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.backgroundColor = "#000000"; //background color (black walls)

		//  Added sky in background
		//bgtile = game.add.tileSprite(0, 0, game.width, game.height, 'sky');
		//var music = game.add.audio('song');music.play('',0,1,true);

		//create group called paths for groundtiles (gray boxes)
		paths = game.add.group();
		walls = game.add.group();

		//place and draw groundtiles into maze paths into map (entire maze is sevenxseven tiles or 2100x2100px)
		//paths.create(one, one, 'ground');

		generateMaze(5,5);
		console.log('My:' + maze);

		//place player into game
		player = game.add.sprite(310, 310, 'player');
		//  Enable physics on the player
		game.physics.arcade.enable(player);

		//  Give player bounce and gravity with world boundary collisions.
		player.body.bounce.y = 0.2;

		player.body.collideWorldBounds = true;
		//game.camera.follow(player);
		//place a enemy into game
		enemy = game.add.sprite(300, 900, 'enemy');
		game.physics.arcade.enable(enemy); //red person
		//enemy.body.velocity.y = 150;
		//enemy2 = game.add.sprite(two, seven, 'enemy');
		//game.physics.arcade.enable(enemy2); //red person
		//enemy2.body.velocity.y = 150;
		//win = game.add.sprite(450, one, 'enemy');
		//game.physics.arcade.enable(win);
		//win.alpha = 0;
		//place a default object into the game
		item = game.add.image(150, 40, 'item'); //green box
		var dir = 0;
		//place a default trap into game
		trap = game.add.image(220, 30, 'trap'); //red box
		this.cursors = game.input.keyboard.createCursorKeys();
		game.camera.follow(player);
	},

	//update() runs gameloop
	update: function() {
		//stop when the player collides with wall
		if(game.physics.arcade.collide(player, walls)){

			//sound3.play();

		}
		// checks for change of state either death or win
		game.physics.arcade.overlap(enemy, player, kill, null, this);
		game.physics.arcade.overlap(enemy2, player, kill, null, this);
		game.physics.arcade.overlap(win, player, kill, null, this);
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		enemySearching(enemy, maze);
		// sets the enemy to patrol
		/*
		if (enemy.y >= 900 && dir == 0){
			dir = 1;
			enemy.body.velocity.y = -150;
		}
		else if (enemy.y <= 600 && dir == 1){
			dir = 0;
			enemy.body.velocity.y = 150;
		}
		if (enemy2.y >= 2400 && dir1 == 0){
			dir1 = 1;
			enemy2.body.velocity.y = -150;
		}
		else if (enemy2.y <= 2100 && dir1 == 1){
			dir1 = 0;
			enemy2.body.velocity.y = 150;
		}
		// all movment for player charecter
		if (this.cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -300;
			player.animations.play('left');
		}
		else if (this.cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 300;

		}
		else if (this.cursors.up.isDown)
		{
			//  Move to the right
			player.body.velocity.y = -300;

		}
		else if (this.cursors.down.isDown)
		{
			//  Move to the right
			player.body.velocity.y = 300;

		}
		*/


		if(player.x >= six && player.y >= seven){
			sound3.play();
			game.state.start('GameOver', true, false, this.score );
		}

	},
}

// define GameOver and methods
var GameOver = function(game) {};
GameOver.prototype = {
	//preload() function preloads assets
	preload: function() {

	},


	//create() places game over text into game space
	create: function() {
		game.stage.backgroundColor = "#ffdbe9"; //background color
		let titleText = game.add.text(35, 35, 'Game Over', { fontSize: '35px', fill: '#000'});
	},


	//update() runs game-over loop
	update: function() {
		if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { //if space is pressed, restart back to Playstate
			game.state.start('Playstate'); //return to playstate
		}
	},
}

function makeWall(x,y)
{
	let wall = new Wall(game, 'wall', 0, x,y );
	game.add.existing(wall);
	walls.add(wall);

}//function that kills game if you hit it
function kill(you, enemy){
  //var nd = game.add.audio('die');
 // nd.play();
  game.state.start('GameOver');
}
function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}
//Game States
game.state.add('MainMenu', MainMenu);
game.state.add('Playstate', Playstate);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
