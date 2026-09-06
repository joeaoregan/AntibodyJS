var controller = {
	left: false,
	right: false,
	up: false,
	down: false,
	fire: false,
	menu: false
};

//Only show the controller for mobile device
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	var controllerCanvas = document.getElementById("controller");
	controllerCanvas.style.display = "none";
	console.log('not mobile');
}

let lastStartTap = 0;
function startGame() {
	// Ignore the duplicate event mobile browsers fire (touchend then synthesized mouseup)
	const now = Date.now();
	if (now - lastStartTap < 300) return;
	lastStartTap = now;

	if (state.current === state.game) {
		game.paused = !game.paused; // START toggles pause once the game is running
	} else {
		state.current = state.game; // start from the Get Ready / over screens
	}
	startMusic(); // start background music on first user gesture
}
function reset() {
	powerupNewLife.reset();
	bloodcellsDestroyed = 0;
	time.reset();
	score.reset();
	state.current = state.getReady;
}
function moveUp() {
	controller.up = true;
}
function moveDown() {
	controller.down = true;
}
function moveLeft() {
	controller.left = true;
}
function moveRight() {
	controller.right = true;
}
function moveXClear() {
	controller.right = controller.left = false;
}
function moveYClear() {
	controller.up = controller.down = false;
}
function fireStart() {
	controller.fire = true;
}
function fireStop() {
	controller.fire = false;
}
function fire() { // keyboard / legacy toggle
	controller.fire = !controller.fire;
}

// Keyboard
window.addEventListener('keydown', function (e) {
	if (e.keyCode == 32) {
		e.preventDefault();
		switch (state.current) {
			case state.getReady:
				state.current = state.game;				startMusic(); // start background music on first user gesture				break;
			case state.game:
				// ship.fire();
				break;
			case state.over:
				reset();
				break;
		}
	}

	switch (e.keyCode) {
		case 65: // A
		case 37: // Left
		case 100: // 4
			controller.left = true;
			e.preventDefault();
			//console.log('Left');
			break;
		case 87: // W
		case 38: // Up
		case 104: // 8
			controller.up = true;
			e.preventDefault();
			//console.log('Up');
			break;
		case 68: // D
		case 39: // Right
		case 102: // 6
			controller.right = true;
			e.preventDefault();
			//console.log('Right');
			break;
		case 83: // S
		case 40: // Down
		case 98: // 2
			controller.down = true;
			e.preventDefault();
			break;
		case 32:
			controller.fire = true;
			break;
		case 77: // m
			game.mute = !game.mute; // Pause / Unpause Game FX
			controller.mute = !controller.mute; // toggle mute
			music.muted = game.mute; // mute / unmute background music too
			break;
		case 27: // ESC
		case 80: // P
			game.paused = !game.paused;
			break;
		case 112: // F1
			e.preventDefault();
			fpsCounter.visible = !fpsCounter.visible;
			break;
		case 190: // .  (period) — next music track
			nextTrack();
			break;
		case 188: // ,  (comma) — previous music track
			prevTrack();
			break;
		case 191: // /  (slash) — random music track
			randomTrack();
			break;
	}
}, false);

document.addEventListener('keyup', function (event) {
	switch (event.keyCode) {
		case 65: // A
		case 37: // Left
		case 100: // 4
			controller.left = false;
			break;
		case 68: // D
		case 39: // Right
		case 102: // 6
			controller.right = false;
			break;
		case 87: // W
		case 38: // Up
		case 104: // 8
			controller.up = false;
			break;
		case 83: // S
		case 40: // Down
		case 98: // 2
			controller.down = false;
			break;
		case 32:
			controller.fire = false;
			break;
	}
});

// Mouse
canvas.addEventListener("click", function (evt) {
	//console.log('click');
	switch (state.current) {
		case state.getReady:
			startGame();
			break;
		case state.game:
			// ship.fire();
			break;
		case state.over:
			reset();
			break;
	}
});