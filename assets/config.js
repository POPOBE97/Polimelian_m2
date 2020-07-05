RYConfigs = function() {
    ArenaSize = new Size(500, 500)
    RobotSize = new Size(20, 20)
    PoundRadius = 25

    // For the general inactivity process
    Timestamp = Date.now()

    // Reserved for drawing control
    DrawingOpt = {
        Enemy: true,
        Self: true,
        Text: true,
        DetectionResult: true
    }
}()
