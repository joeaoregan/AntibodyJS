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

function startGame() {
	state.current = state.game;
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
function fire() {
	controller.fire = !controller.fire;
}

// Keyboard
window.addEventListener('keydown', function (e) {
	if (e.keyCode == 32) {
		e.preventDefault();
		switch (state.current) {
			case state.getReady:
				state.current = state.game;
				break;
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
			break;
		case 80: // P
			game.paused = !game.paused;
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