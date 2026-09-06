const enemyFireFX = registerFX(new Audio());
enemyFireFX.src = "audio/LaserEnemy.wav";

class Enemy extends GameObject {
    constructor(src) {
        super(src, 1200, 300);
        this.speed = -5;
        this.fireDelay = 60;
        this.reset();
    }

    // draw() {
    //     let enemy = this.animation[this.frame];
    //     ctx.drawImage(this.img, enemy.sX, enemy.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    // }

    update() {
        if (state.current === state.game) {
            this.animate();
            this.x += this.speed;
            if (this.x < -this.w) this.reset();
            this.fireRate++;
            this.fire();
        }
    }

    speedReset() {
        this.speed = 0;
    }

    fire() {
        if (this.fireRate > this.lastFire + this.fireDelay && this.x < 1100) {
            var x = new Laser("LaserBlue", this.x - 20, this.y + this.h / 2, 10, -1);
            game.objects.push(x);
            if (!game.mute) enemyFireFX.play();
            this.lastFire = this.fireRate;
        }
    }

    reset() {
        if (state.current != state.game) {
            this.x = 1200;
            this.y = 300;
        } else {
            this.x = canvas.width;
            this.y = Math.round(Math.random() * (SCREEN_HEIGHT - this.h - 70) + 35);
        }
    }
}