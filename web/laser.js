class Laser extends GameObject {
	constructor(src, x, y, speed, direction) {
		super(src, x, y);
		this.speed = speed;
		this.direction = direction;
	}

	update() {
		this.x += (this.speed * this.direction);

		if (this.x > canvas.width + this.w || this.x < -this.w) { // Laser moves off screen
			for (var i = 0; i < game.objects.length; i++) {
				if (game.objects[i] === this) {
					game.objects.splice(i, 1);
					// console.log("Laser destroyed");
					break;
				}
			}
		}

		updateScore();
	}
}