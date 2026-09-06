/*
	music.js
	Background music for the game.
	Multiple tracks with skip forward / random selection.
	Starts on the first user interaction (autoplay policy), loops, respects mute.
*/
const MUSIC_TRACKS = [
	"music/1TheFirstStep.mp3",
	"music/2Virus.mp3",
	"music/3BloodStream.mp3",
	"music/4BloodLevel.mp3"
];

// Display names shown on screen when the track changes
const MUSIC_NAMES = [
	"The First Step",
	"Virus",
	"Blood Stream",
	"Blood Level"
];

let musicIndex = 0;
const music = registerMusic(new Audio(MUSIC_TRACKS[musicIndex]));
music.loop = true;
music.volume = 0.4; // keep under the sound FX

let musicStarted = false;

// On-screen "Now Playing" popup (fades out, like ScoreText)
const nowPlaying = {
	text: '',
	alpha: 0,
	show(name) {
		this.text = 'Now Playing: ' + name;
		this.alpha = 1;
	},
	update() {
		if (this.alpha > 0) this.alpha -= 0.005; // slow fade
	},
	draw() {
		if (this.alpha <= 0) return;
		ctx.save();
		ctx.globalAlpha = Math.max(this.alpha, 0);
		ctx.font = "22px Teko";
		ctx.fillStyle = "#FFF";
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 2;
		const w = ctx.measureText(this.text).width;
		ctx.fillText(this.text, (canvas.width - w) / 2, 60);
		ctx.strokeText(this.text, (canvas.width - w) / 2, 60);
		ctx.restore();
	}
};

// Start music once the player first interacts (browser autoplay policy
// blocks audio before a user gesture). Called from startGame / fire.
function startMusic() {
	if (!musicStarted) {
		musicStarted = true;
		music.play().catch(err => console.log("Music play blocked:", err));
	}
}

// Load and play a track by index (wraps around the list)
function playTrack(index) {
	musicIndex = ((index % MUSIC_TRACKS.length) + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
	music.src = MUSIC_TRACKS[musicIndex];
	if (musicStarted) {
		music.play().catch(err => console.log("Music play blocked:", err));
	}
	nowPlaying.show(MUSIC_NAMES[musicIndex]); // display track name on screen
	console.log("Now playing:", MUSIC_TRACKS[musicIndex]);
}

// Skip to the next track (wraps to the start)
function nextTrack() {
	playTrack(musicIndex + 1);
}

// Skip to the previous track (wraps to the end)
function prevTrack() {
	playTrack(musicIndex - 1);
}

// Jump to a random track (not the current one, if more than one exists)
function randomTrack() {
	if (MUSIC_TRACKS.length < 2) return;
	let i;
	do {
		i = Math.floor(Math.random() * MUSIC_TRACKS.length);
	} while (i === musicIndex);
	playTrack(i);
}
