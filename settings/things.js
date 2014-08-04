(function () {
    /**
     * 
     */
    function MapToJSON() {
        return JSON.stringify({
            "areas": this.areas.map(function (area) {
                return area.toJSON();
            }),
            "locations": this.locations.map(function (location) {
                return location.toJSON();
            })
        });
    }
    
    /**
     * 
     */
    function AreaToJSON() {
        return JSON.stringify({
            "creation": "this is going to be a big array",
            "setting": this.setting
        });
    }
    
    /**
     * 
     */
    function LocationToJSON() {
        return JSON.stringify({
            "area": "should put .areaName in location",
            "entry": this.entry
        });
    }
    
    /**
     * This is used as the OnMake callback for areas. In the future, it would be
     * better to make areas inherit from base area types (Overworld, etc.) so 
     * this inelegant switch statement doesn't have to be used.
     */
    function AreaSetBackground() {
        var setting = this.setting;
        
        // Underwater: always a dark blue
        if(this.setting.indexOf("Underwater") !== -1) {
            this.background = "#2038ec";
        } 
        // Underworld, Castle, and all Nights: black
        else if(this.setting.indexOf("Underworld") !== -1
                || this.setting.indexOf("Castle") !== -1
                || this.setting.indexOf("Night") !== -1) {
            this.background = "#000000";
        } 
        // Default (typically Overworld): sky blue
        else {
            this.background = "#5c94fc";
        }
    }

    FullScreenMario.prototype.settings.things = {
        "on_make": "onMake",
        "store_type": "title",
        "index_map": ["width", "height"],
        "do_properties_full": true,
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
                        "Beetle": {},
                        "Piranha": {},
                        "Blooper": {},
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
                        "Shell": {
                            "BeetleShell": {}
                        },
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
                        "DetectCollision": {
                            "LevelTransport": {}
                        },
                        "DetectWindow": {
                            "ScrollBlocker": {}
                        },
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
                    "Cloud": {
                        "Cloud1": {},
                        "Cloud2": {},
                        "Cloud3": {},
                    },
                    "Fence": {},
                    "Flag": {},
                    "FlagPole": {},
                    "FlagTop": {},
                    "HillSmall": {},
                    "HillLarge": {},
                    "PlantSmall": {},
                    "PlantLarge": {},
                    "Railing": {},
                    "ShroomTrunk": {},
                    "String": {},
                    "TreeTrunk": {},
                    "Water": {},
                    "WaterFill": {}
                },
                "text": {
                    "Text100": {},
                    "Text200": {},
                    "Text400": {},
                    "Text500": {},
                    "Text800": {},
                    "Text1000": {},
                    "Text2000": {},
                    "Text4000": {},
                    "Text5000": {},
                    "Text8000": {},
                    "Text1Up": {}
                }
            }
        },
        "properties": {
            "Map": {
                "toJSON": MapToJSON
            },
            "Area": {
                "onMake": AreaSetBackground,
                "toJSON": AreaToJSON,
                "floor": 104,
                "time": 400,
                "jumpmod": 1.056,
                "maxyvel": 7,
                "maxyvelinv": -7,
                "gravity": FullScreenMario.gravity,
                "canscroll": true,
                "underwater": false,
                "notime": false,
                "nokeys": false,
            },
            "Location": {
                "area": 0,
                "entry": "Normal",
                "toJSON": LocationToJSON
            },
            Thing: {
                // Sizing
                width: 8,
                height: 8,
                tolx: 0,
                toly: FullScreenMario.unitsize / 8,
                // Velocity
                xvel: 0,
                yvel: 0,
                speed: 0,
                // Score amounts on death
                scoreStomp: 100,
                scoreFire: 200,
                scoreStar: 200,
                scoreBelow: 100,
                // Placement
                alive: true,
                placed: false,
                // Quadrants
                maxquads: 4,
                outerok: false,
                // Sprites
                sprite: "",
                sprite_type: "neither",
                opacity: 1,
                // Triggered functions
                animate: FullScreenMario.prototype.animateEmerge,
                onMake: FullScreenMario.prototype.thingProcess,
                death: FullScreenMario.prototype.killNormal,
                collide: false,
                movement: false
            },
            character: {
                libtype: "characters",
                grouptype: "Character",
                character: true,
                moveleft: true,
                firedeath: true,
                movement: FullScreenMario.prototype.moveSimple
            },
            Player: {
                player: 1,
                power: 1,
                canjump: 1,
                nofiredeath: 1,
                nofire: 1,
                nokillend: 1,
                numballs: 0,
                moveleft: 0,
                skidding: 0,
                star: 0,
                dying: 0,
                nofall: 0,
                maxvel: 0,
                paddling: 0,
                jumpers: 0,
                landing: 0,
                tolx: FullScreenMario.unitsize * 2,
                toly: 0,
                walkspeed: FullScreenMario.unitsize / 2,
                maxspeed: FullScreenMario.unitsize * 1.35, // Really only used for timed animations
                maxspeedsave: FullScreenMario.unitsize * 1.35,
                scrollspeed: FullScreenMario.unitsize * 1.75,
                running: '', // Evaluates to false for cycle checker
                fire: FullScreenMario.prototype.animatePlayerFire,
                movement: FullScreenMario.prototype.movePlayer,
                death: FullScreenMario.prototype.killPlayer,
                type: "character",
                name: "player normal small still",
                getKeys: function () {
                    return {
                        "run": 0,
                        "crouch": 0,
                        "jump": 0,
                        "jumplev": 0,
                        "sprint": 0
                    };
                }
            },
            enemy: {
                type: "enemy",
                speed: FullScreenMario.unitsize * .21,
                collide: FullScreenMario.prototype.collideEnemy,
                death: FullScreenMario.prototype.killFlip
            },
            Goomba: {
                scoreFire: 100,
                scoreStar: 100,
                spawntype: "DeadGoomba",
                toly: FullScreenMario.unitsize,
                death: FullScreenMario.prototype.killGoomba,
                spriteCycleSynched: [
                    [FullScreenMario.prototype.unflipHoriz, FullScreenMario.prototype.flipHoriz]
                ]
            },
            Koopa: {
                height: 12,
                shellspawn: true,
                spawntype: "Shell",
                shelltype: "Shell",
                toly: FullScreenMario.unitsize * 2,
                death: FullScreenMario.prototype.killToShell,
                spriteCycle: [
                    ["one", "two"]
                ],
                attributes: {
                    "smart": {
                        movement: FullScreenMario.prototype.moveSmart
                    },
                    "jumping": {
                        movement: FullScreenMario.prototype.moveJumping,
                        jumpheight: FullScreenMario.unitsize * 1.17,
                        gravity: FullScreenMario.gravity / 2.8,
                        scoreStomp: 400
                    },
                    "floating": {
                        movement: FullScreenMario.prototype.moveFloating,
                        nofall: true,
                        yvel: FullScreenMario.unitsize / 4,
                        maxvel: FullScreenMario.unitsize / 4,
                        scoreStomp: 400
                    }
                }
            },
            Beetle: {
                speed: FullScreenMario.unitsize * .21,
                xvel: FullScreenMario.unitsize * .21,
                nofire: 2,
                shellspawn: true,
                death: FullScreenMario.prototype.killToShell,
                spawntype: "BeetleShell",
                shelltype: "BeetleShell",
                spriteCycle: [
                    ["one", "two"]
                ],
            },
            Piranha: {
                height: 12,
                toly: FullScreenMario.unitsize * 8,
                countermax: 49,
                nofall: true,
                deadly: true,
                nocollidesolid: true,
                movement: FullScreenMario.prototype.movePirhana,
                onThingMake: FullScreenMario.prototype.spawnPirhana,
                spriteCycleSynched: [
                    ["one", "two"]
                ]
            },
            Blooper: {
                height: 12,
                nocollidesolid: 1,
                nofall: 1,
                speed: FullScreenMario.unitsize / 2,
                onThingMake: FullScreenMario.prototype.spawnBlooper,
                movement: FullScreenMario.prototype.moveBlooper,
                death: FullScreenMario.prototype.killFlip
            },
            Bowser: {
                width: 16,
                height: 16,
                speed: FullScreenMario.unitsize * .28,
                gravity: FullScreenMario.gravity / 2.8,
                spawntype: "Goomba",
                // killonend: freezeBowser,
                // death: killBowser,
                // onadding: addBowser,
                spriteCycle: [
                    ["one", "two"]
                ]
            },
            item: {
                group: "item",
                collide: FullScreenMario.prototype.collideFriendly,
                jump: FullScreenMario.prototype.itemJump,
                nofire: true
            },
            Mushroom: {
                action: FullScreenMario.prototype.playerShroom,
                speed: FullScreenMario.unitsize * .42
            },
            Mushroom1Up: {
                action: FullScreenMario.prototype.playerShroom1Up
            },
            MushroomDeathly: {
                action: FullScreenMario.prototype.killPlayer
            },
            FireFlower: {
                action: FullScreenMario.prototype.playerShroom,
                spriteCycle: [
                    ["one", "two", "three", "four"]
                ]
            },
            Fireball: {
                width: 4,
                height: 4,
                nofire: true,
                nostar: true,
                collide_primary: true,
                animate: FullScreenMario.prototype.animateFireballEmerge,
                collide: FullScreenMario.prototype.collideFireball,
                death: FullScreenMario.prototype.animateFireballExplode,
                spriteCycleSynched: [
                    ["one", "two", "three", "four"], "spinning", 4
                ]
            },
            CastleFireball: {
                deadly: true,
                nocollidesolid: true,
                nocollidechar: true,
                nofall: true,
            },
            Firework: {
                nocollide: true,
                nofall: true,
                animate: FullScreenMario.prototype.animateFirework
            },
            Star: {
                name: "star item", // Item class so player's star isn't confused with this
                width: 7,
                speed: FullScreenMario.unitsize * .56,
                action: FullScreenMario.prototype.playerStarUp,
                movement: FullScreenMario.prototype.moveJumping,
                jumpheight: FullScreenMario.unitsize * 1.17,
                gravity: FullScreenMario.gravity / 2.8,
                spriteCycle: [
                    ["one", "two", "three", "four"], 0, 7
                ]
            },
            Shell: {
                height: 7,
                speed: FullScreenMario.unitsize * 2,
                collide_primary: true,
                nofire: false,
                moveleft: 0,
                xvel: 0,
                move: 0,
                shell: true,
                hitcount: 0,
                peeking: 0,
                counting: 0,
                landing: 0,
                enemyhitcount: 0,
                movement: FullScreenMario.prototype.moveShell,
                collide: FullScreenMario.prototype.collideShell,
                death: FullScreenMario.prototype.killFlip,
                spawntype: "Koopa",
                attributes: {
                    smart: {}
                }
            },
            BeetleShell: {
                height: 8,
                nofire: 2,
                spawntype: "Beetle"
            },
            Vine: {
                width: 7,
                movement: false,
                nofall: true,
                repeat: true
            },
            BrickShard: {
                width: 4,
                height: 4,
                nocollide: true,
                movement: false,
                spriteCycle: [
                    [FullScreenMario.prototype.unflipHoriz, FullScreenMario.prototype.flipHoriz]
                ]
            },
            Coin: {
                width: 5,
                spritewidth: 5,
                height: 7,
                nofall: true,
                nocollidechar: true,
                nocollidesolid: true,
                animate: FullScreenMario.prototype.animateEmergeCoin,
                collide: FullScreenMario.prototype.collideCoin,
                spriteCycleSynched: [
                    ["one", "two", "three", "two", "one"]
                ]
            },
            solid: {
                type: "solid",
                libtype: "solids",
                grouptype: "Solid",
                spritewidth: 8,
                spriteheight: 8,
                repeat: true,
                solid: true,
                nocollidesolid: true,
                firedeath: 0,
                nofire: 2,
                collide: FullScreenMario.prototype.collideCharacterSolid,
            },
            Brick: {
                breakable: true,
                bottomBump: FullScreenMario.prototype.collideBottomBrick
            },
            Block: {
                unused: true,
                contents: "Coin",
                bottomBump: FullScreenMario.prototype.collideBottomBlock,
                spriteCycleSynched: [
                    ["one", "two", "three", "two", "one"]
                ]
            },
            BridgeBase: {
                height: 4,
                spritewidth: 4,
            },
            DeadGoomba: {
                height: 4,
                nocollide: true,
                onThingMake: function (thing) {
                    thing.EightBitter.TimeHandler.addEvent(FullScreenMario.prototype.killNormal, 21, thing);
                }
            },
            Pipe: {
                width: 16,
                spritewidth: 16,
                actionTop: FullScreenMario.prototype.mapExitPipeVertical
            },
            PipeHorizontal: {
                height: 16,
                spriteheight: 16,
                width: 19.5,
                spritewidth: 19.5,
                actionLeft: FullScreenMario.prototype.mapExitPipeHorizontal,
                attributes: {
                    width: 8,
                    spritewidth: 8
                }
            },
            PipeVertical: {
                width: 16,
                spritewidth: 16
            },
            Platform: {
                height: 4,
                spritewidth: 4,
                fall_threshold_start: FullScreenMario.unitsize * 2.8,
                fall_threshold_end: FullScreenMario.unitsize * 2,
                acceleration: FullScreenMario.unitsize / 16,
                repeat: true,
                killonend: true,
                // maxvel: FullScreenMario.unitsize / 4 * 1.5,
                attributes: {
                    "floating": {
                        // movement: moveFloating,
                        // yvel: FullScreenMario.unitsize / 4 * 1.5
                    },
                    "sliding": {
                        // movement: moveSliding,
                        // xvel: FullScreenMario.unitsize / 4 * 1.5
                    },
                    "transport": {
                        movement: false,
                        collide: FullScreenMario.prototype.collideTransport
                    },
                    "falling": {
                        collide: function () {
                            console.log("Nope! movement should be moveFalling");
                        }
                    }
                }
            },
            PlatformGenerator: {
                hidden: true
            },
            Floor: {
                nofire: true // for the "Super Fireballs" mod
            },
            detector: {
                hidden: true,
                collide_hidden: true
            },
            DetectCollision: {
                collide: FullScreenMario.prototype.collideDetector
            },
            LevelTransport: {
                activate: FullScreenMario.prototype.collideLevelTransport,
            },
            DetectWindow: {
                movement: FullScreenMario.prototype.activateWindowDetector
            },
            ScrollBlocker: {
                activate: FullScreenMario.prototype.activateScrollBlocker
            },
            DetectSpawn: {
                movement: FullScreenMario.prototype.spawnDetector
            },
            scenery: {
                libtype: "scenery",
                grouptype: "Scenery",
                repeat: true
            },
            // Blank: [0, 0],
            BrickHalf: [8, 4],
            BrickPlain: [8, 8],
            Bush1: [16, 8],
            Bush2: [24, 8],
            Bush3: [32, 8],
            Castle: [75, 88],
            CastleChain: [7.5, 7.5],
            CastleDoor: [8, 20],
            CastleRailing: [8, 4],
            CastleRailingFilled: [8, 4],
            CastleTop: [12, 12],
            CastleWall: [8, 48],
            Cloud1: [16, 12],
            Cloud2: [24, 12],
            Cloud3: [32, 12],
            Flag: [8, 8],
            FlagPole: [1, 72],
            FlagTop: [4, 4],
            Fence: [8, 8],
            HillSmall: [24, 9.5],
            HillLarge: [40, 17.5],
            PlantSmall: [7, 15],
            PlantLarge: [8, 23],
            Railing: [4, 4],
            ShroomTrunk: [8, 8],
            String: [1, 1],
            TreeTrunk: [4, 4],
            Water: {
                "width": 4,
                "height": 5,
                // spriteCycle: [
                    // ["one", "two", "three", "four"]
                // ]
            },
            WaterFill: [4, 5],
            "text": {
                "libtype": "Text",
                "grouptype": "Text",
            },
            "Text100": [6, 4],
            "Text200": [6, 4],
            "Text400": [6, 4],
            "Text500": [6, 4],
            "Text800": [6, 4],
            "Text1000": [8, 4],
            "Text2000": [8, 4],
            "Text4000": [8, 4],
            "Text5000": [8, 4],
            "Text8000": [8, 4],
            "Text1Up": [8, 4],
        }
    };
})();