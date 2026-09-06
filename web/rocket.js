/*
	rocket.js
	Player rocket weapon: limited ammo (starts with ROCKET_START, capped at
	ROCKET_MAX), only one in flight at a time, straight-line flight with a
	particle exhaust trail. Hold-to-charge before launch (bigger bonus score
	for a fuller charge), then steerable up/down after launch (R/F keys or
	the mobile rocket-steer thumbsticks).
*/
class Rocket extends GameObject {
	constructor(src, x, y, speed, direction) {
		super(src, x, y);
		this.speed = speed;
		this.direction = direction;
		this.dy = 0; // vertical steering velocity
		this.bonus = 0; // extra score from charge time, set by Player.releaseRocket()
		this.particles = [];
		this.load();
	}

	// Called every frame from Player.move() while this rocket is active
	steer(dir) {
		this.dy = dir * ROCKET_STEER_SPEED;
	}

	update() {
		this.x += this.speed * this.direction;
		this.y += this.dy;

		this.particles.push(new Particle(this.x, this.y + this.h / 2, particleOrangeImg));
		this.particles.forEach(p => p.update());
		this.particles = this.particles.filter(p => !p.dead);

		if (this.x > canvas.width + this.w || this.x < -this.w) {
			this.remove();
		} else if (this.y < 40 || this.y > 520) {
			// Flew out of bounds while steering — explodes instead of a clean despawn
			game.objects.push(new Explosion("Explosion", this.x, this.y));
			if (!game.mute) explosionFX.play();
			this.remove();
		}
	}

	draw() {
		this.particles.forEach(p => p.draw());
		super.draw();
	}

	// Removes the rocket from play and frees up the "one at a time" slot
	remove() {
		const index = game.objects.indexOf(this);
		if (index > -1) game.objects.splice(index, 1);
		player1.rocketActive = false;
		player1.activeRocketRef = null;
	}
}
