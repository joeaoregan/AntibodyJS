// Vars & Consts
let frames = 0;
var hud1;
var bloodcellsDestroyed = 0;

var player1;
var enemyShip;
var powerupNewLife;
var powerupHealth;
var powerupLaser;
var powerupRocket;
var saw;
let rocketSpawnTimer = 700; // frames until the next rocket power-up appears

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
		this.scoreTexts = []; // floating score popups (no collision)
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

			for (let i = 0; i < NUM_VIRUS_GREEN; i++) {
				this.objects.push(new Virus("VirusGreen"));
			}

			// Load the instances into memory
			await Promise.all(this.objects.map(obj => obj.load()));

			// 4. Initialize UI and start loop
			hud1 = new hud();
			powerupNewLife = new PowerUp('PowerUpLife', 'life');
			powerupHealth = new PowerUp('PowerUpHealth', 'health');
			powerupLaser = new PowerUp('PowerUpLaser', 'laser');
			powerupRocket = new PowerUp('Rocket', 'rocket');
			saw = new Saw('SawBlue', player1);
			await Promise.all([powerupNewLife.load(), powerupHealth.load(), powerupLaser.load(), powerupRocket.load(), saw.load()]);

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

			this.scoreTexts.forEach(t => t.update());
			this.scoreTexts = this.scoreTexts.filter(t => !t.dead);

			nowPlaying.update(); // fade the music track popup

			if (powerupNewLife) {
				powerupNewLife.update();
			}
			if (powerupHealth) {
				powerupHealth.update();
			}
			if (powerupLaser) {
				powerupLaser.update();
			}
			if (powerupRocket) {
				powerupRocket.update();
			}
			if (saw) {
				saw.update();
			}

			// Offer a health power-up when the player is hurt and none is on screen
			if (state.current == state.game &&
				player1.health <= MAX_HEALTH / 2 &&
				powerupHealth && !powerupHealth.active) {
				this.spawnHealth();
			}

			// Offer a laser power-up once enough enemy ships are destroyed (grade 0: 5, grade 1: 10)
			if (state.current == state.game && player1.laserGrade < LASER_GRADE_MAX) {
				const killsNeeded = player1.laserGrade === 0 ? LASER_KILLS_GRADE0 : LASER_KILLS_GRADE1;
				if (powerupLaser && !powerupLaser.active && player1.laserKillCount >= killsNeeded) {
					this.spawnLaserPowerUp();
				}
			}

			// Offer a rocket power-up periodically, until the player is fully stocked
			if (state.current == state.game && player1.rockets < ROCKET_MAX) {
				if (powerupRocket && !powerupRocket.active) {
					rocketSpawnTimer--;
					if (rocketSpawnTimer <= 0) {
						this.spawnRocketPowerUp();
						rocketSpawnTimer = 700;
					}
				}
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

		// Saw renders on top of the ship, positioned at its nose/bottom-right (C++ offset x+65, y+25)
		if (saw) {
			saw.draw();
		}

		this.scoreTexts.forEach(t => t.draw());

		hud1.draw();
		fpsCounter.draw(); // FPS overlay (toggle F1)
		nowPlaying.draw(); // music track popup (fades)
		if (powerupNewLife) {
			powerupNewLife.draw();
		}
		if (powerupHealth) {
			powerupHealth.draw();
		}
		if (powerupLaser) {
			powerupLaser.draw();
		}
		if (powerupRocket) {
			powerupRocket.draw();
		}
	}

	spawnLife() {
		powerupNewLife.active = true;
	}

	spawnHealth() {
		powerupHealth.active = true;
	}

	spawnLaserPowerUp() {
		powerupLaser.active = true;
	}

	spawnRocketPowerUp() {
		powerupRocket.active = true;
	}

	// Award score + explosion for a virus kill; splits large viruses when doSplit is true
	handleVirusHit(target, scoreValue, doSplit) {
		score.value += scoreValue;
		score.high = Math.max(score.value, score.high);
		localStorage.setItem("highscore", score.high);
		updateScore();

		this.scoreTexts.push(
			new ScoreText(target.x + target.w / 2, target.y, "+" + scoreValue)
		);

		this.objects.push(
			new Explosion("ExplosionVirusGreen", target.x, target.y)
		);

		if (!this.mute) explosionFX.play();

		player1.laserKillCount++; // counts toward the laser upgrade progress too

		if (doSplit && !target.small) {
			target.split();
			target.reset(); // large virus respawns (persistent pool)
		} else if (target.isSplitSpawn) {
			target.remove();
		} else {
			target.reset();
		}
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
					score.value += SCORE_ENEMY_SHIP;
					score.high = Math.max(score.value, score.high);
					localStorage.setItem("highscore", score.high);
					updateScore();

					this.scoreTexts.push(
						new ScoreText(target.x + target.w / 2, target.y, "+" + SCORE_ENEMY_SHIP)
					);

					this.objects.push(
						new Explosion("Explosion", target.x, target.y)
					);

					if (!this.mute) explosionFX.play();

					target.reset();
					player1.laserKillCount++;
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

				// Ninja star destroys enemy ships (higher score than the laser)
				if (
					projectile.type === "NinjaStarBlue" &&
					target.type === "EnemyShip" &&
					collision(projectile, target)
				) {
					score.value += SCORE_NINJA_SHIP;
					score.high = Math.max(score.value, score.high);
					localStorage.setItem("highscore", score.high);
					updateScore();

					this.scoreTexts.push(
						new ScoreText(target.x + target.w / 2, target.y, "+" + SCORE_NINJA_SHIP)
					);

					this.objects.push(
						new Explosion("Explosion", target.x, target.y)
					);

					if (!this.mute) explosionFX.play();

					target.reset();
					player1.laserKillCount++;
					this.objects.splice(i, 1);
					break;
				}

				// Rocket destroys enemy ships (biggest single bonus, limited ammo)
				if (
					projectile.type === "Rocket" &&
					target.type === "EnemyShip" &&
					collision(projectile, target)
				) {
					const awarded = SCORE_ROCKET_SHIP + (projectile.bonus || 0); // reward for a charged shot
					score.value += awarded;
					score.high = Math.max(score.value, score.high);
					localStorage.setItem("highscore", score.high);
					updateScore();

					this.scoreTexts.push(
						new ScoreText(target.x + target.w / 2, target.y, "+" + awarded)
					);

					this.objects.push(
						new Explosion("Explosion", target.x, target.y)
					);

					if (!this.mute) explosionFX.play();

					target.reset();
					player1.laserKillCount++;
					projectile.remove();
					break;
				}

				// Ninja star splits blood cells (destroys them, blood splatter)
				if (
					projectile.type === "NinjaStarBlue" &&
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

				// Active saw destroys enemy ships (costs energy)
				if (
					saw && saw.active &&
					target.type === "EnemyShip" &&
					collision(saw, target)
				) {
					score.value += SCORE_NINJA_SHIP;
					score.high = Math.max(score.value, score.high);
					localStorage.setItem("highscore", score.high);
					updateScore();

					this.scoreTexts.push(
						new ScoreText(target.x + target.w / 2, target.y, "+" + SCORE_NINJA_SHIP)
					);

					this.objects.push(
						new Explosion("Explosion", target.x, target.y)
					);

					if (!this.mute) explosionFX.play();

					target.reset();
					player1.laserKillCount++;
					saw.energy = Math.max(0, saw.energy - 10); // cutting a ship costs more energy
				}

				// Active saw cuts blood cells (and drains a little extra energy)
				if (
					saw && saw.active &&
					target.type === "BloodCell" &&
					collision(saw, target)
				) {
					this.objects.push(
						new Explosion("ExplosionBlood", target.x, target.y)
					);

					if (!this.mute) splashFX.play();

					bloodcellsDestroyed++;
					target.reset();
					saw.energy = Math.max(0, saw.energy - 5); // cutting costs energy
				}

				// Laser destroys viruses outright (no split — only ninja star/saw split them)
				if (
					projectile.type === "LaserGreen" &&
					(target.type === "VirusGreen" || target.type === "VirusGreenSmall") &&
					collision(projectile, target)
				) {
					this.handleVirusHit(target, target.small ? SCORE_VIRUS_GREEN_SMALL : SCORE_VIRUS_GREEN, false);
					this.objects.splice(i, 1);
					break;
				}

				// Ninja star splits large viruses in two; small ones are just destroyed
				if (
					projectile.type === "NinjaStarBlue" &&
					(target.type === "VirusGreen" || target.type === "VirusGreenSmall") &&
					collision(projectile, target)
				) {
					this.handleVirusHit(target, target.small ? SCORE_VIRUS_GREEN_SMALL : SCORE_VIRUS_GREEN, true);
					this.objects.splice(i, 1);
					break;
				}

				// Rocket destroys viruses outright, with the same charge bonus as ships
				if (
					projectile.type === "Rocket" &&
					(target.type === "VirusGreen" || target.type === "VirusGreenSmall") &&
					collision(projectile, target)
				) {
					const scoreValue = (target.small ? SCORE_VIRUS_GREEN_SMALL : SCORE_VIRUS_GREEN) + (projectile.bonus || 0);
					this.handleVirusHit(target, scoreValue, false);
					projectile.remove();
					break;
				}

				// Active saw splits large viruses in two; small ones are just destroyed (costs energy)
				if (
					saw && saw.active &&
					(target.type === "VirusGreen" || target.type === "VirusGreenSmall") &&
					collision(saw, target)
				) {
					this.handleVirusHit(target, target.small ? SCORE_VIRUS_GREEN_SMALL : SCORE_VIRUS_GREEN, true);
					saw.energy = Math.max(0, saw.energy - (target.small ? 5 : 10));
				}

				// Viruses damage the player on direct contact (no weapon needed)
				if (
					(projectile.type === "VirusGreen" || projectile.type === "VirusGreenSmall") &&
					target.type === "Player1" &&
					collision(projectile, target)
				) {
					target.updateHealth(VIRUS_DAMAGE);
					if (projectile.isSplitSpawn) projectile.remove();
					else projectile.reset();
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
	fpsCounter.tick(); // Update FPS counter

	// msPrev = msNow;
}

// setInterval(() => {
// 	console.log("Total Elapsed Frames: ", frames)
// }, 1000); // Log frames per second every second
