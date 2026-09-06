/*
	audio.js
	Central registry for all game Audio objects so they can be paused/resumed
	together (e.g. when the game is paused) and muted via the sound toggle.

	Register each Audio object with registerFX(audio). pauseAll() silences
	everything on pause; resumeAll() restarts only what should be playing
	(music, and the saw loop if the saw is active).
*/
const FX_SOUNDS = [];      // one-shot + looped effects
let musicRef = null;       // background music (handled separately)

function registerFX(audio) {
	if (audio && !FX_SOUNDS.includes(audio)) FX_SOUNDS.push(audio);
	return audio;
}

function registerMusic(audio) {
	musicRef = audio;
	return audio;
}

// Pause every registered sound (call when the game pauses)
function pauseAllAudio() {
	FX_SOUNDS.forEach(a => { if (a && !a.paused) a.pause(); });
	if (musicRef && !musicRef.paused) musicRef.pause();
}

// Resume only what should be playing (call when the game unpauses)
function resumeAllAudio() {
	if (game.mute) return; // stay silent while muted
	if (musicRef && musicStarted) musicRef.play().catch(() => {});
	// Saw loop resumes only if the saw is still active
	if (typeof saw !== 'undefined' && saw && saw.active && typeof sawFX !== 'undefined') {
		sawFX.play().catch(() => {});
	}
}
