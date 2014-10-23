var GameStartr = (function (EightBittr) {
    "use strict";
    
    // Use an EightBittr as the class parent, with EightBittr's constructor
    var EightBitterProto = new EightBittr(),
        
        // Used for combining arrays from the prototype to this
        proliferate = EightBitterProto.proliferate,
        proliferateHard = EightBitterProto.proliferateHard,
        
        GameStartr = function GameStartr(customs) {
            EightBittr.call(this, {
                "customs": customs,
                "constructor": GameStartr,
                "requirements": {
                    "global": {
                        "AudioPlayr": "src/AudioPlayr.js",
                        "ChangeLinr": "src/ChangeLinr.js",
                        "FPSAnalyzr": "src/FPSAnalyzr.js",
                        "GamesRunnr": "src/GamesRunnr.js",
                        "GroupHoldr": "src/GroupHoldr.js",
                        "InputWritr": "src/InputWritr.js",
                        "LevelEditr": "src/LevelEditr.js",
                        "MapScreenr": "src/MapScreenr.js",
                        "MapsHandlr": "src/MapsHandlr.js",
                        "ModAttachr": "src/ModAttachr.js",
                        "ObjectMakr": "src/ObjectMakr.js",
                        "PixelDrawr": "src/PixelDrawr.js",
                        "PixelRendr": "src/PixelRendr.js",
                        "QuadsKeepr": "src/QuadsKeepr.js",
                        "StatsHoldr": "src/StatsHoldr.js",
                        "StringFilr": "src/StringFilr.js",
                        "ThingHittr": "src/ThingHittr.js",
                        "TimeHandlr": "src/TimeHandlr.js"
                    },
                }
            });
        };
    
    GameStartr.prototype = EightBitterProto;
    
    // Subsequent settings will be stored in FullScreenMario.prototype.settings
    EightBitterProto.settings = {};
    
    // Add all registered functions from above to the GameStartr prototype
    proliferateHard(GameStartr.prototype, {
        
    });
    
    return GameStartr;
})(EightBittr);