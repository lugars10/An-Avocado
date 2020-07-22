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
        for(let i = 0; i != body[6].length; i++)
        {
            if(typeof body[6][i] === "undefined"){break;}
            //let q = -1; 
            //console.log(body[2] + ", " + body[3]); 
            //console.log(body[6]); 
            if(body[6][i][0] == "right" && this.colSystem.isInRangeY(bodyID, body[6][i][1]) && body[2] < 0)
            {
                body[2] = 0;
                body[4] = 0;
                //console.log(0); 
                //q = 0; 
            }
            else if(body[6][i][0] == "left" && this.colSystem.isInRangeY(bodyID, body[6][i][1]) && body[2] > 0)
            {
                body[2] = 0;
                body[4] = 0;  
                //console.log(1); 
                //q = 1; 
            }
            else if(body[6][i][0] == "up" && this.colSystem.isInRangeX(bodyID, body[6][i][1]) && body[3] > 0)
            {
                body[3] = 0;
                body[5] = 0; 
                //console.log(2); 
                //q = 2; 
            }
            else if(body[6][i][0] == "down" && this.colSystem.isInRangeX(bodyID, body[6][i][1]) && body[3] < 0)
            {
                body[3] = 0;
                //body[5] = 0;
                //console.log(3);  
                //q = 3;  
            }
            else if(body[6][i][0] == "right" && (!this.colSystem.isInRangeY(bodyID, body[6][i][1]) || body[2] > 0))
            {
                body[6].splice(i, 1);
                //console.log(4); 
                //q = 4; 
            }
            else if(body[6][i][0] == "left" && (!this.colSystem.isInRangeY(bodyID, body[6][i][1]) || body[2] < 0))
            {
                body[6].splice(i, 1);
                //console.log(5); 
                //q = 5; 
            }
            else if(body[6][i][0] == "up" && (!this.colSystem.isInRangeX(bodyID, body[6][i][1]) || body[3] < 0))
            {
                body[6].splice(i, 1);
                //console.log(6); 
                //q = 6; 
            }
            else if(body[6][i][0] == "down" && (!this.colSystem.isInRangeX(bodyID, body[6][i][1]) || body[3] > 0))
            {
                body[6].splice(i, 1);
                //console.log(7); 
                //q = 7; 
            }
            else
            {
                //console.log("lol" + q);
            }
            
            //console.log(body[6][i][0] + ", " + this.colSystem.isInRangeX(bodyID, body[6][i][1]) + ", " + this.colSystem.isInRangeY(bodyID, body[6][i][1]) + ", " + body[2] + ", " + body[3]); 
        }

        //console.log(body[0].y);
        body[0].setPos(body[0].x + body[2], body[0].y + body[3]); 
    }
    //v is a 2d object with x and y components 
    //time is assumed to be the same for all vectors
    velocityVector(bodyID, v)
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
            if(this.kineticBodies[i][1] == bodyID){contained = true; }
        }
        if(!contained){this.kineticBodies.push(body);  }
    }

    //a is the acceleration represented as a 2d object with x and y components
    //time is the elapsed time passed 
    accelerationVector(bodyID, a, time)
    {
        let body; 
        for(let i = 0; i!=this.bodies.length; i++)
        {
            if(this.bodies[i][1] == bodyID){body = this.bodies[i];}
        }

        if(body == undefined || body == null){ throw new Error("No body found with that ID");}
        body[2] += a.x * body[4];
        body[3] += a.y * body[5];
        body[4] += time;  
        body[5] += time;

        //console.log(body[3]); 
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
            //this.kineticBodies[i][3] = 0; 
        }
    }

    resetY() //resets the velocities, does not reset time of acceleration 
    {
        for(let i = 0; i != this.kineticBodies.length; i++)
        {
            //this.kineticBodies[i][2] = 0;
            this.kineticBodies[i][3] = 0; 
        }
    }

    resetXForBody(bodyID)
    {
        let body;
        let kinetic;
        for(let i = 0; i!= this.bodies.length; i++)
        {
            if(this.bodies[i][1] == bodyID)
            {
                body = this.bodies[i];
            }
        }
        
        for(let i = 0; i!= this.kineticBodies.length; i++)
        {
            if(this.kineticBodies[i][1] == bodyID)
            {
                kinetic = this.kineticBodies[i]; 
            }
        }
        body[2] = 0;
        kinetic[2] = 0;
    }

    resetYForBody(bodyID)
    {
        let body;
        let kinetic;
        for(let i = 0; i!= this.bodies.length; i++)
        {
            if(this.bodies[i][1] == bodyID)
            {
                body = this.bodies[i];
            }
        }
        
        for(let i = 0; i!= this.kineticBodies.length; i++)
        {
            if(this.kineticBodies[i][1] == bodyID)
            {
                kinetic = this.kineticBodies[i]; 
            }
        }
        body[3] = 0;
        kinetic[3] = 0;
    }

    addBody(node, bodyId, bodyWidth, bodyHeight) 
    {
        //bodies[i][2] stores vx
        //bodies[i][3] stores vy
        //bodies[i][4] stores time x
        //bodies[i][5] stores time y 
        //bodies[i][6] stores arrays with 2 parameters: direction of collision and static collider 
        this.bodies.push([node, bodyId, 0, 0, 0, 0, []]);
        this.colSystem.addCollider(node, bodyWidth, bodyHeight, bodyId); //adds collider to the body
    }

    removeBody(bodyID)
    {
        for(let i = 0; i != this.bodies.length; i++)
        {
            for(let j = 0; j != this.bodies[i][6].length; j++)
            {
                if(this.bodies[i][6][j][1] == bodyID)
                {
                    this.bodies[i][6].splice(j); 
                }
            }
            if(this.bodies[i][1] == bodyID)
            {
                this.bodies.splice(i, 1);
                break;  
            }
         
        }

        this.colSystem.removeCollider(bodyID); 
    }

    //colSystem functions 
    //bodyID1 is the kinetic body while bodyID2 is the static body when handleCol is true
    areColliding(bodyID1, bodyID2, handleCol=false, handlerIndex=undefined, returnDirection = false)
    {
        let body1; 
        let body2; 
        for(let i = 0; i!=this.bodies.length; i++) //searches for the given bodies on the bodies Array 
        {
            if(this.bodies[i][1] == bodyID1){body1 = this.bodies[i];}
            if(this.bodies[i][1] == bodyID2){body2 = this.bodies[i];}
        }
        if(typeof body1 == "undefined"){return 0;}
        if(typeof body2 == "undefined"){return 0;}
        if(body1[1] != bodyID1){throw new Error("No body1 with that id");} //Error if there's no body with the ID
        if(body2[1] != bodyID2){throw new Error("No body2 with that id");}
        //console.log(body1); 

        //console.log(body1[2] + " ," + body1[3]);

        let colliding; 

        for(let i = 0; i != body1[6].length; i++) //change order of this
        {
                if(body1[6][i][1] == bodyID2)
                {
                    //colliding = true; 
                    if(returnDirection == false){colliding = true;}
                    else if(returnDirection){colliding = body1[6][i][0]}
                    this.colSystem.collisionDirections[handlerIndex] = undefined; 
                    return colliding;
                }
        }
        colliding = this.colSystem.areColliding(bodyID1, bodyID2, handleCol || returnDirection, {x: body1[2], y: body1[3]}, handlerIndex); //detects collision 

       
        if((handleCol||returnDirection) && this.colSystem.collisionDirections[handlerIndex] != undefined)
        {

            if(returnDirection && !handleCol && colliding)
            {
                let direction = this.colSystem.collisionDirections[handlerIndex];
                return direction;
            }

            let direction = this.colSystem.collisionDirections[handlerIndex];
            let x;
            let y;  
            switch(direction)   //corrects the position of the kinetic object such that body1 is "the border" of collision again 
            {
                case "right":
                    if(body1[2] == 0){break;}
                    //console.log("right" + body1[2])
                    y = body1[3] * (body2[0].x+body2[0].width - body1[0].x)/body1[2] + body1[0].y; 
                    body1[0].setPos(body2[0].x+body2[0].width, y); 
                    //body1[2] = 0;
                    body1[6].push(["right", bodyID2]);
                    //console.log("right"  + ", " + bodyID2)
                    //console.log(body1[6]);  
                    
                    break;
                case "left":
                    if(body1[2] == 0){break;}
                    //console.log("left" + body1[2])
                    y = body1[3] * (body2[0].x - body1[0].width - body1[0].x)/body1[2] + body1[0].y; 
                    body1[0].setPos(body2[0].x - body1[0].width, y);
                    //body1[2] = 0;
                    body1[6].push(["left", bodyID2]); 
                    //console.log("left"  + ", " + bodyID2); 
                    //console.log(body1[6]);  
                    
                    //body1[6];
                    break;  
                case "up":
                    if(body1[3] == 0){break;}
                    //console.log("up" + body1[3])
                    x = body1[2] * (body2[0].y - body1[0].height - body1[0].y)/body1[3] + body1[0].x
                    body1[0].setPos(x, body2[0].y - body1[0].height);
                    body1[3] = 0;
                    body1[5] = 0;
                    body1[6].push(["up", bodyID2]); 
                    //console.log("up"  + ", " + bodyID2);
                    //console.log(body1[6]);  
                    break;
                
                case "down":
                    if(body1[3] == 0){break;}
                    body1[6].push(["down", bodyID2]);
                    //console.log("down" + body1[3])
                    x = body1[2] * (body2[0].y + body1[0].height - body1[0].y)/body1[3] + body1[0].x
                    body1[0].setPos(x, body2[0].y + body2[0].height);
                    //body1[3] = 0;
                    //body1[5] = 0;
                    
                    //console.log("down" + ", " + bodyID2);
                    //console.log(body1[6]);  
                    break;
                     
                default:
                    console.log("Something wrong :(");
                    break;
            }

            if(colliding && returnDirection){colliding = direction;}
            
        }
        return colliding; 

    }
    
}

//
