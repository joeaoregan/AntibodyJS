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

// Weapon status boxes: fill the gap between Lives and Bloodcell Count
const LASER_ICONS = ['PowerUpLaser', 'LaserGunV2', 'LaserGunV3'];
const laserIconImgs = {};
LASER_ICONS.forEach(name => {
	const img = new Image();
	img.src = 'art/' + name + '.png';
	laserIconImgs[name] = img;
});

const sawIconImg = new Image();
sawIconImg.src = 'art/SawBlue.png';

const rocketIconImg = new Image();
rocketIconImg.src = 'art/PowerUpRocket.png';

const WEAPON_BOX_GAP_START = P1Box.x + P1Box.w;
const WEAPON_BOX_GAP_END = (canvas.width / 2) - 200;
const WEAPON_BOX_MARGIN = 8;
const WEAPON_BOX_SPACING = 6;
const WEAPON_BOX_W = Math.floor(
	(WEAPON_BOX_GAP_END - WEAPON_BOX_GAP_START - WEAPON_BOX_MARGIN * 2 - WEAPON_BOX_SPACING * 2) / 3
);
const WEAPON_BOX_H = 50;
const WEAPON_BOX_Y = 625;

const LaserBox = {
	x: WEAPON_BOX_GAP_START + WEAPON_BOX_MARGIN,
	y: WEAPON_BOX_Y,
	w: WEAPON_BOX_W,
	h: WEAPON_BOX_H
}

const SawBox = {
	x: LaserBox.x + WEAPON_BOX_W + WEAPON_BOX_SPACING,
	y: WEAPON_BOX_Y,
	w: WEAPON_BOX_W,
	h: WEAPON_BOX_H
}

const RocketBox = {
	x: SawBox.x + WEAPON_BOX_W + WEAPON_BOX_SPACING,
	y: WEAPON_BOX_Y,
	w: WEAPON_BOX_W,
	h: WEAPON_BOX_H
}

const LaserProgress = {
	x: LaserBox.x,
	y: LaserBox.y + LaserBox.h + 6,
	w: LaserBox.w,
	h: 10
}

const SawProgress = {
	x: SawBox.x,
	y: SawBox.y + SawBox.h + 6,
	w: SawBox.w,
	h: 10
}

const RocketProgress = {
	x: RocketBox.x,
	y: RocketBox.y + RocketBox.h + 6,
	w: RocketBox.w,
	h: 10
}

// Player 2 is a greyed-out mirrored layout until two-player mode is enabled.
const P2Box = {
	x: canvas.width - P1Box.x - P1Box.w,
	y: P1Box.y,
	w: P1Box.w,
	h: P1Box.h
}
const P2RocketBox = {
	x: (canvas.width / 2) + 200 + WEAPON_BOX_MARGIN,
	y: WEAPON_BOX_Y,
	w: WEAPON_BOX_W,
	h: WEAPON_BOX_H
}
const P2SawBox = {
	x: P2RocketBox.x + WEAPON_BOX_W + WEAPON_BOX_SPACING,
	y: WEAPON_BOX_Y,
	w: WEAPON_BOX_W,
	h: WEAPON_BOX_H
}
const P2LaserBox = {
	x: P2SawBox.x + WEAPON_BOX_W + WEAPON_BOX_SPACING,
	y: WEAPON_BOX_Y,
	w: WEAPON_BOX_W,
	h: WEAPON_BOX_H
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

		ctx.fillStyle = "#30373d";
		ctx.fillRect(0, 600, 1280, 120);

		//HUD outline
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "black";
		ctx.rect(0, 600, 1280, 120);
		ctx.stroke();

		this.p1Lives();
		bcCounter.bar();
		this.laserIndicator();
		this.sawIndicator();
		this.rocketIndicator();
		this.p2Layout();

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
		ctx.strokeStyle = 'grey';
		ctx.rect(P1Box.x, P1Box.y, P1Box.w, P1Box.h);
		ctx.stroke();

		if (player1.lives >= 3)
			ctx.drawImage(lifeP1, this.sX, this.sY, this.w, this.h, P1Box.x + P1Box.w * (1 / 6) - life.w / 2, P1Box.y + life.y, life.w, life.h);
		if (player1.lives >= 2)
			ctx.drawImage(lifeP1, this.sX, this.sY, this.w, this.h, P1Box.x + P1Box.w * (3 / 6) - life.w / 2, P1Box.y + life.y, life.w, life.h);
		if (player1.lives >= 1)
			ctx.drawImage(lifeP1, this.sX, this.sY, this.w, this.h, P1Box.x + P1Box.w * (5 / 6) - life.w / 2, P1Box.y + life.y, life.w, life.h);

		ctx.lineWidth = 1;
		ctx.font = "25px Teko";
		ctx.fillStyle = "#FFF";

		P1Box.lifeTxt = 'Lives';
		P1Box.lifeTxtWidth = ctx.measureText(P1Box.lifeTxt).width;

		ctx.fillText(P1Box.lifeTxt, P1Box.x + (P1Box.w / 2) - (P1Box.lifeTxtWidth / 2), P1Box.y + 20);
		ctx.strokeText(P1Box.lifeTxt, P1Box.x + (P1Box.w / 2) - (P1Box.lifeTxtWidth / 2), P1Box.y + 20);

		ctx.font = "22px Teko";
		ctx.fillStyle = "#FFF";
		ctx.textAlign = "center";
		ctx.fillText("Player 1", P1Box.x + P1Box.w / 2, P1Box.y + P1Box.h + 30);
		ctx.textAlign = "start";
	}

	p2Layout() {
		const boxes = [P2RocketBox, P2SawBox, P2LaserBox, P2Box];
		const drawFlipped = (img, x, y, w, h) => {
			ctx.save();
			ctx.translate(x + w, y);
			ctx.scale(-1, 1);
			ctx.drawImage(img, 0, 0, w, h);
			ctx.restore();
		};
		ctx.save();
		ctx.globalAlpha = 0.45;
		ctx.filter = "grayscale(1)";

		boxes.forEach(box => {
			ctx.fillStyle = "#555";
			ctx.fillRect(box.x, box.y, box.w, box.h);
			ctx.strokeStyle = "#999";
			ctx.lineWidth = 1;
			ctx.strokeRect(box.x, box.y, box.w, box.h);
		});

		if (rocketIconImg.complete) {
			const iconH = P2RocketBox.h - 8;
			const iconW = Math.round(iconH * (30 / 60));
			ctx.drawImage(rocketIconImg, P2RocketBox.x + P2RocketBox.w - iconW - 6, P2RocketBox.y + (P2RocketBox.h - iconH) / 2, iconW, iconH);
			ctx.font = "22px Teko";
			ctx.fillStyle = "#FFF";
			ctx.fillText("x5", P2RocketBox.x + 6, P2RocketBox.y + P2RocketBox.h / 2 + 8);
		}

		if (sawIconImg.complete) {
			const iconSize = P2SawBox.w - 12;
			drawFlipped(sawIconImg, P2SawBox.x + (P2SawBox.w - iconSize) / 2, P2SawBox.y + (P2SawBox.h - iconSize) / 2, iconSize, iconSize);
		}

		const iconW = P2LaserBox.w - 8;
		const iconH = Math.round(iconW * (48 / 60));
		const laserImg = laserIconImgs.PowerUpLaser;
		if (laserImg.complete) {
			drawFlipped(laserImg, P2LaserBox.x + (P2LaserBox.w - iconW) / 2, P2LaserBox.y + (P2LaserBox.h - iconH) / 2, iconW, iconH);
		}

		for (let lifeIndex = 0; lifeIndex < 3; lifeIndex++) {
			drawFlipped(
				lifeP1,
				P2Box.x + P2Box.w * (5 / 6 - lifeIndex / 3) - life.w / 2,
				P2Box.y + life.y, life.w, life.h
			);
		}

		[P2RocketBox, P2SawBox, P2LaserBox].forEach(box => {
			const progressY = box.y + box.h + 6;
			ctx.strokeStyle = "#555";
			ctx.lineWidth = 1;
			ctx.strokeRect(box.x, progressY, box.w, 10);
			ctx.fillStyle = "#777";
			ctx.fillRect(box.x, progressY, box.w, 10);
		});

		ctx.filter = "none";
		ctx.fillStyle = "#FFF";
		ctx.font = "22px Teko";
		ctx.textAlign = "center";
		ctx.fillText("Lives", P2Box.x + P2Box.w / 2, P2Box.y + 20);
		ctx.fillText("Player 2", P2Box.x + P2Box.w / 2, P2Box.y + P2Box.h + 30);
		ctx.restore();
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
		const iconW = LaserBox.w - 8, iconH = Math.round(iconW * (48 / 60));
		if (img.complete) {
			ctx.drawImage(img, LaserBox.x + (LaserBox.w - iconW) / 2, LaserBox.y + (LaserBox.h - iconH) / 2, iconW, iconH);
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

	sawIndicator() {
		ctx.fillStyle = "#223";
		ctx.fillRect(SawBox.x, SawBox.y, SawBox.w, SawBox.h);

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "grey";
		ctx.rect(SawBox.x, SawBox.y, SawBox.w, SawBox.h);
		ctx.stroke();

		const iconSize = SawBox.w - 12;
		if (sawIconImg.complete) {
			ctx.save();
			if (saw && saw.burnedOut) ctx.filter = "grayscale(1) brightness(0.6)"; // unusable until fully recharged
			ctx.drawImage(sawIconImg, SawBox.x + (SawBox.w - iconSize) / 2, SawBox.y + (SawBox.h - iconSize) / 2, iconSize, iconSize);
			ctx.restore();
		}

		const percent = saw ? saw.energy / SAW_MAX_ENERGY : 0;

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "black";
		ctx.rect(SawProgress.x, SawProgress.y, SawProgress.w, SawProgress.h);
		ctx.stroke();

		ctx.fillStyle = "#400";
		ctx.fillRect(SawProgress.x, SawProgress.y, SawProgress.w, SawProgress.h);

		ctx.fillStyle = (saw && saw.burnedOut) ? "#888" : "#0c0";
		ctx.fillRect(SawProgress.x, SawProgress.y, SawProgress.w * percent, SawProgress.h);
	}

	rocketIndicator() {
		ctx.fillStyle = "#223";
		ctx.fillRect(RocketBox.x, RocketBox.y, RocketBox.w, RocketBox.h);

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "grey";
		ctx.rect(RocketBox.x, RocketBox.y, RocketBox.w, RocketBox.h);
		ctx.stroke();

		const iconH = RocketBox.h - 8, iconW = Math.round(iconH * (30 / 60));
		if (rocketIconImg.complete) {
			ctx.save();
			if (player1.rockets <= 0) ctx.filter = "grayscale(1) brightness(0.6)"; // out of rockets
			ctx.drawImage(rocketIconImg, RocketBox.x + 6, RocketBox.y + (RocketBox.h - iconH) / 2, iconW, iconH);
			ctx.restore();
		}

		ctx.lineWidth = 1;
		ctx.font = "22px Teko";
		ctx.fillStyle = "#FFF";
		const label = "x" + player1.rockets;
		ctx.fillText(label, RocketBox.x + 6 + iconW + 6, RocketBox.y + RocketBox.h / 2 + 8);
		ctx.strokeText(label, RocketBox.x + 6 + iconW + 6, RocketBox.y + RocketBox.h / 2 + 8);

		// Charge bar: fills while C / the mobile X button is held
		const chargePercent = player1.rocketCharging ? player1.rocketCharge / ROCKET_CHARGE_MAX : 0;

		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.strokeStyle = "black";
		ctx.rect(RocketProgress.x, RocketProgress.y, RocketProgress.w, RocketProgress.h);
		ctx.stroke();

		ctx.fillStyle = "#400";
		ctx.fillRect(RocketProgress.x, RocketProgress.y, RocketProgress.w, RocketProgress.h);

		ctx.fillStyle = chargePercent > 0.85 ? "#f80" : "#0c0"; // flashes toward red near auto-launch
		ctx.fillRect(RocketProgress.x, RocketProgress.y, RocketProgress.w * chargePercent, RocketProgress.h);
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
