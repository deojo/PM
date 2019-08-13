// created by dsjoshi
// Player prefab constructor function
function Wall(game, key, frame, x , y) {

    // Create platforms

    Phaser.Sprite.call(this, game, x, y, key, frame);

    this.moveSpeed = 150;
    // add custom properties
   // this.anchor.set(0.5);
    this.enableBody = true;
    // put some physics on it
    game.physics.enable(this);
    this.body.collideWorldBounds = false;

    this.body.immovable = true;
}

// Define prefab's prototype and constructor (Snowstorm) so all the objects inherit
Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

Wall.prototype.update = function() {

};
