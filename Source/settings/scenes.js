FullScreenMario.FullScreenMario.settings.scenes = {
    "cutscenes": {
		"Flagpole": {
			"firstRoutine": "startSlidingDown",
			"routines": {
				"startSlidingDown": FullScreenMario.FullScreenMario.prototype.cutsceneFlagpoleStartSlidingDown,
				"hitBottom": FullScreenMario.FullScreenMario.prototype.cutsceneFlagpoleHitBottom 
			}
		}
	}
};
