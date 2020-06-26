document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousedown", mouseHandler);
document.addEventListener("scroll", scrollHandler);  

let keysDown = {}; 


//norm = Normalized
//bNorm = Bottom normalized
//
let resources = {};
resources["grass1"] = "resources/grass1.png";
resources["grass2"] = "resources/grass2.png";
resources["grass1bNorm"] = "resources/grass1bNorm.png";
resources["grass2bNorm"] = "resources/grass2bNorm.png";
resources["dirt1"] = "resources/dirt1.png";
resources["dirt2"] = "resources/dirt2.png";
resources["dirt1Norm"] = "resources/dirt1Normalized.png";
resources["dirt2Norm"] = "resources/dirt2Normalized.png";
resources["background"] = "resources/background1.png";
resources["background2"] = "resources/background2.png";
resources["playerBullet"] = "resources/ballAv.png";
resources["enemyBullet"] = "resources/ballEnemy.png";
resources["walker0"] = "resources/walker0.png";
resources["walker1"] = "resources/walker1.png";
resources["walker2"] = "resources/walker2.png";
resources["walker3"] = "resources/walker3.png";
resources["walker4"] = "resources/walker4.png";
resources["walkerQuiet"] = "resources/walkerQuiet.png";
resources["shooter"] = "resources/shooterEnem.png";
resources["shooterAttack"] = "resources/shooterAttack.png";
resources["heart"] = "resources/heartColored.png";
resources["noheart"] = "resources/heartBlue.png";
resources["noCake"] = "resources/cakeBlue.png";
resources["cake"] = "resources/cakeColored.png";
resources["noCandle"] = "resources/candleBlue.png";
resources["candle"] = "resources/candleColored.png";
resources["noBalloon"] = "resources/balloonBlue.png";
resources["balloon"] = "resources/balloonColored.png";

let vy = 0; //current velocity at y axis -
let time = 0; //counter of how many ticks in the INTERVAL interval occur
let counter = 0;  
let N = 25; //miliseconds for interval 
const BLOCK = fillNumber(window.innerWidth, window.innerHeight, 10, 7); //measure of each individual block 
const LEFTOVERY = window.innerHeight - 6.5*BLOCK; 
const LEFTOVERX = window.innerWidth - 10 * BLOCK; 
const GRAVITY = 200/99 * BLOCK; 
const BULSPEED = 250/99 * BLOCK; 
const JUMPCOUNT = 1;
const JUMPSPEED = 600/99 * BLOCK;
const WALKSPEED = 290/99 * BLOCK; 
const WALKERSPEED = 100; //speed for the walker enemy
const SHOOTINGRATE = 1500; //in miliseconds
const IMMUNITY = 1000; //miliseconds of immunity after suffering an attack by an enemy    

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
let cZone = 0; //current zone
let mouseX = 0;
let mouseY = 0;
let health = 3;  //the player life points 
let attacked = false;
let immunCounter = 0;  


let background = new NodeObject(window.innerWidth-LEFTOVERX,window.innerHeight-LEFTOVERY);
background.setPos(LEFTOVERX/2, LEFTOVERY); 
background.preload(resources["background"]); 
background.sendToBack();

let leftBackground = new NodeObject(window.innerWidth-LEFTOVERX, LEFTOVERY); 
leftBackground.setPos(LEFTOVERX/2, 0);
leftBackground.setColor("#BAEAFF");

let player = new NodeObject(BLOCK/2, BLOCK); 
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
/*let floor = new NodeObject(window.innerWidth - LEFTOVERX, BLOCK);
floor.setPos(ctp(0,6, 0).x, ctp(0,6, 0).y);
floor.setColor("transparent");
physics.addBody(floor, "floor", floor.width, floor.height); */

let playButton = new NodeObject(BLOCK, BLOCK);
let buttonPos = ctp(5, 3, 0);
playButton.setPos(buttonPos.x - BLOCK/2, buttonPos.y - BLOCK/2); 
playButton.childBody.onmouseenter = function(){document.body.style.cursor = "grab";}
playButton.childBody.onmouseleave = function(){document.body.style.cursor = "default";}
playButton.childBody.onclick = function(){location = location; }
playButton.sendToFront();
playButton.setColor("transparent");

//HEARTS and object HUD///
let heart1 = new NodeObject(BLOCK/2, BLOCK/2);
let heart2 = new NodeObject(BLOCK/2, BLOCK/2);
let heart3 = new NodeObject(BLOCK/2, BLOCK/2);

let balloon = new NodeObject(BLOCK/2/ BLOCK/2); 
let candle = new NodeObject(BLOCK/2/ BLOCK/2); 
let cake = new NodeObject(BLOCK/2/ BLOCK/2); 

heart1.setPos(LEFTOVERX/2 + BLOCK/2, BLOCK/2);
heart2.setPos(LEFTOVERX/2 + BLOCK + BLOCK/8, BLOCK/2);
heart3.setPos(LEFTOVERX/2 + 3*BLOCK/2 + BLOCK/4, BLOCK/2);

balloon.setPos(window.innerWidth - (LEFTOVERX/2 + 3*BLOCK/2 + BLOCK/4) - BLOCK/2, BLOCK/2); 
candle.setPos(window.innerWidth - (LEFTOVERX/2 + BLOCK + BLOCK/8) - BLOCK/2, BLOCK/2); 
cake.setPos(window.innerWidth - (LEFTOVERX/2 + BLOCK/2) - BLOCK/2, BLOCK/2)

heart1.preload(resources["heart"], "auto");
heart1.preload(resources["noheart"], "auto"); 
heart2.preload(resources["heart"], "auto");
heart2.preload(resources["noheart"], "auto"); 
heart3.preload(resources["heart"], "auto");
heart3.preload(resources["noheart"], "auto"); 

balloon.preload(resources["noBalloon"], "auto", BLOCK/2);
balloon.preload(resources["balloon"], "auto", BLOCK/2);
candle.preload(resources["noCandle"], "auto", BLOCK/2);
candle.preload(resources["candle"], "auto", BLOCK/2);
cake.preload(resources["noCake"], "auto", BLOCK/2);
cake.preload(resources["cake"], "auto", BLOCK/2); 

//////////////////////////
let pBullets = [];
let boxes = []; //the array of all collision boxes present throughout the stages of the game, it contains the IDs of the physic bodies 
let enemies = [];
let zonesInit = [false, false, false, false, false] //Stores state of zone, if loaded then true, if not, false  

let p = ctp(2,1, 0);
player.setPos(p.x, p.y); 
//player.setColor("blue"); 

//////////////////////////////////////////
///////// ----- RESOURCES ------ /////////
//let playerBullet = new NodeObject(BLOCK/5, BLOCK/5); 
//playerBullet.hide();
//playerBullet.preload(resources["playerBullet"]); 

worldLayout("0,6,dirt1 1,6,dirt2 2,6,grass1 3,6,grass1 4,6,grass2 5,6,grass1 6,6,dirt1 7,6,dirt1 8,6,grass1 9,6,grass2", 0);
worldLayout("0,6,grass2 1,6,grass1 4,6,dirt1Norm 5,6,dirt2Norm 6,6,dirt2Norm 7,6,dirt1Norm 8,6,dirt2Norm 9,6,dirt2Norm 4,5,grass1bNorm 5,5,grass1bNorm 6,5,grass2bNorm 7,5,dirt1Norm 8,5,grass2bNorm 9,5,grass2bNorm 7,4,grass1bNorm", 1);


//createEnemy("walker", "w0", {x: 0, y: 200}, {x1: 0, x2: 200}, 0, 3, 3);
//createEnemy("shooter", "s0", {x: 0, y: 200}, {x: 0, y: 0}, 1000, 1, 3 ); 
let INTERVAL = window.setInterval(_delta, N); 

function _delta()
{
    
    balloon.setImage(resources["noBalloon"]);
    candle.setImage(resources["noCandle"]);
    cake.setImage(resources["noCake"]);
    balloon.sendToZ(20000);
    candle.sendToZ(20000);
    cake.sendToZ(20000);

    background.setImage(resources["background"]); 
    background.sendToBack();
    updateEnemies();

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

    updateBullets();
    if(shoot && shootAnim == -1)  //if the player presses the right button of the mouse 
    {
        createBullet("player", {x: player.x + player.width/2, y: player.y + player.height/2}, {x: mouseX, y: mouseY});
        
        shoot = false;
        //shootAux = true; 
        shootAnim = 0;  
    }
    else{ shoot = false;}



    if(attacked && immunCounter < IMMUNITY)
    {
        player.setGray(100); 
        immunCounter += N;
    }
    else if(attacked && immunCounter >= IMMUNITY)
    {
        attacked = false; 
        immunCounter = 0;
    }
    else
    {
        player.setGray(0); 
    }

    if(health == 3)
    {
        heart1.setImage(resources["heart"]);
        heart2.setImage(resources["heart"]);
        heart3.setImage(resources["heart"]);
        heart1.sendToZ(20000);
        heart2.sendToZ(20000);
        heart3.sendToZ(20000);
    }
    else if(health == 2)
    {
        heart3.setImage(resources["noheart"]);
    }
    else if(health == 1)
    {
        heart2.setImage(resources["noheart"]); 
    }

    switch(cZone)
    {
        case 0:
            zone0();
            break;
        case 1:
            zone1();
            break;
    }

    physics.accelerationVector("player", {x: 0, y: GRAVITY*N/1000}, N/1000); 
    physics.update("player");
    
    physics.resetX(); 
    animCounter++;
    if(shootAnim != 15 && shootAnim != -1){shootAnim++;}
    else if(shootAnim == 15){shootAnim = -1;}
    else{ shootAnim = -1; } //default 

}

function zone0()
{
    if(!zonePreloaded)
    {
        newBox("f0", {x: 0, y: 6}, {x: 11, y: 7}, 0);
        newBox("zD0", {x: 10, y: 5}, {x: 11, y: 6}, 0); 
        zonePreloaded = true; 
    }
    if(physics.areColliding("player", "f0", true, 0))
    {
        onground = true;
        spaceCounter = 0;
    }
    else
    {
        onground = false; 
    }

    if(physics.areColliding("player", "zD0"))
    {
        let pos = ctp(0, 4, 1);
        player.setPos(pos.x, pos.y); 
        zonePreloaded = false; 
        cZone = 1;
        spaceUp = true;
        space = true;
        spaceCounter = 0;
        scrollTo(window.innerWidth * 1, 0); 
        //boxes = []; 
    }
}

function zone1()
{
    if(!zonePreloaded)
    {
        boxes = []; 
        newBox("f1", {x: 0, y: 6}, {x: 2, y: 7}, 1);
        newBox("f2", {x: 4, y: 5}, {x: 11, y: 7}, 1);
        newBox("f3", {x: 7, y: 4}, {x: 8, y: 5}, 1);    
        zonePreloaded = true; 
    }

    if(physics.areColliding("player", "f1", true, 0) || physics.areColliding("player", "f2", true, 1))
    {
        onground = true;
        spaceCounter = 0;
    }
    else
    {
        onground = false; 
    }

    physics.areColliding("player", "f3", true, 2); 
}


function createEnemy(enemyType, ID, position, walkerInterval, shooterRange, damage, health)
{
    let enemy = new NodeObject(BLOCK, BLOCK);
    physics.addBody(enemy, ID, BLOCK/2, BLOCK/2); 
    enemy.setPos(position.x, position.y); 
    if(enemyType == "walker")
    {
        enemy.preload(resources["walker0"]);
        enemy.preload(resources["walker1"]);
        enemy.preload(resources["walker2"]);
        enemy.preload(resources["walker3"]);
        enemy.preload(resources["walker4"]);
        enemy.preload(resources["walkerQuiet"]);
    }
    else if(enemyType == "shooter")
    {
        enemy.preload(resources["shooter"]);
        enemy.preload(resources["shooterAttack"]); 
    }

    let e = [enemy, ID, enemyType, walkerInterval.x1, walkerInterval.x2, 0, shooterRange, 0, damage, health, -1] //array for storing enemy's variables
    enemies.push(e);  
}

//each enemy in "enemies" array is another array that looks like this:
// [node, bodyID, enemyType, walkerPos1, walkerPos2, walkerDirection, shooterRange, counter, damage, health, shooterCounterAuxiliary]
//where "enemyType" can be "walker" or "shooter", when it is "shooter", walkerPos1 & 2 can have any value
//tho is recommended to be set to 0 or undefined, the same happens when enemyType = "walker" and the shooterRange parameter
//walkerPos1 & 2 just specifies a range in the x axis that the walker will walk through repeately
//walkerDirection is an auxiliary variable to determine the current direction of the walking cycle, 0 is right, 1 is left
//the counter paremeter allows for changing walking frames on walker-type enemies and serves as a pausing-shooting method for shooter-type enemies   
function updateEnemies()
{
    for(let i = 0; i != enemies.length; i++)
    {
        if(enemies[i][9] == 0)
        {
            enemies[i][0].hide();
            physics.removeBody(enemies[i][1]);
            enemies.splice(i, 1);
            continue; 
        }

        if(enemies[i][2] == "walker")
        {
            if(enemies[i][7] != -1)
            {
                let frameNumber = Math.floor( (enemies[i][7]%(4*5)) /5); 
                //enemies[i][0].setImage("resources/walker" + frameNumber + ".png");
                enemies[i][0].setImage(resources["walker" + frameNumber]);
                enemies[i][7]++; 
            }
            else
            {
                enemies[i][0].setImage(resources["walkerQuiet"]);
            }

            if(enemies[i][0].x + enemies[i][0].width < enemies[i][4] && enemies[i][5] == 0)   //RIGHT DIRECTION
            {
                physics.velocityVector(enemies[i][1], {x: WALKERSPEED*N/1000, y: 0});
            }
            else if(enemies[i][0].x + enemies[i][0].width >= enemies[i][4])
            {
                physics.velocityVector(enemies[i][1], {x: -WALKERSPEED*N/1000, y: 0});
                enemies[i][0].mirrorImage("left"); 
                enemies[i][5] = 1;
            }
            else if(enemies[i][0].x > enemies[i][3] && enemies[i][5] == 1)  //LEFT DIRTECTION
            {
                physics.velocityVector(enemies[i][1], {x: -WALKERSPEED*N/1000, y: 0});
            }
            else if(enemies[i][0].x <= enemies[i][3])
            {
                physics.velocityVector(enemies[i][1], {x: WALKERSPEED*N/1000, y: 0});
                enemies[i][0].mirrorImage("right"); 
                enemies[i][5] = 0; 
            }
            //else{console.log("bruh");}

            if(physics.areColliding("player", enemies[i][1]) && !attacked)
            {
                attacked = true; 
                health--; 
            }

            
            
        }
        else if(enemies[i][2] == "shooter")
        {
            let shooterCenter = {x: enemies[i][0].x + enemies[i][0].width/2, y: enemies[i][0].y + enemies[i][0].height/2}; 
            let playerCenter = {x: player.x + player.width/2, y: player.y + player.height/2}; 
            let distance = Math.sqrt(Math.pow(shooterCenter.x - playerCenter.x, 2) + Math.pow(shooterCenter.y - playerCenter.y, 2));
            //console.log(playerCenter); 
            enemies[i][0].setImage(resources["shooter"]); 
            if(distance <= enemies[i][6]) //IN RANGE
            {
                if(enemies[i][7] == SHOOTINGRATE) //if enough time has passed, the enemy shoots 
                {
                    createBullet("enemy", {x: enemies[i][0].x + enemies[i][0].width/2, y: enemies[i][0].y + enemies[i][0].height/2}, {x: player.x + player.width/2, y: player.y + player.height/2});
                    //enemies[i][0].setImage(resources["shooterAttack"]); 
                    enemies[i][7] = 0;
                    enemies[i][10] = 0; 
                }
                else
                {
                    enemies[i][7] += N; 
                }
                
            }
            else
            {
                enemies[i][7] = 0; 
            }

            if(enemies[i][10] == 20)
            {
                enemies[i][10] = -1; 
            }
            else if(enemies[i][10] != -1)
            {
                enemies[i][0].setImage(resources["shooterAttack"]);
                enemies[i][10]++; 
            }
        } 

        enemies[i][0].setGray(100 - (100/3 * enemies[i][9])); 
        physics.update(enemies[i][1]); 
    }
}

function updateBullets()
{
    loop1:
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
            if(pBullets[i][5] == "player")
            {
                pBullets[i][0].setImage(resources["playerBullet"]);
            }
            else if(pBullets[i][5] == "enemy")
            {
                pBullets[i][0].setImage(resources["enemyBullet"]);
            }
            ///////
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
            if(!attacked) //IMMUNITY
            {
                attacked = true;
                health--; 
            }
           
            pBullets[i][0].hide();
            pBullets[i] = 0; 
            physics.removeBody("bullet" + i);
            //player.setGray(100);
            continue; 
        }

        for(let j = 0; j != boxes.length; j++)
        {
            if(physics.areColliding("bullet" + i, boxes[j]))
            {
                pBullets[i][0].hide();
                pBullets[i] = 0; 
                physics.removeBody("bullet" + i);
                continue loop1; 
            }
        }

        for(let j = 0; j != enemies.length; j++)
        {
            if(physics.areColliding("bullet" + i, enemies[j][1]) && pBullets[i][5] == "player")
            {
                pBullets[i][0].hide();
                pBullets[i] = 0; 
                physics.removeBody("bullet" + i);
                enemies[j][9]--; 
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
  
    bullet.setPos(fromCenter.x - BLOCK/5, fromCenter.y - BLOCK/5); //check and change this, AGAIN

    if(bulletType == "player")
    {
        bullet.preload(resources["playerBullet"], "auto");
        player.setImage("resources/attackAv.png"); 
        shoot = false;
        shootAnim = 0;  
    }
    else if(bulletType == "enemy")
    {
        bullet.preload(resources["enemyBullet"], "auto");
    }
    pBullets.push([bullet, {VX: velocityX*sign, VY: velocityY*sign}, angle, sign, true, bulletType]);  
    physics.addBody(bullet, "bullet" + (pBullets.length-1), BLOCK/10, BLOCK/10);  
    
    //shootAux = true;  
}

//fN = floor number N
//zD = zone detector (to change zone n to zone n+1)
//dN = detector number N

//froomCoord and toCoord are 2d objects with x and y components that, from basic position system, will get transformed to page position system with the ctp function
function newBox(id, fromCoord, toCoord, z) //creator of collision boxex that, along with the worldLayout function, helps constructing the map of the game
{
    let box = new NodeObject((toCoord.x - fromCoord.x) * BLOCK, (toCoord.y - fromCoord.y) * BLOCK); 
    let bPos = ctp(fromCoord.x, fromCoord.y, z); 
    box.setPos(bPos.x, bPos.y); 
    box.setColor("transparent"); 
    physics.addBody(box, id, box.width, box.height);
    boxes.push(id);  
}

//ctp stands for coord to Pos 
function ctp(xPos, yPos, zone) //converts coordinates of blocks to real position to manage top and left css properties
{
    //let position = {x: LEFTOVERX/2 + xPos*BLOCK + window.innerWidth*zone , y: LEFTOVERY + yPos*BLOCK}; 
    let position = {x: LEFTOVERX/2 + xPos*BLOCK + window.innerWidth*zone, y: LEFTOVERY + yPos*BLOCK}; 
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

function worldLayout(seed, z)
{
    //Intializes the zone if it hasn't been loaded
    if(!zonesInit[z])
    {
        let rightMargin = new NodeObject(LEFTOVERX/2, window.innerHeight);
        let leftMargin = new NodeObject(LEFTOVERX/2, window.innerHeight);

        rightMargin.setColor("white");
        rightMargin.setPos(window.innerWidth*z);
        rightMargin.sendToZ(2000);

        leftMargin.setColor("white");
        leftMargin.setPos(window.innerWidth*(z+1) - LEFTOVERX/2);
        leftMargin.sendToZ(2000);

        zonesInit[z] = true; 
    }

    let blocks = seed.split(" ");
    for(let i = 0; i!=blocks.length; i++)
    {
        let parameters = blocks[i].split(",");
        let blockNode = new NodeObject(BLOCK, BLOCK);
        let pos = ctp(parseInt(parameters[0]), parseInt(parameters[1]), z);
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
    scrollTo(window.innerWidth*cZone,0); 
}