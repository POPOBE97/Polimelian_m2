class Robot {
    constructor() {
        this.x = 250
        this.y = 450
        this.size = 20
    }

    draw(p) {
        p.stroke(255)
        p.fill(255)
        p.circle(this.x, this.y, this.size)
    }
}