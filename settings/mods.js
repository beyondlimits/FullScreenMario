FullScreenMario.prototype.mods = {
    "mods": [
        {
            "name": "ParallaxClouds",
            "enabled": false,
            "events": {
                "onReady": function () {
                    FSM.ObjectMaker.getFunction("Cloud").prototype.parallax = .56;
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