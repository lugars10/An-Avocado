 /*if(handleCollision == true && handleColIndex != undefined)
            {
                //this.handleCollision(collider1[1]);
                let xLeg = (collider1[2].x1 + collider1[2].x2)/2 - (collider2[2].x1 + collider2[2].x2)/2; 
                let yLeg = (collider1[2].y1 + collider1[2].y2)/2 - (collider2[2].y1 + collider2[2].y2)/2;
                let colDirection = ""; 
                if(Math.abs(xLeg) > Math.abs(yLeg))
                {
                    if(Math.sign(xLeg) == 1){colDirection = "right";}
                    else if(Math.sign(xLeg) == -1){colDirection = "left";}
                }
                else if(Math.abs(xLeg) < Math.abs(yLeg))
                {
                    if(Math.sign(yLeg) == 1){colDirection = "down";}
                    else if(Math.sign(yLeg) == -1){colDirection = "up";}
                }
                this.collisionDirections[handleColIndex] = direction; 
            } */
           
           //VERSION 2
           
              //console.log(handleCollision + ", " + handleColIndex);
            if(handleCollision && handleColIndex != undefined)
            {
                
                let colBoxCenter = {x: (collider1[2].x1 + collider1[2].x2)/2, y: (collider1[2].y1 + collider1[2].y2)/2}; 
                let prevPos = {x: colBoxCenter.x - velocity.x, y: colBoxCenter.y - velocity.y};
                let timeFaceUp = (collider1[2].y1 -  prevPos.y)/velocity.y; 
                let timeFaceDown = (collider1[2].y2 - prevPos.y)/velocity.y; 
                let timeFaceRight = (collider1[2].x2 - prevPos.x)/velocity.x;
                let timeFaceLeft = (collider1[2].x1 - prevPos.x)/velocity.x; 

                let posFaceUp = timeFaceUp * velocity.x + prevPos.x; //pos in the x axis at the given time 
                let posFaceDown = timeFaceDown * velocity.x + prevPos.x; //pos in the x axis at the given time
                let posFaceRight = timeFaceRight * velocity.y + prevPos.y; //pos in the y axis at the given time
                let posFaceLeft = timeFaceLeft * velocity.y + prevPos.y; //pos in the y axis at the given time

                let directions = []; //the two possibles directions of the kinetic body
                
                //console.log(collider1[2].y1 + ", " + prevPos.y + ", " + prevPos.x + "," + velocity.y );
                console.log(posFaceUp + ", " + collider2[2].x1 + ", " + collider2[2].x2);

                if(collider2[2].x1 < posFaceUp && posFaceUp < collider2[2].x2){directions.push(["up", timeFaceUp]);}
                if(collider2[2].x1 < posFaceDown && posFaceDown < collider2[2].x2){directions.push(["down", timeFaceDown]);}
                if(collider2[2].y1 < posFaceLeft && posFaceLeft < collider2[2].y2){directions.push(["left", timeFaceLeft]);}
                if(collider2[2].y1 < posFaceRight && posFaceRight < collider2[2].y2){directions.push(["right", timeFaceRight]);}

                console.log(directions); 
                console.log(velocity);
                if(directions[0][1] < directions[1][1]){this.collisionDirections[handleColIndex] = directions[0][0];}
                else{this.collisionDirections[handleColIndex] = directions[1][0];}
