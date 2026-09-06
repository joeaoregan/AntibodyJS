// Canvas
const canvas = document.getElementById("antibody");
const ctx = canvas.getContext("2d");

const SCREEN_HEIGHT = 600;

// Blood Cells
const MAX_BLOODCELLS = 50;
const NUM_BLOODCELLS = 5;

// Player
const MAX_HEALTH = 100;
const MAX_LIVES = 3;
const DAMAGE_ENEMY_LASER = 15; // damage dealt by an enemy laser hit
const HEALTHBAR_W = 75;
const HEALTHBAR_H = 10;
const HEALTHBAR_X = 10;
const HEALTHBAR_Y = -15;

// Scoring: points per enemy type
const SCORE_ENEMY_SHIP = 25;
const SCORE_NINJA_SHIP = 50; // ninja star ship kill — 2x laser, reward for a slower weapon
const NINJA_FIRE_DELAY = 40; // ninja stars fire much slower than lasers (laser = 10)
