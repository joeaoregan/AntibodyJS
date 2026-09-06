const lifeP1 = new Image();
lifeP1.src = "art/Player1ShipSmall.png";

const P1Box = {
	w: 200,
	h: 50,
	y: 625,
	x: 25,
	lifeTxt: '',
	lifeTxtWidth: 0
}

const life = {
	y: 23,
	w: 50,
	h: 25
}

// Laser grade indicator: icon changes as the player upgrades (PowerUpLaser -> LaserGunV2 -> LaserGunV3)
const LASER_ICONS = ['PowerUpLaser', 'LaserGunV2', 'LaserGunV3'];
const laserIconImgs = {};
LASER_ICONS.forEach(name => {
	const img = new Image();
	img.src = 'art/' + name + '.png';
	laserIconImgs[name] = img;
});

const LaserBox = {
	h: 50,
	y: 625,
	x: P1Box.x + P1Box.w + 15
}
LaserBox.w = ((canvas.width / 2) - 200) - LaserBox.x - 15; // fills the gap up to the Bloodcell Count box

const LaserProgress = {
	x: LaserBox.x,
	y: LaserBox.y + LaserBox.h + 6,
	w: LaserBox.w,
	h: 10
}

class hud {
	constructor() {
		this.sX = 0;
		this.sY = 0;

		this.w = 50;
		this.h = 25;
		this.x = 25;
		this.y = 625;
	}

	draw() {
		ctx.save(); // 1. Save state (protects against player transparency/rotations)

		//HUD outline
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "black";
		ctx.rect(0, 600, 1280, 120);
		ctx.stroke();

		this.p1Lives();
		bcCounter.bar();
		this.laserIndicator();

		// 2. Remove the textAlign and textBaseline lines from here.
		// This allows levelTxt, score, etc., to use their own internal alignment.
		levelTxt.draw();
		score.draw();
		time.draw();
		antibodyTxt.draw();

		ctx.restore(); // 3. Restore state
	}

	p1Lives() {
		// Player 1: Lives
		ctx.fillStyle = "#991122";
		ctx.fillRect(P1Box.x, P1Box.y, P1Box.w, P1Box.h);

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokStyle = "grey";
		ctx.rect(P1Box.x, P1Box.y, P1Box.w, P1Box.h);
		ctx.stroke();

		if (player1.lives >= 3)
			ctx.drawImage(lifeP1, this.sX, this.sY, this.w, this.h, P1Box.x + (P1Box.w * 3 / 3) - (life.w / 2) - P1Box.w * 1 / 6, P1Box.y + life.y, life.w, life.h);
		if (player1.lives >= 2)
			ctx.drawImage(lifeP1, this.sX, this.sY, this.w, this.h, P1Box.x + (P1Box.w * 2 / 3) - (life.w / 2) - P1Box.w * 1 / 6, P1Box.y + life.y, life.w, life.h);
		if (player1.lives >= 1)
			ctx.drawImage(lifeP1, this.sX, this.sY, this.w, this.h, P1Box.x + (P1Box.w * 1 / 3) - (life.w / 2) - P1Box.w * 1 / 6, P1Box.y + life.y, life.w, life.h);

		ctx.lineWidth = 1;
		ctx.font = "25px Teko";
		ctx.fillStyle = "#FFF";

		P1Box.lifeTxt = 'Lives';
		P1Box.lifeTxtWidth = ctx.measureText(P1Box.lifeTxt).width;

		ctx.fillText(P1Box.lifeTxt, P1Box.x + (P1Box.w / 2) - (P1Box.lifeTxtWidth / 2), P1Box.y + 18);
		ctx.strokeText(P1Box.lifeTxt, P1Box.x + (P1Box.w / 2) - (P1Box.lifeTxtWidth / 2), P1Box.y + 18);
	}

	laserIndicator() {
		ctx.fillStyle = "#223";
		ctx.fillRect(LaserBox.x, LaserBox.y, LaserBox.w, LaserBox.h);

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "grey";
		ctx.rect(LaserBox.x, LaserBox.y, LaserBox.w, LaserBox.h);
		ctx.stroke();

		const iconName = LASER_ICONS[Math.min(player1.laserGrade, LASER_ICONS.length - 1)];
		const img = laserIconImgs[iconName];
		if (img.complete) {
			ctx.drawImage(img, LaserBox.x + (LaserBox.w - 60) / 2, LaserBox.y + 1, 60, 48);
		}

		// Progress toward the next laser upgrade (enemy ship kills)
		const maxed = player1.laserGrade >= LASER_GRADE_MAX;
		const killsNeeded = player1.laserGrade === 0 ? LASER_KILLS_GRADE0 : LASER_KILLS_GRADE1;
		const percent = maxed ? 1 : Math.min(1, player1.laserKillCount / killsNeeded);

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "black";
		ctx.rect(LaserProgress.x, LaserProgress.y, LaserProgress.w, LaserProgress.h);
		ctx.stroke();

		ctx.fillStyle = "#400";
		ctx.fillRect(LaserProgress.x, LaserProgress.y, LaserProgress.w, LaserProgress.h);

		ctx.fillStyle = "#0c0";
		ctx.fillRect(LaserProgress.x, LaserProgress.y, LaserProgress.w * percent, LaserProgress.h);
	}
}

const bcCounter = {
	w: 400,
	h: 50,
	x: (canvas.width / 2) - 200,
	y: 625,
	barText: 'Bloodcell Count',
	textWidth: 0,

	bar: function () {
		//ctx.fillStyle = "#70c5ce";
		ctx.beginPath();
		ctx.lineWidth = "3";
		ctx.strokeStyle = "black";//Outline
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.stroke();

		//ctx.beginPath();
		ctx.fillStyle = "#666";//Black
		//ctx.rect(this.x-10,this.y,100,10);
		ctx.fillRect(this.x, this.y, this.w, this.h);

		ctx.fillStyle = "#F12";//Red
		//ctx.rect(this.x-10,this.y,100,10);
		ctx.fillRect(this.x, this.y, this.w * (MAX_BLOODCELLS - bloodcellsDestroyed) / MAX_BLOODCELLS, this.h);
		//ctx.fillRect(this.x+HEALTHBAR_X,this.y+HEALTHBAR_Y,HEALTHBAR_W*this.health/MAX_HEALTH,HEALTHBAR_H);

		ctx.lineWidth = 2;
		ctx.font = "35px Teko";
		ctx.fillStyle = "#FFF";

		this.textWidth = ctx.measureText(this.barText).width;

		ctx.fillText(this.barText, this.x + ((this.w - this.textWidth) / 2), this.y + 35);
		ctx.strokeText(this.barText, this.x + ((this.w - this.textWidth) / 2), this.y + 35);
	}
}
