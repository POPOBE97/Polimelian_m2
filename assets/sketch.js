let sketch = function(p){
// Polimelian is a subclass of Robot. Our strategy is implemented in it's back() and front() methods
// Polimelian(position(x, y), directionItFaces, colorOnTheCanvas)
polimelian = new RYModules.Polimelian(new Vector(300, 400), 90, 'green')
enemies = [new RYModules.Polimelian(new Vector(100, 100), 0, 'red'),
           new RYModules.Polimelian(new Vector(100, 300), 90, 'red'),
           new RYModules.Polimelian(new Vector(300, 100), 90, 'red'),
           new RYModules.Polimelian(new Vector(300, 300), 90, 'red')
          ]

// Pond is a subclass of RoundObject.
// Pond(position(x, y), radius)
pond = new RYModules.Pond(new Vector(250,250), PondRadius)

// Called by p5.js only one time before drawing.
p.setup = function() {
    // create canvas on the html
    createCanvas(ArenaSize.w, ArenaSize.h)
}

// Called by p5.js every frame (30 fps)
p.draw = function() {
    // perform the inactivity
    inactivityProcess()

    // perform the front strategy
    for (let i = 0; i < enemies.length; i++) enemies[i].front()
    polimelian.front()

    // perform the back strategy
    for (let i = 0; i < enemies.length; i++) enemies[i].back()
    polimelian.back()

    // In front and back method, robots only set state but do not
    // make actual movements. All the movements are taking place
    // in natureProcess
    natureProcess()

    // mandatory to reset the canvas before drawing
    clear()
    // set canvas background to black
    background('black')

    // draw pond
    pond.draw()

    // draw the enemies
    if (DrawingOpt.Enemy) for (let i = 0; i < enemies.length; i++) enemies[i].draw()

    // draw Polimelian
    polimelian.draw()
}

// called by p5.js when key released
// https://p5js.org/reference/#/p5/keyReleased
p.keyReleased = function() {
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

// In front and back method, robots only set state but do not
// make actual movements. All the movements are taking place
// in here
const natureProcess = () => {
    for (let i = 0; i < enemies.length; i++) enemies[i].makeMove()
    polimelian.makeMove()
}

// call the inactivity process of each robot every 5 seconds
const inactivityProcess = () => {
    var dt = Date.now() - Timestamp
    // avoid calling inactivity process multiple times within 5 seconds
    // 20 can be adjusted to a bigger value as jobs in each looping increases
    if (dt % 5000 < 20) {
        polimelian.inactivity()
        for (let i = 0; i < enemies.length; i++) enemies[i].inactivity()
    } 
}

// called by p5.js when mouse moved
// detailed documentation can be found here
// https://p5js.org/reference/#/p5/mouseMoved
p.mouseMoved = function(event) {
}
}

// To initiate p5.js environments and methods
new p5(sketch)
