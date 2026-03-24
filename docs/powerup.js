const powerupFX = new Audio();
powerupFX.src = "audio/Bonus1.wav";

class PowerUp extends GameObject {
	constructor(src) {
		super(src);
		this.reset();
	}

	update() {
		if (this.active) {
			this.updateRotate(); // Update rotating Game Objects
			this.clearOnLeft();	// When enemy objects moves off screen (left)

			if (collision(player1, this)) {
				navigator.vibrate([100, 50, 100, 50, 100, 50, 400]); // vibrate mobile device if power up collected
				this.reset();
				if (player1.lives < 3) {
					player1.lives++;
					if (!game.mute) powerupFX.play();
				} else if (player1.health < MAX_HEALTH) {
					player1.health = MAX_HEALTH;
					if (!game.mute) powerupFX.play();
				}
			}
		}

		if (state.current === state.over) {
			this.active = false; // If the game is over, remove from screen
		}
	}

	draw() {
		this.drawRotate();
	}

	reset() {
		this.active = false; // false: Doesn't appear on screen at start of game
		this.x = 1280 + (Math.floor(Math.random() * 10) + 1) * 75;
		this.y = 60 + (Math.floor(Math.random() * 10) * 44);
		this.direction = Math.floor(Math.random() * 10);
		this.speed = Math.floor(Math.random() * 4) + 1;
		this.degrees = Math.floor(Math.random() * 360);
	}
}