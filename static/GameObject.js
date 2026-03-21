const DEBUG_MODE = true;

class GameObject {
    constructor(src, x, y) {
        this.img = new Image();
        this.srcPath = "art/" + src + ".png";
        this.x = x;
        this.y = y;

        const data = SPRITE_DATA[src] || { frames: 1, w: 0, h: 0 };
        this.totalFrames = data.frames || 1;
        this.w = data.w / this.totalFrames;
        this.h = data.h;

        this.currentFrame = 0;
        this.frameTick = 0;
        this.animationSpeed = 5; // Higher = slower animation

        this.dx = 0;
        this.dy = 0;
        this.speed = 5;

        this.fireRate = 0;
        this.lastFire = 0;
        this.fireDelay = 10;
        this.alpha = 1.0;
        this.flashDown = false;
        this.flashCount = 0;
        this.flashTimes = 0;
        this.flashing = false;
        this.lives = 1;
        this.health = 5;

        // Debug info
        this.type = src;
        console.log("Created " + this.type)
    }

    load() {
        return new Promise((resolve, reject) => {
            this.img.onload = () => resolve(this);
            this.img.onerror = () => reject(`Failed: ${this.srcPath}`);
            this.img.src = this.srcPath;
        });
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    updateRotate() {
        this.degrees += (this.direction % 2 == 0) ? 1 : -1; // clockwise/anti-clockwise
        this.degrees %= 360;
        this.

            x -= this.speed;
    }

    animate() {
        this.frameTick++;
        if (this.frameTick % this.animationSpeed === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }
    }

    draw() {
        if (!this.img.complete) return; // Don't draw if image isn't ready

        let sX = this.currentFrame * this.w;

        ctx.drawImage(
            this.img,
            sX, 0,
            this.w, this.h,
            this.x, this.y,
            this.w, this.h
        );

        if (DEBUG_MODE) {
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.w, this.h);

            ctx.fillStyle = "lime";
            ctx.font = "10px Arial";
            ctx.fillText(`${this.type} [F:${this.currentFrame}]`, this.x, this.y - 5);
        }
    }

    // Update rotating Game Objects
    drawRotate() {
        if (!this.img.complete) return;

        let sX = this.currentFrame * this.w;

        ctx.save();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.degrees * Math.PI / 180);

        ctx.drawImage(
            this.img,
            sX, 0, this.w, this.h,      // Source
            -this.w / 2, -this.h / 2, this.w, this.h // Destination
        );
        ctx.restore();

        if (DEBUG_MODE) {
            ctx.strokeStyle = "lime";
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }

    reset() {
        this.fireRate = 0;
        this.lastFire = 0;
        this.alpha = 1.0;
        this.flashCount = 0;
        this.flashTimes = 0;
        this.flashing = false;
    }

    clearOnLeft() {
        if (this.x < -this.w) {	// When enemy objects moves off screen (left)
            this.reset();
        }
    }
}