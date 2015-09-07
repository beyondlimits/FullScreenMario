FullScreenMario.FullScreenMario.settings.scenes = {
    "cutscenes": {
		"Flagpole": {
			"firstRoutine": "StartSlidingDown",
			"routines": {
				"StartSlidingDown": FullScreenMario.FullScreenMario.prototype.cutsceneFlagpoleStartSlidingDown,
				"HitBottom": FullScreenMario.FullScreenMario.prototype.cutsceneFlagpoleHitBottom 
			}
		},
		"BowserVictory": {
		    "firstRoutine": "CollideCastleAxe",
		    "routines": {
                "CollideCastleAxe": FullScreenMario.FullScreenMario.prototype.cutsceneBowserVictoryCollideCastleAxe
		    }
		}
	}
};
