polimelian = new Robot()
pond = new Pond()



// Called by p5.js only one time before drawing.
setup = function () {
    // create canvas on the html
    createCanvas(configs.ArenaSize[0], configs.ArenaSize[1])
}

// Called by p5.js every frame (30 fps)
draw = function () {
    background(0)
    pond.draw()
    polimelian.draw()

    polimelian.findPond(pond)
    polimelian.detectPond(pond)

    annotate()
}

annotate = function() {
    textFont("monospace");
    annotation = polimelian.annotate()
    var index = 1;
    for (let i = 0; i < annotation.length; i++, index++) {
        const anno = annotation[i];
        text(anno, 0, index * 15)
    }
}

// called by p5.js when key released
// https://p5js.org/reference/#/p5/keyReleased
keyReleased = function () {
    // parameter 'key' is a global variable defined by p5.js
    // for details please refer to the documentation
    // https://p5js.org/reference/#/p5/key
    // Other p5 related documentations can also befound there
    // https://p5js.org/reference
    switch (key) {
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
mouseMoved = function (event) {
    polimelian.x = mouseX
    polimelian.y = mouseY
}

// To initiate p5.js environments and methods
var m2 = new p5();