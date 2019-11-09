class explosion {
	constructor(x,y){
		this.x=x;
		this.y=y;
		this.w=96;
		this.h=96;
		this.frame=0;
		this.speed=5;
		this.animation=[
        {sX: 0, sY : 0},
        {sX: 96, sY : 0},
        {sX: 192, sY : 0},
        {sX: 288, sY : 0},
        {sX: 384, sY : 0},
        {sX: 480, sY : 0},
        {sX: 576, sY : 0},
        {sX: 672, sY : 0},
        {sX: 768, sY : 0},
        {sX: 864, sY : 0},
        {sX: 960, sY : 0},
        {sX: 1056, sY : 0}];
	}
	
    draw(){
        let explosion = this.animation[this.frame];        
		ctx.drawImage(explosionSprite, explosion.sX, explosion.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
    
    update(){              
        this.frame += frames%this.speed == 0 ? 1 : 0; 	// Increment every 5 frames      
        this.frame = this.frame%this.animation.length; 	// Frame loops 0 to 11
    }
}