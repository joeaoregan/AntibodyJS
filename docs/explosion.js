const explosionFX = new Audio();
explosionFX.src = "audio/explosion.wav";

const splashFX = new Audio();
splashFX.src = "audio/splash.wav";

class Explosion extends GameObject {
	constructor(src, x, y, dimension, numFrames) {
		super(src, x, y);
		this.w = this.h = dimension;
		this.frame = 0;
		this.speed = 5;
		this.animation = [];

		for (var i = 0; i < numFrames; i++) {
			this.animation[i] = { sX: i * dimension, sY: 0 };
		}
	}

	draw() {
		let explosion = this.animation[this.frame];
		ctx.drawImage(this.img, explosion.sX, explosion.sY, this.w, this.h, this.x, this.y, this.w, this.h);
	}

	update() {
		if (this.frame >= 11) {
			for (var i = 0; i < game.objects.length; i++) {
				if (this == game.objects[i]) {
					game.objects.splice(i, 1);
					break; // no need to check the rest
				}
			}
		}

		this.frame += frames % this.speed == 0 ? 1 : 0; 	// Increment every 5 frames PUT HERE TO SHOW ALL ANIMATION FRAMES
		this.frame = this.frame % this.animation.length; 	// Frame loops 0 to 11
	}
}