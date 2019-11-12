// Canvas
const canvas = document.getElementById("antibody");
const ctx = canvas.getContext("2d");

// Vars & Consts
let frames = 0;
const SCREEN_HEIGHT=600;
var lasers=[], explosions=[], bloodcells=[];

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

		
window.onload = function() {
	//when the document is finished loading, replace everything
	//between the <a ...> </a> tags with the value of splitText
} 

function updateScore(){	
   document.getElementById("scoreID").innerHTML=score.high;
}

function init(){
	var b1 = new bloodcell();
	var b2 = new bloodcell();
	var b3 = new bloodcell();
	var b4 = new bloodcell();
	var b5 = new bloodcell();
	bloodcells.push(b1);
	bloodcells.push(b2);
	bloodcells.push(b3);
	bloodcells.push(b4);
	bloodcells.push(b5);
}

init();

// Draw objects
function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
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
	
	//bloodcell.draw();
	for (var i = 0; i < bloodcells.length; i++) {
		bloodcells[i].draw();
	}
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

	//bloodcell.update();
	for (var i = 0; i < bloodcells.length; i++) {
		bloodcells[i].update();
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
canvas.addEventListener("click", function(evt){
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