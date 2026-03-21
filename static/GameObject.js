class GameObject {constructor(src, x, y, w, h, totalFrames = 1) {
        this.img = new Image();
        this.img.src = "art/" + src + ".png";
        this.type = src;
        this.x = x;
        this.y = y;
        
        this.totalFrames = totalFrames;
        this.currentFrame = 0;
        this.frameTick = 0; 
        this.animationSpeed = 5; // Higher = slower animation

        this.img.onload = () => {
            // If width isn't passed, calculate it based on frame count
            this.w = w || (this.img.width / this.totalFrames);
            this.h = h || this.img.height;
        };

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
        let sX = this.currentFrame * this.w;

        ctx.drawImage(
            this.img,
            sX, 0,          // Source Clipping
            this.w, this.h, // Source Dimensions
            this.x, this.y, // Canvas Position
            this.w, this.h  // Canvas Scale
        );
    }

    // draw() {
    //     // ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    //     ctx.drawImage(
    //         this.img,
    //         this.currentFrame * this.w, 0, // sx, sy (Top-left of the frame)
    //         this.w, this.h,               // sw, sh (Width/Height of one frame)
    //         this.x, this.y,               // dx, dy (Position on screen)
    //         this.w, this.h                // dw, dh (Size on screen)
    //     );
    // }

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