FullScreenMario.prototype.mods = {
    "mods": [
        {
            "name": "ParallaxClouds",
            "enabled": false,
            "events": {
                // "onModEnable": function () {
                "onReady": function () {
                    FSM.ObjectMaker.getFunction("Cloud").prototype.parallax = .56;
                },
                "onModDisable": function () {
                    FSM.ObjectMaker.getFunction("Cloud").prototype.parallax = undefined;
                }
            }
        },
        {
            "name": "QCount",
            "enabled": true,
            "events": {
                // Nothing yet!
            }
        }
    ]
}