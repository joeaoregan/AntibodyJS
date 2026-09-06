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

// Laser grades: 0 = single, 1 = double (angled), 2 = triple (straight + 2 angled)
const LASER_GRADE_MAX = 2;
const LASER_KILLS_GRADE0 = 5;  // enemy ships to kill at grade 0 before the grade 1 power-up appears
const LASER_KILLS_GRADE1 = 10; // enemy ships to kill at grade 1 before the grade 2 power-up appears

// Saw energy: drains while active, recharges when off, health power-up refills it
const SAW_MAX_ENERGY = 100;
const SAW_DRAIN = 0.3;    // energy per frame while active (lasts ~2x longer)
const SAW_RECHARGE = 0.25; // energy per frame while inactive

// Rockets: limited ammo, only one in flight at a time, bigger reward per kill
const ROCKET_START = 5; // rockets the player begins with
const ROCKET_MAX = 10;  // most rockets the player can carry
const SCORE_ROCKET_SHIP = 75;
const ROCKET_SPEED = 15;
const ROCKET_CHARGE_MAX = 120; // frames to fully charge (2s @60fps)
const ROCKET_MAX_BONUS = 50;   // extra score for a fully charged hit
const ROCKET_STEER_SPEED = 4;  // vertical steering speed while the rocket is in flight

// Green virus: tracks the player's Y while approaching, splits in two when cut
const NUM_VIRUS_GREEN = 2;      // persistent pool of large viruses on screen
const VIRUS_SPEED = 2;          // large virus horizontal speed
const VIRUS_SMALL_SPEED = 1.5;  // small (split) virus horizontal speed
const VIRUS_TRACK_SPEED = 1;    // vertical tracking speed while right of the player
const VIRUS_DAMAGE = 20;        // contact damage dealt to the player
const SCORE_VIRUS_GREEN = 10;
const SCORE_VIRUS_GREEN_SMALL = 5;
