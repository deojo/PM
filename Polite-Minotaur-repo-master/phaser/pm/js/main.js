// team git hub https://github.com/MaxwellBurkhart/Polite-Minotaur-repo
"use strict";
// define game
var game = new Phaser.Game(600, 500, Phaser.AUTO); //maze size is 2400x2400 (actual maze is 7x7 tiles or 2100x2100px but I left a 8x8 border (1 tile thick border) around maze)
var dir = 0;
var dir1 = 0;
var six , seven;
var sound3;
var paths, walls;
var player, enemy, enemy2, win, item;
var trapName, traps, trap1, trap1x, trap1y, trap2, trap2x, trap2y, trapActive, trapIdle, toggleTrap, trapRange, trap1Range, trap1Rangex, trap1Rangey, trap2Range, trap2Rangex, trap2Rangey;
var trap1Value = 'trapActive';
var trap2Value = 'trapActive';

// define MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	//preload() function preloads assets
	preload: function() {
		//preload tile image
		game.load.image('ground', 'assets/images/ground.png'); //gray ground tile (300x300px)
		game.load.image('wall', 'assets/images/leaf.png');

		//preload object assets
		game.load.image('trapOff', 'assets/images/trapOff.png'); //green default trap (50x50px)
		game.load.image('trapOn', 'assets/images/default-trap.png'); //red default trap (50x50px)
		game.load.image('trapRange', 'assets/images/trapRange.png') //invisble trapRange (40x40px)

		//preload character spritesheets
		game.load.image('player', 'assets/images/minotaur.png'); //minotaur player (80x55px)
		game.load.image('enemy', 'assets/images/enemy.png'); //red enemy (80x45px)

		//preload audio
		game.load.audio('shoot', 'assets/audio/Shoot(1).mp3');
		game.load.audio('die',['assets/audio/Die.mp3']);
   		game.load.audio('score',['assets/audio/Score.mp3']);
    	game.load.audio('song',['assets/audio/Song.mp3']);
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

		sound3 = game.add.audio('shoot');

	},


	//create() places assets into game space
	create: function() {
		//sets world Size\

		game.world.setBounds(0, 0, 2400, 2400);
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.backgroundColor = "#000000"; //background color (black walls)

		//  Added sky in background
		//bgtile = game.add.tileSprite(0, 0, game.width, game.height, 'sky');
		var music = game.add.audio('song');
    music.play('',0,1,true);

		//variables to help with drawing groundtiles
		var tileSize = 300;
		var start = tileSize; //starts by giving space for a tile thick border around maze
		//tile positioning variables based on sevenxseven grid
		var zero = 0;
		var one = start;
		var two = start+tileSize;
		var three = start+tileSize*2;
		var four = start+tileSize*3;
		var five = start+tileSize*4;
		six = start+tileSize*5;
		seven = start+tileSize*6;
		var eight = start+tileSize*7;

		//create group called paths for groundtiles (gray boxes)
		paths = game.add.group();
		walls = game.add.group();

		//place and draw groundtiles into maze paths into map (entire maze is sevenxseven tiles or 2100x2100px)
		paths.create(one, one, 'ground');
		paths.create(one, two, 'ground');
		paths.create(one, three, 'ground');
		paths.create(one, four, 'ground');
		paths.create(one, five, 'ground');
		paths.create(one, six, 'ground');
		paths.create(one, seven, 'ground');
		paths.create(two, two, 'ground');
		paths.create(two, seven, 'ground');
		paths.create(three, two, 'ground');
		paths.create(three, three, 'ground');
		paths.create(three, four, 'ground');
		paths.create(three, five, 'ground');
		paths.create(three, six, 'ground');
		paths.create(three, seven, 'ground');
		paths.create(four, four, 'ground');
		paths.create(four, seven, 'ground');
		paths.create(five, one, 'ground');
		paths.create(five, two, 'ground');
		paths.create(five, three, 'ground');
		paths.create(five, four, 'ground');
		paths.create(five, six, 'ground');
		paths.create(six, one, 'ground');
		paths.create(six, four, 'ground');
		paths.create(six, five, 'ground');
		paths.create(six, six, 'ground');
		paths.create(seven, one, 'ground');


		makeWall(two, one);
		makeWall(two, three);
		makeWall(two, four);
		makeWall(two, five);
		makeWall(two, six);
		makeWall(three, one);
		makeWall(four, one);
		makeWall(four, three);
		makeWall(four, two);
		makeWall(four, five);
		makeWall(four, six);
		makeWall(five, five);
		makeWall(five, six);
		makeWall(five, seven);
		makeWall(six, two);
		makeWall(six, one);
		makeWall(six, three);
		//makeWall(six, seven);
		makeWall(seven, two);
		makeWall(seven, three);
		makeWall(seven, four);
		makeWall(seven, five);
		makeWall(seven, six);
		//makeWall(seven, seven);
		makeWall(zero, one);
		makeWall(zero, two);
		makeWall(zero, three);
		makeWall(zero, four);
		makeWall(zero, five);
		makeWall(zero, six);
		makeWall(zero, seven);

		makeWall(one, eight);
		makeWall(two, eight);
		makeWall(three, eight);
		makeWall(four, eight);
		makeWall(two, zero);
		makeWall(three,zero);
		makeWall(four, zero);
		makeWall(five, zero);
		makeWall(six, zero);
		makeWall(seven,zero);
		//makeWall(one,zero,  'wall');

		//create group traps 
		traps = game.add.group(); //group of traps 
		trapRange = game.add.group(); //group of invisible detection range around traps

		//place a traps into game
		trap1x = 1900; trap1Rangex = trap1x-20;
		trap1y = 2000; trap1Rangey = trap1y-20;
		trap2x = 2000; trap2Rangex = trap2x-20;
		trap2y = 2000; trap2Rangey = trap2y-20;
		trap1 = traps.create(trap1x, trap1y, 'trapOn');
		trap1Range = trapRange.create(trap1Rangex, trap1Rangey, 'trapRange');
		trap2 = traps.create(trap2x, trap2y, 'trapOn');
		trap2Range = trapRange.create(trap2Rangex, trap2Rangey, 'trapRange'); 
		//give all traps physics and make trap1 immovable
		game.physics.arcade.enable(traps); 
		game.physics.arcade.enable(trapRange);
		trapRange.enable = false;
		//set all traps immovable 
		traps.setAll('body.immovable', true);
		trapRange.setAll('body.immovable', true);

		//place player into game
		player = game.add.sprite(six, six, 'player');
		//  Enable physics on the player
		game.physics.arcade.enable(player);

		//  Give player bounce and gravity with world boundary collisions.
		player.body.bounce.y = 0.2;

		player.body.collideWorldBounds = true;
		game.camera.follow(player);

		//place a enemy into game
		enemy = game.add.sprite(two, two, 'enemy');
		game.physics.arcade.enable(enemy); //red person
		enemy.body.velocity.y = 150;
		enemy2 = game.add.sprite(two, seven, 'enemy');
		game.physics.arcade.enable(enemy2); //red person
		enemy2.body.velocity.y = 150;
		win = game.add.sprite(450, one, 'enemy');
		game.physics.arcade.enable(win);
		win.alpha = 0;
		var dir = 0;
		this.cursors = game.input.keyboard.createCursorKeys();

		game.camera.follow(player);
	},

	//update() runs gameloop
	update: function() {
		//stop when the player collides with wall
		if(game.physics.arcade.collide(player, walls)){

			sound3.play(); 

		}
		// checks for change of state either death or win
		game.physics.arcade.overlap(enemy, player, kill, null, this);
		game.physics.arcade.overlap(enemy2, player, kill, null, this);
		game.physics.arcade.overlap(win, player, kill, null, this);
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		// sets the enemy to patrol
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



		if(player.x >= six && player.y >= seven){
			sound3.play();
			game.state.start('GameOver', true, false, this.score );
		}
		//set E key as toggle trap button 
		toggleTrap = game.input.keyboard.addKey(Phaser.Keyboard.E);
		//trap 1 is in active state, collision with trap = stuck; overlap with trap radius = you can toggle trap with E
		if (trap1Value == 'trapActive' && checkOverlap(player, trap1Range)){ 
		console.log('condition of trapActive and collision true'); 
		toggleTrap.onDown.add(trap1Idle, this); //changes trap to idle state
		game.physics.arcade.overlap(traps, player, collisionTrap, null, this); //freezes player if they touch trap in active state
		}
		//trap 1 is in idle state, collide with trap harmlessly 
		if (trap1Value == 'trapIdle' && (game.physics.arcade.collide(player, trap1))){
		}
		//trap 2 is in active state, collision with trap = stuck; overlap with trap radius = you can toggle trap with E
		if (trap2Value == 'trapActive' && checkOverlap(player, trap2Range)){ 
		console.log('condition of trapActive and collision true'); 
		toggleTrap.onDown.add(trap2Idle, this); //changes trap to idle state
		game.physics.arcade.overlap(traps, player, collisionTrap, null, this); //freezes player if they touch trap in active state
		}
		//trap 2 is in idle state, collide with trap harmlessly 
		if (trap2Value == 'trapIdle' && (game.physics.arcade.collide(player, trap2))){
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
//changes trap to Idle
function trap1Idle() {
	trap1.kill(); //remove previous state of trap 
	trap1 = traps.create(trap1x, trap1y, 'trapOff');  //off 
	trap1Value = 'trapIdle'; 
	console.log('trapIdle function is called');
}
//changes trap to Idle
function trap2Idle() {
	trap2.kill(); //remove previous state of trap 
	trap2 = traps.create(trap2x, trap2y, 'trapOff');  //off 
	trap2Value = 'trapIdle'; 
	console.log('trapIdle function is called');
}
//player's collsion with active trap freezes player
function collisionTrap() {
	if (!toggleTrap.isDown){ //pressing E unfreezes player
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
}
}

//code borrowed from photostorm at https://github.com/photonstorm/phaser-examples/blob/master/examples/sprites/overlap%20without%20physics.js
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

function makeWall(x,y)
{
	let wall = new Wall(game, 'wall', 0, x,y );
	game.add.existing(wall);
	walls.add(wall);

}
function kill(you, enemy){
  var nd = game.add.audio('die');
  nd.play();
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