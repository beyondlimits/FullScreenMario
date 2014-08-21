FullScreenMario.prototype.settings.mods = {
    "mods": [
        {
            "name": "Luigi",
            "description": "The little brother who could!",
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
            "name": "QCount",
            "description": "QQQQQQQ",
            "enabled": true,
            "events": {
                "onModEnable": function (mod) {
                    console.log("Enabling mod of status", mod.enabled);
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
                    this.TimeHandler.clearEvent(mod.settings.event);
                    this.InputWriter.clearEvent("onkeydown", 81, true);
                    this.InputWriter.clearEvent("onkeydown", "q", true);
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
                "onLocationSet": function () {
                    FSM.playerStarUp(this.player, Infinity);
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
            "name": "Invisible Player",
            "description": "You can't see the player anymore.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.ObjectMaker.getFunction("Player").prototype.hidden = 1;
                },
                "onModDisable": function (mod) {
                    this.ObjectMaker.getFunction("Player").prototype.hidden = 0;
                }
            }
        },
        {
            "name": "Acid Trip",
            "description": "Sprites aren't cleared from the screen each game tick.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.PixelDrawer.setNoRefill(true);
                },
                "onModDisable": function (mod) {
                    this.PixelDrawer.setNoRefill(false);
                }
            }
        }
    ]
}