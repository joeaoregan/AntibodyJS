// Ship
const player1 = new Image();
player1.src="art/Player1Ship.png";

const fireFX = new Audio();
fireFX.src = "audio/laser1.wav";

const ship ={
    sX: 0,
    sY: 0,
    w: 100,
    h: 47,
    x: 0,
    y: 275,    
	speed: 5,	
    dx: 0,
	dy: 0,
	fireRate: 0,
	lastFire: 0,
	
    draw : function(){
		ctx.drawImage(player1, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
	},
	
	update: function(){
		this.fireRate++;
		
		this.x += this.dx;		
		this.y += this.dy;
		
		if (this.x < 0){
			this.x=0;		
		}
		if (this.y<40){
			this.y=40;
		}
		if (this.y>520){
			this.y=520;
		}		
	},

	fire: function(){
		if(this.fireRate>this.lastFire+10){
			var x = new laser(this.x+this.w-20,this.y+this.h/2,10);
			lasers.push(x);
			console.log('lasers'+lasers.length);
			fireFX.play();
			this.lastFire=this.fireRate;
			console.log('fireRate: '+this.fireRate+' lastFire: '+this.lastFire);
		}
	}
}