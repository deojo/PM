// team git hub https://github.com/MaxwellBurkhart/Polite-Minotaur-repo
"use strict";
// define game
var game = new Phaser.Game(900, 900, Phaser.AUTO); //maze size is 2400x2400 (actual maze is 7x7 tiles or 2100x2100px but I left a 8x8 border (1 tile thick border) around maze)
var six , seven;
var sound3, nd;
var paths, walls;
var traps, ranges, toggleTrap;
var player, enemies;
const sprintTimer = 192;
var sprintUsed = 0;
var spb, mask;
var maze, nVisited, emitter;
var partic = 0;
var keyNum = 0;
var fade;
var win = false;

// define MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	//preload() function preloads assets
	preload: function() {
		//preload tile image
		game.load.image('ground', 'assets/images/ground.png'); //ground tile (300x300px)
		game.load.image('wall', 'assets/images/wall.png');
		game.load.image('dirt', 'assets/images/dirt.png');
		game.load.image('fade', 'assets/images/fade.png');

		//preload object assets
		game.load.image('trapOff1', 'assets/images/trap3Idle.png'); //green default trap (50x50px)
		game.load.image('trapOn1', 'assets/images/trap3active.png'); //red default trap (50x50px)
		game.load.image('trapOn2', 'assets/images/trap2active.png');
		game.load.image('trapOff2', 'assets/images/trap2Idle.png');
		game.load.image('sprint', 'assets/images/sprint.png'); //sprint bar
		game.load.image('mainMenu', 'assets/images/trapMainMenu.png'); //main menu image
		//preload character spritesheets
		game.load.spritesheet('player', 'assets/images/mn.png', 140, 140); //minotaur player (80x55px)
		//game.load.spritesheet('enemy', 'assets/images/spritesheet.png', 110, 110); //red enemy (80x45px)
		game.load.spritesheet('enemy', 'assets/images/enemy2sprite.png', 110, 110);

		//preload audio
		game.load.audio('shoot', 'assets/audio/Shoot(1).mp3');
		game.load.audio('die',['assets/audio/Die.mp3']);
   		game.load.audio('score',['assets/audio/Score.mp3']);
    	game.load.audio('song',['assets/audio/Song.mp3']);
	},


	//create() places main menu assets into game space
	create: function() {
		let titleText = game.add.text(40, 100, 'The Polite Minotaur', { fontSize: '50px', fill: '#ffffff'}); //title text
		let IntructionText = game.add.text(35, 230, 'Instructions: Press arrow keys to navigate, \nE to turn off and on traps, and SHIFT to sprint.\n\n\nPress SPACEBAR to begin.', { fontSize: '20px', fill: '#ffffff'}); //instruction text
		game.stage.backgroundColor = "#000"; //background color
		game.add.image(350, 300, 'mainMenu');
	},


	//update() runs main menu loop
	update: function() {
		//transition to Play state when spacebar is pressed
		if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
			game.state.start('Play');
		}
	},
};

// define Play state and methods
var Play = function(game) {};
Play.prototype = {

	init: function() {
		console.log('Play: init');
		// created local variable score in this
		this.state = "Play";
		this.score = 0;
		this.walkSpeed = 300;
		this.runSpeed = 750;
	},

	//preload() function preloads assets
	preload: function() {

		sound3 = game.add.audio('shoot');
		nd = game.add.audio('die');
	},


	//create() places assets into game space
	create: function() {
		//sets world Size

		game.world.setBounds(0, 0, 4000, 4000);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = "#000000"; //background color (black walls)

		let music = game.add.audio('song', 1, true, true);
		//music.play();

		//set T key as toggle trap button
		toggleTrap = game.input.keyboard.addKey(Phaser.Keyboard.T);

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
		traps = game.add.group();
		ranges = game.add.group();
		enemies = game.add.group();

		maze = generateMaze(13, 13);
		//place and draw groundtiles into maze paths into map (entire maze is sevenxseven tiles or 2100x2100px)

		//place player into game
		let tempI = [1,3,5,7,9,11];
		emitter = game.add.emitter(1,2,100);
		emitter.makeParticles('dirt');
		emitter.angularDrag = 100;
		let h = game.rnd.integerInRange(0,5);
		player = game.add.sprite(9*300+150, tempI[h]*300+150, 'player');
		player.animations.add('down', [0, 1, 2, 3, 4], 10, true);
		player.animations.add('left', [5, 6, 7, 8, 9], 10, true);
		player.animations.add('up', [10, 11, 12, 13, 14], 10, true);
		player.animations.add('right', [15, 16, 18, 19], 10, true);
		game.physics.arcade.enable(player);
		player.frozen = false;
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5,0.5);
		game.camera.follow(player);
		fade = game.add.image(-30,-30, 'fade');
		fade.cameraOffset.setTo(0);
		fade.fixedToCamera = true;
		fade.scale.setTo(1.8,1.8);

		this.cursors = game.input.keyboard.createCursorKeys();
		// Sprint bar created
		spb = game.add.sprite(10, 10, 'sprint');
		spb.fixedToCamera = true;

		//Mask created
		mask = game.add.graphics(0, 0);
		mask.beginFill(0xffffff, 1);
		mask.drawRect(10, 10, spb.width, spb.height);
		// Applied to sprint bar
		spb.mask = mask;
		mask.fixedToCamera = true;
		mask.cameraOffset.setTo(0);
		game.camera.follow(player);
	},

	//update() runs gameloop
	update: function() {
		emitter.x = player.x;
		emitter.y = player.y;
		//stop when the player collides with wall
		let hitWall = game.physics.arcade.collide(player, walls);
		if (player.x< 280){
			game.state.start('GameOver');
		}
		game.physics.arcade.overlap(enemies, traps, trapEnemy, null, this);
		game.physics.arcade.overlap(player, enemies, kill, null, this);
		game.physics.arcade.overlap(player, ranges, overlapRange, null, this);

		let speed = this.walkSpeed;
		game.physics.arcade.overlap(player, traps, overlapTrap, null, this);
		if (game.input.keyboard.isDown(Phaser.KeyCode.SHIFT) && sprintUsed < sprintTimer
			&& (this.cursors.left.isDown || this.cursors.right.isDown ||
				this.cursors.up.isDown || this.cursors.down.isDown) && !hitWall && !player.frozen){
			speed = this.runSpeed;
			sprintUsed++;
			this.lastUsed = game.time.time;
		}
		if (sprintUsed > 0 && game.time.elapsedSince(this.lastUsed) >= 1500) {
			sprintUsed--;
		}
		mask.cameraOffset.setTo(-sprintUsed, 0);
		player.body.velocity.setTo(0);
		if (!player.frozen){
			if (this.cursors.left.isDown) {//  Move left
				player.animations.play('left');
				player.body.velocity.x = -speed;
				if(partic >= 5){
					emitter.setXSpeed(75,0);
					emitter.start(true,300,1,1);
					partic = 0;
				}
			}
			else if (this.cursors.right.isDown) { //  Move right
				player.animations.play('right');
				player.body.velocity.x = speed;
				if(partic >= 5){
					emitter.setXSpeed(-75,0);
					emitter.start(true,300,1,1);
					partic = 0;
				}
			}
			else if (this.cursors.up.isDown) { //  Move up
				player.animations.play('up');
				player.body.velocity.y = -speed;
				if(partic >= 5){
					emitter.setYSpeed(-75,0);
					emitter.start(true,300,1,1);
					partic = 0;
				}
			}
			else if (this.cursors.down.isDown) { //  Move down
				player.animations.play('down');
				player.body.velocity.y = speed;
				if(partic >= 5){
					emitter.setYSpeed(75,0);
					emitter.start(true,300,1,1);
					partic = 0;
				}
			}
			else {
				//  Stand still
				emitter.setXSpeed(0,0);
				emitter.setYSpeed(0,0);
				player.animations.pause = true;
			}
			partic ++;
		}
	},
};

// define GameOver and methods
var GameOver = function(game) {};
GameOver.prototype = {
	//preload() function preloads assets
	preload: function() {

	},

	//create() places game over text into game space
	create: function() {
		if (!win){ //lose screen if you lose game
			game.stage.backgroundColor = "#ffdbe9"; //background color
			let titleText = game.add.text(35, 35, 'Game Over: You were killed.', { fontSize: '35px', fill: '#ffffff'});
			let creditText = game.add.text(50, 35, 'Credits: \nMaxwell Burkhart: Programming and Sound Design\nDeo Joshi: Programming and Art\nAttie Sit: Programming and Art', {fill: '#ffffff'});
		}
		if (win){ //win screen if you win game
			game.stage.backgroundColor = "#000"; //background color
			let titleText = game.add.text(35, 150, 'Game Over: You escaped!!', { fontSize: '35px', fill: '#ffffff'});
			let creditText = game.add.text(35,300, 'Credits: \nMaxwell Burkhart: Programming and Sound Design\nDeo Joshi: Programming and Art\nAttie Sit: Programming and Art', {fill: '#ffffff'});
			win = false; //reset
		}
	},

	//update() runs game-over loop
	update: function() {
		if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { //if space is pressed, restart back to Play
			game.state.start('Play'); //return to playstate
		}
	},
};

function overlapRange(player, range) {
	if(toggleTrap.justPressed()){
		range.container.toggle();
	}
}

function trapEnemy(enemy, trap) {
	if (trap.active) {
		enemy.frozen = true;
	}
}

function overlapTrap(player, trap) {
	trap.collided =true;
	if(trap.active){
		player.frozen = true;
	}
	if(toggleTrap.justPressed()){
		player.frozen = trap.toggle();
	}
}
function makePath(x, y) {
	paths.create(x, y, 'ground');
}
function makeWall(x, y) {
	let wall = new Wall(game, 'wall', 0, x, y);
	game.add.existing(wall);
	walls.add(wall);
}

function makeEnemy(x, y) {
//place a enemy into game
	let enemy = new Enemy(game, 'enemy', 0, x, y, player, maze, mazeValues);
	game.add.existing(enemy);
	enemies.add(enemy);
}
function makeTrap(x, y, active=true, rangeX=200, rangeY=200) {
	let trap;
	if(keyNum %2 ==0){
 		trap = new Trap(game, 'trapOn1', "trapOff1", 0, x, y, active, rangeX, rangeY);
	}
	else{
		trap = new Trap(game, 'trapOn2', "trapOff2", 0, x, y, active, rangeX, rangeY);
	}
	keyNum++;
	game.add.existing(trap);
	game.add.existing(trap.range);
	traps.add(trap);
	ranges.add(trap.range);

}

function kill(player, enemy){
  nd.play();
  game.state.start('GameOver');
}
//Game States
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
