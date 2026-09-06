/*
	saw.js
	Player saw weapon: a rotating blade that hovers in front of the ship
	and follows it (close-range deflection weapon).

	Energy mechanic (new vs C++): the saw has an energy meter that drains
	while active and slowly recharges while inactive. When it runs out the
	saw switches off until it has recharged enough. Collecting a health
	power-up fully restores the energy. While active the player cannot be
	damaged (the blade deflects incoming objects).
*/
const sawFX = registerFX(new Audio());
sawFX.src = "audio/Saw.wav";
sawFX.loop = true;

class Saw extends GameObject {
	constructor(src, player) {
		super(src, 0, 0);
		this.player = player;       // the ship it follows
		this.active = false;        // hidden until toggled on
		this.energy = SAW_MAX_ENERGY;
		this.degrees = 0;
		this.spin = 5;              // degrees per frame (matches C++)
		this.load();
	}

	toggle() {
		if (this.active) {
			this.deactivate();
		} else if (this.energy > SAW_MAX_ENERGY * 0.2) { // need a minimum charge to switch on
			this.active = true;
			if (!game.mute) sawFX.play();
		}
	}

	deactivate() {
		this.active = false;
		sawFX.pause();
	}

	update() {
		// Stop sound and deactivate when the game is paused or over
		if (game.paused || state.current !== state.game) {
			sawFX.pause();
			if (state.current !== state.game) this.active = false;
			return;
		}

		// Energy drain / recharge
		if (this.active) {
			this.energy -= SAW_DRAIN;
			if (this.energy <= 0) {
				this.energy = 0;
				this.deactivate(); // burnt out
			}
		} else if (this.energy < SAW_MAX_ENERGY) {
			this.energy = Math.min(SAW_MAX_ENERGY, this.energy + SAW_RECHARGE);
		}

		if (!this.active) return;

		// Keep the loop in sync with the active state and mute flag
		if (sawFX.paused && !game.mute) sawFX.play().catch(() => {});

		// Hover in front of the ship and follow it (C++ offset x+65, y+25)
		this.x = this.player.x + 65;
		this.y = this.player.y + 25;
		this.degrees = (this.degrees + this.spin) % 360;
	}

	// Called when the player collects a health power-up: top up the saw
	recharge() {
		this.energy = SAW_MAX_ENERGY;
	}

	draw() {
		if (!this.active) return;
		this.drawRotate();
		this.drawEnergyBar();
	}

	// Small energy meter above the saw while it's running
	drawEnergyBar() {
		const w = 40, h = 5;
		const x = this.x, y = this.y - 12;
		ctx.save();
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
		ctx.strokeRect(x, y, w, h);
		ctx.fillStyle = "#400";
		ctx.fillRect(x, y, w, h);
		ctx.fillStyle = this.energy > SAW_MAX_ENERGY * 0.25 ? "#0c0" : "#f80"; // orange when low
		ctx.fillRect(x, y, w * (this.energy / SAW_MAX_ENERGY), h);
		ctx.restore();
	}
}
