const fireFX = registerFX(new Audio());
fireFX.src = "audio/laser1.wav";

class Player extends GameObject {
    constructor(src, x, y, w, h) {
        super(src, x, y, w, h);
        this.reset();
        this.particles = [];
    }

    update() {
        this.move();

        if (state.current == state.game) {
            this.fireRate++;
            this.x += this.dx;
            this.y += this.dy;

            if (this.x < 0) this.x = 0;
            else if (this.x >= canvas.width - this.w) this.x = canvas.width - this.w;
            else if (this.y < 40) this.y = 40;
            else if (this.y > 520) this.y = 520;

            if (this.dx !== 0 || this.dy !== 0) {
                this.particles.push(new Particle(this.x + 9, this.y + 30, particleOrangeImg));
            }
            this.particles.forEach(p => p.update());
            this.particles = this.particles.filter(p => !p.dead);
        }

        if (state.current === state.over) {
            this.reset();
        }
    }

    draw() {
        ctx.save(); // Save the clean state
        // console.log("Player draw")
        ctx.globalAlpha = this.alpha;

        super.draw();

        ctx.globalAlpha = 0.5;
        this.healthbar();
        this.flash();
        this.particles.forEach(p => p.draw()); // draw particles
        ctx.restore(); // Restore to clean state
    }

    move() {
        if (controller.left) this.dx = -this.speed;
        else if (controller.right) this.dx = this.speed;
        else this.dx = 0;

        if (controller.up) this.dy = -this.speed;
        else if (controller.down) this.dy = this.speed;
        else this.dy = 0;

        if (controller.fire) this.fire();
        if (controller.ninjaStar) this.fireNinjaStar();
    }

    fire() {
        if (this.fireRate > this.lastFire + this.fireDelay && state.game) {
            var x = new Laser("LaserGreen", this.x + this.w - 20, this.y + this.h / 2, 10, 1);
            game.objects.push(x);
            if (!game.mute) fireFX.play();
            this.lastFire = this.fireRate;
            //console.log('fireRate: '+this.fireRate+' lastFire: '+this.lastFire);
        }
    }

    fireNinjaStar() {
        if (this.fireRate > this.lastFire + NINJA_FIRE_DELAY && state.game) {
            var n = new NinjaStar("NinjaStarBlue", this.x + this.w, this.y + this.h / 2, 10, 1);
            game.objects.push(n);
            if (!game.mute) ninjaFX.play();
            this.lastFire = this.fireRate;
        }
    }

    updateHealth(damage = DAMAGE_ENEMY_LASER) {
        // Saw deflects damage while it's active
        if (typeof saw !== 'undefined' && saw && saw.active) return;

        if (!this.flashing) {
            if (this.health > damage) {
                this.health -= damage;
                this.flashThisMany(2);
                navigator.vibrate?.([300, 100, 300, 100, 300]); // vibrate mobile device if hit
            } else {
                this.lives--;
                console.log('Player Life Lost - Lives: ', this.lives);
                if (this.lives > 0) {
                    this.flashThisMany(5);
                    this.health = MAX_HEALTH;
                }
            }
        }

        if (this.lives <= 0) {
            state.current = state.over;
            this.reset();
        }

        if (this.lives == 1) {
            game.spawnLife();
        }
        //console.log('SHIP HIT - Health: ', ship.health);
    }

    healthbar() {
        //ctx.fillStyle = "#70c5ce";
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "black";
        ctx.rect(this.x + 10, this.y - 15, HEALTHBAR_W, HEALTHBAR_H);
        ctx.stroke();

        //ctx.beginPath();
        ctx.fillStyle = "#990000";
        //ctx.rect(this.x-10,this.y,100,10);
        ctx.fillRect(this.x + HEALTHBAR_X, this.y + HEALTHBAR_Y, HEALTHBAR_W, HEALTHBAR_H);

        ctx.fillStyle = "#009900";
        //ctx.rect(this.x-10,this.y,100,10);
        ctx.fillRect(this.x + HEALTHBAR_X, this.y + HEALTHBAR_Y, HEALTHBAR_W * this.health / MAX_HEALTH, HEALTHBAR_H);
    }

    flash() {
        if (this.flashCount < this.flashTimes) {
            if (this.alpha >= 0.0 && this.flashDown) {
                this.alpha -= 0.05;
                if (this.alpha <= 0.0) {
                    //this.flashUp=true;
                    this.flashDown = false;
                }
            }
            if (this.alpha <= 1.0 && !this.flashDown) {
                this.alpha += 0.05;
                if (this.alpha >= 1.0) {
                    this.flashDown = true;

                    this.flashCount++;
                }
            }
        } else {
            this.flashing = false;
        }
    }

    flashThisMany(time) {
        this.flashCount = 0;
        this.flashTimes = time;
        this.flashing = true;
    }

    reset() {
        GameObject.prototype.reset.call(this); // Call parent function
        this.x = 0;
        this.y = 275;
        this.dx = 0;
        this.dy = 0;
        this.lives = MAX_LIVES;
        this.health = MAX_HEALTH;
        this.particles = [];
    }
}