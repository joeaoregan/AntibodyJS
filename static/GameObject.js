class GameObject {
    constructor(src, x, y, w, h) {
        this.img = new Image();
        this.img.src = "art/" + src + ".png";
        this.type = src;
        this.x = x;
        this.y = y;
        this.w = w || this.img.width;
        this.h = h || this.img.height;
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
        console.log("Created " + this.type)
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    updateRotate() {
        this.degrees += (this.direction % 2 == 0) ? 1 : -1; // clockwise/anti-clockwise
        this.degrees %= 360;
        this.x -= this.speed;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
    
    // Update rotating Game Objects
    drawRotate() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.degrees * Math.PI / 180);
        ctx.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
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