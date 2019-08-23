// created by dsjoshi
// Wall prefab constructor function
function Wall(game, key, frame, x , y) {

    // Create Walls

    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.enableBody = true;
    // put some physics on it
    game.physics.enable(this);
    this.body.collideWorldBounds = false;

    this.body.immovable = true;
}

// Define prefab's prototype and constructor (Walls) so all the objects inherit
Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;
