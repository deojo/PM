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

		let music = game.add.audio('song', 1, true, true); //game music
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


		paths = game.add.group(); //create group called paths for groundtiles
		walls = game.add.group(); //create group called walls for wall tiles
		traps = game.add.group(); //create traps group
		ranges = game.add.group(); //create ground for detection range
		enemies = game.add.group(); //create enemies group

		//maze = generateMaze(7, 7);
		maze = generateMaze(13, 13); //procedural generation

		//code to create dirt trail
		let tempI = [1,3,5,7,9,11];
		emitter = game.add.emitter(1,2,100);
		emitter.makeParticles('dirt');
		emitter.angularDrag = 100;
		let h = game.rnd.integerInRange(0,5);
		player = game.add.sprite(9*300+95, tempI[h]*300+150, 'player');
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
		for (let ha = 1; ha<13; ha++){
			if (maze[0][ha] == 2){
				winTile = game.add.image(0, ha*300, 'doors'); //add doors but have it above fade and player
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
			game.state.start('GameOver'); //move to gameOver state
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
		//playHit();
	}
}
//freeze player in traps
function overlapTrap(player, trap) {
	trap.collided =true;
	if(trap.active){
		player.frozen = true;
		if(s == 0){
			playHit();
			s++;
		}
	}
	if(toggleTrap.justPressed()){
		player.frozen = trap.toggle();
		s = 0;
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
	if(keyNum1%2 ==0){ //alternate pasting the two types of enemy in the game
		enemy = new Enemy(game, 'enemy', 0, x, y, player, maze, mazeValues);
	}else{
		enemy = new Enemy(game, 'enemy2', 0, x, y, player, maze, mazeValues);
	}
	keyNum1++;
	game.add.existing(enemy);
	enemies.add(enemy);
}
function makeTrap(x, y, active=true, rangeX=200, rangeY=200) {
	let trap;
	if(keyNum%2 ==0){ //alternate pasting the two types of traps in the game
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
//kill player and move to gameOver state
function kill(player, enemy){
  nd.play();
  game.state.start('GameOver');
}
function playHit(){
	nd.play();
}
