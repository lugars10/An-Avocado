class Physics
{
    constructor()
    {
        this.bodies = []; //it stores all bodies that will have physical values like velocity
        this.kineticBodies = []; //it stores all bodies whose velocities change  
        this.colSystem = new CollisionSystem();
    }

    //node is the NodeObject to accelerate 
    //v0 is an object composed of 2 values: initial x-velocity and initial y-velocity
    //a is an object composed of 2 values: x-acceleration and y-acceleration
    //timeDif is the elapsed time of acceleration
    update(bodyID)
    {
        let body; 
        for(let i = 0; i!=this.bodies.length; i++)
        {
            if(this.bodies[i][1] == bodyID){body = this.bodies[i];}
        }

        if(body == undefined || body == null){ throw new Error("No body found with that ID");}

        //body[4] += timeDif; //updates the time counter of the body by adding the difference of time passed in the x axis; 
        //body[5] += timeDif; //updates the time counter of the body by adding the difference of time passed in the y axis; 
        //body[2] = v0.x + a.x * body[4]; //sets the new x-velocity of the body 
        //body[3] = v0.y + a.y * body[5]; //sets the new y-velocity of the body 

        //console.log(body[3]);
        //console.log(body[6]);
        for(let i = 0; i != body[8].length; i++)
        {
            if(body[8][i] === undefined){break;}
            if(body[8][i][0] == "right" && this.colSystem.isInRangeY(bodyID, body[8][i][1]) && body[2] < 0)
            {
                body[2] = 0;
                body[4] = 0; 
                body[6] = 0;
            }
            else if(body[8][i][0] == "left" && this.colSystem.isInRangeY(bodyID, body[8][i][1]) && body[2] > 0)
            {
                body[2] = 0;
                body[4] = 0;  
                body[6] = 0;
                //console.log("xd");
            }
            else if(body[8][i][0] == "up" && this.colSystem.isInRangeX(bodyID, body[8][i][1]) && body[3] > 0)
            {
                body[3] = 0;
                body[5] = 0;
                body[7] = 0; 
            }
            else if(body[8][i][0] == "down" && this.colSystem.isInRangeX(bodyID, body[8][i][1]) && body[3] < 0)
            {
                body[3] = 0;
                body[5] = 0;
                body[7] = 0; 
            }
            else if(body[8][i][0] == "right" && (!this.colSystem.isInRangeY(bodyID, body[8][i][1]) || body[2] > 0))
            {
                body[8].splice(i, 1);
            }
            else if(body[8][i][0] == "left" && (!this.colSystem.isInRangeY(bodyID, body[8][i][1]) || body[2] < 0))
            {
                body[8].splice(i, 1);
            }
            else if(body[8][i][0] == "up" && (!this.colSystem.isInRangeX(bodyID, body[8][i][1]) || body[3] < 0))
            {
                body[8].splice(i, 1);
            }
            else if(body[8][i][0] == "down" && (!this.colSystem.isInRangeX(bodyID, body[8][i][1]) || body[3] > 0))
            {
                body[8].splice(i, 1);
            }
        }

        //console.log(body[0].y);
        body[0].setPos(body[0].x + body[2], body[0].y + body[3]); 
    }
    //v is a 2d object with x and y components 
    //time is assumed to be the same for all vectors acting on the body 
    velocityVector(bodyID, v, time)
    {
        let body; 
        for(let i = 0; i!=this.bodies.length; i++)
        {
            if(this.bodies[i][1] == bodyID){body = this.bodies[i];}
        }

        if(body == undefined || body == null){ throw new Error("No body found with that ID");}
        body[2] += v.x;
        body[3] += v.y;
        
        let contained = false; 
        for(let i = 0; i != this.kineticBodies.length; i++)
        {
            if(this.kineticBodies[i][1] == bodyID){contained = true;}
        }
        if(!contained){this.kineticBodies.push(body);}
    }

    //a is the acceleration represented as a 2d object with x and y components
    //time is the elapsed time passed assumed to be the same for all vectors acting on the body 
    accelerationVector(bodyID, a, time)
    {
        let body; 
        for(let i = 0; i!=this.bodies.length; i++)
        {
            if(this.bodies[i][1] == bodyID){body = this.bodies[i];}
        }

        if(body == undefined || body == null){ throw new Error("No body found with that ID");}
        body[4] += a.x //* body[4];
        body[5] += a.y //* body[5];
        body[6] += time;  
        body[7] += time;

        let contained = false; 
        for(let i = 0; i != this.kineticBodies.length; i++)
        {
            if(this.kineticBodies[i][1] == bodyID){contained = true; }
        }
        if(!contained){this.kineticBodies.push(body);  }
        
    }

    resetX() //resets the velocities, does not reset time of acceleration 
    {
        for(let i = 0; i != this.kineticBodies.length; i++)
        {
            this.kineticBodies[i][2] = 0;
            this.kineticBodies[i][4] = 0;
            //this.kineticBodies[i][3] = 0; 
        }
    }

    resetY() //resets the velocities, does not reset time of acceleration 
    {
        for(let i = 0; i != this.kineticBodies.length; i++)
        {
            //this.kineticBodies[i][2] = 0;
            this.kineticBodies[i][3] = 0; 
            this.kineticBodies[i][5] = 0;  
        }
    }

    reset()
    {
        for(let i = 0; i != this.kineticBodies.length; i++)
        {
            this.kineticBodies[i][2] = 0;
            this.kineticBodies[i][3] = 0;
            this.kineticBodies[i][4] = 0;
            this.kineticBodies[i][5] = 0;  
        }
    }

    addBody(node, bodyId, bodyWidth, bodyHeight) 
    {
        //bodies[i][2] stores vx
        //bodies[i][3] stores vy
        //bodies[i][4] stores acceleration x
        //bodies[i][5] stores acceleration y 
        //bodies[i][6] stores time x
        //bodies[i][7] stores time y 
        //bodies[i][8] stores arrays with 2 parameters: direction of collision and static collider 
        this.bodies.push([node, bodyId, 0, 0, 0, 0, 0, 0, []]);
        this.colSystem.addCollider(node, bodyWidth, bodyHeight, bodyId); //adds collider to the body
    }

    //colSystem functions 
    //bodyID1 is the kinetic body while bodyID2 is the static body when handleCol is true
    areColliding(bodyID1, bodyID2, handleCol=false, handlerIndex=undefined)
    {
        let body1; 
        let body2; 
        for(let i = 0; i!=this.bodies.length; i++) //searches for the given bodies on the bodies Array 
        {
            if(this.bodies[i][1] == bodyID1){body1 = this.bodies[i];}
            if(this.bodies[i][1] == bodyID2){body2 = this.bodies[i];}
        }
        if(body1[1] != bodyID1){throw new Error("No body1 with that id");} //Error if there's no body with the ID
        if(body2[1] != bodyID2){throw new Error("No body2 with that id");}
        //console.log(body1); 

        //console.log(body1[2] + " ," + body1[3]);

        let colliding; 

        for(let i = 0; i != body1[8].length; i++) //change order of this
        {
                if(body1[8][i][1] == bodyID2)
                {
                    colliding = true; 
                    this.colSystem.collisionDirections[handlerIndex] = undefined; 
                    return colliding;
                }
        }
        colliding = this.colSystem.areColliding(bodyID1, bodyID2, handleCol, {x: body1[2], y: body1[3]}, handlerIndex); //detects collision 


        if(handleCol && this.colSystem.collisionDirections[handlerIndex] != undefined)
        {

            let direction = this.colSystem.collisionDirections[handlerIndex];
            let x;
            let y;  
            switch(direction)   //corrects the position of the kinetic object such that body1 is "the border" of collision again 
            {
                case "right":
                    y = body1[3] * (body2[0].x+body2[0].width - body1[0].x)/body1[2] + body1[0].y; 
                    body1[0].setPos(body2[0].x+body2[0].width, y); 
                    body1[2] = 0;
                    body1[8].push(["right", bodyID2]); 
                    console.log("right");
                    break;
                case "left":
                    y = body1[3] * (body2[0].x - body1[0].width - body1[0].x)/body1[2] + body1[0].y; 
                    body1[0].setPos(body2[0].x - body1[0].width, y);
                    body1[2] = 0;
                    body1[8].push(["left", bodyID2]); 
                    //console.log("left");
                    break;
                case "up":
                    x = body1[2] * (body2[0].y - body1[0].height - body1[0].y)/body1[3] + body1[0].x
                    body1[0].setPos(x, body2[0].y - body1[0].height);
                    body1[3] = 0;
                    body1[8].push(["up", bodyID2]); 
                    //console.log("up");
                    break;
                case "down":
                    x = body1[2] * (body2[0].y + body1[0].height - body1[0].y)/body1[3] + body1[0].x
                    body1[0].setPos(x, body2[0].y + body2[0].height);
                    body1[3] = 0;
                    body1[8].push(["down", bodyID2]); 
                    //console.log("down");
                    break;
                default:
                    //console.log("Something wrong :(");
                    break;
            }
            
        }
        return colliding; 

    }
    
}

//
