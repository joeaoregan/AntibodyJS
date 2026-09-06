/*
	rocket.js
	Player rocket weapon: limited ammo (starts with MAX_ROCKETS), only one in
	flight at a time, straight-line flight with a particle exhaust trail.
	Bigger single-target reward than the laser/ninja star to offset the
	limited supply. No charge/steering yet — simplest version first.
*/
class Rocket extends GameObject {
	constructor(src, x, y, speed, direction) {
		super(src, x, y);
		this.speed = speed;
		this.direction = direction;
		this.particles = [];
		this.load();
	}

	update() {
		this.x += this.speed * this.direction;

		this.particles.push(new Particle(this.x, this.y + this.h / 2, particleOrangeImg));
		this.particles.forEach(p => p.update());
		this.particles = this.particles.filter(p => !p.dead);

		if (this.x > canvas.width + this.w || this.x < -this.w) {
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
	}
}
