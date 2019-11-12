const laserSprite = new Image();
laserSprite.src="art/LaserGreen.png";

class laser {	
	constructor(x,y,speed){
		this.sX=0;
		this.sY=0;
		this.w=50;
		this.h=5;
		this.x=x;
		this.y=y;
		this.speed=speed;
	}
	
	draw(){
		ctx.drawImage(laserSprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
	}

	update(){
		this.x += this.speed;
		
		for (var i = 0; i < lasers.length; i++) {
			
			if(lasers[i] === this && this.x > canvas.width+this.w){
				lasers.splice(i,1);				
			}
			if(lasers[i] === this && (collision(lasers[i], enemyShip))){
				//console.log('COLLISION!');
				lasers.splice(i,1);
				score.value++;
                score.high = Math.max(score.value, score.high);
                localStorage.setItem("highscore", score.high);
				//console.log('lasers'+lasers.length);
				
				var ex = new explosion(this.x+this.w,this.y-enemyShip.h/2,96,12,'Explosion'); // create explosion
				explosions.push(ex);
				explosionFX.play();
				enemyShip.reset();
			}
			
			for(var j=0; j<bloodcells.length;j++){
				if(lasers[i] === this && (collision(lasers[i], bloodcells[j]))){
					lasers.splice(i,1);
					var ex = new explosion(this.x+this.w,this.y-bloodcells[j].h,128,16,'ExplosionBlood'); // create explosion
					explosions.push(ex);
					bloodcells[j].reset();
				}				
			}
		}
		
		updateScore();
	}
}