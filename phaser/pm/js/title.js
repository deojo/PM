var MainMenu = function(game) {};
MainMenu.prototype = {
	//preload() function preloads assets
	preload: function() {
		//preload tile image
		game.load.image('ground', 'assets/images/ground.png'); //ground tile (300x300px)
		game.load.image('wall', 'assets/images/wall.png');
		game.load.image('dirt', 'assets/images/dirt.png');
		game.load.image('fade', 'assets/images/fade.png');
		game.load.image('doors', 'assets/images/doors.png');

		//preload object assets
		game.load.image('trapOff1', 'assets/images/trap3Idle.png'); //green default trap (50x50px)
		game.load.image('trapOn1', 'assets/images/trap3active.png'); //red default trap (50x50px)
		game.load.image('trapOn2', 'assets/images/trap1active.png');
		game.load.image('trapOff2', 'assets/images/trap1Idle.png');
		game.load.image('sprint', 'assets/images/sprint.png'); //sprint bar
		//game.load.image('mainMenu', 'assets/images/trapMainMenu.png'); //main menu image
		game.load.image('mainMenu', 'assets/images/mainMenuScreen.png'); //main menu image
		game.load.image('bubble', 'assets/images/bubble.png');

		//preload character spritesheets
		game.load.spritesheet('player', 'assets/images/mn.png', 180, 180); //minotaur player (80x55px)
		//game.load.spritesheet('enemy', 'assets/images/spritesheet.png', 110, 110); //red enemy (80x45px)
		game.load.spritesheet('enemy', 'assets/images/enemy2sprite.png', 110, 110);
		game.load.spritesheet('enemy2', 'assets/images/enemy3sprite.png', 110, 110);

		//preload audio
		game.load.audio('shoot', 'assets/audio/Shoot(1).mp3');
		game.load.audio('die',['assets/audio/Die.mp3']);
   	game.load.audio('score',['assets/audio/Score.mp3']);
    game.load.audio('song',['assets/audio/Song.mp3']);
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
