// team git hub https://github.com/MaxwellBurkhart/Polite-Minotaur-repo && finished on https://github.com/deojo/PM
// Team Members: Maxwell Burkhart, Deo Joshi, Attie Sit

"use strict";
var game; //define game
var six , seven;
var sound3, nd, hitTrap, death, walking, mainSound, enemySound, activate, winSound;
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
var s;

// define MainMenu state and methods


// define Play state and methods



window.onload = function(){
	game = new Phaser.Game(900, 900, Phaser.AUTO);
	game.state.add('MainMenu', MainMenu);
	game.state.add('Play', Play);
	game.state.add('GameOver', GameOver);
	game.state.start('MainMenu');
}
//Game States
