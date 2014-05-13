FullScreenMario.prototype.quadrants = {
    "num_rows": 5,
    "num_cols": 6,
    "screen_width": window.innerWidth,
    "screen_height": window.innerHeight,
    "tolerance": FullScreenMario.unitsize / 2,
    "onUpdate": function onUpdate() {
        var diff_right = gamescreen.right + QuadsKeeper.getOutDifference();
        MapsManager.spawnMap(diff_right / FullScreenMario.unitsize);
    },
    "onCollide": false
}