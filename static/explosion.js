const explosionFX = new Audio();
explosionFX.src = "audio/explosion.wav";

const splashFX = new Audio();
splashFX.src = "audio/splash.wav";

class Explosion extends GameObject {
	constructor(src, x, y, dimension, numFrames) {
		super(src, x, y, dimension, dimension, numFrames);
		this.animationSpeed = 3;
	}

	update() {
		this.animate();

		// If we reached the last frame, remove from game
		if (this.currentFrame === this.totalFrames - 1) {
			const index = game.objects.indexOf(this);
			if (index > -1) game.objects.splice(index, 1);
		}
	}
}