function generateMaze(x,y){
    maze = [];
    let temp;
    for(var i = 0; i<y; i++){
        maze[i] = [];
        for(var h = 0; h<x; h++){
            maze[i][h] = null;
        }
    }
    let exit = createExit(x,y);
    createPerimeter(x,y,exit);
    createInner(exit, x ,y);
}
// creates the perimater of the maze
function createPerimeter(x,y,exit){
    console.log(maze);
    for(var i = 0; i <y; i++){//i represents the y axis
        for(var h = 0; h<x; h++){//h represents the x axis
            if(i<1||i+1 == y){
                makeWall(h*300,i*300);
                maze[h][i] = 1;
            }
            else if(h==0||h == x -1){
                if(i !== exit || h === y-1){// need to create a function to make game end on exit that works with generation
                    makeWall(h*300,i*300);
                    maze[h][i] = 1;
                }
            }
            if(maze[0].length > y){
                debugger;
            }
        }
    }
}
function createExit(x,y){// curently broken and always picks the top left as the exit
    let temp1 = game.rnd.integerInRange(0,y);// this might be wrong
    //make sure this is the proper way to destroy walls
    maze[0][1] = 2;
    return 1;//
}
function createInner(start, width, length){
    nVisited = []; // ist of what needs to be visited
    let done = 0;// while flagloop
    let temp1 = 0;
    let temp2 = 0;
    let holder1;
    let holder2;

    const mazeValues ={
        Pathway: 5,
        Both: 4,
        unVis: 3,
        Exit: 2,
        Wall: 1

    }
    //let total = 0;
    //set all even/even to 3, odd/odd to 1 and odd/even to 4
    console.log(maze);
    for(var i = 0; i <length; i++){//i represents the y axis
        for(var h = 0; h<width; h++){//h represents the x axis
            // all even/even
            if((i%2) != 0 && (h%2) != 0 && h != (width -1) && h != (length-1)){
                maze[h][i] = mazeValues.unVis;
            }
            //all odd/odd
            else if((i%2) == 0 && (h%2) == 0 && h != (width -1) && h != (length-1)){
                maze[h][i] = mazeValues.Wall;
                makeWall(h*300,i*300);
            }
            //all even/odd
            //else if(h < (width -1) && h < (length-1)){
            // maze[h][i] = mazeValues.Both;
            //}
        }
    }
    console.log(maze);
    //set exit as start and adds it to visited and sets it to 5
    maze[1][start] = mazeValues.Pathway;
    if(start+2 < length -1){
        nVisited.push([1,start+2]);
    }
    if(start-2 > 0){
        nVisited.push([1,start-2]);
    }
    nVisited.push([3,start]);
    //iterates through surounding edges and sees if any are 5?
    while(done == 0){
        if(nVisited.length != 0){
            //selects random from nVisited
            temp1 = game.rnd.integerInRange(0,nVisited.length-1);
            holder1 = nVisited[temp1];
            maze[holder1[0]][holder1[1]] = mazeValues.Pathway;
            let direction = [];
            //checks to see which direction there are 5s so it can path to it
            // checks west
            if([holder1[0]-2] > 0){
                if(maze[holder1[0]-2][holder1[1]] == mazeValues.Pathway){
                    direction.push([holder1[0]-2,holder1[1]]);
                }
            }
            //checks east
            if([holder1[0]+2] < width){
                if(maze[holder1[0]+2][holder1[1]] == mazeValues.Pathway){
                    direction.push([holder1[0]+2,holder1[1]]);
                }
            }
            // checks north
            if([holder1[1]-2] > 0){
                if(maze[holder1[0]][holder1[1]-2] == mazeValues.Pathway){
                    direction.push([holder1[0],holder1[1]-2]);
                }
            }
            // checks south
            if([holder1[1]-2] < length){
                if(maze[holder1[0]][holder1[1]+2] == mazeValues.Pathway){
                    direction.push([holder1[0],holder1[1]+2]);
                }
            }
            temp2 = game.rnd.integerInRange(0,direction.length-1);
            holder2 = direction[temp2];
            // checks to see where to add new path and conect new segment
            if(holder1[0]+2 == holder2[0]){
                maze[holder1[0]+1][holder1[1]] = mazeValues.Pathway;
            }
            else if(holder1[0]-2 == holder2[0]){
                maze[holder1[0]-1][holder1[1]] = mazeValues.Pathway;
            }
            else if(holder1[1]+2 == holder2[1]){
                maze[holder1[0]][holder1[1]+1] = mazeValues.Pathway;
            }
            else if(holder1[1]-2 == holder2[1]){
                maze[holder1[0]][holder1[1]-1] = mazeValues.Pathway;
            }
            direction = [];

            if([holder1[0]-2] > 0){
                if(maze[holder1[0]-2][holder1[1]] == mazeValues.unVis){
                    nVisited.push([holder1[0]-2,holder1[1]]);

                }
            }
            //checks east
            if([holder1[0]+2] < width){
                if(maze[holder1[0]+2][holder1[1]] == mazeValues.unVis){
                    nVisited.push([holder1[0]+2,holder1[1]]);

                }
            }
            // checks north
            if([holder1[1]-2] > 0){
                if(maze[holder1[0]][holder1[1]-2] == mazeValues.unVis){
                    nVisited.push([holder1[0],holder1[1]-2]);

                }
            }
            // checks south
            if([holder1[1]+2] < length){
                if(maze[holder1[0]][holder1[1]+2] == mazeValues.unVis){
                    nVisited.push([holder1[0],holder1[1]+2]);
                }
            }
            holder1 = [];
            holder2 = [];
            nVisited.splice(temp1,1);
        }
        /*if (check serounding edges of all visited and store all with 3 in potental ie x+2,x-2,y+2,y-2){
            randomly picks one of the posible numbers and sets it to 5
            sets the path between visted and 5 to 5
        }*/
        else{
            done++;// means there are no more 5s left sets all remaining 3s to 1s
            for(var i = 0; i <length; i++){//i represents the y axis
                for(var h = 0; h<width; h++){//h represents the x axix
                    if(maze[h][i] == null){
                        maze[h][i] = 1;
                        makeWall(h*300,i*300);
                    }
                }
            }
        }
    }
    // if not set as possible new path to use use
    //randomly select a path
}
function enemySearching(enemy) {
    let start = [Math.ceil(enemy.body.x/300), Math.ceil(enemy.body.y/300)];
    let map ={};
    let candidates = [];
    let list = [[start[0] - 1, start[1]], [start[0] + 1, start[1]], [start[0], start[1] + 1], [start[0], start[1] - 1]];
    for (var a of list){
        if (maze[a[0]][a[1]] === 5 || maze[a[0]][a[1]] === 2){
            let dist = euclidean(a, [player.position.x/300, player.position.y/300]);
            candidates.push(dist);
            map[dist]= a;
        }
    }
    var t = map[Math.min.apply(null, candidates)];
    var x = t[0] * 300;
    var y = t[1] * 300;
    game.physics.arcade.moveToXY(enemy,x, y, 100);
}
function euclidean(pos1, pos2) {
    return Math.abs(pos1[0] - pos2[0] ) + Math.abs( pos1[1] - pos2[1]);
}