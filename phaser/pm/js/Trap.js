// created by dsjoshi
// Trap prefab constructor function
function Trap(game, key1, key2, frame, x , y, active, rangeX, rangeY) {

    // Create Traps
    this.keyset = [key1, key2];
    Phaser.Sprite.call(this, game, x, y, active? key1: key2, frame);
    this.enableBody = true;
	this.active = active;
	this.count = 0;
	this.collided = false;
    // put some physics on it
    game.physics.enable(this);
    this.body.collideWorldBounds = false;
    this.body.immovable = true;
    this.range = game.make.sprite(x-rangeX/2, y-rangeY/2, null);
    game.physics.enable(this.range);
    this.range.enableBody = true;
    this.anchor.setTo(0.5,0.5);
    this.range.body.setSize(rangeX, rangeY);
    this.range.container = this;
}

// Define prefab's prototype and constructor (Trap) so all the objects inherit
Trap.prototype = Object.create(Phaser.Sprite.prototype);
Trap.prototype.constructor = Trap;

Trap.prototype.deactivate = function() {
	this.loadTexture(this.keyset[1]);
	this.active = false;
};
Trap.prototype.activate = function() {
    this.loadTexture(this.keyset[0]);
    this.active = true;
};

Trap.prototype.toggle = function() {
    if (this.count === 5 || !this.active || !this.collided){
        this.loadTexture(this.keyset[1 - this.keyset.indexOf(this.key)]);
        this.active = !this.active;
        this.count = 0;
        this.collided = false;
        hitTrap.play();
    }else{game.camera.shake(); this.count++;}
    return this.count !== 5 && this.active;
};
