(function () {
    function KeyDownLeft(player) {
        player.keys.run = -1;
        player.keys.left_down = true; // independent of changes to keys.run
    }
  
    function KeyDownRight(player) {
        player.keys.run = 1;
        player.keys.right_down = true; // independent of changes to keys.run
    }
    
    function KeyDownUp(player) {
        player.keys.up = true;
        if(player.canjump && (player.resting || map_settings.underwater)) {
            player.keys.jump = 1;
            player.canjump = player.keys.jumplev = 0;
            
            // To do: can player make a jumping sound during springs?
            // To do: can player make a jumping sound during pipe cutscenes?
            if(player.power > 1) {
                player.EightBitter.AudioPlayer.play("Jump Super");
            } else {
                player.EightBitter.AudioPlayer.play("Jump Small");
            }
            
            if(player.EightBitter.MapScreener.underwater) {
                setTimeout(function() {
                    player.jumping = player.keys.jump = false;
                }, timer * 14);
            }
        }
    }
    
    function KeyDownDown(player) {
        player.keys.crouch = true;
    }
    
    function KeyDownSprint(player) {
        if(player.power == 3 && player.keys.sprint == 0 && !player.crouch) {
            player.fire(player);
        }
        player.keys.sprint = 1;
    }
    
    function KeyDownPause(player) {
        var FSM = player.EightBitter;
        if(!FSM.GamesRunner.getPaused()) {
            FSM.TimeHandler.addEvent(FSM.GamesRunner.pause, 7, true);
        }
    }
    
    function KeyDownMute(player) {
        player.EightBitter.AudioPlayer.toggleMute();
    }
    
    function KeyDownL(player) {
        player.EightBitter.toggleLuigi();
    }
    
    function KeyUpLeft(player) {
        player.keys.run = player.keys.left_down = 0;
    }
    
    function KeyUpRight(player) {
        player.keys.run = player.keys.right_down = 0;
    }
    
    function KeyUpUp(player) {
        if(!player.EightBitter.MapScreener.underwater) {
            player.keys.jump = player.keys.up = 0;
        }
        player.canjump = true;
    }
    
    function KeyUpDown(player) {
        player.keys.crouch = 0;
        player.EightBitter.removeCrouch();
    }
    
    function KeyUpSprint(player) {
        player.keys.sprint = 0;
    }
    
    function KeyUpPause(player) {
        if(player.EightBitter.GamesRunner.getPaused()) {
            player.EightBitter.GamesRunner.unpause(true);
        }
    }
    
    function MouseDownRight(player) {
        player.EightBitter.GamesRunner.togglePause();
    }
    
    FullScreenMario.prototype.input = {
        "aliases": {
            // Keyboard aliases
            "left":   [37, 65],     // a,     left
            "right":  [39, 68],     // d,     right
            "up":     [38, 87, 32], // w,     up
            "down":   [40, 83],     // s,     down
            "sprint": [16, 17],     // shift, ctrl
            "pause":  [80],         // p (pause)
            "mute":   [77],         // m (mute)
            "l":      [76],         // l (luigi)
            // "q":      [81],         // q (qcount)
            // Mouse aliases
            "rightclick": [3]
        },
        "triggers": {
            "onkeydown": {
                "left": KeyDownLeft,
                "right": KeyDownRight,
                "up": KeyDownUp,
                "down": KeyDownDown,
                "sprint": KeyDownSprint,
                "pause": KeyDownPause,
                "mute": KeyDownMute,
                "l": KeyDownL,
                // "q": KeyDownQ
            },
            "onkeyup": {
                "left": KeyUpLeft,
                "right": KeyUpRight,
                "up": KeyUpUp,
                "down": KeyUpDown,
                "sprint": KeyUpSprint,
                "pause": KeyUpPause
            },
            "onmousedown": {
                "rightclick": MouseDownRight
            },
            "oncontextmenu": {}
        }
    };
})();