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
	},
	
	reset: function(){
		this.timer=0;
	}
}

setInterval(function(){
	if(state.current == state.game){
		time.timer++;
	}
	//console.log('time: '+time.timer);
},1000);

// FPS counter (toggle with F1)
const fpsCounter = {
	visible: false,
	frames: 0,
	lastTime: performance.now(),
	value: 0,

	tick: function () {
		this.frames++;
		const now = performance.now();
		const elapsed = now - this.lastTime;
		if (elapsed >= 500) { // update twice a second
			this.value = Math.round((this.frames * 1000) / elapsed);
			this.frames = 0;
			this.lastTime = now;
		}
	},

	draw: function () {
		if (!this.visible) return;
		ctx.save();
		ctx.font = "20px Teko";
		ctx.fillStyle = "#0F0";
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 2;
		const txt = 'FPS: ' + this.value;
		ctx.fillText(txt, canvas.width - ctx.measureText(txt).width - 30, 55);
		ctx.strokeText(txt, canvas.width - ctx.measureText(txt).width - 30, 55);
		ctx.restore();
	}
};

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
			ctx.lineWidth = 2;
            ctx.font = "35px Teko";
			
			// Game Over
			this.scoreTxt='Game Over!!!';
			this.textWidth=ctx.measureText(this.scoreTxt).width;			
            ctx.fillText(this.scoreTxt, (canvas.width-this.textWidth)/2, 30);
            ctx.strokeText(this.scoreTxt, (canvas.width-this.textWidth)/2, 30);        
			
            // Score
			this.scoreTxt='Score: '+this.value;		
			this.textWidth=ctx.measureText(this.scoreTxt).width;
            ctx.fillText(this.scoreTxt, (canvas.width/2)-(this.textWidth/2), 186);
            ctx.strokeText(this.scoreTxt, (canvas.width/2)-(this.textWidth/2), 186);
			
            // High Score
			this.scoreTxt='High Score: '+this.high;
			this.textWidth=ctx.measureText(this.scoreTxt).width;
            ctx.fillText(this.scoreTxt, (canvas.width/2)-(this.textWidth/2), 228);
            ctx.strokeText(this.scoreTxt, (canvas.width/2)-(this.textWidth/2), 228);
        }
    },
    
    reset : function(){
        frames = 0;
        this.value = 0; // This resets the score
    }
}

// Level text
const levelTxt={
	value: 1,
	label: null, // Optional override; defaults to 'Level: N'

	draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
		
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
			let txt = this.label ? this.label : 'Level: '+this.value;
            ctx.fillText(txt, 30, 30);
            ctx.strokeText(txt, 30, 30);
		}				
	}
}
	
// Antibody text
const antibodyTxt={
	abText: "Antibody JS by Joe O'Regan",
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