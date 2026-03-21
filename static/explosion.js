const explosionFX = new Audio();
explosionFX.src = "audio/explosion.wav";

const splashFX = new Audio();
splashFX.src = "audio/splash.wav";

class Explosion extends GameObject {
	constructor(src, x, y) {
		super(src, x, y);
		this.animationSpeed = 3;

		this.load();
	}

	update() {
		this.animate();

		// If we reached the last frame, remove from game
		if (this.currentFrame >= this.totalFrames - 1 && this.frameTick % this.animationSpeed === 0) {
			const index = game.objects.indexOf(this);
			if (index > -1) game.objects.splice(index, 1);
		}
	}
}