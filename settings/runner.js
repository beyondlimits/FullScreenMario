FullScreenMario.prototype.runner = {
    "upkeep_schedule": setTimeout,
    "upkeep_cancel": clearTimeout,
    "interval": 1000 / 60,
    "FPSAnalyzer": new FPSAnalyzr(),
    "games": [
        function () {
            this.QuadsKeeper.determineAllQuadrants(solids);
        },
        function () {
            this.maintainSolids();
        },
        function () {
            this.maintainCharacters();
        },
        function () {
            this.maintainPlayer();
        },
        function () {
            texts.length && maintainTexts;
        },
        function () {
            this.TimeHandler.handleEvents();
        },
        function () {
            this.PixelDrawer.refillGlobalCanvas();
        }
    ],
    "on_pause": function () {
        AudioPlayer.pause();
    },
    "on_unpause": function () {
        AudioPlayer.unpause();
    }
}