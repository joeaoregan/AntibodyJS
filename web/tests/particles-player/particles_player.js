/*
	particles_player.js
    06/09/2026
	Test driver: scrolling background + player ship only.
	No enemies, power-ups, collisions, or game-over logic.
*/

// Vars & Consts
let frames = 0;
let hud1;
let bloodcellsDestroyed = 0;

let player1;

// GAME STATE
const state = {
	current: 0,
	getReady: 0,
	game: 1,
	over: 2
}

class Game {
	constructor() {
		this.objects = [];
		this.paused;
		this.mute = false;
	}

	async init() {
		console.log("Fetching sprite manifest...");
		try {
			// 1. Fetch the JSON file first!
			const response = await fetch('art/sprites.json');
			window.SPRITE_DATA = await response.json(); // Global access for GameObjects
			console.log("Manifest loaded:", window.SPRITE_DATA);

			// 2. Automatically "Warm up" every image in the JSON
			const warmUpPromises = Object.keys(window.SPRITE_DATA).map(key => {
				return new GameObject(key, 0, 0).load();
			});
			await Promise.all(warmUpPromises);

			// 3. Create actual game instances now that data is ready
			let bg = new Background();
			player1 = new Player("Player1", canvas.width / 2, canvas.height / 2);

			this.objects.push(bg, player1);

			// Load the instances into memory
			await Promise.all(this.objects.map(obj => obj.load()));

			// 4. Initialize UI and start loop
			hud1 = new hud();

			console.log("All systems green. Starting game loop.");
			loop(); // Start the animation loop here
		} catch (err) {
			console.error("CRITICAL BOOT ERROR:", err);
		}
	}

	update() {
		if (!this.paused) {
			this.objects.forEach(obj => obj.update());
			frames++;
		}
	}

	draw() {
		ctx.fillStyle = "#70c5ce";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.objects.forEach(obj => obj.draw());

		hud1.draw();
	}
}

// AABB Collisions between 2 objects (kept for any shared code that references it)
function collision(o1, o2) {
	return (o2.x < o1.x + o1.w &&
		o2.x + o2.w > o1.x &&
		o2.y < o1.y + o1.h &&
		o2.y + o2.h > o1.y);
}

window.onload = function () {
	updateScore();
}

function updateScore() {
	document.getElementById("scoreID").innerHTML = parseInt(localStorage.getItem("highscore")) || 0;
}

var game = new Game();
game.init();

let msPrev = window.performance.now();
const fps = 60; // Frames per second
const msPerFrame = 1000 / fps; // Milliseconds per frame

// Game loop
function loop() {
	requestAnimationFrame(loop);

	const msNow = window.performance.now();
	const msPassed = msNow - msPrev;

	if (msPassed < msPerFrame) return; // Skip frame if not enough time has passed

	const excessTime = msPassed % msPerFrame;
	msPrev = msNow - excessTime; // Adjust previous time to maintain consistent frame rate

	// Should run at 60 FPS
	game.update(); // Update objects
	game.draw(); // Draw objects
}
