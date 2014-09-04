FullScreenMario.prototype.settings.editor = {
    "blocksize": FullScreenMario.unitsize * 4,
    "map_default": {
        "name": "New Map",
        "locations": [
            { "entry": "Plain" }
        ],
        "areas": [
            {
                "setting": "Overworld",
                "creation": [
                    { "location": "0" },
                    { "thing": "Floor", "x": 0, "y": 0, "width": 128 }
                ]
            }
        ]
    },
    "things": {
        "Characters": [
            "Goomba",
            "Koopa",
            "Beetle",
            "Piranha",
            "Blooper",
            "CheepCheep",
            "Podoboo",
            "BulletBill",
            "Lakitu",
            "SpinyEgg",
            "Spiny",
            "HammerBro",
            "Bowser"
        ],
        "Items": [
            "Mushroom",
            "Mushroom1Up",
            "MushroomDeathly",
            "FireFlower",
            "Star",
            "Shell",
            "BeetleShell",
            "Coin"
        ],
        "Solids": [
            "Block",
            "Brick",
            "Pipe",
            "PipeHorizontal",
            "PipeVertical",
            "Platform",
            "Stone",
            "Cannon",
            "Springboard",
            "Floor",
            "CastleBlock",
            "CastleBridge",
            "Coral"
        ],
        "Scenery": [
            "Axe",
            "BrickPlain",
            "Bush1",
            "Bush2",
            "Bush3",
            "Cloud1",
            "Cloud2",
            "Cloud3",
            "Fence",
            "HillSmall",
            "HillLarge",
            "PlantSmall",
            "PlantLarge",
            "Railing",
            "Water"
        ]
    },
    "macros": {
        "Fill": {
            "function": "macroFillPreThings",
            "description": "Hello world!"
        },
        "Pattern": {
            "function": "macroFillPrePattern",
            "description": "Hello world!"
        },
        "Floor": {
            "function": "macroFloor",
            "description": "Hello world!"
        },
        "Pipe": {
            "function": "macroPipe",
            "description": "Hello world!"
        },
        "Tree": {
            "function": "macroTree",
            "description": "Hello world!"
        },
        "Shroom": {
            "function": "macroShroom",
            "description": "Hello world!"
        },
        "Water": {
            "function": "macroWater",
            "description": "Hello world!"
        },
        "CastleSmall": {
            "function": "macroCastleSmall",
            "description": "Hello world!"
        },
        "Ceiling": {
            "function": "macroCeiling",
            "description": "Hello world!"
        },
        "Bridge": {
            "function": "macroBridge",
            "description": "Hello world!"
        },
        "PlatformGenerator": {
            "function": "macroPlatformGenerator",
            "description": "Hello world!"
        },
        "StartInsideCastle": {
            "function": "macroStartInsideCastle",
            "description": "Hello world!"
        },
        "EndOutsideCastle": {
            "function": "macroEndOutsideCastle",
            "description": "Hello world!"
        },
        "EndInsideCastle": {
            "function": "macroEndInsideCastle",
            "description": "Hello world!"
        }
    }
};