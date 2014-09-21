FullScreenMario.prototype.settings.mods = {
    "store_locally": true,
    "prefix": "FullScreenMarioMods",
    "mods": [
        {
            "name": "High Speed",
            "description": "Mario's maximum speed is quadrupled.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    var stats = this.ObjectMaker.getFunction("Player").prototype;
                    mod.value_old = stats.maxspeedsave;
                    stats.maxspeedsave = stats.maxspeed = stats.scrollspeed = mod.value_old * 4;
                },
                "onModDisable": function (mod) {
                    var stats = this.ObjectMaker.getFunction("Player").prototype;
                    stats.maxspeedsave = stats.maxspeed = stats.scrollspeed = mod.value_old;
                }
            }
        },
        {
            "name": "Gradient Skies",
            "description": "Skies fade out to black in the heavens above.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    if(this.MapsHandler.getMap()) {
                        mod.events.onSetLocation.call(this, mod);
                    }
                },
                "onModDisable": function (mod) {
                    this.MapsHandler.getArea().background = mod.settings.backgroundOld;
                },
                "onSetLocation": (function (gradients) {
                    return function (mod) { 
                        var area = this.MapsHandler.getArea(),
                            setting = area.setting,
                            context = this.canvas.getContext("2d"),
                            background = context.createLinearGradient(
                                0, 0,
                                this.MapScreener.width,
                                this.MapScreener.height
                            ), gradient, i;
                        
                        for(i in gradients) {
                            if(setting.indexOf(i) !== -1) {
                                gradient = gradients[i]
                                break;
                            }
                        }
                        
                        if(!gradient) {
                            gradient = gradients["default"];
                        }
                        
                        for(i in gradient) {
                            background.addColorStop(i, gradient[i]);
                        }
                        
                        mod.settings.backgroundOld = area.background;
                        
                        area.background = background;
                    };
                })({
                    "Underwater": {
                        "0": "#77dddd",
                        "0.21": "#5cbaf9",
                        "1": "#2149bb"
                    },
                    "Night": {
                        "0": "#000000",
                        "0.42": "#000035",
                        "0.84": "#560056",
                        "1": "#350000"
                    },
                    "Underworld": {
                        "0.14": "#000000",
                        "1": "#005649"
                    },
                    "Castle": {
                        "0.21": "#000000",
                        "1": "#980000"
                    },
					"Womb": {
						"0.14": "#703521",
						"1": "#770014"
					},
                    "default": {
                        "0.21": "#5C94FC",
                        "0.35": "#77AAFF",
                        "0.7": "#FFCCAA",
                        "1": "#FFFFFF"
                    }
                })
            },
            "settings": {}
        },
        {
            "name": "Invincibility",
            "description": "Mario is constantly given star power.",
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    if(this.player) {
                        FSM.playerStarUp(this.player, Infinity);
                    }
                },
                "onModDisable": function () {
                    FSM.playerStarDown(this.player);
                },
                "onSetLocation": function () {
                    FSM.playerStarUp(this.player, Infinity);
                }
            }
        },
        {
            "name": "Parallax Clouds",
            "description": "Clouds in the sky scroll at about 63% the normal rate.",
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallax = .63;
                },
                "onModDisable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallax = undefined;
                }
            }
        },
        {
            "name": "Low Gravity",
            "description": "I believe I can fly!",
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.ObjectMaker.getFunction("Player").prototype.gravity 
                            = this.ObjectMaker.getFunction("Area").prototype.gravity / 1.4
                },
                "onModDisable": function () {
                    this.ObjectMaker.getFunction("Player").prototype.gravity 
                            = this.ObjectMaker.getFunction("Area").prototype.gravity;
                }
            }
        },
        {
            "name": "Luigi",
            "description": "The little brother who couldl!",
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.StatsHolder.set("luigi", true);
                    this.ObjectMaker.getFunction("Player").prototype.title = "Luigi";
                    
                    if(this.player) {
                        this.player.title = "Luigi";
                        this.PixelDrawer.setThingSprite(this.player);
                    }
                },
                "onModDisable": function () {
                    this.StatsHolder.set("luigi", false);
                    this.ObjectMaker.getFunction("Player").prototype.title = "Player";
                    
                    if(this.player) {
                        this.player.title = "Player";
                        this.PixelDrawer.setThingSprite(this.player);
                    }
                }
            }
        },
        {
            "name": "QCount",
            "description": "QQQQQQQ",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    var FSM = this,
                        characters = mod.settings.characters,
                        charactersFSM = FSM.GroupHolder.getCharacterGroup(),
                        level;
                    
                    this.InputWriter.addEvent("onkeydown", "q", function () {
                        mod.settings.qcount += 1;
                        
                        if(mod.settings.levels[mod.settings.qcount]) {
                            var level = mod.settings.levels[mod.settings.qcount];
                            mod.settings.event = FSM.TimeHandler.addEventInterval(function () {
                                if(charactersFSM.length < 210) {
                                    var num = Math.floor(Math.random() * level.length),
                                        lul = FSM.ObjectMaker.make.apply(FSM, level[num]);
                                    
                                    lul.yvel = Math.random() * FSM.unitsize / 4;
                                    lul.xvel = lul.speed = Math.random() * FSM.unitsize * 2;
                                    if(Math.floor(Math.random() * 2)) {
                                        lul.xvel *= -1;
                                    }
                                    
                                    characters.push(lul);
                                    FSM.addThing(
                                        lul, 
                                        (32 * Math.random() + 128) * FSM.unitsize,
                                        88 * Math.random() * FSM.unitsize
                                    );
                                }
                            }, 7, Infinity);
                        }
                    });
                    this.InputWriter.addAlias("q", [81]);
                },
                "onModDisable": function (mod) {
                    mod.settings.qcount = 0;
                    this.TimeHandler.clearEvent(mod.settings.event);
                    this.InputWriter.clearEvent("onkeydown", 81, true);
                    this.InputWriter.clearEvent("onkeydown", "q", true);
                },
                "onSetLocation": function (mod) {
                    mod.settings.qcount = 0;
                }
            },
            "settings": {
                "qcount": 0,
                "characters": [],
                "levels": {
                    "7": [ ["Goomba"] ],
                    "14": [ 
                        ["Koopa"],
                        ["Koopa", { "smart": true }],
                        ["Koopa", { "jumping": true }],
                        ["Koopa", { "smart": true, "jumping": true }],
                        // ["Beetle"],
                        // ["HammerBro"],
                        // ["Lakitu"],
                        // ["Blooper"]
                    ],
                    "21": [ ["Bowser"] ]
                }
            }
        },
        {
            "name": "Super Fireballs",
            "description": "Fireballs blow up solids, and Mario has unlimited.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.ObjectMaker.getFunction("solid").prototype.nofire = 0;
                    this.ObjectMaker.getFunction("solid").prototype.firedeath = 1;
                },
                "onModDisable": function (mod) {
                    this.ObjectMaker.getFunction("solid").prototype.nofire = 2;
                    this.ObjectMaker.getFunction("solid").prototype.firedeath = 0;
                }
            }
        },
        {
            "name": "Trip of Acid",
            "description": "Sprites aren't cleared from the screen each game tick.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.TimeHandler.addEvent(function () {
                        this.PixelDrawer.setNoRefill(true);
                    }.bind(this), 3);
                },
                "onSetLocation": function (mod) {
                    this.PixelDrawer.setNoRefill(false);
                    this.TimeHandler.addEvent(function () {
                        this.PixelDrawer.setNoRefill(true);
                    }.bind(this), 3);
                },
                "onModDisable": function (mod) {
                    this.PixelDrawer.setNoRefill(false);
                }
            }
        }
    ]
}