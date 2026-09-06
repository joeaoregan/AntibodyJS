/*
	controller-canvas.js
	Canvas-rendered on-screen gamepad that scales uniformly at any width.

	Design: a fixed logical coordinate space (LOGICAL_W x LOGICAL_H). Every
	button is positioned and sized as a fraction of that space, then the whole
	thing is drawn with a single scale factor — so it can never skew; it just
	scales. Pointer input is hit-tested with distance-from-center math and
	mapped onto the shared `controller` object used by player.js.
*/

// Logical (design) resolution — positions below are in these units
const CTRL_W = 1000;
const CTRL_H = 400;

// Which pointer is holding which button (pointerId -> button)
const activePresses = new Map();

// Cluster centres (pushed toward the edges) and the surrounding ring radius
const LEFT_CX = 200;
const RIGHT_CX = 800;
const CLUSTER_CY = 200;
const CLUSTER_R = 192;   // surrounding circle
const BTN_R = 70;        // button radius (larger touch target for smaller fingers)
const BTN_OFF = 108;     // distance of each button from its cluster centre

// Button definitions. Positions are centers in logical units; r is radius.
// Each maps to either a controller flag or an action.
const CTRL_BUTTONS = [
	// D-pad (left cluster)
	{ id: 'up',     x: LEFT_CX,              y: CLUSTER_CY - BTN_OFF, r: BTN_R, label: '↑', colour: '#f14', flag: 'up' },
	{ id: 'left',   x: LEFT_CX - BTN_OFF,    y: CLUSTER_CY,           r: BTN_R, label: '←', colour: '#f14', flag: 'left' },
	{ id: 'right',  x: LEFT_CX + BTN_OFF,    y: CLUSTER_CY,           r: BTN_R, label: '→', colour: '#f14', flag: 'right' },
	{ id: 'down',   x: LEFT_CX,              y: CLUSTER_CY + BTN_OFF, r: BTN_R, label: '↓', colour: '#f14', flag: 'down' },

	// ABXY (right cluster): A/B = laser, X/Y = ninja star
	{ id: 'X', x: RIGHT_CX,             y: CLUSTER_CY - BTN_OFF, r: BTN_R, label: 'X', colour: '#00f', action: 'ninja' },
	{ id: 'Y', x: RIGHT_CX - BTN_OFF,   y: CLUSTER_CY,           r: BTN_R, label: 'Y', colour: '#0f0', action: 'ninja' },
	{ id: 'A', x: RIGHT_CX + BTN_OFF,   y: CLUSTER_CY,           r: BTN_R, label: 'A', colour: '#f14', action: 'fire' },
	{ id: 'B', x: RIGHT_CX,             y: CLUSTER_CY + BTN_OFF, r: BTN_R, label: 'B', colour: '#ff0', action: 'fire', dark: true },

	// START (dead centre, circular) — a second middle button can go below it later
	{ id: 'start', x: CTRL_W / 2, y: CLUSTER_CY, r: 62, label: '≡', colour: '#999', action: 'start', dark: true }
];

let ctrlCanvas = null;
let ctrlCtx = null;
let ctrlScale = 1; // canvas pixels per logical unit

function initControllerCanvas() {
	ctrlCanvas = document.getElementById('controllerCanvas');
	if (!ctrlCanvas) return;
	ctrlCtx = ctrlCanvas.getContext('2d');

	resizeControllerCanvas();
	window.addEventListener('resize', resizeControllerCanvas);

	// Pointer events unify mouse + touch
	ctrlCanvas.addEventListener('pointerdown', ctrlPointerDown);
	ctrlCanvas.addEventListener('pointerup', ctrlPointerUp);
	ctrlCanvas.addEventListener('pointercancel', ctrlPointerUp);
	ctrlCanvas.addEventListener('pointerleave', ctrlPointerUp);

	drawController();
}

// Size the canvas to fit its container width, keeping the logical aspect ratio
function resizeControllerCanvas() {
	if (!ctrlCanvas) return;
	const w = ctrlCanvas.parentElement.clientWidth || window.innerWidth;
	ctrlCanvas.style.width = w + 'px';
	ctrlCanvas.style.height = Math.round(w * (CTRL_H / CTRL_W)) + 'px';
	// Backing store at logical resolution, scaled by CSS
	ctrlCanvas.width = CTRL_W;
	ctrlCanvas.height = CTRL_H;
	ctrlScale = ctrlCanvas.width / CTRL_W; // == 1; drawing uses logical units
	drawController();
}

// Convert a pointer event to logical coordinates
function ctrlPointerPos(e) {
	const rect = ctrlCanvas.getBoundingClientRect();
	const x = (e.clientX - rect.left) * (CTRL_W / rect.width);
	const y = (e.clientY - rect.top) * (CTRL_H / rect.height);
	return { x, y };
}

// Find the button (if any) under a logical point
function ctrlHit(x, y) {
	for (const b of CTRL_BUTTONS) {
		const dx = x - b.x;
		const dy = y - b.y;
		if (Math.hypot(dx, dy) <= b.r) return b;
	}
	return null;
}

function ctrlPress(b) {
	if (b.flag) controller[b.flag] = true;
	if (b.action === 'fire') fireStart();
	if (b.action === 'ninja') { controller.ninjaStar = true; }
	if (b.action === 'start') startGame();
}

function ctrlRelease(b) {
	if (b.flag) controller[b.flag] = false;
	if (b.action === 'fire') fireStop();
	if (b.action === 'ninja') { controller.ninjaStar = false; }
}

function ctrlPointerDown(e) {
	e.preventDefault();
	const p = ctrlPointerPos(e);
	const b = ctrlHit(p.x, p.y);
	if (!b) return;
	activePresses.set(e.pointerId, b);
	ctrlPress(b);
	drawController();
}

function ctrlPointerUp(e) {
	const b = activePresses.get(e.pointerId);
	if (b) {
		ctrlRelease(b);
		activePresses.delete(e.pointerId);
		drawController();
	}
}

function drawController() {
	if (!ctrlCtx) return;
	const c = ctrlCtx;
	c.clearRect(0, 0, CTRL_W, CTRL_H);

	// Cluster background circles (surrounding rings)
	c.fillStyle = 'rgba(120,150,180,0.18)';
	c.strokeStyle = 'rgba(120,150,180,0.35)';
	c.lineWidth = 3;
	for (const cx of [LEFT_CX, RIGHT_CX]) {
		c.beginPath(); c.arc(cx, CLUSTER_CY, CLUSTER_R, 0, Math.PI * 2); c.fill(); c.stroke();
	}

	// Buttons
	for (const b of CTRL_BUTTONS) {
		const pressed = [...activePresses.values()].includes(b);
		c.beginPath();
		c.arc(b.x, b.y, b.r, 0, Math.PI * 2);
		c.fillStyle = pressed ? shade(b.colour) : b.colour;
		c.fill();
		c.lineWidth = 4;
		c.strokeStyle = '#111';
		c.stroke();

		// Label
		c.fillStyle = b.dark ? '#111' : '#fff';
		c.font = `bold ${Math.round(b.r * 0.9)}px Teko, Arial, sans-serif`;
		c.textAlign = 'center';
		c.textBaseline = 'middle';
		c.fillText(b.label, b.x, b.y + 4);
	}
}

// Darken a hex colour slightly for the pressed state
function shade(hex) {
	const n = parseInt(hex.slice(1), 16);
	const r = Math.max(0, (n >> 16) - 60);
	const g = Math.max(0, ((n >> 8) & 0xff) - 60);
	const bl = Math.max(0, (n & 0xff) - 60);
	return `rgb(${r},${g},${bl})`;
}

window.addEventListener('load', initControllerCanvas);
