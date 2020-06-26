class NodeObject
{
    //imageAutoProp supports a similar function to "auto" property, it can be "height" or "width" 
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.x = 0; 
        this.y = 0;
        this.isShown = true;
        this.color = "black";
        this.image = undefined; 
        this.imageSrc = ""; 
        this.imgDir = "right";  //image direction or orientation 
        this.lastPosition = {x: this.x, y: this.y};
        this.preloadImg = []; 
        
        
        this.childBody = document.createElement("div");
        this.childBody.style.width = this.width + "px";
        this.childBody.style.height = this.height + "px";
        this.childBody.style.background = "black";
        this.childBody.style.position = "absolute";
        document.body.appendChild(this.childBody);
    }

    setPos(x, y)
    {
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y; 
        this.x = x;
        this.y = y;
        this.childBody.style.left = x + "px";
        this.childBody.style.top = y + "px";
        if(this.image !== undefined)
        {
            this.image.style.left = x + "px"; 
            this.image.style.top = y + "px"; 
        }
        
    }

    setColor(color)
    {
        this.childBody.style.background = color;
        this.color = color; 
    }

    hide()
    {
        if(this.isShown)
        {
            this.childBody.parentNode.removeChild(this.childBody);
            this.image.parentNode.removeChild(this.image); 
            this.isShown = false;
        }
    }

    show()
    {
        if(!this.isShown)
        {
            document.body.appendChild(this.childBody);
            document.body.appendChild(this.image); 
            this.isShown = true;
        }
    }

    sendToBack()
    {
        this.childBody.style.zIndex = -1;
        if(this.image != undefined){this.image.style.zIndex = -1;}
    }

    sendToFront()
    {
        this.childBody.style.zIndex = 1000; 
        if(this.image != undefined){this.image.style.zIndex = 1000;}
    }

    sendToZ(zDepth)
    {
        this.childBody.style.zIndex = zDepth;
        if(this.image != undefined){this.image.style.zIndex = zDepth;}
    }

    setFont(font, size)
    {
        this.childBody.style.fontFamily = font;
        this.childBody.style.fontSize = size + "px";
    }

    setText(text)
    {
        let txt = text.replace(/#sp/g, "<br/>");
        this.childBody.innerHTML = txt;
    }

    setAlignment(alignment)
    {
        this.childBody.style.textAlign = alignment;
    }

    setRound(round)
    {
        this.childBody.style.borderRadius = round; 
    }

    preload(source, w = this.width, h = this.height, x = this.x, y = this.y)
    {
        let image = document.createElement("img");
        //let image = new Image();
        //let div = this.childBody; 
        image.src = source; 
        let width = w;
        let height = h;
        let arr = this.preloadImg; 
        //this.orientation = "right"; ??? 
        image.onload = function() 
        {
            
            width = (width == "auto") ? image.naturalWidth * (height/image.naturalHeight) : width; 
            height = (height == "auto") ? image.naturalHeight * (width/image.naturalWidth) : height; 

            //div.style.backgroundImage = "url(" + source + ")";
            image.style.width = width + "px";
            image.style.height = height + "px";
            image.style.position = "absolute";
            image.style.left = x + "px"; 
            image.style.top = y + "px";
            //image.style.transform = "scale(-1, 1)"; 
            image.style.filter = "FlipH";
            arr.push([image, width, height, source]); 
        }
        //this.preloadImg.push([image, width, height, source]); 
    }
    setImage(source)
    {
        
        //this.setColor("transparent");
        this.setColor("black");
        /*let image = document.createElement("img");
        //let image = new Image();
        //let div = this.childBody; 
        image.src = source; 
        let width = w;
        let height = h;
        this.orientation = "right"; 
        image.onload = function()
        {
            width = (width == "auto") ? image.naturalWidth * (height/image.naturalHeight) : width; 
            height = (height == "auto") ? image.naturalHeight * (width/image.naturalWidth) : height; 

            //div.style.backgroundImage = "url(" + source + ")";
            image.style.width = width + "px";
            image.style.height = height + "px";
            image.style.position = "absolute";
            image.style.left = x + "px"; 
            image.style.top = y + "px";
            //image.style.transform = "scale(-1, 1)"; 
            image.style.filter = "FlipH";
               
        }
        document.body.appendChild(image); 
        this.childBody.style.width = width + "px"; 
        this.childBody.style.height = height + "px"; 
        //this.childBody.style.backgr
        this.imageSrc = source; 
        this.image = image; */

        for(let i = 0; i!= this.preloadImg.length; i++)
        {
            if(this.preloadImg[i][3] == source)
            {
                if(this.image !== undefined)
                {
                    if(this.imageSrc == source){return 0;}
                    else{this.image.remove();}
                }

                this.image = this.preloadImg[i][0]; 
                this.childBody.style.width = this.preloadImg[i][1] + "px"; 
                this.childBody.style.height = this.preloadImg[i][2] + "px";
                this.width = this.preloadImg[i][1]; 
                this.height = this.preloadImg[i][2]; 
                //console.log(this.preloadImg[i]);
                this.mirrorImage(this.imgDir); 
                this.imageSrc = this.preloadImg[i][3]; 
                this.setPos(this.x, this.y); 

                document.body.appendChild(this.image); 
            }
        }

    }

    mirrorImage(orientation)
    {
        if(orientation == "right")
        {
            this.image.style.transform = "scale(1, 1)";
            this.imgDir = "right"; 
        }

        if(orientation == "left")
        {
            this.image.style.transform = "scale(-1, 1)";
            this.imgDir = "left";  
        }
    }

    rotate(angle)
    {
        this.image.style.transform = "rotate(" + angle + "rad)"; 
    }

    setGray(percent)
    {
        this.image.style.filter = "grayscale(" + percent + "%)"; 
    }


}