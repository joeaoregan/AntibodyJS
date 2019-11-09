// CVS
const cvs = document.getElementById("antibody");
const ctx = cvs.getContext("2d");

// Vars & Consts
let frames = 0;
const SCREEN_WIDTH = 1280, SCREEN_HEIGHT=600;
var lasers=[], explosions=[];

// Sprites
const background = new Image();
background.src="art/background720.png";
const player1 = new Image();
player1.src="art/Player1Ship.png";
const enemySprite = new Image();
enemySprite.src="art/EnemySpriteSheet.png";
const explosionSprite = new Image();
explosionSprite.src="art/Explosion.png";
const laserSprite = new Image();
laserSprite.src="art/LaserGreen.png";

// FX
const fireFX = new Audio();
fireFX.src = "audio/laser1.wav";
const explosionFX = new Audio();
explosionFX.src = "audio/explosion.wav";

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// AABB Collisions
function collision(o1, o2) {
	return (o2.x < o1.x+o1.w &&
           o2.x+o2.w > o1.x &&
           o2.y < o1.y+o1.h &&
           o2.y+o2.h > o1.y);
}

// Time text
const time ={
	timer: 0,
	update: 0,

	draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
		
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText('Time: '+this.timer, 1150, 30);
            ctx.strokeText('Time: '+this.timer, 1150, 30);
		}				
	}
}

setInterval(function(){
	time.timer++;
	//console.log('time: '+time.timer);
},1000);
		
window.onload = function() {
       //when the document is finished loading, replace everything
       //between the <a ...> </a> tags with the value of splitText
} 

function updateScore(){	
   document.getElementById("scoreID").innerHTML=score.high;
   //document.getElementById("scoreID").innerHTML=0;
}

// Score text
const score = {
    high : parseInt(localStorage.getItem("highscore")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText('Score: '+this.value, cvs.width/2, 30);
            ctx.strokeText('Score: '+this.value, cvs.width/2, 30);
            
        }else if(state.current == state.over){
            // Score
            ctx.font = "25px Teko";
            ctx.fillText('Score: '+this.value, 225, 186);
            ctx.strokeText('Score: '+this.value, 225, 186);
            // High Score
            ctx.fillText(this.high, 225, 228);
            ctx.strokeText(this.high, 225, 228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}

// Level text
const levelTxt={
	value: 1,

	draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
		
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText('Level: '+this.value, 30, 30);
            ctx.strokeText('Level: '+this.value, 30, 30);
		}				
	}
}

// Antibody text
const antibodyTxt={
	draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
		
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText('Antibody', SCREEN_WIDTH/2, 590);
            ctx.strokeText('Antibody', SCREEN_WIDTH/2, 590);
		}				
	}
}

// Draw objects
function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    scrollingBG.draw();
	enemyShip.draw();

	for (var i = 0; i < explosions.length; i++) {
		explosions[i].draw();
	}
	ship.draw();
	for (var i = 0; i < lasers.length; i++) {
		lasers[i].draw();
	}
	levelTxt.draw();
    score.draw();
	time.draw();
	antibodyTxt.draw();
}

// Update objects
function update(){
	ship.update();
    scrollingBG.update();
	for (var i = 0; i < lasers.length; i++) {
		lasers[i].update();
	}
	enemyShip.update();
	
	for (var i = 0; i < explosions.length; i++) {
		explosions[i].update();
		if(explosions[i].frame>=11){	// remove explosion after animation finished
			explosions.splice(i,1);
		}
	}
		
}

// Game loop
function loop(){
    update();
    draw();
    frames++;    
    requestAnimationFrame(loop);
}

loop();

// Mouse
cvs.addEventListener("click", function(evt){
	//console.log('click');
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            ship.fire();
            break;
        case state.over:
			score.reset();
			state.current = state.getReady;
            break;
    }
});

// Keyboard
window.addEventListener('keydown',function(e){
	if(e.keyCode==32){
		switch(state.current){
			case state.getReady:
				state.current = state.game;
				break;
			case state.game:
				ship.fire();
				break;
			case state.over:
				score.reset();
				state.current = state.getReady;
				break;
		}
	}	
	
	switch (e.keyCode) {
		case 65: // A
		case 37: // Left
		case 100: // 4
			ship.dx=-ship.speed;
			//console.log('Left');
			break;
		case 87: // W
		case 38: // Up
		case 104: // 8
			ship.dy=-ship.speed;
			//console.log('Up');
			break;
		case 68: // D
		case 39: // Right
		case 102: // 6
			ship.dx=ship.speed;
			//console.log('Right');
			break;
		case 83: // S
		case 40: // Down
		case 98: // 2
			ship.dy=ship.speed;
			//console.log('Down ' + ship.dy);
			break;
	}
},false);

document.addEventListener('keyup', function(event) {
	switch (event.keyCode) {
		case 65: // A
		case 37: // Left
		case 100: // 4
		case 68: // D
		case 39: // Right
		case 102: // 6
			ship.dx=0;
			break;
		case 87: // W
		case 38: // Up
		case 104: // 8
		case 83: // S
		case 40: // Down
		case 98: // 2
			ship.dy=0;
			break;
	}	
});