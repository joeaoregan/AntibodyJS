// Background

class Background extends GameObject {
    constructor() {
        super("background720", 0, 0, 1200, 600);
        this.dx = 2; // Speed to move object
    }

    update() {
        //if (state.current == state.game) { // pause background movement until started
            this.x = (this.x - this.dx) % (this.w);
        //}
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        ctx.drawImage(this.img, this.x + this.w, this.y, this.w, this.h);
    }
}