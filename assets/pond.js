class Pond {
    constructor() {
        this.x = configs.ArenaSize[0]/2
        this.y = configs.ArenaSize[1]/2
        this.size = 50
    }

    draw(p) {
        p.stroke(255)
        p.fill(0, 0, 255)
        p.circle(this.x, this.y, this.size)
    }
}