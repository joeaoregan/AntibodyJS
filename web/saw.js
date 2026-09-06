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
		this.burnedOut = false;     // true after running dry; needs a full recharge to reuse
		this.degrees = 0;
		this.spin = 5;              // degrees per frame (matches C++)
		this.load();
	}

	toggle() {
		if (this.active) {
			this.deactivate();
			return;
		}
		if (this.burnedOut) {
			if (this.energy >= SAW_MAX_ENERGY) this.burnedOut = false; // fully recharged, usable again
			else return; // still locked out
		}
		if (this.energy > SAW_MAX_ENERGY * 0.2) { // need a minimum charge to switch on
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
				this.burnedOut = true; // must fully recharge before it can be used again
				this.deactivate(); // burnt out
			}
		} else {
			if (this.energy < SAW_MAX_ENERGY) {
				this.energy = Math.min(SAW_MAX_ENERGY, this.energy + SAW_RECHARGE);
			}
			if (this.burnedOut && this.energy >= SAW_MAX_ENERGY) this.burnedOut = false;
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
		this.burnedOut = false;
	}

	draw() {
		if (!this.active) return;
		this.drawRotate(); // status/energy bar now lives in the HUD
	}
}
