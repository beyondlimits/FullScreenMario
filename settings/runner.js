FullScreenMario.prototype.settings.runner = {
    "upkeep_schedule": setTimeout,
    "upkeep_cancel": clearTimeout,
    "interval": 1000 / 60,
    "FPSAnalyzer": new FPSAnalyzr(),
    "games": [
        function () {
            this.QuadsKeeper.determineAllQuadrants(this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainSolids(this, this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainCharacters(this, this.GroupHolder.getCharacterGroup());
        },
        function () {
            this.maintainPlayer(this, this.player);
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