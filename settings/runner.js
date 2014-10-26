FullScreenMario.prototype.settings.runner = {
    "upkeep_schedule": setTimeout,
    "upkeep_cancel": clearTimeout,
    "interval": 1000 / 60,
    "FPSAnalyzer": new FPSAnalyzr(),
    "games": [
        function () {
            this.QuadsKeeper.determineAllQuadrants(this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants(this.GroupHolder.getTextGroup());
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
            // this.PixelDrawer.refillGlobalCanvas(this.MapsHandler.getArea().background);
            this.PixelDrawer.refillQuadrants(
                this.QuadsKeeper.getQuadrants(),
                this.MapsHandler.getArea().background
            );
        }
    ]
}