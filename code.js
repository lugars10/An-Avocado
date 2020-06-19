document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousedown", mouseHandler);
document.addEventListener("scroll", scrollHandler);  

let keysDown = {}; 

let resources = {};
resources["grass1"] = "resources/grass1.png";
resources["grass2"] = "resources/grass2.png";
resources["dirt1"] = "resources/dirt1.png";
resources["dirt2"] = "resources/dirt2.png";
resources["background"] = "resources/background1.png";
resources["playerBullet"] = "resources/ballAv.png";
resources["enemyBullet"] = "resources/ballEnemy.png";  

let vy = 0; //current velocity at y axis -
let time = 0; //counter of how many ticks in the INTERVAL interval occur
let counter = 0;  
let N = 25; //miliseconds for interval 
const BLOCK = fillNumber(window.innerWidth, window.innerHeight, 10, 7); //measure of each individual block 
const LEFTOVERY = window.innerHeight - 6.5*BLOCK; 
const LEFTOVERX = window.innerWidth - 10 * BLOCK; 
const GRAVITY = 200; 
const BULSPEED = 200; 
const JUMPCOUNT = 1;
const JUMPSPEED = 500;
const WALKSPEED = 250; 
const WALKERSPEED = 250; //speed for the walker enemy
const SHOOTINGRATE = 1000; //in miliseconds   


let col = new CollisionSystem();
let physics = new Physics(); 

let direction = "";
let space = false; 
let spaceUp = true; 
let onground = false; 
let shoot = false; 
let shootAux = false; 
let shootAnim = -1; //whenever -1 it means it is not executing  
let spaceCounter = 0; 
let animCounter = 0; 
let zonePreloaded = false; 
let mouseX = 0;
let mouseY = 0;
let health = 3;  //the player life points 
let enemies = []; 

let background = new NodeObject(window.innerWidth-LEFTOVERX,window.innerHeight-LEFTOVERY);
background.setPos(LEFTOVERX/2, LEFTOVERY); 
background.preload(resources["background"]); 
background.sendToBack();

let leftBackground = new NodeObject(window.innerWidth-LEFTOVERX, LEFTOVERY); 
leftBackground.setPos(LEFTOVERX/2, 0);
leftBackground.setColor("#BAEAFF");

let player = new NodeObject(BLOCK, BLOCK); 
player.preload("resources/quietAv.png", "auto"); 
player.preload("resources/fallingAv.png", "auto")
player.preload("resources/walkAv0.png", "auto");
player.preload("resources/walkAv1.png", "auto"); 
player.preload("resources/walkAv2.png", "auto"); 
player.preload("resources/walkAv3.png", "auto"); 
player.preload("resources/walkAv4.png", "auto");
player.preload("resources/attackAv.png", "auto");  

player.setImage("resources/quietAv.png"); 
physics.addBody(player, "player", player.width, player.height); 
let floor = new NodeObject(window.innerWidth - LEFTOVERX, BLOCK);
floor.setPos(coordToPos(0,6).x, coordToPos(0,6).y);
floor.setColor("transparent");
physics.addBody(floor, "floor", floor.width, floor.height);


let playButton = new NodeObject(BLOCK, BLOCK);
let buttonPos = coordToPos(5, 3);
playButton.setPos(buttonPos.x - BLOCK/2, buttonPos.y - BLOCK/2); 
playButton.childBody.onmouseenter = function(){document.body.style.cursor = "grab";}
playButton.childBody.onmouseleave = function(){document.body.style.cursor = "default";}
playButton.sendToFront();
playButton.setColor("transparent");

let pBullets = [];
let boxes = []; //the array of all collision boxes present throughout the stages of the game, it contains the IDs of the physic bodies 

let p = coordToPos(2,1);
player.setPos(p.x, p.y); 
//player.setColor("blue"); 

//////////////////////////////////////////
///////// ----- RESOURCES ------ /////////
//let playerBullet = new NodeObject(BLOCK/5, BLOCK/5); 
//playerBullet.hide();
//playerBullet.preload(resources["playerBullet"]); 

floor.sendToFront();
worldLayout("0,6,dirt1 1,6,dirt2 2,6,grass1 3,6,grass1 4,6,grass2 5,6,grass1 6,6,dirt1 7,6,dirt1 8,6,grass1 9,6,grass2 5,5,grass2 5,4,grass1");

let INTERVAL = window.setInterval(_delta, N); 

function _delta()
{
    background.setImage(resources["background"]); 
    background.sendToBack();

    switch(direction) //reads the direction variable and updates position of player 
    {
        case "right":
            //physics.accelerate("player", {x: WALKSPEED*N/1000, y: 0}, {x: 0, y: 0}, N);
            physics.velocityVector("player", {x: WALKSPEED*N/1000, y: 0}); 
            player.mirrorImage("right"); 
            break;
        case "left":
            //physics.accelerate("player", {x: -WALKSPEED*N/1000, y: 0}, {x: 0, y: 0}, N);
            physics.velocityVector("player", {x: -WALKSPEED*N/1000, y: 0}); 
            player.mirrorImage("left");
            break;
    }

    for(let i = 0; i!= pBullets.length; i++) //updates every position of all bullets 
    {
        //pBullets[i].setPos(pBullets[i].x + (150*N)/1000, pBullets[i].y); 
        //pBullets[i][0].setPos(pBullets[i][0].x + (pBullets[i][1].VX * N)/1000, pBullets[i][0].y + (pBullets[i][1].VY * N)/1000);
        physics.velocityVector("bullet" + i, {x: pBullets[i][1].VX * N/1000, y: pBullets[i][1].VY * N/1000}); 
        physics.update("bullet" + i);
        physics.resetYForBody("bullet" + i);
    }

    if(space && spaceCounter < JUMPCOUNT && spaceUp) //if the player presses the space bar 
    {
        //vy += JUMPSPEED;
        //physics.accelerate("player", {x: 0, y: -JUMPSPEED*N/1000}, {x: 0, y: 0}, N); 
        physics.velocityVector("player", {x: 0, y: -JUMPSPEED*N/1000}); 
        space = false;
        spaceCounter++; 
        spaceUp = false; 
        onground = false;
          
    }

    if(onground)
    {
        if(direction != "" && shootAnim == -1)
        {
            let frameNumber = Math.floor( (animCounter%(5*3)) /3); 
            player.setImage("resources/walkAv" + frameNumber + ".png");
        }
        else if(shootAnim == -1)
        {
            player.setImage("resources/quietAv.png");
            animCounter = 0;  
        }
        
    }
    if(!onground) // if the player is jumping or falling 
    {
        if(shootAnim == -1)
        {
            player.setImage("resources/fallingAv.png"); 
        }
    }

    //AAAAAAAA!!!!!!!!!!!
    //AAAAAAAAAAAAAAAAAAAAAAA
    if(shootAux) //Remove this code after implementetion of updateBullets AAAAAAAA!!!!!
    {
        pBullets[pBullets.length-1][0].setImage("resources/ballAv.png");
        if(pBullets[pBullets.length-1][3] == -1)
        {
            pBullets[pBullets.length-1][0].rotate(pBullets[pBullets.length-1][2] + Math.PI);
        }
        else
        {
            pBullets[pBullets.length-1][0].rotate(pBullets[pBullets.length-1][2])
        }
         
        //pBullets[pBullets.length-1][0].mirrorImage(pBullets[pBullets.length-1][3] );
        shootAux = false; 
    }

    if(shoot && shootAnim == -1)  //if the player presses the right button of the mouse 
    {
        let bullet = new NodeObject(BLOCK/5, BLOCK/5);
        let angle = Math.atan((mouseY-(player.y+player.height/2))/(mouseX-(player.x+player.width/2))); 
        let sign = Math.sign(mouseX-(player.x+player.width/2));
        let velocityX = BULSPEED * Math.cos(angle); 
        let velocityY = BULSPEED * Math.sin(angle); 
        bullet.setColor("green");
        //bullet.setRound("100%");
        bullet.preload("resources/ballAv.png", "auto");
        //bullet.mirrorImage(dir); 
        //bullet.setImage("resources/ballAv.png");
        bullet.setPos(player.x + player.width/2 - 5, player.y + player.height/2 - 5); //check and change this

        pBullets.push([bullet, {VX: velocityX*sign, VY: velocityY*sign}, angle, sign]);  
        physics.addBody(bullet, "bullet" + (pBullets.length-1), BLOCK/5, BLOCK/5);  
        player.setImage("resources/attackAv.png");

        
        shoot = false;
        shootAux = true; 
        shootAnim = 0;  
    }
    //player.setPos(player.x, player.y - (vy*N)/1000);
    //physics.accelerate("player", {x: 0, y: 0}, {x: 0, y: GRAVITY*N/1000}, N);
    physics.accelerationVector("player", {x: 0, y: GRAVITY*N/1000}, N/1000); 

    physics.update("player");


    if(physics.areColliding("player", "floor", true, 0))
    {
        //player.setPos(player.x, floor.y-player.height+0.5); 
        //player.setImage("resources/quietAv.png"); 
        onground = true; 
        spaceCounter = 0; 
    }
    else
    {
        onground = false; 
    }

    physics.resetX(); 
    animCounter++;
    if(shootAnim != 10 && shootAnim != -1){shootAnim++;}
    else if(shootAnim == 10){shootAnim = -1;}
    else{ shootAnim = -1; } //default 

}

function zone1()
{
    if(!zonePreloaded)
    {

    }
}

//each enemy in "enemies" array is another array that looks like this:
// [node, bodyID, enemyType, walkerPos1, walkerPos2, walkerDirection, shooterRange, shooterCounter, damage, health]
//where "enemyType" can be "walker" or "shooter", when it is "shooter", walkerPos1 & 2 can have any value
//tho is recommended to be set to 0 or undefined, the same happens when enemyType = "walker" and the shooterRange parameter
//walkerPos1 & 2 just specifies a range in the x axis that the walker will walk through repeately
//walkerDirection is an auxiliary variable to determine the current direction of the walking cycle, 0 is right, 1 is left   
function updateEnemies()
{
    for(let i = 0; i != enemies.length; i++)
    {
        if(enemies[i][2] == "walker")
        {
            if(enemies[i][0].x + enemies[i][0].width < enemies[i][4] && enemies[i][5] == 0)   //RIGHT DIRECTION
            {
                physics.velocityVector(enemies[i][1], WALKERSPEED*N/1000); 
            }
            else if(enemies[i][0].x >= enemies[i][4])
            {
                physics.velocityVector(enemies[i][1], -WALKERSPEED*N/1000);
                enemies[i][0].mirrorImage("left"); 
                enemies[i][5] = 1;
            }
            else if(enemies[i][0].x > enemies[i][3] && enemies[i][5] == 1)  //LEFT DIRTECTION
            {
                physics.velocityVector(enemies[i][1], -WALKERSPEED*N/1000);
            }
            else if(enemies[i][0].x <= enemies[i][3])
            {
                physics.velocityVector(enemies[i][1], WALKERSPEED*N/1000);
                enemies[i][0].mirrorImage("right"); 
                enemies[i][5] = 0; 
            }
            
        }
        else if(enemies[i][1] == "shooter")
        {
            let shooterCenter = {x: enemies[i][0].x + enemies[i][0].width/2, y: enemies[i][0].y + enemies[i][0].height/2}; 
            let playerCenter = {x: player.x + player.width/2, y: player.y + player.height/2}; 
            let distance = Math.sqrt(Math.pow(shooterCenter.x - playerCenter.x) + Math.pow(shooterCenter.y - playerCenter.y));
            if(distance <= enemies[i][6]) //IN RANGE
            {
                if(enemies[i][7] == SHOOTINGRATE) //if enough time has passed, the enemy shoots 
                {

                    enemies[i][7] = 0; 
                }
                else
                {
                    enemies[i][7] += N; 
                }
                
            }
        } 
        physics.update(enemies[i][1]); 
    }
}

function updateBullets()
{
    for(let i = 0; i!= pBullets.length; i++) //updates every position of all bullets 
    {
        //pBullets[i].setPos(pBullets[i].x + (150*N)/1000, pBullets[i].y); 
        if(pBullets[i] == 0){continue;} //passes to the next itetarion if the bullet has been destroyed 

        //pBullets[i][0].setPos(pBullets[i][0].x + (pBullets[i][1].VX * N)/1000, pBullets[i][0].y + (pBullets[i][1].VY * N)/1000);
        physics.velocityVector("bullet" + i, {x: pBullets[i][1].VX * N/1000, y: pBullets[i][1].VY * N/1000}); 
        physics.update("bullet" + i);
        physics.resetYForBody("bullet" + i);

        if(pBullets[i][4])
        {
            pBullets[i][0].setImage("resources/ballAv.png");
            if(pBullets[i][3] == -1)
            {
                pBullets[i][0].rotate(pBullets[i][2] + Math.PI);
            }
            else
            {
                pBullets[i][0].rotate(pBullets[i][2])
            }
            pBullets[i][4] = false; 
        }
        
        if(physics.areColliding("bullet" + i, "player") && pBullets[i][5] == "enemy") //if bullet hits player 
        {
            health--;
            physics.removeBody("bullet" + i);
            pBullets[i][0].hide();
            pBullets[i] = 0; 
        }

        for(let j = 0; j != boxes.length; j++)
        {
            if(physics.areColliding("bullet" + i, boxes[j]))
            {
                physics.removeBody("bullet" + i);
                pBullets[i][0].hide();
                pBullets[i] = 0; 
            }
        }

        
    }
}

//bulletType specifies if the bullet is shot by the player with "player" value or shot by an enemy, specified as "enemy"
//fromCenter represents the 2d object with x and y components in which the bullet appears and then directed to toCenter coordinates
function createBullet(bulletType, fromCenter, toCenter)
{
    let bullet = new NodeObject(BLOCK/5, BLOCK/5);

    //fromCenter.y+player.height/2
    let angle = Math.atan((toCenter.y-fromCenter.y)/(toCenter.x-fromCenter.x)); 
    let sign = Math.sign(toCenter.x-fromCenter.x);
    let velocityX = BULSPEED * Math.cos(angle); 
    let velocityY = BULSPEED * Math.sin(angle); 
    //bullet.setColor("green");
    //bullet.setRound("100%");
    //bullet.preload("resources/ballAv.png", "auto");
    //bullet.mirrorImage(dir); 
    //bullet.setImage("resources/ballAv.png");
    bullet.setPos(fromCenter.x - BLOCK/5, fromCenter.y - BLOCK/5); //check and change this, AGAIN

    if(bulletType == "player")
    {
        bullet.preload(resources["playerBullet"]);
        player.setImage("resources/attackAv.png"); 
        shoot = false;
        shootAnim = 0;  
    }
    else if(bulletType == "enemy")
    {
        bullet.preload(resources["enemyBullet"]);
    }
    pBullets.push([bullet, {VX: velocityX*sign, VY: velocityY*sign}, angle, sign, true, bulletType]);  
    physics.addBody(bullet, "bullet" + (pBullets.length-1), BLOCK/5, BLOCK/5);  
    
    //shootAux = true;  
}

function coordToPos(xPos, yPos) //converts coordinates of blocks to real position to manage top and left css properties
{
    let position = {x: LEFTOVERX/2 + xPos*BLOCK , y: LEFTOVERY + yPos*BLOCK}; 
    return position;
}

function fillNumber(width, height, widthS, heightS)
{
    let f = 1; 
    while(f*widthS < width && f*heightS<height)
    {
        f++; 
    }
    f--;
    return f; 
}

function worldLayout(seed)
{
    let blocks = seed.split(" ");
    for(let i = 0; i!=blocks.length; i++)
    {
        let parameters = blocks[i].split(",");
        let blockNode = new NodeObject(BLOCK, BLOCK);
        let pos = coordToPos(parseInt(parameters[0]), parseInt(parameters[1]));
        blockNode.setPos(pos.x, pos.y);
        //blockNode.setColor(parameters[2]); 
        blockNode.preload(resources[parameters[2]]); 
        window.setTimeout(function(){blockNode.setImage(resources[parameters[2]])}, 1000); 
    }
}


function keyDownHandler(event) //handles the button of movement of player 
{
    keysDown[event.key] = true; 

    if(keysDown[" "]){space = true;}
    if(keysDown["d"]){direction = "right";}
    if(keysDown["a"]){direction = "left";}

}

function keyUpHandler(event) //handles the moment of player's stopping 
{
    if(event.key == " "){spaceUp = true; space = false; } 
    keysDown[event.key] = false;
    if(!keysDown["d"] && !keysDown["a"]){direction = "";}
    else if(!keysDown["d"]){direction = "left";}
    else if(!keysDown["a"]){direction = "right";}
    
}

function mouseHandler(event) //handles the shooting of player 
{
    switch(event.button)
    {
        case 0:
            shoot = true;
    }
    mouseX = event.pageX; 
    mouseY = event.pageY; 
}

function scrollHandler()
{
    scrollTo(0,0); 
}
