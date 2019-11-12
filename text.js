// Time text
const time ={
	timer: 0,
	update: 0,
	timeTxt: '',
	textWidth: 0,

	draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
		
		this.timeTxt='Time: '+this.timer;
		this.textWidth=ctx.measureText(this.timeTxt).width;

        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.timeTxt, canvas.width-this.textWidth-30, 30);
            ctx.strokeText(this.timeTxt, canvas.width-this.textWidth-30, 30);
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
	scoreTxt: '',
	textWidth: 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
		
		ctx.lineWidth = 2;
		ctx.font = "35px Teko";
        
        if(state.current == state.getReady){
			this.scoreTxt='Press Fire To Begin';
			this.textWidth=ctx.measureText(this.scoreTxt).width;
			
            ctx.fillText(this.scoreTxt, (canvas.width-this.textWidth)/2, 30);
            ctx.strokeText(this.scoreTxt, (canvas.width-this.textWidth)/2, 30);			
		}else if(state.current == state.game){
            //ctx.lineWidth = 2;
            //ctx.font = "35px Teko";
			
			this.scoreTxt='Score: '+this.value;
			this.textWidth=ctx.measureText(this.scoreTxt).width;
			
            ctx.fillText(this.scoreTxt, (canvas.width-this.textWidth)/2, 30);
            ctx.strokeText(this.scoreTxt, (canvas.width-this.textWidth)/2, 30);            
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
	abText: 'Antibody JS by Joe O Regan',
	textWidth: 0,
	
	draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
		
		this.textWidth=ctx.measureText(this.abText).width;
		
        //if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.abText, (canvas.width/2)-(this.textWidth/2), 590);
            ctx.strokeText(this.abText, (canvas.width/2)-(this.textWidth/2), 590);
		//}				
	}
}