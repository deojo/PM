// define game 
var game = new Phaser.Game(650, 500, Phaser.AUTO); //maze size is 2400x2400 (actual maze is 7x7 tiles or 2100x2100px but I left a 8x8 border (1 tile thick border) around maze)

// define MainMenu state and methods 
var MainMenu = function(game) {};
MainMenu.prototype = {
	//preload() function preloads assets 
	preload: function() {
	},


	//create() places main menu assets into game space
	create: function() {
		titleText = game.add.text(35, 100, 'The Polite Minotaur', { fontSize: '35px', fill: '#000'}); //title text
		IntructionText = game.add.text(30, 230, 'Goal: \n\nInstructions:  \n\n\nPress SPACEBAR to begin.', { fontSize: '16px', fill: '#000'}); //instruction text 
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
	//preload() function preloads assets 
	preload: function() {
		//preload tile image
		game.load.image('ground', 'assets/images/ground.png'); //gray ground tile (300x300px) 

		//preload object assets
		game.load.image('item', 'assets/images/default-item.png'); //green default item (30x32px)
		game.load.image('trap', 'assets/images/default-trap.png'); //red default trap (50x51px)

		//preload character spritesheets
		game.load.spritesheet('player', 'assets/images/minotaur.png', 80, 55); //minotaur player (80x55px)
		game.load.spritesheet('enemy', 'assets/images/enemy.png', 80, 45); //red enemy (80x45px)

		//preload audio 
	
	},


	//create() places assets into game space
	create: function() {
		game.stage.backgroundColor = "#000000"; //background color (black walls)

		//variables to help with drawing groundtiles
		var tileSize = 300;
		var start = tileSize; //starts by giving space for a tile thick border around maze
		//tile positioning variables based on sevenxseven grid
		var one = start; 
		var two = start+tileSize;
		var three = start+tileSize*2;
		var four = start+tileSize*3;
		var five = start+tileSize*4;
		var six = start+tileSize*5;
		var seven = start+tileSize*6;

		//create group called paths for groundtiles (gray boxes)
		paths = game.add.group(); 

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

		//place player into game 
		player = game.add.sprite(game.width/2, game.height/2, 'player');

		//place a enemy into game
		enemy = game.add.sprite(30, 30, 'enemy'); //red person

		//place a default object into the game 
		item = game.add.image(150, 40, 'item'); //green box

		//place a default trap into game
		trap = game.add.image(220, 30, 'trap'); //red box
	},


	//update() runs gameloop 
	update: function() {

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
		titleText = game.add.text(35, 35, 'Game Over', { fontSize: '35px', fill: '#000'}); 
	},


	//update() runs game-over loop 
	update: function() {
		if(game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) { //if space is pressed, restart back to Playstate 
			game.state.start('Playstate'); //return to playstate 
		}
	},
}

//Game States
game.state.add('MainMenu', MainMenu);
game.state.add('Playstate', Playstate);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
