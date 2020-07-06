class Robot {
    constructor() {
        this.x = 250
        this.y = 450
        this.size = 20
        this.direction = 90
        this.isInPond  = false
        this.detectedTargets = []
        this.detectedPond    = {}
    }

    draw() {
        this.drawDirection()
        this.drawBody()
    }

    drawDirection() {
        stroke(255,0,0)
        var length = 30
        var dx     = length * Math.cos(radians(this.direction))
        var dy     = length * Math.sin(radians(this.direction))
        line(this.x, this.y, this.x + dx, this.y - dy)
    }

    drawBody() {
        stroke(255)
        fill(255)
        circle(this.x, this.y, this.size)

        strokeWeight(0)
        fill(255)
        text("Pond   : "+this.detectedPond.direction, 0, 15)

        strokeWeight(0)
        fill(255)
        text(this.direction, this.x+this.size, this.y)

        strokeWeight(0)
        fill(255)
        text("in Pond: "+this.isInPond, 0, 30)
    }

    move(l, r) {
        var delta = r - l
        if (delta != 0) {
            this.direction += degrees(Math.atan(delta / this.size))
        }
        while (this.direction < 0) 
            this.direction += 360.0
        var speed = (l + r) / 2

        this.x += speed * Math.cos(radians(this.direction))
        this.y -= speed * Math.sin(radians(this.direction))
    }

    detectPond(p) {
        if (dist(p.x, p.y, this.x, this.y) < p.size / 2) this.isInPond = true
        else this.isInPond = false
        return this.isInPond
    }

    findPond(p) {
        var dir = this.getObjDir(p)
        dir -= this.direction
        if (dir <= 22.5 && dir >= -22.5)
            this.detectedPond = {direction: dir}
        else
            this.detectedPond = {}
    }

    findTargets(others) {
        this.detectedTargets = []
        for (const obj of object) {
            var dir = this.getObjDir(obj)
            if (dir <= 22.5 && dir >= -22.5)
                this.detectedTargets.push({direction: dir, distance: dist(obj.x, obj.y, this.x, this.y)})
        }
    }

    // Get the relative direction of an object to this sensor
    // Please do not modify this function
    getObjDir(obj) {
        var dx = obj.x - this.x
        var dy = this.y - obj.y
        d = 0
        if (dx == 0) {
            if (dy > 0) d = 90
            if (dy < 0) d = 270
        } else if (dy == 0) {
            if (dx < 0) d = 180
            if (dx > 0) d = 0
        } else {
            var d = degrees(atan(float(dy) / dx))
            if (d > 0) {
                if (dy > 0) d = d
                else d = 180 + d
            }
            if (d < 0) {
                if (dy > 0) d = 180 + d
                else d = 360 + d
            }
        }
        return d
    }
}