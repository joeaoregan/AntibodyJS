/*
	ninja-star.js
	Player ninja star weapon: a rotating projectile.
	Slower than the laser but can split viruses (when viruses are added).
	Unlimited supply, like the laser. Rotates clockwise as it flies.
*/
const ninjaFX = registerFX(new Audio());
ninjaFX.src = "audio/Swoosh1.wav";

class NinjaStar extends GameObject {
	constructor(src, x, y, speed = 10, direction = 1) {
		super(src, x, y);
		this.speed = speed;
		this.direction = direction;
		this.degrees = 0;       // rotation angle
		this.spin = 5;          // degrees per frame (matches C++)
		this.load();
	}

	update() {
		this.x += this.speed * this.direction;
		this.degrees = (this.degrees + this.spin) % 360; // rotate as it moves

		// Remove when it flies off screen
		if (this.x > canvas.width + this.w || this.x < -this.w) {
			const index = game.objects.indexOf(this);
			if (index > -1) game.objects.splice(index, 1);
		}
	}

	draw() {
		this.drawRotate(); // rotating sprite
	}
}
