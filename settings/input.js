FullScreenMario.prototype.input = {
    "alias": {
          // Keyboard aliases
          "left":   [37, 65,      "AXIS_LEFT", "DPAD_LEFT"],                    // a,     left
          "right":  [39, 68,      "AXIS_RIGHT", "DPAD_RIGHT"],                  // d,     right
          "up":     [38, 87, 32,  "FACE_1", "DPAD_UP", "LEFT_BOTTOM_SHOULDER"], // w,     up
          "down":   [40, 83,      "AXIS_DOWN", "DPAD_DOWN"],                    // s,     down
          "sprint": [16, 17,      "FACE_1"],                                    // shift, ctrl
          "pause":  [80,          "START_FORWARD"],                             // p (pause)
          "mute":   [77],                                                       // m (mute)
          "q":      [81],                                                       // q (qcount)
          "l":      [76],                                                       // l (luigi)
          // Mouse aliases
          "rightclick": [3]
    },
    // "triggers": {
        // "onkeydown": {
            // "left": KeyDownLeft,
            // "right": KeyDownRight,
            // "up": KeyDownUp,
            // "down": KeyDownDown,
            // "sprint": KeyDownSprint,
            // "pause": KeyDownPause,
            // "mute": KeyDownMute,
            // "l": KeyDownL,
            // "q": KeyDownQ
        // },
        // "onkeyup": {
            // "left": KeyUpLeft,
            // "right": KeyUpRight,
            // "up": KeyUpUp,
            // "down": KeyUpDown,
            // "sprint": KeyUpSprint,
            // "pause": KeyUpPause
        // },
        // "onmousedown": {
            // "rightclick": MouseDownRight
        // },
        // "oncontextmenu": {}
    // }
};