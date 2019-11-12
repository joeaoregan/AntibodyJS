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
            ctx.fillText('Score: '+this.value, canvas.width/2, 30);
            ctx.strokeText('Score: '+this.value, canvas.width/2, 30);
            
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
            ctx.fillText('Antibody', canvas.width/2, 590);
            ctx.strokeText('Antibody', canvas.width/2, 590);
		}				
	}
}