class Pond {
    constructor() {
        this.x = configs.ArenaSize[0]/2
        this.y = configs.ArenaSize[1]/2
        this.size = 50
    }

    draw() {
        stroke(255)
        strokeWeight(1)
        fill(0, 0, 255)
        circle(this.x, this.y, this.size / 2)
        
    }
}