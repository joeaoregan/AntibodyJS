/*
	virus.js
	Green virus enemy: tracks the player's Y position while approaching from
	the right, then continues straight once it passes. Destroying a large
	virus with the ninja star or saw splits it into 2 small viruses (matching
	the C++ original); the laser and rocket just destroy it outright.
	Touching the player directly deals contact damage.
*/
const ripFX = registerFX(new Audio());
ripFX.src = "audio/Rip.wav";

class Virus extends GameObject {
	constructor(src, small = false, isSplitSpawn = false) {
		super(src);
		this.small = small;
		this.isSplitSpawn = isSplitSpawn; // split-spawned viruses are removed on death, not respawned
		this.speed = small ? VIRUS_SMALL_SPEED : VIRUS_SPEED;
		this.animationSpeed = 8;
		this.reset();
	}

	update() {
		if (state.current !== state.game) return;
		this.animate();

		// Large viruses track the player's Y while still to their right; once passed, go straight
		if (!this.small && this.x > player1.x) {
			if (this.y < player1.y) this.y += VIRUS_TRACK_SPEED;
			else if (this.y > player1.y) this.y -= VIRUS_TRACK_SPEED;
		}
		this.x -= this.speed;

		if (this.x < -this.w) {
			if (this.isSplitSpawn) {
				const index = game.objects.indexOf(this);
				if (index > -1) game.objects.splice(index, 1);
			} else {
				this.reset();
			}
		}
	}

	// Spawns 2 small viruses at this virus's position (ninja star / saw hits only)
	split() {
		if (this.small) return; // small viruses can't split further
		for (const dy of [-20, 20]) {
			const v = new Virus("VirusGreenSmall", true, true);
			v.x = this.x;
			v.y = this.y + dy;
			v.load();
			game.objects.push(v);
		}
		if (!game.mute) ripFX.play();
	}

	// Removes a split-spawned virus outright (large viruses use reset() to respawn instead)
	remove() {
		const index = game.objects.indexOf(this);
		if (index > -1) game.objects.splice(index, 1);
	}

	reset() {
		this.x = canvas.width + Math.random() * 200;
		this.y = Math.round(Math.random() * (SCREEN_HEIGHT - this.h - 70) + 35);
	}
}
