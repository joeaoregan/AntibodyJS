const powerupFX = registerFX(new Audio());
powerupFX.src = "audio/Bonus1.wav";

class PowerUp extends GameObject {
	constructor(src, effect = 'life') {
		super(src);
		this.effect = effect; // 'life' | 'health'
		this.reset();
	}

	update() {
		if (this.active) {
			if (this.effect === 'rocket') {
				this.x -= this.speed; // drift right-to-left like the other pickups
				this.waveAngle += 0.05;
				this.y = this.baseY + Math.sin(this.waveAngle) * 15; // gentle wavy bob, no spin
			} else {
				this.updateRotate(); // Update rotating Game Objects
			}
			this.clearOnLeft();	// When enemy objects moves off screen (left)

			if (collision(player1, this)) {
				navigator.vibrate?.([100, 50, 100, 50, 100, 50, 400]); // vibrate mobile device if power up collected
				this.reset();
				this.applyEffect();
			}
		}

		if (state.current === state.over) {
			this.active = false; // If the game is over, remove from screen
		}
	}

	applyEffect() {
		if (this.effect === 'health') {
			// Restore +50 HP, capped at max — also fully recharges the saw
			if (player1.health < MAX_HEALTH) {
				player1.health = Math.min(player1.health + 50, MAX_HEALTH);
				if (!game.mute) powerupFX.play();
			}
			if (typeof saw !== 'undefined' && saw) saw.recharge();
		} else if (this.effect === 'laser') {
			if (player1.laserGrade < LASER_GRADE_MAX) {
				player1.laserGrade++;
				player1.laserKillCount = 0; // progress resets for the next upgrade tier
				if (!game.mute) powerupFX.play();
				game.scoreTexts.push(
					new ScoreText(player1.x, player1.y - 20, "Laser Upgraded!", "#0FF")
				);
			}
		} else if (this.effect === 'rocket') {
			if (player1.rockets < ROCKET_MAX) {
				player1.rockets++;
				if (!game.mute) powerupFX.play();
				game.scoreTexts.push(
					new ScoreText(player1.x, player1.y - 20, "+1 Rocket!", "#FA0")
				);
			}
		} else { // 'life'
			if (player1.lives < 3) {
				player1.lives++;
				if (!game.mute) powerupFX.play();
			} else if (player1.health < MAX_HEALTH) {
				player1.health = MAX_HEALTH;
				if (!game.mute) powerupFX.play();
			}
		}
	}

	draw() {
		if (this.effect === 'rocket') {
			// Vertical, nose-up, scaled down a little so it doesn't look oversized
			if (!this.img.complete) return;
			const scale = 0.7;
			const w = this.w * scale, h = this.h * scale;
			ctx.save();
			ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
			ctx.rotate(-Math.PI / 2); // nose points up
			ctx.drawImage(this.img, -w / 2, -h / 2, w, h);
			ctx.restore();
			return;
		}
		this.drawRotate();
	}

	reset() {
		this.active = false; // false: Doesn't appear on screen at start of game
		this.x = 1280 + (Math.floor(Math.random() * 10) + 1) * 75;
		this.y = 60 + (Math.floor(Math.random() * 10) * 44);
		this.direction = Math.floor(Math.random() * 10);
		this.speed = Math.floor(Math.random() * 4) + 1;
		this.degrees = Math.floor(Math.random() * 360);
		this.baseY = this.y; // centre line for the rocket power-up's wavy bob
		this.waveAngle = Math.random() * Math.PI * 2;
	}
}