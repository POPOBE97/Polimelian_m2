class Size {
    constructor(w, h) {
        this.w = w
        this.h = h
    }
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(vec) {
        this.x += vec.x
        this.y += vec.y
    }

    sub(vec) {
        this.x -= vec.x
        this.y -= vec.y
    }

    dot(i) {
        this.x *= i
        this.y *= i
    }
}