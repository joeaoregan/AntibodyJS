# Features

- [x] implemented
- [ ] to be added

## Implemented

Features already working in the JavaScript version.

### Game States

- [x] Get Ready screen ("Press Fire To Begin")
- [x] Gameplay state
- [x] Game Over screen (final score + high score display)
- [x] Pause / resume (P or ESC)

### Player

- [x] Player 1 ship with 8-directional movement (WASD / arrows / numpad)
- [x] Screen-boundary movement clamping
- [x] Health (100 HP) with red/green health bar above ship
- [x] 3 lives system
- [x] Invincibility flash on hit and on respawn
- [x] Engine particle trail (20 particles per ship)

### Weapons

- [x] Single green laser (SPACE / on-screen A / B buttons), with fire-rate limit
- [x] Laser upgrade grades: single → double → triple beam, via power-up unlocked by enemy-ship kills, HUD icon + progress bar
- [x] Ninja stars: rotating projectile, destroys enemy ships (+50) and splits blood cells (N / on-screen X / Y buttons)
- [x] Enemy blue laser fire
- [x] Saw: melee weapon hovering in front of ship (E key / on-screen Y), cuts blood cells and enemy ships, invincibility while active; energy drains with use and requires a full recharge after burning out; HUD icon + energy bar
- [x] Rockets: 5-rocket inventory (cap 10), hold-to-charge with power bar and score bonus, steerable up/down after launch (R/F keys or two on-screen thumbsticks), particle trail, HUD icon + count

### Enemies & Obstacles

- [x] Nano-bot enemy ship: right-to-left movement, 4-frame animation, fires back at player, respawns at random Y
- [x] Blood cells: rotating, scroll with background, destroyable (blood splatter explosion)
- [x] Bloodcell Count bar: game over when all blood cells are destroyed

### Power-Ups

- [x] Life power-up: rotating collectible, grants +1 life (or full health if lives maxed)
- [x] Health power-up (+50 HP), also fully recharges the saw
- [x] Laser upgrade power-up (increments laser grade, capped at triple)
- [x] Rocket power-up: real Rocket sprite floats in vertically with a wavy bob, grants +1 rocket (capped)

### HUD & UI

- [x] Lives display with ship icons
- [x] Bloodcell Count status bar
- [x] Score display (top centre)
- [x] Level text (static "Level: 1")
- [x] Timer display (counts up)
- [x] FPS counter (toggle with F1)
- [x] Credit text ("Antibody JS by Joe O'Regan")
- [x] Controls / Info accordion panels on the page
- [x] Weapon status boxes (Laser / Saw / Rocket) with icons and progress/ammo indicators

### Scoring

- [x] Score increments on enemy ship destroyed
- [x] High score persisted in browser localStorage
- [x] Score popup text at kill location, floats toward scoring player with fade-out
- [x] Per-enemy point values (ship 25, blockage 15, boss 50, virus tiers)

### Audio

- [x] Sound FX: player laser, enemy laser, explosion, blood splash, power-up pickup, ninja star swoosh, saw loop
- [x] All audio (music + FX) pauses and resumes together with the game pause
- [x] Mute / unmute toggle (M)
- [x] Music: 4 tracks ("The First Step", "Virus", "Blood Stream", "Blood Level")

### Graphics & Effects

- [x] Seamless scrolling background (dual-image wrap)
- [x] Sprite animations via JSON sprite manifest with async preloading
- [x] Explosion animation (fire) and blood splatter animation
- [x] Player transparency flash effect

## C++ Features to Implement

Features from the C++ original (AntibodyV3 Year 3 Project) not yet ported.

### Game States & Screens

- [ ] Splash screens: title, creators, 3-page story
- [ ] Main menu (Story, 1 Player, 2 Player, Settings, High Scores, Quit) with mouse-driven buttons
- [ ] Settings menu (music on/off, fullscreen toggle)
- [ ] High Scores table screen (top 10)
- [ ] Enter Name screen after qualifying score
- [ ] Level intro / objective screens with random message generator
- [ ] Enemies / Power-ups / Story info screens
- [ ] Pause menu (Resume, Return to Main Menu)
- [ ] Level Complete screen

### Player

- [ ] 2-Player mode: Player 2 ship with independent controls (arrow keys), health, lives and score
- [ ] Speed Boost (P1: F / P2: R) with HUD indicator
- [ ] Gamepad support: D-pad + analog stick (dead zone 8000), per-player pads
- [ ] Controller haptic / force feedback on hits

### Weapons

- [ ] Ninja star virus splitting (spawn 2 small viruses) + per-player kill-rate tracking — base projectile done; needs viruses

### Enemies & Obstacles

- [ ] Green virus: tracks nearest player, splits into small viruses when hit by ninja star / saw
- [ ] Orange virus: tracks player, explodes on collision, approach warning message
- [ ] Blue virus: fires satellite projectiles, spawns orbiting satellites
- [ ] Small virus variants spawned after splits
- [ ] Large blood cell: stalker movement (chases small viruses)
- [ ] Small blood cell
- [ ] White blood cell: guardian, hunts small viruses
- [ ] Blockage walls: groups of 4 segments, only destructible by saw, warning message on spawn
- [ ] Enemy Boss: 100 HP, animated face, eye lasers, spawns viruses from mouth, dedicated health bar, spawns after 15 background scrolls

### Power-Ups

- [ ] Checkpoint power-up (saves progress, restores health)

### HUD & UI

- [ ] Countdown game timer (30s, flashing red at ≤5s) — JS timer currently counts up and does nothing
- [ ] Per-player scores, lives and weapon indicators in 2-player mode
- [ ] Speed Boost indicator text
- [ ] Boss health bar
- [ ] Ninja star kill-rate percentage
- [ ] Mini-map with enlarge/shrink toggle
- [ ] Random message displays: level intro, boss approach, blockage, player spawn

### Scoring

- [ ] High score table (top 10 names + scores)
- [ ] Name entry for qualifying scores

### Audio

- [ ] Music controls: play/pause, skip forward/back, current track name display
- [ ] Separate SFX per player (laser, ninja star)
- [ ] Virus-rip and dedicated rocket-launch SFX (rocket currently reuses the laser sound)

### Levels & Progression

- [ ] 3 levels with increasing difficulty (enemy spawn limits per level)
- [ ] Start / middle / end background sequence
- [ ] Boss encounter after 15 background scrolls to complete a level
- [ ] Level progression to next level on boss defeat

### Multiplayer

- [ ] Split-Screen Race Mode (2-player split-screen test case from C++ repo)

## JavaScript Only Features

Features unique to this version, not present in the C++ original.

- [x] Runs in the browser (HTML5 canvas, no install)
- [x] High score persistence via localStorage (C++ used a highscore.txt file)
- [x] On-screen touch controller (D-pad + A/B/X/Y + START + two rocket-steer thumbsticks), auto-shown on mobile devices only
- [x] Vibration API haptics on mobile (hit / power-up collected)
- [x] Web page wrapper: top navigation (Home / Antibody / Docs)
- [x] Dark / light page theme toggle, persisted in localStorage
- [x] Accordion Controls / Info panels
- [x] MkDocs documentation site (this site)
- [x] JSON sprite manifest with automatic preloading of all sprites
- [x] Node/Express server with Socket.IO: connected-user list and chat messaging (foundation for online multiplayer)
- [ ] Online multiplayer / co-op over Socket.IO (server groundwork exists, gameplay networking not yet built)
- [ ] Server-side shared high scores (scores.json)