// created by dsjoshi
// Enemy prefab constructor function

function Enemy(game, key, frame, x , y) {

    // Create Enemies

    Phaser.Sprite.call(this, game, x, y, key, frame);
    this.frozen = false;
    //this.anchor.set(0.5, 0.5);
    this.enableBody = true;
    // put some physics on it
    game.physics.enable(this);
    this.body.collideWorldBounds = false;
    this.bounds = this.raycast(maze, mazeValues);
    this.previousEnemyPosition = null;
    this.dir = 1;
    this.searching = false;
    this.boundsBreached = false;
}

// Define prefab's prototype and constructor (Enemies) so all the objects inherit
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.minimumDistance = function (enemyPosition, playerPosition, maze, mazeValues){

    //if ( this.previousEnemyPosition === null ||
      //  !(this.previousEnemyPosition.x === enemyPosition.x && this.previousEnemyPosition.y === enemyPosition.y) )
    {
        let visited = [];
        for (let i = 0; i < maze[0].length; i++) {
            visited[i] = [];
            for (let h = 0; h < maze.length; h++) {
                visited[i][h] = null;
            }
        }
        for (let i = 0; i < maze[0].length; i++) {
            for (let h = 0; h < maze.length; h++) {
                if (maze[h][i] === mazeValues.Wall) {
                    visited[h][i] = true;
                } else visited[h][i] = h === enemyPosition.x && i === enemyPosition.y;
            }
        }

        let queue = [];
        queue[0] = enemyPosition;
        while (queue.length > 0) {
            let qItem = queue.shift();

            if (qItem.x === playerPosition.x && qItem.y === playerPosition.y) {
                return qItem;
            }

            // moving up
            if (qItem.x - 1 >= 0 &&
                visited[qItem.x - 1][qItem.y] === false) {
                queue.push({x: qItem.x - 1, y: qItem.y, dist: qItem.dist + 1, parent: qItem});
                visited[qItem.x - 1][qItem.y] = true;
            }

            // moving down
            if (qItem.x + 1 < maze[0].length &&
                visited[qItem.x + 1][qItem.y] === false) {
                queue.push({x: qItem.x + 1, y: qItem.y, dist: qItem.dist + 1, parent: qItem});
                visited[qItem.x + 1][qItem.y] = true;
            }

            // moving left
            if (qItem.y - 1 >= 0 &&
                visited[qItem.x][qItem.y - 1] === false) {
                queue.push({x: qItem.x, y: qItem.y - 1, dist: qItem.dist + 1, parent: qItem});
                visited[qItem.x][qItem.y - 1] = true;
            }

            // moving right
            if (qItem.y + 1 < maze.length &&
                visited[qItem.x][qItem.y + 1] === false) {
                queue.push({x: qItem.x, y: qItem.y + 1, dist: qItem.dist + 1, parent: qItem});
                visited[qItem.x][qItem.y + 1] = true;
            }
        }
    }
    return null;
};

Enemy.prototype.search = function (player, maze, mazeValues) {
    if( ! this.frozen ){
        let enemyPosition = {x:Math.floor(this.body.x/300), y:Math.floor(this.body.y/300), dist:0, parent: null};
        let playerPosition = {x:Math.floor(player.body.x / 300),y: Math.floor(player.body.y / 300)};

        let nextEnemyPosition = this.minimumDistance(enemyPosition, playerPosition, maze, mazeValues);

        if( nextEnemyPosition != null ) {
            while (nextEnemyPosition !== null) {
                if (nextEnemyPosition.parent !== null &&
                    !(nextEnemyPosition.parent.x === enemyPosition.x && nextEnemyPosition.parent.y === enemyPosition.y)) {
                    nextEnemyPosition = nextEnemyPosition.parent;
                } else {
                    break;
                }
            }
            let xDifference = enemyPosition.x - nextEnemyPosition.x;
            let yDifference = enemyPosition.y - nextEnemyPosition.y;

            if (xDifference < 0) {
                //left
                this.frame = 2;
            } else if (xDifference > 0) {
                // right
                this.frame = 0;
            } else if (yDifference < 0) {
                //top
                this.frame = 3;
            } else if (yDifference > 0) {
                //bottom
                this.frame = 1;
            }
            this.previousEnemyPosition = nextEnemyPosition;
            let x = (nextEnemyPosition.x * 300) + 95;
            let y = (nextEnemyPosition.y * 300) + 95;
            game.physics.arcade.moveToXY(this, x, y, 100);
        }
    }
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
    if (!this.frozen ) {
        let start = [Math.floor(this.body.x / 300), Math.floor(this.body.y / 300)];
        let end = [Math.floor(player.x / 300), Math.floor(player.y / 300)];

        //this.bounds = this.raycast(maze, mazeValues);

        let dist = euclidean(start, end);
        if( dist >= 2 && !this.boundsBreached) {
            if (this.bounds[2]) {
                // left
                if (this.body.x <= 300 * this.bounds[0] + 300) {
                    this.dir = 1;
                    this.frame = 2;
                }
                // right
                if (this.body.x >= 300 * this.bounds[1] - 100) {
                    this.dir = -1;
                    this.frame = 0;
                }
                this.body.velocity.x = 200 * this.dir;
            } else {
                //top
                if (this.body.y <= 300 * this.bounds[0] + 300) {
                    this.dir = 1;
                    this.frame = 3;
                }
                //bottom
                if (this.body.y >= 300 * this.bounds[1] - 100) {
                    this.dir = -1;
                    this.frame = 1;
                }
                this.body.velocity.y = 200 * this.dir;
            }
        }else /*if ( dist < 5 )*/ {
            this.boundsBreached = true;
            this.body.velocity.setTo(0,0);
            this.search(player, maze, mazeValues);
        }
    }else{
        this.body.velocity.setTo(0,0);
    }
};

function euclidean(pos1, pos2) {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

