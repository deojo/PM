// created by dsjoshi
// Enemy prefab constructor function
function Enemy(game, key, frame, x , y) {

    // Create Enemies

    Phaser.Sprite.call(this, game, x, y, key, frame, player, maze, mazeValues);
    this.frozen = false;
    this.enableBody = true;
    // put some physics on it
    game.physics.enable(this);
    this.body.collideWorldBounds = false;
    this.bounds = this.raycast(maze, mazeValues);
    this.dir = 1;
}

// Define prefab's prototype and constructor (Enemies) so all the objects inherit
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.searching = function (player, maze, mazeValues) {
    if (this.frozen){return;}
    let start = [Math.floor(this.body.x/300), Math.floor(this.body.y/300)];
    let end = [Math.floor(player.position.x/300), Math.floor(player.position.y/300)];
    if (start === end){game.physics.arcade.moveToObject(this, player, 100); return;}
    let map ={};
    let candidates = [];
    let list = [[start[0] - 1, start[1]], [start[0] + 1, start[1]], [start[0], start[1] + 1], [start[0], start[1] - 1]];
    for (var dest of list){
        if (maze[dest[0]][dest[1]] === mazeValues.Pathway || maze[dest[0]][dest[1]] === mazeValues.Exit){
            let dist = euclidean(dest, end);
            candidates.push(dist);
            map[dist]= dest;
        }
    }
    let t = map[Math.min.apply(null, candidates)];
    let x = t[0] * 300;
    let y = t[1] * 300;
    game.physics.arcade.moveToXY(this, x, y, 100);
};
Enemy.prototype.raycast = function(maze, mazeValues){
    let start = [Math.floor(this.body.x / 300), Math.floor(this.body.y / 300)];
    let left = start[0], right = start[0], up = start[1], down = start[1];
    for(let i = start[0]; i >= 0; i--){
        if(maze[i][start[1]] !== mazeValues.Wall){left--;}
        else {break;}
    }
    for(let i = start[0]; i < maze.length; i++){
        if(maze[i][start[1]] !== mazeValues.Wall){right++;}
        else {break;}
    }
    for(let i = start[1]; i >= 0; i--){
        if(maze[start[0]][i] !== mazeValues.Wall){up--;}
        else {break;}
    }
    for(let i = start[1]; i < maze[start[0]].length; i++){
        if(maze[start[0]][i] !== mazeValues.Wall){down++;}
        else {break;}
    }
    console.log(left, right, up, down);
    if(right - left < down - up){return [left, right, true];}
    else{return [up, down, false];}
};

Enemy.prototype.update = function() {
    if (!this.frozen) {
        if (this.bounds[2]) {
            if (this.body.x <= 300 * (this.bounds[0] + 1)) {
                this.dir = 1;
                this.frame = 2;
            }
            if (this.body.x >= 300 * this.bounds[1]) {
                this.dir = -1;
                this.frame = 0;
            }
            this.body.velocity.x = 200 * this.dir;
        } else {
            if (this.body.y <= 300 * this.bounds[0]) {
                this.dir = 1;
                this.frame = 3;
            }
            if (this.body.y >= 300 * this.bounds[1]) {
                this.dir = -1;
                this.frame = 1;
            }
            this.body.velocity.y = 200 * this.dir;
        }
    }
}


function euclidean(pos1, pos2) {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}
