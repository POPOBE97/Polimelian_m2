##General Structure:
    p5.js manages the backends. There are two entry points:
        setup() in sketch.js
        draw() in sketch.js
    p5.js will first call setup() one time, then call draw() for each frame to paint the canvas

    Everything is running in one single thread due to the mechanism of javascript. Try to use 
    state instead of looping

index.html  | define the canvas
sketch.js   | entry file
config.js   | global variables and definations
base.js     | defined Vector and Size
modules.js  | defined everything else

Please start reading from sketch.js