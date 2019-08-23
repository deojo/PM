// team git hub https://github.com/MaxwellBurkhart/Polite-Minotaur-repo
"use strict";
// define game
var game = new Phaser.Game(2400, 2400, Phaser.AUTO); //maze size is 2400x2400 (actual maze is 7x7 tiles or 2100x2100px but I left a 8x8 border (1 tile thick border) around maze)
var six , seven;
var sound3, nd;
var paths, walls;
var traps, toggleTrap;
var player, enemy, enemy2;
const sprintTimer = 192;
var sprintUsed = 0;
var spb, mask;
var maze, nVisited;

// define MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	//preload() function preloads assets
	preload: function() {
		//preload tile image
		game.load.image('ground', 'assets/images/ground1.png'); //gray ground tile (300x300px)
		game.load.image('wall', 'assets/images/wall.png');

		//preload object assets
		game.load.image('trapOff', 'assets/images/trapOff.png'); //green default trap (50x50px)
		game.load.image('trapOn', 'assets/images/claws.png'); //red default trap (50x50px)
		game.load.image('sprint', 'assets/images/sprint.png'); //red default trap (50x50px)

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
		let instructionText = game.add.text(30, 230, 'Goal: \n\nInstructions:  \n\n\nPress SPACEBAR to begin.', { fontSize: '16px', fill: '#000'}); //instruction text
		game.stage.backgroundColor = "#7AD7F0"; //background color
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

	init: function(score) {
		console.log('Play: init');
		// created local variable score in this
		this.state = "Play";
		this.score = 0;
		this.walkSpeed = 300;
		this.runSpeed = 750;
		this.resprint = false;
		this.timer = game.time.create(false);
	},

	//preload() function preloads assets
	preload: function() {

		sound3 = game.add.audio('shoot');
		nd = game.add.audio('die');
	},


	//create() places assets into game space
	create: function() {
		//sets world Size

		game.world.setBounds(0, 0, 2400, 2400);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = "#000000"; //background color (black walls)

		//  Added sky in background
		//bgtile = game.add.tileSprite(0, 0, game.width, game.height, 'sky');
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

		//create group traps 
		traps = game.add.group(); //group of traps
		makeTrap(1900, 2000);
		makeTrap(2000, 2000);

		//place player into game
		player = game.add.sprite(six, six, 'player');
		//  Enable physics on the player
		game.physics.arcade.enable(player);
		player.frozen = false;
		player.body.collideWorldBounds = true;
		game.camera.follow(player);

		//place a enemy into game
		enemy = game.add.sprite(two, two, 'enemy');
		game.physics.arcade.enable(enemy); //red person
		enemy.body.velocity.y = 150;
		enemy2 = game.add.sprite(two, seven, 'enemy');
		game.physics.arcade.enable(enemy2); //red person
		enemy2.body.velocity.y = 150;
		this.cursors = game.input.keyboard.createCursorKeys();
		// Sprint bar created
		spb = game.add.sprite(10, 10, 'sprint');
		spb.fixedToCamera = true;

		//Mask created
		mask = game.add.graphics(0, 0);
		mask.beginFill(0xffffff, 1);
		mask.drawRect(10, 10, 200, 50);
		// Applied to sprint bar
		spb.mask = mask;
		mask.fixedToCamera = true;
		game.camera.follow(player);
	},

	//update() runs gameloop
	update: function() {
		console.log(mask.position);
		//stop when the player collides with wall
		let hitWall = game.physics.arcade.collide(player, walls);

		let speed = this.walkSpeed;
		game.physics.arcade.overlap(player, traps, overlapTrap, null, this);
		if (game.input.keyboard.isDown(Phaser.KeyCode.SHIFT) && sprintUsed < sprintTimer
			&& (this.cursors.left.isDown || this.cursors.right.isDown ||
				this.cursors.up.isDown || this.cursors.down.isDown) && !hitWall && !player.frozen){
			speed = this.runSpeed;
			sprintUsed++;
			mask.x--;
		}
		if (sprintUsed >= sprintTimer/4 && (sprintUsed % (sprintTimer/4) === 0)) {
			this.timer.loop(1200, () => this.resprint = true, this);
			this.timer.start();
		}
		if (sprintUsed > 0 && this.resprint) {
			sprintUsed--;
			console.log(sprintUsed, this.resprint);
			mask.x++;
		}
		player.body.velocity.setTo(0);
		if (!player.frozen){
			if (this.cursors.left.isDown) {//  Move left
				player.body.velocity.x = -speed;
			}
			else if (this.cursors.right.isDown) { //  Move right
				player.body.velocity.x = speed;

			}
			else if (this.cursors.up.isDown) { //  Move up
				player.body.velocity.y = -speed;

			}
			else if (this.cursors.down.isDown) { //  Move down
				player.body.velocity.y = speed;
			}
		}

		if(player.x >= six && player.y >= seven){
			sound3.play();
			game.state.start('GameOver', true, false, this.score );
		}
	}
};

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
		if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { //if space is pressed, restart back to Play
			game.state.start('Play'); //return to playstate
		}
	},
};
function overlapTrap(player, trap) {
	if(trap.active){
		player.frozen = true;
	}
	if(toggleTrap.justPressed()){
		player.frozen = trap.toggle();
	}

}
function makeWall(x, y) {
	let wall = new Wall(game, 'wall', 0, x, y);
	game.add.existing(wall);
	walls.add(wall);
}
function makeTrap(x, y, active=true) {
	let trap = new Trap(game, 'trapOn', "trapOff", 0, x, y, active);
	game.add.existing(trap);
	traps.add(trap);
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