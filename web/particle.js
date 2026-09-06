const particleOrangeImg = new Image();
particleOrangeImg.src = "art/ParticleOrange.png"; // relative to index.html, not this file

class Particle {
    constructor(x, y, img) {
        this.img = img || particleOrangeImg;
        this.x = x;
        this.y = y;
        this.dx = -(Math.random() * 3 + 2);
        this.dy = (Math.random() - 0.5) * 1.5;
        this.alpha = 1;
        this.size = 5; // source image size
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.03;                    // fade out
    }
    draw() {
        if (!this.img.complete) return;  // same guard GameObject uses
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
        ctx.restore();
    }
    get dead() { return this.alpha <= 0; }
}