polimelian = new Robot()
pond       = new Pond()

let sketch = function (p) {

    // Called by p5.js only one time before drawing.
    p.setup = function () {
        // create canvas on the html
        p.createCanvas(configs.ArenaSize[0], configs.ArenaSize[1])
    }

    // Called by p5.js every frame (30 fps)
    p.draw = function () {
        p.background(0)
        polimelian.draw(p)
        pond.draw(p)
    }

    // called by p5.js when key released
    // https://p5js.org/reference/#/p5/keyReleased
    p.keyReleased = function () {
        // parameter 'key' is a global variable defined by p5.js
        // for details please refer to the documentation
        // https://p5js.org/reference/#/p5/key
        // Other p5 related documentations can also befound there
        // https://p5js.org/reference
        switch (p.key) {
            // enable or disable the drawing of enemies
            case 's':
            case 'S':
                DrawingOpt.Enemy = !DrawingOpt.Enemy
                DrawingOpt.DetectionResult = !DrawingOpt.DetectionResult
                break;
            default:
                break;
        }
        return false;
    }



    // called by p5.js when mouse moved
    // detailed documentation can be found here
    // https://p5js.org/reference/#/p5/mouseMoved
    p.mouseMoved = function (event) {}
}

// To initiate p5.js environments and methods
var m2 = new p5(sketch);