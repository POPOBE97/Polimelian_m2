// Avoid naming conflicts
var RYModules = function () {

    class Object {
        constructor(pos) {
            this.pos = pos
        }

        draw() {}
    }

    // Base class for sensors
    class Sensor {
        Result = []
    
        constructor(robot) {
            this.robot = robot
        }

        // Get the relative direction of an object to this sensor
        // Please do not modify this function
        getObjDir(obj) {
            var dx = obj.pos.x - this.robot.pos.x
            var dy = this.robot.pos.y - obj.pos.y
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

        // Get the relative distance of an object to this sensor
        // Please do not modify this function
        getObjDist(obj) {
            return dist(this.robot.pos.x, this.robot.pos.y, obj.pos.x, obj.pos.y)
        }
    }

    // Abstract class
    class DetectionResult {
        constructor() {}
    }

    // The rotating ultrasonic sensor
    class Radar extends Sensor {

        // robot:       the instance of robot you are going to install the radar
        // angleRange:  the angular range of scanning
        // range:       the distance range of scanning
        // precision:   angle between two scanning
        constructor(robot, angleRange, range, precision) {
            super(robot)
            this.range  = range
            this.angleRange = angleRange
            this.step   = range / precision
            this.precision = precision
            this.Result = Array(this.step).fill(range)
        }

        // Draw the radar
        draw() {
            noFill()
            strokeWeight(1)
            strokeCap(ROUND)
            stroke(100)
            beginShape()
            for (let i = 0; i < this.Result.length; i++) {
                const d = this.Result[i];
                var theta = radians(i*this.precision+this.robot.dir-this.angleRange/2)
                var x = this.robot.pos.x + d * cos(theta)
                var y = this.robot.pos.y - d * sin(theta)

                if (d < this.range) {
                    stroke(255, 0, 0)
                    strokeWeight(5)
                    point(x, y)
                } else {
                    stroke(100)
                    strokeWeight(5)
                }
            }
            endShape()
        }

        // Map surroundings
        mapSurroundings(enemies) {
            for (let dir = 0; dir < this.step; dir++) {
                var d = this.detectObjIn(dir*this.precision+this.robot.dir-this.angleRange/2, enemies)
                this.Result[dir] = d
            }
        }

        // Find the object from the set which is on the direction of dir
        detectObjIn(dir, set) {
            dir = dir % 360
            if (dir < 0) dir += 360
            var d = this.range
            for (let i = 0; i < set.length; i++) {
                const e = set[i];
                var dr = this.getObjDir(e)
                var di = this.getObjDist(e)
                if (abs(dr-dir) < 15 && (di < this.range) && di < d) d = di
            }
            return d
        }
    }

    // RGB sensor
    class RGBSensor extends Sensor {
        constructor(robot) {
            super(robot)
        }

        // Detect if the robot is in the pond
        inPond() {
            // Safety factor of 1.5, make sure the robot is in the pond
            if (this.getObjDist(pond) < PondRadius/1.5) {
                return true
            } else {
                return false
            }
        }
    }

    // The structure of camera detection result
    class CameraDetectionResult extends DetectionResult {
        constructor(type, dir, dist) {
            super()
            // String
            // "Pond"  -> the pond
            // "Target" -> the red target on the enemy
            this.type = type

            // Direction, the relative direction in degrees
            this.dir = dir

            // Distance, the relative distance in cm
            this.dist = dist
        }
    }

    // The camera
    class Camera extends Sensor {

        constructor(robot, rov, range) {
            super(robot)
            this.rov = rov
            this.range = range
            this.Result = {pond: 0, targets: []}
        }

        // Will be set to true if pond found in the detection
        pondDetected = false

        // Will be set to true if at least one target found in the detection
        targetDetected = false

        // Draw the camera
        draw() {
            noFill()
            strokeWeight(1)
            strokeCap(ROUND)
            stroke(100)
            beginShape()
            var ori = this.robot.pos
            var dir = this.robot.dir
            vertex(ori.x, ori.y)
            const maxR = int(this.rov)
            for (let i = 0; i < maxR; i++) {
                var theta = radians(i - maxR/2 + dir)
                var x = ori.x + this.range * cos(theta)
                var y = ori.y - this.range * sin(theta)
                vertex(x, y)
            }
            endShape(CLOSE)

            if (DrawingOpt.DetectionResult) {
                // console.log(this.Result)
            }
        }

        // Test if object is in the sight of camera
        // enemies:    the enemies
        // pond:       the pond
        detectObjInSight(enemies, pond) {
            this.clear()
            var dir = this.getObjDir(pond)
            if (this.isDirInSight(dir)) {
                dir = this.robot.dir - dir
                var dist = this.getObjDist(pond)
                var r = new CameraDetectionResult("Pond", dir, dist)
                this.Result.pond = r
                this.pondDetected = true
            }

            enemies.forEach(obj => {
                dir = this.getObjDir(obj)
                if (this.isDirInSight(dir)) {
                    dir = this.robot.dir - dir
                    var dist = this.getObjDist(obj)
                    var r = new CameraDetectionResult("Target", dir, dist)
                    this.targetDetected = true
                    this.Result.targets.push(r)
                }
            });
        }


        // Handyful tool to test if a direction (absolute) is in the sight of camera
        isDirInSight(dir) {
            var s = (this.robot.dir - this.rov/2)
            var e = (this.robot.dir + this.rov/2)
            if (dir >= s && dir <= e) return true
            else return false
        }

        // Must call to clear the result from last detection
        clear() {
            this.Result = {pond: 0, targets: []}
            this.pondDetected = false
            this.targetDetected = false
        }
    }

    // Base object for all the robots, and the pond will draw a circle on the canvas
    class RoundObject extends Object {
        constructor(pos, radius) {
            super(pos)
            this.radius = radius
        }

        draw () {
            circle(this.pos.x, this.pos.y, this.radius)
        }
    }

    // Robot
    class Robot extends RoundObject {

        // pos: the initial position of the robot
        // dir: the initial direction the robot is facing, necessary for determine the camera and radar direction
        constructor(pos, dir) {
            super(pos, RobotSize.w)
            this.dir = dir
            this.score = 60

            // because of the program structure, each movements take place
            // in the natureProcess in sketch.js. robot can only set it's 
            // target position or the target direction it wants to move to
            // or rotate to. Robot will stop moving once the _targetDir or 
            // _targetPos is meet
            this._targetDir = this.dir
            this._targetPos = this.pos
        }

        // Draw the robot as well as the words
        draw() {
            super.draw()
            if (this._words.length != 0) {
                fill("white")
                text("\""+this._words+"\"", this.pos.x+10, this.pos.y-10)
                // the words will disapear afte 2000 ms.
                setTimeout(() => {
                    this._words = ""
                }, 2000);
            }
        }

        // locks
        lockP = false
        lockA = false
        lockD = false

        // the moving speed
        // the rotating speed
        speed = 50 / 30  // cm/s / fps
        angularSpeed = 20 / 30 // degree/s / fps

        // these variables are for use of generating merlin noise
        _xoff = random(0, 1000)
        _yoff = random(0, 1000)
        _doff = random(0, 1000)

        // the words the robot is going to say
        _words = ""

        // because of the program structure, each movements take place
        // in the natureProcess in sketch.js. robot can only set it's 
        // target position or the target direction it wants to move to
        // or rotate to. Robot will stop moving once the _targetDir or 
        // _targetPos is meet.
        _targetPos = 0      // Vector
        _targetDir = 0      // Integer 

        // Inactivity process
        // implemented according to the diagram
        // structure may changed a little to fit in to the program structure
        inactivity = function () {
            if (!this.lockP && !this.lockA && !this.lockD) {
                if (this.score == 0) {
                    this.say("GOODBYE CRUEL WORLD!") 
                    return
                }
                else this.score -= 1
            }
            this.say(this.score)
        }

        // make random moves (only for testing)
        makeRandomMove = async function() {
            return new Promise((resolve, reject) =>{
                setTimeout(() => {
                    var ox = noise(this._xoff)*ArenaSize.w
                    var oy = noise(this._yoff)*ArenaSize.h
                    var od = noise(this._doff)*90

                    if (this.pos.x > ArenaSize.x - 100) ox = -abs(ox)
                    if (this.pos.x < 100) ox = abs(ox)
                    if (this.pos.y > ArenaSize.y - 100) oy = -abs(oy)
                    if (this.pos.y < 100) oy = abs(oy)
                    this.pos.x = ox
                    this.pos.y = oy
                    this.dir   = od

                    this._xoff += 0.005
                    this._yoff += 0.005
                    this._doff += 0.005
                    resolve(true)
                }, 0)
            })
        }

        // say a word
        // words: string
        say = function(words) {
            this._words = words
        }

        // move forward along the current direction
        // this behaviour only effected by speed
        // and dir
        moveForward() {
            var ox = this.speed * cos(radians(this.dir)) 
            var oy = this.speed * sin(radians(this.dir))
            this._targetPos.x = this.pos.x + ox
            this._targetPos.y = this.pos.y - oy
        }

        // set the target direction to dir
        // dir: integer 0-360
        // the actual rotation will take place in 
        // natureProcess in sketch.js
        turnToward(dir) {
            dir = dir % 360
            this._targetDir = dir
        }

        // this function should only be called from 
        // the naturePrcess in sketch.js
        makeMove() {
            // set position
            this.pos = this._targetPos

            // set direction
            var od = this._targetDir - this.dir
            if (abs(od) > this.angularSpeed) {
                this.dir += (od < 0 ? -this.angularSpeed : this.angularSpeed)
            } else {
                this.dir += od
            }
        }

        // handyful tool to move while turn
        moveToward(dir) {
            this.turnToward(dir)
            this.moveForward()
        }
    }

    // Flashing brittlestar
    class Flash {
        constructor(robot) {
            this.robot = robot
        }

        _on = false

        turnOn() {
            this._on = true
        }

        turnOff() {
            this._on = false
        }

        // turn on if off
        // turn off if on
        trigger() {
            if (this._on) {
                this.turnOff()
            } else {
                this.turnOn()
            }
        }

        // draw the flashing effect
        draw() {
            if (this._on) {
                stroke(255, 255, 255, 100)
                strokeWeight(1)
                var x0 = this.robot.pos.x+5*cos(radians(this.robot.dir + 180))
                var y0 = this.robot.pos.y-5*sin(radians(this.robot.dir + 180))
                var range = 50
                for (let i = 0; i < 36; i++) {
                    var x1 = x0 + range*cos(radians(i*10))
                    var y1 = y0 - range*sin(radians(i*10))
                    line(x0, y0, x1, y1)

                }
            }
        }
    }

    // The robot that have all the behaviours defined on the diagram
    class Polimelian extends Robot {

        // radar is the rotational ultrasonicsensor
        // Radar(robotItIsInstalledOn, angleRangeInDegree, distanceRangeIncm, drawingSizeRadius)
        radar = new Radar(this, 180, 400, 10)

        // rgb sensor
        // RGBSensor(robotItIsInstalledOn)
        rgbSensor = new RGBSensor(this)

        // Flashing brittlestar
        // Flash(robotItIsInstalledOn)
        flash = new Flash(this)

        // pos: initial position
        // dir: initial direction the robot should face to
        //      need for the camera and ultrasonic sensor
        // color: the color to draw on the canvas
        constructor(pos, dir, color) {
            super(pos, dir, RobotSize.w)
            this.cam = new Camera(this, 75, 400)
            this.color = color
        }

        // for the inactivity process
        _timestamp = 0

        // draw the robot
        draw() {
            this.radar.draw()
            this.cam.draw()
            // fill the circle with the color
            fill(this.color)
            super.draw()
            this.flash.draw()
        }

        // implement the front strategy from the diagram
        // the structure is slightly changed to meet the 
        // program structure (single thread). Please avoid
        // using long loops, otherwise block the thread
        front = function() {
            this.radar.mapSurroundings(enemies)
            this.cam.detectObjInSight(enemies, pond)
            if (!this.lockP) {
                if (this.cam.pondDetected) {
                    let r = this.cam.Result.pond
                    this.moveToward(this.dir - r.dir)
                } else if (this.cam.targetDetected) {
                    let r = this.cam.Result.targets[0]
                    this.moveToward(this.dir - r.dir)
                }
            }

            if (this.rgbSensor.inPond()) {
                this.lockP = true
                if (this._timestamp == 0) {
                    this._timestamp = Date.now()
                } else {
                    var ot = (Date.now() - this._timestamp) % 5000
                    if (ot < 20) {
                        this.say("YEEEY!")
                        this.score += 20
                    }
                }
            } else if (!this.lockP) {
                if (this.cam.targetDetected) {
                    this.say("Attack!!!!!")
                }
            } else {
                this.say("OH NOOOO!")
                this.lockP = false
            }
        }


        // implement the back strategy from the diagram
        // the structure is slightly changed to meet the 
        // program structure (single thread). Please avoid
        // using long loops. otherwise block the thread
        back = function () {
            var ot = Date.now() - this._timestamp
            if ((ot % 5000) < 20) this.flash.trigger()

            // attacking behaviour is waiting to be defined 
        }
    }

    // Not in use
    class Enemy extends Robot {
        constructor(pos) {
            super(pos, RobotSize.w)
        }

        draw() {
            fill('red')
            super.draw()
        }
    }

    // The pond
    class Pond extends RoundObject {
        draw() {
            stroke(0, 150, 0)
            fill(0,50,0)
            super.draw()
        }
    }

    // For cross file usage
    return {
        Camera: Camera,
        Object: Object,
        RoundObject: RoundObject,
        Robot: Robot,
        Polimelian: Polimelian,
        Pond: Pond,
        Enemy: Enemy,
        Radar: Radar,
        DetectionResult: DetectionResult
    }
}();