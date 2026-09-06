// Vars & Consts
let frames = 0;
var hud1;
var bloodcellsDestroyed = 0;

var player1;
var enemyShip;
var powerupNewLife;

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
			// This replaces your manual laserBlue/explosion warm-up list
			const warmUpPromises = Object.keys(window.SPRITE_DATA).map(key => {
				return new GameObject(key, 0, 0).load();
			});
			await Promise.all(warmUpPromises);

			// 3. Create actual game instances now that data is ready
			let bg = new Background();
			player1 = new Player("Player1", canvas.width / 2, canvas.height / 2);
			enemyShip = new Enemy("EnemyShip");

			this.objects.push(bg, player1, enemyShip);

			for (let i = 0; i < NUM_BLOODCELLS; i++) {
				this.objects.push(new Bloodcell("BloodCell"));
			}

			// Load the instances into memory
			await Promise.all(this.objects.map(obj => obj.load()));

			// 4. Initialize UI and start loop
			hud1 = new hud();
			powerupNewLife = new PowerUp('PowerUpLife');
			await powerupNewLife.load();

			console.log("All systems green. Starting game loop.");
			loop(); // Start the animation loop here
		} catch (err) {
			console.error("CRITICAL BOOT ERROR:", err);
		}
	}

	update() {
		if (!this.paused) {
			this.objects.forEach(obj => obj.update());
			this.collisions();

			if (powerupNewLife) {
				powerupNewLife.update();
			}

			if (bloodcellsDestroyed >= MAX_BLOODCELLS) {
				state.current = state.over; // Game over
				console.log("Game Over! You destroyed all the blood cells!");
			}

			frames++;
		}
	}

	draw() {
		ctx.fillStyle = "#70c5ce";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.objects.forEach(obj => obj.draw());

		hud1.draw();
		if (powerupNewLife) {
			powerupNewLife.draw();
		}
	}

	spawnLife() {
		powerupNewLife.active = true;
	}

	collisions() {
		for (let i = this.objects.length - 1; i >= 0; i--) {
			for (let j = 0; j < this.objects.length; j++) {
				const projectile = this.objects[i];
				const target = this.objects[j];

				if (!projectile || !target || projectile === target) {
					continue;
				}

				if (
					projectile.type === "LaserGreen" &&
					target.type === "EnemyShip" &&
					collision(projectile, target)
				) {
					score.value++;
					score.high = Math.max(score.value, score.high);
					localStorage.setItem("highscore", score.high);
					updateScore();

					this.objects.push(
						new Explosion("Explosion", target.x, target.y)
					);

					if (!this.mute) explosionFX.play();

					target.reset();
					this.objects.splice(i, 1);
					break;
				}

				if (
					projectile.type === "LaserGreen" &&
					target.type === "BloodCell" &&
					collision(projectile, target)
				) {
					this.objects.push(
						new Explosion("ExplosionBlood", target.x, target.y)
					);

					if (!this.mute) splashFX.play();

					bloodcellsDestroyed++;
					target.reset();
					this.objects.splice(i, 1);
					break;
				}

				if (
					projectile.type === "LaserBlue" &&
					target.type === "Player1" &&
					collision(projectile, target)
				) {
					target.updateHealth();
					this.objects.splice(i, 1);
					break;
				}
			}
		}
	}
}

// AABB Collisions between 2 objects
function collision(o1, o2) {
	return (o2.x < o1.x + o1.w &&
		o2.x + o2.w > o1.x &&
		o2.y < o1.y + o1.h &&
		o2.y + o2.h > o1.y);
}

window.onload = function () {
	updateScore();
	if ("vibrate" in navigator) {
		console.log('can vibrate');
	} else {
		console.log('can not vibrate');
	}
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

	// msPrev = msNow;
}

// setInterval(() => {
// 	console.log("Total Elapsed Frames: ", frames)
// }, 1000); // Log frames per second every second
