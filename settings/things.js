FullScreenMario.prototype.things = {
    "on_make": "onMake",
    "store_type": "title",
    "index_map": ["width", "height"],
    "inheritance": {
        "Map": {},
        "Area": {},
        "Location": {},
        "Thing": {
            "character": {
                "Player": {},
                "enemy": {
                    "Goomba": {},
                    "Koopa": {},
                    "Pirhana": {},
                    "HammerBro": {
                        "Bowser": {}
                    }
                },
                "item": {
                    "Mushroom": {
                        "Mushroom1Up": {},
                        "MushroomDeathly": {}
                    },
                    "FireFlower": {},
                    "Fireball": {
                        "CastleFireball": {}
                    },
                    "Star": {},
                    "Shell": {},
                    "Vine": {}
                },
                "BrickShard": {},
                "Coin": {},
                "Firework": {},
            },
            "solid": {
                "Block": {},
                "BridgeBase": {},
                "Brick": {},
                "DeadGoomba": {},
                "Pipe": {},
                "PipeHorizontal": {},
                "PipeVertical": {},
                "Platform": {},
                "PlatformGenerator": {},
                "Stone": {},
                "Floor": {},
                "TreeTop": {},
                "ShroomTop": {},
                "CastleAxe": {},
                "CastleBlock": {},
                "CastleBridge": {},
                "Coral": {},
                "detector": {
                    "DetectCollision": {},
                    "DetectSpawn": {}
                },
            },
            "scenery": {
                "Axe": {},
                "Blank": {},
                "BrickHalf": {},
                "BrickPlain": {},
                "Bush1": {},
                "Bush2": {},
                "Bush3": {},
                "Castle": {},
                "CastleDoor": {},
                "CastleChain": {},
                "CastleRailing": {},
                "CastleRailingFilled": {},
                "CastleTop": {},
                "CastleWall": {},
                "Cloud1": {},
                "Cloud2": {},
                "Cloud3": {},
                "Fence": {},
                "Flag": {},
                "FlagPole": {},
                "FlagTop": {},
                "HillSmall": {},
                "HillLarge": {},
                "PirhanaScenery": {},
                "PlantSmall": {},
                "PlantLarge": {},
                "Railing": {},
                "ShroomTrunk": {},
                "String": {},
                "TreeTrunk": {},
                "Water": {},
                "WaterFill": {}
            }
        }
    }
};