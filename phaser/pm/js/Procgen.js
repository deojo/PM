const mazeValues ={// values used to mark walls
    Pathway: 5,
    Both: 4,
    unVis: 3,
    Exit: 2,
    Wall: 1

};


function generateMaze(x,y){
  //set up intial maze
    maze = [];
    let temp;
    for(var i = 0; i<y; i++){//i = y axis
        maze[i] = [];
        for(var h = 0; h<x; h++){ //h = x axis
            maze[i][h] = null;
        }
    }
    let exit = createExit(x,y);// calls create exit function
    createPerimeter(x,y,exit);// calls function to create perimater
    createInner(exit, x ,y);// calls function to set up interior
    return maze;// returns maze value
}

// creates the perimater of the maze
function createPerimeter(x,y,exit){
    console.log(maze);
    for(var i = 0; i <y; i++){//i represents the y axis
        for(var h = 0; h<x; h++){//h represents the x axis
            if(i<1||i+1 == y){// creats walls on right and left side
                makeWall(h*300,i*300);
                maze[h][i] = 1;
            }
            else if(h==0||h == x -1){// creates walls on top or bottom
                if(i !== exit || h === y-1){// need to create a function to make game end on exit that works with generation
                    makeWall(h*300,i*300);
                    maze[h][i] = 1;
                }
                else if(i == exit || h === y-1){
                  makePath(0, exit*300);// sets exit to a path
                }
            }
        }
    }
}
function createExit(x,y){// creates exit. rigged to only pick left hand side and only works on 13x13 walls
    let temp1 = game.rnd.integerInRange(0,4);//picks the actula location
    let temp2;
    let haha = [1,3,5,7,9,11];
    temp2 = haha[temp1];
    maze[0][temp2] = 2;//sets exit location
    return temp2;//
}
function createInner(start, width, length){
    nVisited = []; // list of what needs to be visited
    let done = 0;// while flagloop
    let temp1 = 0;
    let temp2 = 0;
    let holder1;
    let holder2;
    //set all even/even to 3, odd/odd to 1 and odd/even to 4
    console.log(maze);
    for(var i = 0; i <length; i++){//i represents the y axis
        for(var h = 0; h<width; h++){//h represents the x axis
            // all even/even
            if((i%2) != 0 && (h%2) != 0 && h != (width -1) && h != (length-1)){// sets all even even to paths
                maze[h][i] = mazeValues.unVis;
            }
            //all odd/odd
            else if((i%2) == 0 && (h%2) == 0 && h != (width -1) && h != (length-1)){//sets all odd dood to walls
                maze[h][i] = mazeValues.Wall;
                makeWall(h*300,i*300);
            }
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
            // checks west and adds it to direction array
            if([holder1[0]-2] > 0){
                if(maze[holder1[0]-2][holder1[1]] == mazeValues.Pathway){
                    direction.push([holder1[0]-2,holder1[1]]);
                }
            }
            //checks east and adds it to direction array
            if([holder1[0]+2] < width){
                if(maze[holder1[0]+2][holder1[1]] == mazeValues.Pathway){
                    direction.push([holder1[0]+2,holder1[1]]);
                }
            }
            // checks north and adds it to direction array
            if([holder1[1]-2] > 0){
                if(maze[holder1[0]][holder1[1]-2] == mazeValues.Pathway){
                    direction.push([holder1[0],holder1[1]-2]);
                }
            }
            // checks south and adds it to direction array
            if([holder1[1]-2] < length){
                if(maze[holder1[0]][holder1[1]+2] == mazeValues.Pathway){
                    direction.push([holder1[0],holder1[1]+2]);
                }
            }
            temp2 = game.rnd.integerInRange(0,direction.length-1);
            holder2 = direction[temp2];
            // checks to see where to add new path and conect new segment
            if(holder1[0]+2 == holder2[0]){ //checks north and adds in new path to array
                maze[holder1[0]+1][holder1[1]] = mazeValues.Pathway;
            }
            else if(holder1[0]-2 == holder2[0]){ //checks south and adds in new path to array
                maze[holder1[0]-1][holder1[1]] = mazeValues.Pathway;
            }
            else if(holder1[1]+2 == holder2[1]){//checks east and adds in new path to array
                maze[holder1[0]][holder1[1]+1] = mazeValues.Pathway;
            }
            else if(holder1[1]-2 == holder2[1]){//checks west and adds in new path to array
                maze[holder1[0]][holder1[1]-1] = mazeValues.Pathway;
            }
            direction = [];
            // checks for new now open links and adds them to unvisited
            if([holder1[0]-2] > 0){//checcks south
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
            // checks west
            if([holder1[1]-2] > 0){
                if(maze[holder1[0]][holder1[1]-2] == mazeValues.unVis){
                    nVisited.push([holder1[0],holder1[1]-2]);

                }
            }
            // checks east
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
            randomly picks one of the posible numbers
        }*/
        else{
            done++;// means there are no more 5s left sets all remaining 3s to 1s
            for(var i = 0; i <length; i++){//i represents the y axis
                for(var h = 0; h<width; h++){//h represents the x axix
                    if(maze[h][i] == null){//sets 3s to 1s
                        maze[h][i] = 1;
                        makeWall(h*300,i*300);
                    }
                }
            }
            let openLots = [];

            let numTrap = Math.ceil(length/2);
            let numEnemy = Math.ceil(length/2);

            for(var i = 0; i <length; i++){//i represents the y axis
                for(var h = 0; h<width; h++){//h represents the x axix
                    if(maze[h][i] == 5){
                        makePath(h*300, i*300);
                    }
                    if(i>0 && i<13 && h>1 && h!= 9 && h <11 && maze[h][i]==5){
                        openLots.push([h,i]);
                    }
                }
            }
            let hold;
            let sechold;
            // adds all traps and enemys to map
            while(numTrap> 0||numEnemy > 0 ){
                hold = game.rnd.integerInRange(0,openLots.length-1);
                if(numTrap>0){//adds traps
                    //debugger;
                    numTrap--;
                    sechold = openLots[hold];
                    makeTrap(sechold[0]*300+150, sechold[1]*300+150);//places trap
                    openLots.splice(hold,1);
                }
                else if(numEnemy>0){//adds enemys
                    numEnemy--;
                    sechold = openLots[hold];
                    makeEnemy(sechold[0]*300+95, sechold[1]*300+95);
                    openLots.splice(hold,1);
                }
            }
        }
    }
}
