class Laser extends GameObject {
	constructor(src, x, y, speed, direction) {
		super(src, x, y);
		this.speed = speed;
		this.direction = direction;
		this.load();
	}

	update() {
		this.x += (this.speed * this.direction);

		if (this.x > canvas.width + this.w || this.x < -this.w) { // Laser moves off screen
			const index = game.objects.indexOf(this);
			if (index > -1) {
				game.objects.splice(index, 1);
			}
		}
	}
}