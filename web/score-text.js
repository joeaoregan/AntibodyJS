/*
	score-text.js
	Floating score popup: spawns at a destroyed enemy, drifts up, fades out.
	Kept in game.scoreTexts (separate from objects) so it skips collision checks.
*/
class ScoreText {
	constructor(x, y, text, colour = "#FFF200") {
		this.x = x;
		this.y = y;
		this.text = text;
		this.colour = colour;
		this.alpha = 1;
		this.dy = -1; // drift upward
	}
	update() {
		this.y += this.dy;
		this.alpha -= 0.02; // fade out
	}
	draw() {
		ctx.save();
		ctx.globalAlpha = Math.max(this.alpha, 0);
		ctx.font = "25px Teko";
		ctx.lineWidth = 2;
		ctx.fillStyle = this.colour;
		ctx.strokeStyle = "#000";
		ctx.fillText(this.text, this.x, this.y);
		ctx.strokeText(this.text, this.x, this.y);
		ctx.restore();
	}
	get dead() { return this.alpha <= 0; }
}
