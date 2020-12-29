class CollisionSystem
{
    constructor()
    {
        this.colliders = [];
        this.collisionDirections = []; //used for storing directions of collisions with 2 colliders 
    }

    //(1) get new positions of each node
    //(2) update every collision box interval
    update()
    {
        let currentCollider; 
        let node;
        let nodeUpdatedCenter = {x: null, y: null};
        let nodeLastCenter = {x: null, y: null};
        let difPos = {x: null, y: null};


        for(let i = 0; i!= this.colliders.length; i++)
        {
            currentCollider = this.colliders[i];
            node = currentCollider[1];   //(???) maybe wrong! 
            nodeUpdatedCenter.x = node.x + (node.width/2);
            nodeUpdatedCenter.y = node.y + (node.height/2);
            

            nodeLastCenter.x = (currentCollider[2].x1 + currentCollider[2].x2)/2  //- (node.width)/2;
            nodeLastCenter.y = (currentCollider[2].y1 + currentCollider[2].y2)/2 //- (node.height)/2;

            difPos.x = nodeLastCenter.x - nodeUpdatedCenter.x;
            difPos.y = nodeLastCenter.y - nodeUpdatedCenter.y;

            currentCollider[2].x1 -= difPos.x;
            currentCollider[2].x2 -= difPos.x;
            currentCollider[2].y1 -= difPos.y;
            currentCollider[2].y2 -= difPos.y; 
            
        }
    }

    //node is expected to be a NodeObject object class
    //Collision boxes are always centered with respect to the center of the node 
    addCollider(node, colBoxWidth, colBoxHeight, colBoxID)
    {
        let collider = [colBoxID, node]; 
        let colInterval = {x1: null, x2: null, y1: null, y2: null};
        let nodeCenter = {x: node.x + (node.width/2), y: node.y + (node.height/2) };
        //colBoxCenter is the corrected center that accomplishes our wanted centering
        let colBoxCenter = {x: nodeCenter.x - (colBoxWidth/2), y: nodeCenter.y - (colBoxHeight/2)};
        colInterval.x1 = colBoxCenter.x; 
        colInterval.x2 = colBoxCenter.x + colBoxWidth;
        colInterval.y1 = colBoxCenter.y
        colInterval.y2 = colBoxCenter.y + colBoxHeight;

        collider.push(colInterval);
        this.colliders.push(collider);
    }

    removeCollider(colBoxID)
    {
        for(let i = 0; i != this.colliders.length; i++)
        {
            if(this.colliders[i] == colBoxID)
            {
                this.colliders.splice(i, 1);
            }
        }
    }

    //searches their colliders on "this.colliders" array 
    //compares their intervals in both ways and determines if their intersect
    //if they do, returns true;
    //else, false; 
    //Asume colBox1 as a kinetic object and colBox2 as a static object 
    //Velocity is a 2d object with x and y components used to handle the collision
    //handleColIndex is the index that will be used to store the direction of collision in the collisionDirections arrya  
    areColliding(colBox1, colBox2, handleCollision = false, velocity = undefined, handleColIndex = undefined)      //the id's of the colBoxes 
    {
        this.update();
        let collider1; //the collider of colBox1
        let collider2; //the collider of colBox2
        let colScore = 0; //there's a collision only if colScore is 2
        for(let i = 0; i != this.colliders.length; i++)
        {
            if(colBox1 == this.colliders[i][0]){collider1 = this.colliders[i];}
            if(colBox2 == this.colliders[i][0]){collider2 = this.colliders[i];}
        }
        
        if(collider1[0] != colBox1){throw new Error("No colBox1 with that id");}
        if(collider2[0] != colBox2){throw new Error("No colBox2 with that id");}

        //X axis 
        if(collider1[2].x1 > collider2[2].x1 && collider1[2].x1 < collider2[2].x2){colScore++;}
        if(collider2[2].x1 > collider1[2].x1 && collider2[2].x1 < collider1[2].x2){colScore++;}
        if(collider1[2].x1 == collider2[2].x1){colScore++;}

        //Y axis 
        if(collider1[2].y1 > collider2[2].y1 && collider1[2].y1 < collider2[2].y2){colScore++;}
        if(collider2[2].y1 > collider1[2].y1 && collider2[2].y1 < collider1[2].y2){colScore++;}
        if(collider1[2].y1 == collider2[2].y1){colScore++;}

        //Total
        if(colScore == 2)
        {
           
            //console.log(handleCollision + ", " + handleColIndex);
            if(handleCollision && handleColIndex != undefined)
            {
                //################################

                let centerCol2 = {x: (collider2[2].x1 + collider2[2].x2)/2, y: (collider2[2].y1 + collider2[2].y2)/2}; 
                let corners = [];
                corners[0] = {x: collider1[2].x1, y: collider1[2].y1};
                corners[1] = {x: collider1[2].x2, y: collider1[2].y1};
                corners[2] = {x: collider1[2].x1, y: collider1[2].y2};
                corners[3] = {x: collider1[2].x2, y: collider1[2].y2};

                let prevCorners = [];
                prevCorners[0] = {x: corners[0].x - velocity.x, y: corners[0].y - velocity.y};
                prevCorners[1] = {x: corners[1].x - velocity.x, y: corners[1].y - velocity.y};
                prevCorners[2] = {x: corners[2].x - velocity.x, y: corners[2].y - velocity.y};
                prevCorners[3] = {x: corners[3].x - velocity.x, y: corners[3].y - velocity.y};

                let cornerSectors = [];

                for(let i = 0; i != 4; i++)
                {
                    cornerSectors.push(this.sectorOfPoint(prevCorners[i], centerCol2));
                }

                if(cornerSectors.includes(1) && cornerSectors.includes(2)){this.collisionDirections[handleColIndex] = "up";} //up
                else if(cornerSectors.includes(2) && cornerSectors.includes(3)){this.collisionDirections[handleColIndex] = "left";} //left
                else if(cornerSectors.includes(3) && cornerSectors.includes(4)){this.collisionDirections[handleColIndex] = "down";} //down 
                else if(cornerSectors.includes(1) && cornerSectors.includes(4)){this.collisionDirections[handleColIndex] = "right";} //right
                else //this means that all corners of the collider1 are in the same sector
                {
                    let time;
                    let newCorners = []; 
                    switch(cornerSectors[0])
                    {
                        case 1: //sector 1
                            time = (collider2[2].y1 - prevCorners[3].y)/velocity.y;
                            newCorners[0] = velocity.x * time + prevCorners[0].x;
                            newCorners[1] = velocity.x * time + prevCorners[1].x; 
                            if(this.facesCollide(collider2[2].x1, collider2[2].x2, newCorners[0], newCorners[1]) && velocity.y > 0){this.collisionDirections[handleColIndex] = "up";}
                            else{this.collisionDirections[handleColIndex] = "right";}
                            //onsole.log("sector 1 " + this.collisionDirections[handleColIndex]);
                            //console.log(velocity.y); 

                            break;
                        case 2: //sector 2
                            time = (collider2[2].y1 - prevCorners[3].y)/velocity.y;
                            newCorners[0] = velocity.x * time + prevCorners[0].x;
                            newCorners[1] = velocity.x * time + prevCorners[1].x; 
                            if(this.facesCollide(collider2[2].x1, collider2[2].x2, newCorners[0], newCorners[1]) && velocity.y > 0){this.collisionDirections[handleColIndex] = "up";}
                            else{this.collisionDirections[handleColIndex] = "left";}
                            //console.log("sector 2 " + this.collisionDirections[handleColIndex]);
                            //console.log(this.facesCollide(collider2[2].x1, collider2[2].x2, newCorners[0], newCorners[1]) + ", " + (velocity.y > 0)); 
                            //console.log(velocity.y); 
                            //console.log("time: " + time);

                            break;
                        case 3: //sector 3
                            time = (collider2[2].y2 - prevCorners[0].y)/velocity.y; 
                            newCorners[0] = velocity.x * time + prevCorners[0].x; 
                            newCorners[1] = velocity.x * time + prevCorners[1].x; 
                            if(this.facesCollide(collider2[2].x1, collider2[2].x2, newCorners[0], newCorners[1]) && velocity.y < 0){this.collisionDirections[handleColIndex] = "down";}
                            else{this.collisionDirections[handleColIndex] = "left";}
                            //console.log("sector 3 " + this.collisionDirections[handleColIndex]);
                            //console.log(time + " ," + newCorners[0] + " ," + newCorners[1]); 

                            break; 
                        case 4: //sector 4
                            time = (collider2[2].y2 - prevCorners[0].y)/velocity.y; 
                            newCorners[0] = velocity.x * time + prevCorners[0].x; 
                            newCorners[1] = velocity.x * time + prevCorners[1].x; 
                            if(this.facesCollide(collider2[2].x1, collider2[2].x2, newCorners[0], newCorners[1]) && velocity.y < 0){this.collisionDirections[handleColIndex] = "down";}
                            else{this.collisionDirections[handleColIndex] = "right";}
                            //console.log("sector 4 " + this.collisionDirections[handleColIndex]);

                            break; 
                    }
                }

                
            }

            return true;
        }; 
        //console.log(colScore);
        return false;
    }

    //kinetic is expected to be NodeObject object class 
    handleCollision(kinetic)
    {
        kinetic.setPos(kinetic.lastPosition.x, kinetic.lastPosition.y);
    }

    isInRangeX(colBox1, colBox2)
    {
        this.update();
        let collider1; //the collider of colBox1
        let collider2; //the collider of colBox2
        let inRange = false; //there's a collision only if colScore is 2
        for(let i = 0; i != this.colliders.length; i++)
        {
            if(colBox1 == this.colliders[i][0]){collider1 = this.colliders[i];}
            if(colBox2 == this.colliders[i][0]){collider2 = this.colliders[i];}
        }
        
        if(collider1[0] != colBox1){throw new Error("No colBox1 with that id");}
        if(collider2[0] != colBox2){throw new Error("No colBox2 with that id");}

        if(collider1[2].x1 > collider2[2].x1 && collider1[2].x1 < collider2[2].x2){inRange = true;}
        if(collider2[2].x1 > collider1[2].x1 && collider2[2].x1 < collider1[2].x2){inRange = true;}
        if(collider1[2].x1 == collider2[2].x1){inRange = true;}

        return inRange;  

    }

    isInRangeY(colBox1, colBox2)
    {
        this.update();
        let collider1; //the collider of colBox1
        let collider2; //the collider of colBox2
        let inRange = false; //there's a collision only if colScore is 2
        for(let i = 0; i != this.colliders.length; i++)
        {
            if(colBox1 == this.colliders[i][0]){collider1 = this.colliders[i];}
            if(colBox2 == this.colliders[i][0]){collider2 = this.colliders[i];}
        }
        
        if(collider1[0] != colBox1){throw new Error("No colBox1 with that id");}
        if(collider2[0] != colBox2){throw new Error("No colBox2 with that id");}

        if(collider1[2].y1 > collider2[2].y1 && collider1[2].y1 < collider2[2].y2){inRange = true;}
        if(collider2[2].y1 > collider1[2].y1 && collider2[2].y1 < collider1[2].y2){inRange = true;}
        if(collider1[2].y1 == collider2[2].y1){inRange = true;}

        return inRange;  
    }

    //point is the 2d object with x and y components whose sector is wished to know
    //origin is the 2d object with x and y components that divide the page in 4 sectors (serves as the origin of the page)
    sectorOfPoint(point, origin)
    {
        let xDif = point.x - origin.x; 
        let yDif = origin.y - point.y; 
        let xSign = Math.sign(xDif);
        let ySign = Math.sign(yDif); 
        let sector = 0; 

        if(xSign == 1 && ySign == 1){sector = 1;}
        if(xSign == -1 && ySign == 1){sector = 2;}
        if(xSign == -1 && ySign == -1){sector = 3;}
        if(xSign == 1 && ySign == -1){sector = 4;}

        return sector; 

    }

    facesCollide(staticP1, staticP2, kineticP1, kineticP2)
    {
        let collide = false; 
    
        if(kineticP1 == staticP1){collide = true;}
        else if(kineticP1 < staticP1 && kineticP2 > staticP1){collide = true;}
        else if(kineticP1 > staticP1 && kineticP1 < staticP2){collide = true;}

        return collide; 
        //else if(kineticP1 == staticP1 && kineticP2 == staticP2){collide = true;}
    }

    p(direction)
    {
        console.log(direction); 
    }


}
//For every collision box, we have two pairs of open intervals; one open interval
//for the x-axis, and another one for the y-axis
//We denote the collection of these intervals with the variable colInterval
//which contains four variables, according to the intervals (x1, x2) and (y1,y2)