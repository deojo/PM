// team git hub https://github.com/MaxwellBurkhart/Polite-Minotaur-repo && finished on https://github.com/deojo/PM
// Team Members: Maxwell Burkhart, Deo Joshi, Attie Sit 

"use strict";

var game = new Phaser.Game(2400, 2400, Phaser.AUTO); //define game
var six , seven;
var nd, hitTrap, death, walking, mainSound, enemySound, activate, winSound;
var paths, walls;
var traps, ranges, toggleTrap;
var player, enemies;
const sprintTimer = 192;
var sprintUsed = 0;
var spb, mask;
var maze, nVisited, emitter;
var partic = 0;
var par = 0;
var keyNum = 0;
var keyNum1 = 0;
var fade;
var win = false;
var winTile;

// define MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	//preload() function preloads assets
	preload: function() {
		//preload tile image
		game.load.image('ground', 'assets/images/ground.png'); //invisible title for corner collision
		game.load.image('wall', 'assets/images/wall.png'); //stone wall tile 
		game.load.image('dirt', 'assets/images/dirt.png'); //dirt ground tile 
		game.load.image('fade', 'assets/images/fade.png'); //fade for lighting effect
		game.load.image('doors', 'assets/images/doors.png'); //door to show exit 

		//preload object assets
		game.load.image('trapOff1', 'assets/images/trap3Idle.png'); //blue trap idle
		game.load.image('trapOn1', 'assets/images/trap3active.png'); //blue trap active
		game.load.image('trapOn2', 'assets/images/trap1active.png'); //floor trap active 
		game.load.image('trapOff2', 'assets/images/trap1Idle.png'); //floor trap idle
		game.load.image('sprint', 'assets/images/sprint.png'); //sprint bar
		game.load.image('mainMenu', 'assets/images/mainMenuScreen.png'); //main menu screen 

		//preload character spritesheets
		game.load.spritesheet('player', 'assets/images/mn.png', 180, 180); //minotaur player (80x55px)
		game.load.spritesheet('enemy', 'assets/images/enemy2sprite.png', 110, 110);
		game.load.spritesheet('enemy2', 'assets/images/enemy3sprite.png', 110, 110);

		//preload audio
		game.load.audio('die',['assets/audio/Die.mp3']);
		game.load.audio('HitTrap',['assets/audio/HitTrap.mp3']);
		game.load.spritesheet('player', 'assets/images/mn.png', 180, 180); //minotaur player 
		game.load.spritesheet('enemy', 'assets/images/enemy2sprite.png', 110, 110); //brass armored enemy 
		game.load.spritesheet('enemy2', 'assets/images/enemy3sprite.png', 110, 110); //brass armored enemy 

		//preload audio assets 
		game.load.audio('shoot', 'assets/audio/Shoot(1).mp3');
		game.load.audio('die',['assets/audio/Die.mp3']);
		game.load.audio('walking',['assets/audio/walking.mp3']);
		game.load.audio('Death',['assets/audio/Death.mp3']);
		game.load.audio('main',['assets/audio/main.mp3']);
		game.load.audio('enemy',['assets/audio/enemy.mp3']);
		game.load.audio('activate',['assets/audio/activate.mp3']);
		game.load.audio('win',['assets/audio/win.mp3']);
	},


	//create() places main menu screen into game space
	create: function() {
		game.stage.backgroundColor = "#000"; //background color
		game.add.image(0, 0, 'mainMenu'); //main main screen 
	},


	//update() runs main menu loop
	update: function() {
		//transition to Play state when spacebar is pressed
		if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
			game.state.start('Play', true, false, 0);
		}
	},
};

// define Play state and methods
var Play = function(game) {};
Play.prototype = {

	init: function(level) {
		console.log('Play: init');
		// created local variable score in this
		this.level = level;
		this.walkSpeed = 300; //initialize walk speed
		this.runSpeed = 750; //initialize run speed
	},

	//preload() function preloads audio assets
	preload: function() {

		nd = game.add.audio('die');
		walking = game.add.audio('walking');
		walking.volume = 0.8;
		hitTrap = game.add.audio('HitTrap');
		death = game.add.audio('death');
		enemySound = game.add.audio('enemy');
		mainSound = game.add.audio('main');
		activate = game.add.audio('activate');
		winSound = game.add.audio('win');
		//hitTrap = game.add.audio('');
	},


	//create() places assets into game space
	create: function() {
		//sets world Size
		game.world.setBounds(0, 0, 4000, 4000);
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = "#000000"; //background color black

		//set T key as toggle trap button
		toggleTrap = game.input.keyboard.addKey(Phaser.Keyboard.T);

		let music = game.add.audio('song', 1, true, true); //game music
		//music.play();

		//set T key as toggle trap button
		toggleTrap = game.input.keyboard.addKey(Phaser.Keyboard.T);

		paths = game.add.group(); //create group called paths for groundtiles
		walls = game.add.group(); //create group called walls for wall tiles
		traps = game.add.group(); //create traps group
		ranges = game.add.group(); //create ground for detection range
		enemies = game.add.group(); //create enemies group
		maze = generateMaze(13 + 4 * this.level, 13 + 4 * this.level);


		//code to create dirt trail
		let tempI = [1,3,5,7,9,11];
		emitter = game.add.emitter(1,2,100);
		emitter.makeParticles('dirt');
		emitter.angularDrag = 100;
		//code to give player motion and animation
		let h = game.rnd.integerInRange(0,5);
		player = game.add.sprite(9*300+95, tempI[h]*300+95, 'player');
		player.animations.add('down', [0, 1, 2, 3, 4], 10, true);
		player.animations.add('left', [5, 6, 7, 8, 9], 10, true);
		player.animations.add('up', [10, 11, 12, 13, 14], 10, true);
		player.animations.add('right', [15, 16, 17, 18, 19], 10, true);

		//give player physics and collision

		game.physics.arcade.enable(player);
		player.frozen = false;
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5,0.5);
		//have camera follow player
		game.camera.follow(player);
		fade = game.add.image(-30,-30, 'fade');
		//code to add fade for lighting effect
		fade.cameraOffset.setTo(0);
		fade.fixedToCamera = true;
		fade.scale.setTo(1.8,1.8);

		//play enemy sound
		enemySound.play();

		this.cursors = game.input.keyboard.createCursorKeys();
		// Sprint bar created
		spb = game.add.sprite(10, 10, 'sprint');
		spb.fixedToCamera = true; //set sprint bar to follow camera

		//Mask created
		mask = game.add.graphics(0, 0);
		mask.beginFill(0xffffff, 1);
		mask.drawRect(10, 10, spb.width, spb.height);
		// Applied to sprint bar
		spb.mask = mask;
		mask.fixedToCamera = true;
		mask.cameraOffset.setTo(0);
		game.camera.follow(player);
		for (let doorLoc = 1; doorLoc<13; doorLoc++){
			if (maze[0][doorLoc] === 2){
				winTile = game.add.image(0, doorLoc*300, 'doors'); //add doors but have it above fade and player
			}
		}
	},

	//update() runs gameloop
	update: function() {
		emitter.x = player.x;
		emitter.y = player.y;
		//stop when the player collides with wall
		let hitWall = game.physics.arcade.collide(player, walls);
		if (player.x< 280){
			win = true;
			winSound.play();
			game.state.start('GameOver', true, false, this.level); //move to gameOver state
		}
		//trap enemy in trap if they touch
		game.physics.arcade.overlap(enemies, traps, trapEnemy, null, this);
		//kill player when enemy catches player
		game.physics.arcade.overlap(player, enemies, kill, null, this);
	    //lets player turn off traps if near
		game.physics.arcade.overlap(player, ranges, overlapRange, null, this);

		let speed = this.walkSpeed;
		game.physics.arcade.overlap(player, traps, overlapTrap, null, this); //trap player in traps
		//code to add sprint related functions and sprint bar
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
				if(par >= 21){
					walking.play();
					par = 0;
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
				if(par >= 21){
					walking.play();
					par = 0;
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
				if(par >= 21){
					walking.play();
					par = 0;
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
				if(par >= 21){
					walking.play();
					par = 0;
				}
			}
			else {
				//  Stand still
				emitter.setXSpeed(0,0);
				emitter.setYSpeed(0,0);
				player.animations.pause = true;
			}
			partic ++;
			par ++;
		}
	},
};

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
			this.level++;
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
//toggle traps if in range 
function overlapRange(player, range) {
	if(toggleTrap.justPressed()){
		range.container.toggle();
	}
}
//freeze enemy in traps
function trapEnemy(enemy, trap) {
	if (trap.active) {
		enemy.frozen = true;
	}
}
//freeze player in traps
function overlapTrap(player, trap) {
	trap.collided =true;
	if(trap.active){
		player.frozen = true;
	}
	if(toggleTrap.justPressed()){
		player.frozen = trap.toggle();
	}
}
//draws path of maze 
function makePath(x, y) {
	paths.create(x, y, 'ground');
}
//draw walls of maze 
function makeWall(x, y) {
	let wall = new Wall(game, 'wall', 0, x, y);
	game.add.existing(wall);
	walls.add(wall);
}

function makeEnemy(x, y) {
//place a enemy into game
	let enemy;
	if (keyNum1 % 2 === 0) {
		enemy = new Enemy(game, 'enemy', 0, x, y, player, maze, mazeValues);
	} else {
		enemy = new Enemy(game, 'enemy2', 0, x, y);
	}
	keyNum1++;
	game.add.existing(enemy);
	enemies.add(enemy);
}

function makeTrap(x, y, active = true, rangeX = 200, rangeY = 200) {
	let trap;
	if (keyNum % 2 === 0) {
		trap = new Trap(game, 'trapOn1', "trapOff1", 0, x, y, active, rangeX, rangeY);
	} else {
		trap = new Trap(game, 'trapOn2', "trapOff2", 0, x, y, active, rangeX, rangeY);
	}
	keyNum++;
	game.add.existing(trap);
	game.add.existing(trap.range);
	traps.add(trap);
	ranges.add(trap.range);

}

//kill player and move to gameOver state
	function kill(player, enemy) {
		nd.play();
		game.state.start('GameOver', true, false, this.level);
	}

//Game States
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
