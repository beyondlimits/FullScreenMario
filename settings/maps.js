FullScreenMario.prototype.settings.maps = {
    "screen_attributes": [
        "gravity",
        "setting",
        "time",
        "underwater",
        "floor",
        "jumpmod",
        "maxyvel",
        "maxyvelinv",
        "notime",
        "nokeys"
    ],
    "on_spawn": function (prething, xloc) {
        var thing = prething.thing;
        
        thing.EightBitter.addThing(
            thing, 
            prething.xloc * thing.EightBitter.unitsize - thing.EightBitter.MapScreener.left,
            (FSM.MapScreener.floor - prething.yloc) * thing.EightBitter.unitsize
        );
    },
    "macros": {
        "Example": FullScreenMario.prototype.macroExample,
        "Fill": FullScreenMario.prototype.macroFillPreThings,
        "Pattern": FullScreenMario.prototype.macroFillPrePattern,
        "Floor": FullScreenMario.prototype.macroFloor,
        "Pipe": FullScreenMario.prototype.macroPipe,
        "Tree": FullScreenMario.prototype.macroTree,
        "Shroom": FullScreenMario.prototype.macroShroom,
        "Water": FullScreenMario.prototype.macroWater,
        "Ceiling": FullScreenMario.prototype.macroCeiling,
        "Bridge": FullScreenMario.prototype.macroBridge,
        "PlatformGenerator": FullScreenMario.prototype.macroPlatformGenerator,
        "StartInsideCastle": FullScreenMario.prototype.macroStartInsideCastle,
        "EndOutsideCastle": FullScreenMario.prototype.macroEndOutsideCastle,
        "EndInsideCastle": FullScreenMario.prototype.macroEndInsideCastle
    },
    "entrances": {
        "Plain": FullScreenMario.prototype.mapEntrancePlain,
        "Normal": FullScreenMario.prototype.mapEntranceNormal,
        "Castle": FullScreenMario.prototype.mapEntranceCastle
    },
    "patterns": (function (patterns) {
        var pattern,
            i;
        for(i in patterns) {
            if(patterns.hasOwnProperty(i)) {
                pattern = patterns[i];
                if(!pattern.length) {
                    continue;
                }
                
                // Pattern's last array should previously be ["blank", width]
                pattern.width = pattern[pattern.length - 1][1];
                pattern.pop();
            }
        }
        return patterns;
    })({
        "BackRegular": [
            ["HillLarge", 0, 0],
            ["Cloud1", 68, 68],
            ["Bush3", 92, 0],
            ["HillSmall", 128, 0],
            ["Cloud1", 156, 76],
            ["Bush1", 188, 0],
            ["Cloud3", 220, 68],
            ["Cloud2", 292, 76],
            ["Bush2", 332, 0],
            ["Blank", 384]
        ],
        "BackCloud": [
            ["Cloud2", 28, 64],
            ["Cloud1", 76, 32],
            ["Cloud2", 148, 72],
            ["Cloud1", 228, 0],
            ["Cloud1", 284, 32],
            ["Cloud1", 308, 40],
            ["Cloud1", 372, 0],
            ["Blank", 384]
        ],
        "BackFence": [
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 4],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 2],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin": [
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 4],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 2],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin2": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 1],
            ["Fence", 128, 0, 2],
            ["Cloud1", 148, 68],
            // ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 2],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin3": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 4],
            ["Cloud1", 148, 68],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ]
    })
};

FullScreenMario.prototype.settings.maps.maps = {
    "1-1": {
        "locations": [
              { "entry": true },
              { "entry": "ExitPipeVertical" },
              { "area": 1 }
        ],
        "areas": [
            {
                "setting": "Overworld",
                "creation": [
                      { "location": 0 },
                      { "macro": "Pattern", "pattern": "BackRegular", "repeat": 5 },
                      { "macro": "Floor", "width": 552 },
                      { "thing": "Block", "x": 128, "y": 32 },
                      { "thing": "Brick", "x": 160, "y": 32 },
                      { "thing": "Block", "x": 168, "y": 32, "contents": "Mushroom" },
                      { "thing": "Goomba", "x": 176, "y": 8 },
                      { "thing": "Brick", "x": 176, "y": 32 },
                      { "thing": "Block", "x": 176, "y": 64 },
                      { "thing": "Block", "x": 184, "y": 32 },
                      { "thing": "Brick", "x": 192, "y": 32 },
                      { "macro": "Pipe", "x": 224, "height": 16 },
                      { "macro": "Pipe", "x": 304, "height": 24 },
                      { "macro": "Pipe", "x": 368, "height": 32 },
                      { "thing": "Goomba", "x": 340, "y": 8 },
                      { "macro": "Pipe", "x": 368, "height": 32 },
                      { "thing": "Goomba", "x": 412, "y": 8 },
                      { "thing": "Goomba", "x": 422, "y": 8 },
                      { "macro": "Pipe", "x": 456, "height": 32, "entrance": 2 },
                      { "thing": "Block", "x": 512, "y": 40, "contents": "Mushroom1Up", "hidden": true },
                      { "macro": "Floor", "x": 568, "width": 120 },
                      { "thing": "Brick", "x": 616, "y": 32 },
                      { "thing": "Block", "x": 624, "y": 32, "contents": "Mushroom" },
                      { "thing": "Brick", "x": 632, "y": 32 },
                      { "thing": "Brick", "x": 640, "y": 32 },
                      { "thing": "Goomba", "x": 640, "y": 72 },
                      { "thing": "Brick", "x": 648, "y": 64 },
                      { "thing": "Brick", "x": 656, "y": 64 },
                      { "thing": "Goomba", "x": 656, "y": 72 },
                      { "macro": "Fill", "thing": "Brick", "x": 664, "y": 64, "xnum": 5, "xwidth": 8 },
                      { "macro": "Floor", "x": 712, "width": 512 }, 
                      { "macro": "Fill", "thing": "Brick", "x": 728, "y": 64, "xnum": 3, "xwidth": 8 },
                      { "thing": "Brick", "x": 752, "y": 32, "contents": "Coin" },
                      { "thing": "Block", "x": 752, "y": 64 },
                      { "thing": "Goomba", "x": 776, "y": 8 },
                      { "thing": "Goomba", "x": 788, "y": 8 },
                      { "thing": "Brick", "x": 800, "y": 32 },
                      { "thing": "Brick", "x": 808, "y": 32, "contents": "Star" },
                      { "thing": "Block", "x": 848, "y": 32 },
                      { "thing": "Koopa", "x": 856, "y": 12 },
                      { "thing": "Block", "x": 872, "y": 32 },
                      { "thing": "Block", "x": 872, "y": 64, "contents": "Mushroom" },
                      { "thing": "Block", "x": 896, "y": 32 },
                      { "thing": "Goomba", "x": 912, "y": 8 },
                      { "thing": "Goomba", "x": 924, "y": 8 },
                      { "thing": "Brick", "x": 944, "y": 32 },
                      { "macro": "Fill", "thing": "Brick", "x": 968, "y": 64, "xnum": 3, "xwidth": 8 },
                      { "macro": "Fill", "thing": "Goomba", "x": 992, "y": 8, "xnum": 4, "xwidth": 16 },
                      { "thing": "Brick", "x": 1024, "y": 64 },
                      { "thing": "Brick", "x": 1032, "y": 32 },
                      { "thing": "Block", "x": 1032, "y": 64 },
                      { "thing": "Brick", "x": 1040, "y": 32 },
                      { "thing": "Block", "x": 1040, "y": 64 },
                      { "thing": "Brick", "x": 1048, "y": 64 },
                      { "thing": "Stone", "x": 1072, "y": 8 },
                      { "thing": "Stone", "x": 1080, "y": 16, "height": 16 },
                      { "thing": "Stone", "x": 1088, "y": 24, "height": 24 },
                      { "thing": "Stone", "x": 1096, "y": 32, "height": 32 },
                      { "thing": "Stone", "x": 1120, "y": 32, "height": 32 },
                      { "thing": "Stone", "x": 1128, "y": 24, "height": 24 },
                      { "thing": "Stone", "x": 1136, "y": 16, "height": 16 },
                      { "thing": "Stone", "x": 1144, "y": 8 },
                      { "thing": "Stone", "x": 1184, "y": 8 },
                      { "thing": "Stone", "x": 1192, "y": 16, "height": 16 },
                      { "thing": "Stone", "x": 1200, "y": 24, "height": 24 },
                      { "thing": "Stone", "x": 1208, "y": 32, "height": 32 },
                      { "thing": "Stone", "x": 1216, "y": 32, "height": 32 },
                      { "macro": "Floor", "x": 1240, "width": 552 },
                      { "thing": "Stone", "x": 1240, "y": 32, "height": 32 },
                      { "thing": "Stone", "x": 1248, "y": 24, "height": 24 },
                      { "thing": "Stone", "x": 1256, "y": 16, "height": 16 },
                      { "thing": "Stone", "x": 1264, "y": 8 },
                      { "macro": "Pipe", "x": 1304, "height": 16, "exit": 1 },
                      { "thing": "Brick", "x": 1344, "y": 32 },
                      { "thing": "Brick", "x": 1352, "y": 32 },
                      { "thing": "Block", "x": 1360, "y": 32 },
                      { "thing": "Brick", "x": 1368, "y": 32 },
                      { "thing": "Goomba", "x": 1392, "y": 8 },
                      { "thing": "Goomba", "x": 1404, "y": 8 },
                      { "macro": "Pipe", "x": 1432, "height": 16 },
                      { "thing": "Stone", "x": 1448, "y": 8 },
                      { "thing": "Stone", "x": 1456, "y": 16, "height": 16 },
                      { "thing": "Stone", "x": 1464, "y": 24, "height": 24 },
                      { "thing": "Stone", "x": 1472, "y": 32, "height": 32 },
                      { "thing": "Stone", "x": 1480, "y": 40, "height": 40 },
                      { "thing": "Stone", "x": 1488, "y": 48, "height": 48 },
                      { "thing": "Stone", "x": 1496, "y": 56, "height": 56 },
                      { "thing": "Stone", "x": 1504, "y": 64, "height": 64, "width": 16 },
                      { "macro": "EndOutsideCastle", "x": 1580, "y": 0 }
                ]
            },
            {
                "setting": "Underworld",
                "creation": [
                    { "location": 2 },
                    { "macro": "Ceiling", "x": 32, "width": 56 },
                    { "macro": "Floor", "x": 0, "y": 0, "width": 136 },
                    { "macro": "Fill", "thing": "Brick", "x": 0, "y": 8, "ynum": 11, "yheight": 8 },
                    { "macro": "Fill", "thing": "Brick", "x": 32, "y": 8, "xnum": 7, "ynum": 3, "xwidth": 8, "yheight": 8 },
                    { "macro": "Fill", "thing": "Coin", "x": 33, "y": 31, "xnum": 7, "ynum": 2, "xwidth": 8, "yheight": 16 },
                    { "macro": "Fill", "thing": "Coin", "x": 41, "y": 63, "xnum": 5, "ynum": 1, "xwidth": 8 },
                    { "thing": "PipeHorizontal", "x": 104, "y": 16, "entrance": 1, "width": 16 },
                    { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
                ]
            }
        ]
    }
};