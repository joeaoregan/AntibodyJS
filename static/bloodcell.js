class Bloodcell extends GameObject {
	constructor(src) {
		super(src);
		this.reset();
	}

	update() {
		this.updateRotate(); // Update rotating Game Objects
		this.clearOnLeft();	// When enemy objects moves off screen (left)
	}

	draw() {
		this.drawRotate();
	}

	reset() {
		this.x = 1280 + (Math.floor(Math.random() * 10) + 1) * 75;
		this.y = 60 + (Math.floor(Math.random() * 10) * 44);
		this.direction = Math.floor(Math.random() * 10);
		this.speed = Math.floor(Math.random() * 4) + 1;
		this.degrees = Math.floor(Math.random() * 360);
	}
}