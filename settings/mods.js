FullScreenMario.prototype.settings.mods = {
    "store_locally": true,
    "prefix": "FullScreenMarioMods",
    "mods": [
        {
            "name": "Bouncy Bounce",
            "description": "Mario landing causes him to jump.",
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onPlayerLanding": function (mod) {
                    var player = this.player;
                    
                    if(Math.abs(player.yvel) < player.EightBitter.unitsize / 4) {
                        return;
                    }
                    
                    player.jumpcount = 0;
                    player.resting = undefined;
                    player.yvel = -3 * player.EightBitter.unitsize;
                }
            },
        },
        {
            "name": "Earthquake!",
            "description": "Mario landing causes everything else to jump.",
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onPlayerLanding": (function () {
                    var shiftLevels = [2, 1.5, 1, .5, 0, -.5, -1, -1.5, -2],
                        shiftCount = 0,
                        shiftAll = function (EightBitter, solids, scenery, characters) {
                            var dy = shiftLevels[shiftCount];
                            
                            EightBitter.shiftVert(EightBitter.player, dy);
                            EightBitter.shiftThings(solids, 0, dy);
                            EightBitter.shiftThings(scenery, 0, dy);
                            EightBitter.shiftThings(characters, 0, dy);
                            
                            shiftCount += 1;
                            if(shiftCount >= shiftLevels.length) {
                                shiftCount = 0;
                                return true;
                            }
                        };
                    
                    return function (mod) {
                        var characters = this.GroupHolder.getCharacterGroup(),
                            player = this.player,
                            character, i;
                        
                        if(Math.abs(player.yvel) < player.EightBitter.unitsize) {
                            return;
                        }
                        
                        this.AudioPlayer.play("Bump");
                        
                        for(i = 0; i < characters.length; i += 1) {
                            character = characters[i];
                            if(character.player || character.nofall) {
                                continue;
                            }
                            
                            character.resting = undefined;
                            character.yvel = player.EightBitter.unitsize * -1.4;
                        }
                        
                        // A copy of each group is made because new Things 
                        // added in shouldn't start being moved in the middle
                        if(shiftCount === 0) {
                            this.TimeHandler.addEventInterval(
                                shiftAll, 1, Infinity, this,
                                this.GroupHolder.getSolidGroup().slice(),
                                this.GroupHolder.getSceneryGroup().slice(),
                                this.GroupHolder.getCharacterGroup().slice()
                            );
                        }
                    }
                })()
            }
        },
        {
            "name": "Gradient Skies",
            "description": "Skies fade out to black in the heavens above.",
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
                        "0": "#357749",
                        "1": "#2149CC"
                    },
                    "Night": {
                        "0": "#000000",
                        "0.49": "#000028",
                        "0.84": "#210028",
                        "1": "#210021"
                    },
                    "Underworld": {
                        "0.35": "#000000",
                        "1": "#003528"
                    },
                    "Castle": {
                        "0.21": "#000000",
                        "1": "#700000"
                    },
					"Womb": {
						"0.21": "#703521",
						".7": "#770014",
                        "1": "#AA0035"
					},
                    "default": {
                        ".21": "#5C94FC",
                        ".49": "#77AAFF",
                        "1": "#FFCCAA"
                    }
                })
            },
            "settings": {}
        },
        {
            "name": "High Speed",
            "description": "Mario's maximum speed is quadrupled.",
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallax = .7;
                },
                "onModDisable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallax = undefined;
                }
            }
        },
        {
            "name": "Low Gravity",
            "description": "I believe I can fly!",
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
            "description": "The little brother who could!",
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
                    this.InputWriter.addAliasValues("q", [81]);
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
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
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
        },
        {
            "name": "Wasted",
            "description": "Should add in some form of filters option to enable B/W (it should be like GTAV",
            "author": {
                "name": "Josh Golderg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                
            }
        }
    ]
}