FullScreenMario.prototype.settings.runner = {
    "upkeep_schedule": setTimeout,
    "upkeep_cancel": clearTimeout,
    "interval": 1000 / 60,
    "FPSAnalyzer": new FPSAnalyzr(),
    "games": [
        function () {
            this.QuadsKeeper.determineAllQuadrants(solids);
        },
        function () {
            this.maintainSolids(this);
        },
        function () {
            this.maintainCharacters(this);
        },
        function () {
            this.maintainPlayer(this);
        },
        function () {
            this.TimeHandler.handleEvents();
        },
        function () {
            this.PixelDrawer.refillGlobalCanvas(this.MapsHandler.getArea().background);
        }
    ],
    "on_pause": function () {
        FSM.AudioPlayer.pause();
    },
    "on_unpause": function () {
        FSM.AudioPlayer.resume();
    }
}