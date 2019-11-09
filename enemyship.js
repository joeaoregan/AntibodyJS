const enemyShip = {
    animation : [
        {sX: 0, sY : 0},
        {sX: 120, sY : 0},
        {sX: 240, sY : 0},
        {sX: 360, sY : 0}
    ],
    x : 1200,
    y : 300,
    w : 120,
    h : 50,        
    frame : 0,    
    speed : -5,
    
    draw : function(){
        let enemy = this.animation[this.frame];        
		ctx.drawImage(enemySprite, enemy.sX, enemy.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    },
    
    update: function(){        
        this.period = state.current == state.getReady ? 10 : 5; // If the game state is GET READY state, the enemy moves slow        
        this.frame += frames%this.period == 0 ? 1 : 0; 			// Increment frame by 1, each period        
        this.frame = this.frame%this.animation.length; 			// Frame loops 0 to 3
        
        if(state.current == state.getReady){
            this.y = 300; // Reset enemy position
			this.x = 1200;
        }else{
            this.x += this.speed;
			
			if(this.x<-this.w){	// When the enemy moves off screen (left)
				this.reset();
			}
        }
        
    },
    speedReset : function(){
        this.speed = 0;
    },
	reset(){
		this.x=SCREEN_WIDTH;
		this.y=this.y=Math.round(Math.random()*(SCREEN_HEIGHT-this.h-40)+40);
	}
}