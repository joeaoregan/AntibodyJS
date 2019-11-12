const bcImg = new Image();
bcImg.src = "art/BloodCell.png";
/*
const bloodcell = {
	sX : 0,
	sY : 0,
    w : 100,
    h : 55,
    x : 1280 + Math.round(Math.random()*200),
    y : 50 + Math.round(Math.random()*480),
	degrees : 0,
    
    draw : function(){
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.x+this.w/2, this.y+this.h/2);
		
		ctx.rotate(this.degrees*Math.PI/180);
		ctx.drawImage(bcImg, this.sX, this.sY, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);
		ctx.restore();
    },
	
	update : function(){
		this.degrees++;
		this.degrees%=360;
		this.x-=2;
			
		if(this.x<-this.w){	// When the enemy moves off screen (left)
			this.reset();
		}
	},
	
	reset(){
		this.x=canvas.width;
		this.y=Math.round(Math.random()*(SCREEN_HEIGHT-this.h-70)+35);
	}
}
*/
class bloodcell{
	constructor(){
		this.x=1280 + (Math.floor(Math.random()*10)+1)*75;
		this.y=60 + (Math.floor(Math.random()*10)*44);
		//this.x=600;
		//this.y=300;
		this.w=100;
		this.h=55;
		this.sX=0;
		this.sY=0;
		this.degrees=0;
		this.speed=Math.floor(Math.random()*4)+1;
	}
	
	draw(){
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.x+this.w/2, this.y+this.h/2);
		
		ctx.rotate(this.degrees*Math.PI/180);
		ctx.drawImage(bcImg, this.sX, this.sY, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);
		ctx.restore();
	}
	
	update(){
		this.degrees++;
		this.degrees%=360;
		this.x-=this.speed;
			
		if(this.x<-this.w){	// When the enemy moves off screen (left)
			this.reset();
		}
	}
	
	reset(){
		this.x=canvas.width + (Math.floor(Math.random()*10)+1)*75;
		this.y=60 + (Math.floor(Math.random()*10)*44);
	}
}