window.FullScreenMario = (function() {
    "use strict";
    
    // Use an EightBittr as the class parent, with EightBittr's constructor
    var EightBitterProto = new EightBittr(),
        
        // Used for combining arrays from the prototype to this
        proliferate = EightBitterProto.proliferate,
        proliferateHard = EightBitterProto.proliferateHard;
        
    // Subsequent settings will be stored in FullScreenMario.prototype.settings
    EightBitterProto.settings = {};
    
    /**
     * Constructor for a new FullScreenMario game object.
     * Static game settings are stored in the appropriate settings/*.js object
     * as members of the FullScreenMario.prototype object.
     * Dynamic game settings may be given as members of the "customs" argument.
     * On typical machines, game startup time is approximately 500-700ms.
     * 
     * @param {Number} width   Width of the game viewport: at least 480.
     * @param {Number} height   Height of the game viewport: at least 464.
     * @param {Object} [style]   Additional CSS styles to be given to the
     *                           game's container <div> element.
     * @param {} 
     * @returns {FullScreenMario}
     * 
     * @example Creating a 15 x 14.5 blocks sized FullScreenMario object.
     * var FSM = new FullScreenMario({
     *     "width": 480, 
     *     "height": 464
     * });
     * 
     * @example Creating a full-screen FullScreenMario object with a few mods.
     * var FSM = new FullScreenMario({
     *    "width": window.innerWidth,
     *    "height": window.innerHeight,
     *    "mods": {
     *         "Luigi": true,
     *         "ParallaxClouds": true,
     *         "High Speed": true,
     *         "Super Fireballs": true
     *     }
     * });
     * 
     * @example Binding the FullScreenMario object controls to the body's mouse
     *          and key events, and starting the game.
     * window.FSM = new FullScreenMario({
     *    "width": window.innerWidth, 
     *    "height": window.innerHeight
     * });
     * 
     * document.body.appendChild(FSM.container);
     * 
     * FSM.proliferate(document.body, {
     *     "onkeydown": FSM.InputWriter.makePipe("onkeydown", "keyCode"),
     *     "onkeyup": FSM.InputWriter.makePipe("onkeyup", "keyCode"),
     *     "onmousedown": FSM.InputWriter.makePipe("onmousedown", "which"),
     *     "oncontextmenu": FSM.InputWriter.makePipe("oncontextmenu", null, true)
     * });
     * 
     * FSM.gameStart();
     */
    function FullScreenMario(customs) {        // Call the parent EightBittr constructor to set the base settings,        // verify the prototype requirements, and call the reset functions        EightBittr.call(this, {
            "customs": customs,
            "constructor": FullScreenMario,            "unitsize": 4,            "scale": 2,            "requirements": {                "global": {                    "AudioPlayr": "src/AudioPlayr.js",                    "ChangeLinr": "src/ChangeLinr.js",                    "FPSAnalyzr": "src/FPSAnalyzr.js",                    "GamesRunnr": "src/GamesRunnr.js",                    "GroupHoldr": "src/GroupHoldr.js",                    "InputWritr": "src/InputWritr.js",                    "LevelEditr": "src/LevelEditr.js",
                    "MapScreenr": "src/MapScreenr.js",
                    "MapsHandlr": "src/MapsHandlr.js",
                    "ModAttachr": "src/ModAttachr.js",                    "ObjectMakr": "src/ObjectMakr.js",                    "PixelDrawr": "src/PixelDrawr.js",                    "PixelRendr": "src/PixelRendr.js",                    "QuadsKeepr": "src/QuadsKeepr.js",                    "StatsHoldr": "src/StatsHoldr.js",                    "StringFilr": "src/StringFilr.js",                    "ThingHittr": "src/ThingHittr.js",                    "TimeHandlr": "src/TimeHandlr.js"                },
                "settings": {
                    "audio": "settings/audio.js",
                    "collisions": "settings/collisions.js",                    "events": "settings/events.js",
                    "maps": "settings/maps.js",                    "quadrants": "settings/quadrants.js",
                    "runner": "settings/runner.js",
                    "sprites": "settings/sprites.js",
                    "statistics": "settings/statistics.js"                }            },            "resets": [
                resetPixelRender,                resetPixelDrawer,                resetTimeHandler,
                resetAudioPlayer,
                resetQuadsKeeper,
                resetGamesRunner,
                resetStatsHolder,
                resetThingHitter,
                resetObjectMaker,
                resetMapScreener,
                resetMapsCreator,
                resetMapsHandler,
                resetInputWriter,
                resetLevelEditor,
                resetModAttacher,
                startModAttacher,
                resetContainer
            ],
            "constants": [
                "unitsize",
                "scale",
                "jumplev1",
                "jumplev2",
                "ceilmax",
                "castlev",
                "point_levels",
                "gravity"
            ]        });    }
    FullScreenMario.prototype = EightBitterProto;
    
    // For the sake of reset functions, store constants as members of the actual
    // FullScreenMario function itself - this allows prototype setters to use 
    // them regardless of whether the prototype has been instantiated yet.
    // The floor is 104 spaces (13 blocks) below the top of the screen (yloc = -16).
    FullScreenMario.unitsize = 4;
    FullScreenMario.scale = 2;
    
    // Gravity is always a function of unitsize
    FullScreenMario.gravity = Math.round(12 * FullScreenMario.unitsize) / 100; // .48
    
    // When a player is far enough below the bottom, that's a death
    FullScreenMario.bottom_death_difference = 12 * FullScreenMario.unitsize;
    
    // Levels of points to award for hopping on / shelling enemies
    FullScreenMario.point_levels = [
        100, 200, 400, 500, 800, 1000, 2000, 4000, 5000, 8000
    ];            /* Reset functions, in order    */        /**     * Sets self.PixelRender     *      * @param {FullScreenMario} self     * @remarks Requirement(s): PixelRendr (src/PixelRendr/PixelRendr.js)
     *                          sprites.js (settings/sprites.js)     */    function resetPixelRender(self, customs) {        // PixelRender settings are stored in FullScreenMario.prototype.sprites,        // though they also need the scale measurement added        self.PixelRender = new PixelRendr(proliferateHard({
            "unitsize": self.unitsize,
            "scale": self.scale
        }, self.settings.sprites));    }        /**     * Sets self.PixelDrawer     *      * @param {FullScreenMario} self     * @remarks Requirement(s): PixelDrawr (src/PixelDrawr/PixelDrawr.js)     */    function resetPixelDrawer(self, customs) {        self.PixelDrawer = new PixelDrawr({            "PixelRender": self.PixelRender,
            "getCanvas": self.getCanvas,
            "unitsize": self.unitsize,
            "innerWidth": customs.width,
            "make_object_key": function(thing) {
                return thing.EightBitter.MapsHandler.getArea().setting 
                        + ' ' + thing.libtype + ' ' 
                        + thing.title + ' ' + thing.className;
            }        });    }        /**     * Sets self.TimeHandler     *      * @param {FullScreenMario} self     * @remarks Requirement(s): TimeHandlr (src/TimeHandlr/TimeHandlr.js)
     *                          events.js (settings/events.js)     */    function resetTimeHandler(self, customs) {
        self.TimeHandler = new TimeHandlr(proliferate({
            "classAdd": self.addClass,
            "classRemove": self.removeClass
        }, self.settings.events));    }
    
    /**
     * Sets self.AudioPlayer
     * 
     * @param {FullScreenMario} self
     * @remarks Requirement(s): AudioPlayr (src/AudioPlayr/AudioPlayr.js)
     *                          audio.js (settings/audio.js)
     */
    function resetAudioPlayer(self, customs) {
        self.AudioPlayer = new AudioPlayr(proliferate({
            "getVolumeLocal": function getVolumeLocal() {
                return .49;
            },
            "getThemeDefault": function getThemeDefault() {
                return self.MapsHandler.getArea().setting.split(' ')[0];
            },
        }, self.settings.audio));
    }
    
    /**
     * Sets self.QuadsKeeper
     * @remarks Requirement(s): QuadsKeepr (src/QuadsKeepr/QuadsKeepr.js)
     *                          quadrants.js (settings/quadrants.js)
     */
    function resetQuadsKeeper(self, customs) {
        self.QuadsKeeper = new QuadsKeepr(proliferate({
            "screen_width": customs.width,
            "screen_height": customs.height,
            "onUpdate": function () {
                var diff_right = self.MapScreener.right + self.QuadsKeeper.getOutDifference();
                self.MapsHandler.spawnMap(diff_right / self.unitsize);
            }
        }, self.settings.quadrants));
    }
    
    /**
     * Sets self.GamesRunner
     * @remarks Requirement(s): GamesRunnr (src/GamesRunnr/GamesRunnr.js)
     *                          runner.js (settings/runner.js)
     */
    function resetGamesRunner(self, customs) {
        self.GamesRunner = new GamesRunnr(proliferate({
            "scope": self,
            "on_pause": function () {
                self.AudioPlayer.pause();
            },
            "on_unpause": function () {
                self.AudioPlayer.resume();
            }
        }, self.settings.runner));
    }
    
    /**
     * Sets self.StatsHolder
     * @remarks Requirement(s): StatsHoldr (src/StatsHoldr/StatsHoldr.js)
     *                          statistics.js (settings/statistics.js)
     */
    function resetStatsHolder(self, customs) {
        self.StatsHolder = new StatsHoldr(proliferate({
            "scope": self,
            "width": customs.width,
            "proliferate": self.proliferate,
            "createElement": self.createElement,
        }, self.settings.statistics));
        
        if(customs.width < 560) {
            self.StatsHolder.getContainer().children[0].cells[4].style.display = "none";
        }
    }
    
    /**
     * Sets self.ThingHitter
     * @remarks Requirement(s): ThingHittr (src/ThingHittr/ThingHittr.js)
     *                          collisions.js (settings/collisions.js)
     */
    function resetThingHitter(self, customs) {
        self.ThingHitter = new ThingHittr(proliferate({
            "scope": self
        }, self.settings.collisions));
        
        self.GroupHolder = self.ThingHitter.getGroupHolder();
    }
    
    /**
     * Sets self.ObjectMaker
     * 
     * Because many Thing functions require access to other FSM modules, each is
     * given a reference to this container FSM via properties.Thing.EightBitter. 
     * 
     * @remarks Requirement(s): ObjectMakr (src/ObjectMakr/ObjectMakr.js)
     *                          objects.js (settings/objects.js)
     */
    function resetObjectMaker(self, customs) {
        self.ObjectMaker = new ObjectMakr(proliferate({
            "properties": {
                "Thing": {
                    "EightBitter": self
                }
            }
        }, self.settings.objects));
    }
    
    /**
     * Sets self.MapScreener
     * 
     * @remarks Requirement(s): MapScreenr (src/MapScreenr/MapScreenr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapScreener(self, customs) {
        self.MapScreener = new MapScreenr({
            "unitsize": FullScreenMario.unitsize,
            "width": customs.width,
            "height": customs.height,
            "variable_args": [self],
            "variables": self.settings.maps.screen_variables
        });
    }
    
    /**
     * Sets self.MapCreator
     * 
     * @remarks Requirement(s): MapCreatr (src/MapCreatr/MapCreatr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsCreator(self, customs) {
        self.MapsCreator = new MapsCreatr({
            "ObjectMaker": self.ObjectMaker,
            "group_types": ["Character", "Scenery", "Solid", "Text"],
            "macros": self.settings.maps.macros,
            "entrances": self.settings.maps.entrances,
            "maps": self.settings.maps.maps,
            "scope": self
        });
    }
    
    /**
     * Sets self.MapsHandler
     * 
     * @remarks Requirement(s): MapsHandlr (src/MapsHandlr/MapsHandlr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsHandler(self, customs) {
        self.MapsHandler = new MapsHandlr({
            "MapsCreator": self.MapsCreator,
            "MapScreener": self.MapScreener,
            "screen_attributes": self.settings.maps.screen_attributes,
            "on_spawn": self.settings.maps.on_spawn
        });
    }
    
    /**
     * Sets self.InputWriter
     * 
     * @remarks Requirement(s): InputWritr (src/InputWritr/InputWritr.js)
     *                          input.js (settings/input.js)
     */
    function resetInputWriter(self, customs) {
        self.InputWriter = new InputWritr(proliferate({
            "can_trigger": function () {
                return !self.MapScreener.nokeys;
            }
        }, self.settings.input));
    }
    
    /**
     * Sets self.resetLevelEditor
     * 
     * @remarks Requirement(s): LevelEditr (src/LevelEditr/LevelEditr.js)
     */
    function resetLevelEditor(self, customs) {
        self.LevelEditor = new LevelEditr(proliferate({
            "GameStarter": self,
			"beautifier": js_beautify // Eventually there will be a custom beautifier
        }, self.settings.editor));
    }
    
    /**
     * 
     */
    function resetModAttacher(self, customs) {
        self.ModAttacher = new ModAttachr(proliferate({
            "scope_default": self,
            "StatsHoldr": StatsHoldr,
            "proliferate": self.proliferate,
            "createElement": self.createElement
        }, self.settings.mods));
    }
    
    /** 
     * 
     */
    function startModAttacher(self, customs) {
        var mods = customs.mods,
            i;
        
        if(mods) {
            for(i in mods) {
                if(mods[i]) {
                    self.ModAttacher.enableMod(i);
                }
            }
        }
        
        self.ModAttacher.fireEvent("onReady", self, self);
    }
    
    /**
     * 
     */
    function resetContainer(self, customs) {
        self.container = self.createElement("div", {
            "className": "FullScreenMario EightBitter",
            "style": proliferate({
                "position": "relative",
                "width": customs.width + "px",
                "height": customs.height + "px",
                "fontFamily": "Press Start"
            }, customs.style)
        });
        self.canvas = self.getCanvas(customs.width, customs.height);
        
        self.PixelDrawer.setCanvas(self.canvas);
        self.PixelDrawer.setThingArrays([
            self.GroupHolder.getSceneryGroup(),
            self.GroupHolder.getSolidGroup(),
            self.GroupHolder.getCharacterGroup(),
            self.GroupHolder.getTextGroup()
        ]);
        
        self.container.appendChild(self.canvas);
        self.container.appendChild(self.StatsHolder.getContainer());
    }
    
    
    /* Global manipulations
    */
    
    /**
     * 
     */
    function gameStart() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        EightBitter.setMap("1-1");
        EightBitter.StatsHolder.set("lives", 3);
        EightBitter.GamesRunner.unpause();
    }
    
    /**
     * 
     */
    function gameOver() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            backgroundOld = EightBitter.MapsHandler.getArea().background;
        
        EightBitter.AudioPlayer.pauseTheme();
        EightBitter.AudioPlayer.play("Game Over");
        
        EightBitter.GroupHolder.clearArrays();
        EightBitter.MapsHandler.getArea().background = "black";
        EightBitter.StatsHolder.hideContainer();
        
        EightBitter.TimeHandler.addEvent(function () {
            EightBitter.MapsHandler.getArea().background = backgroundOld;
            EightBitter.gameStart();
            EightBitter.StatsHolder.displayContainer();
        }, 420);
    }
    
    /**
     * 
     */
    function nextLevel() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            ints = EightBitter.MapsHandler.getMapName().split("-").map(Number);
        
        if(ints[1] > 3) {
            ints[0] += 1;
            ints[1] = 1;
        } else {
            ints[1] += 1;
        }
        
        EightBitter.setMap(ints.join("-"));
    }
    
    /**
     * 
     * 
     * 
     */
    function addThing(thing, left, top) {
        if(typeof(thing) === "string" || thing instanceof String) {
            thing = this.ObjectMaker.make(thing);
        } else if(thing.constructor === Array) {
            thing = this.ObjectMaker.make.apply(this.ObjectMaker, thing);
        }
        
        if(arguments.length > 1) {
            thing.EightBitter.setLeft(thing, left);
            thing.EightBitter.setTop(thing, top);
        }
        
        thing.EightBitter.updateSize(thing);
        
        thing.EightBitter.GroupHolder.getFunctions().add[thing.grouptype](thing);
        thing.placed = true;
        
        if(thing.onThingAdd) {
            thing.onThingAdd(thing);
        }
        
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        
        return thing;
    }
    
    /**
     * 
     * 
     * 
     * @todo Create a generic version of this in GameStartr
     * @todo Make players as an array of players (native multiplayer!)
     */
    function addPlayer(left, top) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            player;
        
        player = EightBitter.player = EightBitter.ObjectMaker.make("Player", {
            "power": EightBitter.StatsHolder.get("power"),
            "keys": EightBitter.ObjectMaker.getProperties().Player.getKeys()
        });
        
        EightBitter.InputWriter.setEventInformation(player);
        EightBitter.setPlayerSizeSmall(player);
        
        if(EightBitter.MapScreener.underwater) {
            player.swimming = true;
            EightBitter.TimeHandler.addClassCycle(player, [
                "swim1", "swim2"
            ], "swimming", 5);
        }
        
        EightBitter.addThing(player,
            left || EightBitter.unitsize * 16,
            top || EightBitter.unitsize * (EightBitter.MapScreener.floor - player.height)
        );
        
        switch(player.power) {
            case 2:
                EightBitter.playerGetsBig(player, true);
                break;
            case 3:
                EightBitter.playerGetsBig(player, true);
                EightBitter.playerGetsFire(player, true);
                break;
        }
        
        return player;
    }
    
    /**
     * 
     */
    function thingProcess(thing, type, settings, defaults) {
        // If the Thing doesn't specify its own title, use the type by default
        thing.title = thing.title || type;
        
        // If a width/height is provided but no spritewidth/height,
        // use the default spritewidth/height
        if(thing.width && !thing.spritewidth) {
            thing.spritewidth = defaults.spritewidth || defaults.width;
        }
        if(thing.height && !thing.spriteheight) {
            thing.spriteheight = defaults.spriteheight || defaults.height;
        }
        
        // "Infinity" height refers to objects that reach exactly to the bottom
        if(thing.height === "Infinity") {
            thing.height = thing.EightBitter.getAbsoluteHeight(thing.y) / thing.EightBitter.unitsize;
        }
        
        // Each thing has at least 4 maximum quadrants (for the QuadsKeepr)
        var maxquads = 4,
            num;
        num = Math.floor(thing.width 
            * (FullScreenMario.unitsize / thing.EightBitter.QuadsKeeper.getQuadWidth()));
        if(num > 0) {
            maxquads += ((num + 1) * maxquads / 2);
        }
        num = Math.floor(thing.height 
            * (FullScreenMario.unitsize / thing.EightBitter.QuadsKeeper.getQuadHeight()));
        if(num > 0) {
            maxquads += ((num + 1) * maxquads / 2);
        }
        thing.maxquads = maxquads;
        thing.quadrants = new Array(maxquads);
        
        // Basic sprite information
        var spritewidth = thing.spritewidth = thing.spritewidth || thing.width,
            spriteheight = thing.spriteheight = thing.spriteheight || thing.height,
            // Sprite sizing
            spritewidthpixels = thing.spritewidthpixels = spritewidth * FullScreenMario.unitsize,
            spriteheightpixels = thing.spriteheightpixels = spriteheight * FullScreenMario.unitsize;
        
        // Canvas, context, imageData
        var canvas = thing.canvas = FullScreenMario.prototype.getCanvas(spritewidthpixels, spriteheightpixels),
            context = thing.context = canvas.getContext("2d"),
            imageData = thing.imageData = context.getImageData(0, 0, spritewidthpixels, spriteheightpixels);
        
        if(thing.opacity !== 1) {
            thing.EightBitter.setOpacity(thing, thing.opacity);
        }
        
        // Attributes, such as Koopa.smart
        if(thing.attributes) {
            thingProcessAttributes(thing, thing.attributes, settings);
        }
        
        // Important custom functions
        if(thing.onThingMake) {
            thing.onThingMake(thing, settings);
        }
        
        // Initial class / sprite setting
        thing.EightBitter.setSize(thing, thing.width, thing.height);
        thing.EightBitter.setClassInitial(thing, thing.name || thing.title);
        
        // Sprite cycles
        var cycle;
        if(cycle = thing.spriteCycle) {
            thing.EightBitter.TimeHandler.addClassCycle(thing, cycle[0], cycle[1] || null, cycle[2] || null);
        }
        if(cycle = thing.spriteCycleSynched) {
            thing.EightBitter.TimeHandler.addClassCycleSynched(thing, cycle[0], cycle[1] || null, cycle[2] || null);
        }
        
        // Mods!
        thing.EightBitter.ModAttacher.fireEvent("onThingMake", thing.EightBitter, thing, type, settings, defaults);
    }
    
    /**
     * 
     */
    function thingProcessAttributes(thing, attributes) {
        var attribute, i;

        // For each listing in the attributes...
        for(attribute in attributes) {
            // If the thing has that attribute as true:
            if(thing[attribute]) {
                // Add the extra options
                proliferate(thing, attributes[attribute]);
                // Also add a marking to the name, which will go into the className
                if(thing.name) {
                    thing.name += ' ' + attribute;
                } else {
                    thing.name = thing.title + ' ' + attribute;
                }
            }
        }
    }
    
    /**
     * 
     */
    function scrollWindow(dx, dy) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        dx = dx || 0;
        dy = dy || 0;
        
        EightBitter.MapScreener.shift(dx, dy);
        EightBitter.shiftAll(-dx, -dy);
        
        EightBitter.shiftThings(EightBitter.QuadsKeeper.getQuadrants(), -dx, -dy);
        EightBitter.QuadsKeeper.updateQuadrants(-dx);
    }
    
    /**
     * 
     */
    function scrollPlayer(thing, dx, dy) {
        var saveleft = thing.left,
            savetop = thing.top;
        
        thing.EightBitter.scrollWindow(dx, dy);
        thing.EightBitter.setLeft(thing, saveleft);
        thing.EightBitter.setTop(thing, savetop);
    }
        
    
    /* Upkeep maintenence
    */
    
    /**
     * 
     * 
     * @param {FullScreenMario} EightBitter
     */
    function maintainSolids(EightBitter, solids) {
        var delx = EightBitter.QuadsKeeper.getDelX(),
            solid, i;
        
        for (i = 0; i < solids.length; ++i) {
            solid = solids[i];
            
            if(solid.alive && solid.right > delx) {
                if (solid.movement) {
                    solid.movement(solid);
                }
            } else {
                EightBitter.arrayDeleteMember(solid, solids, i);
                i -= 1;
            }
        }
    }

    /**
     * 
     * 
     * @param {FullScreenMario} EightBitter
     */
    function maintainCharacters(EightBitter, characters) {
        var deldx = EightBitter.QuadsKeeper.getOutDifference(),
            delx = EightBitter.MapScreener.right + deldx,
            character, i;
        for (i = 0; i < characters.length; ++i) {
            character = characters[i];
            
            // Gravity
            if(character.resting) {
                character.yvel = 0;
            } else {
                if (!character.nofall) {
                    character.yvel += character.gravity || EightBitter.MapScreener.gravity;
                }
                character.yvel = Math.min(character.yvel, EightBitter.MapScreener.maxyvel);
            }

            // Position updating and collision detection
            character.under = character.undermid = false;
            EightBitter.updatePosition(character);
            EightBitter.QuadsKeeper.determineThingQuadrants(character);
            EightBitter.ThingHitter.getGroupHolder().setCharacterGroup(characters);
            EightBitter.ThingHitter.checkHitsOfOne(character);

            // Resting tests
            if (character.resting) {
                if (!EightBitter.isCharacterOnResting(character, character.resting)) {
                    character.resting = undefined; // Necessary for moving platforms :(
                } else {
                    /*character.jumping = */
                    character.yvel = false;
                    EightBitter.setBottom(character, character.resting.top);
                }
            }

            // Movement or deletion
            // To do: rethink this...
            if (character.alive) {
                if (!character.player &&
                    (character.numquads == 0 || character.left > delx) &&
                    (!character.outerok || character.right < -deldx)) {
                    EightBitter.arrayDeleteMember(character, characters, i);
                } else {
                    if (!character.nomove && character.movement) {
                        character.movement(character);
                    }
                }
            } else {
                EightBitter.arrayDeleteMember(character, characters, i);
                i -= 1;
            }
        }
    }

    /**
     * 
     * 
     * @param {FullScreenMario} EightBitter
     */
    function maintainPlayer(EightBitter) {
        var player = EightBitter.player;
        if (!player.alive) {
            return;
        }

        // Player is falling
        if (player.yvel > 0) {
            if (!EightBitter.MapScreener.underwater) {
                player.keys.jump = 0;
            }
            // Jumping?
            if (!player.jumping) {
                // Paddling? (from falling off a solid)
                if (EightBitter.MapScreener.underwater) {
                    if (!player.paddling) {
                        EightBitter.switchClass(player, "paddling", "paddling");
                        player.paddling = true;
                    }
                } else {
                    EightBitter.addClass(player, "jumping");
                    player.jumping = true;
                }
            }
            // Player has fallen too far
            if (!player.piping && !player.dying && player.top > EightBitter.MapScreener.bottom) {
                // If the map has an exit loc (cloud world), transport there
                if (EightBitter.MapScreener.exitloc) {
                    EightBitter.setLocation(map.exitloc);
                }
                // Otherwise, since Player is below the screen, kill him dead
                else {
                    EightBitter.killPlayer(player, 2);
                }
                
                return;
            }
        }

        // Player is moving to the right
        if (player.xvel > 0) {
            if (player.right > EightBitter.MapScreener.middlex) {
                // If Player is to the right of the screen's middle, move the screen
                if (player.right > EightBitter.MapScreener.right - EightBitter.MapScreener.left) {
                    player.xvel = Math.min(0, player.xvel);
                }
            }
        }
        // Player is moving to the left
        else if (player.left < 0) {
            // Stop Player from going to the left.
            player.xvel = Math.max(0, player.xvel);
        }

        // Player is hitting something (stop jumping)
        if (player.under) {
            player.jumpcount = 0;
        }

        // Scrolloffset is how far over the middle player's right is
        if(EightBitter.MapScreener.canscroll) {
            var scrolloffset = player.right - EightBitter.MapScreener.middlex;
            if (scrolloffset > 0) {
                EightBitter.scrollWindow(Math.round(Math.min(player.scrollspeed, scrolloffset)));
            }
        }
    }
    
    
    /* Collision detectors
    */

    /**
     * Generic checker for can_collide, used for both Solids and Characters
     * 
     * @param {Thing} thing
     * @return {Boolean}
     */
    function canThingCollide(thing) {
        return thing.alive && !thing.nocollide;
    }

    /**
     * Generic base function to check if one thing is touching another
     * This will be called by the more specific thing touching functions
     * 
     * @param {Thing} thing
     * @param {Thing} other
     * @return {Boolean}
     * @remarks Only the horizontal checks use unitsize
     */
    function isThingTouchingThing(thing, other) {
        return !thing.nocollide && !other.nocollide
                && thing.right - thing.EightBitter.unitsize > other.left
                && thing.left + thing.EightBitter.unitsize < other.right
                && thing.bottom >= other.top
                && thing.top <= other.bottom;
    }
    
    /**
     * Is thing on top of other?
     * 
     * 
     * @remarks This is a more specific form of isThingTouchingThing
     */
    function isThingOnThing(thing, other) {
        // If thing is a solid and other is falling, thing can't be above other
        if(thing.grouptype === "Solid" && other.yvel > 0) {
            return false;
        }
        
        // If other is falling faster than thing, and isn't a solid,
        // thing can't be on top (if anything, the opposite is true)
        if(thing.yvel < other.yvel && other.grouptype !== "Solid") {
            return false;
        }
        
        // If thing is the player, and it's on top of an enemy, that's true
        if(thing.player && thing.bottom < other.bottom 
                && other.type === "enemy") {
            return true;
        }
        
        // If thing is too far to the right, it can't be touching other
        if(thing.left + thing.EightBitter.unitsize >= other.right) {
            return false;
        }
        
        // If thing is too far to the left, it can't be touching other
        if(thing.right - thing.EightBitter.unitsize <= other.left) {
            return false;
        }
        
        // If thing's bottom is below other's top, factoring tolerance and
        // other's vertical velocity, they're touching
        if(thing.bottom <= other.top + other.toly + other.yvel) {
            return true;
        }
        
        // Same as before, but with velocity as the absolute difference between
        // their two velocities
        if(thing.bottom <= other.top + other.toly
                + Math.abs(thing.yvel - other.yvel)) {
            return true;
        }
        
        // None of the above checks passed for true, so this is false (thing's
        // bottom is above other's top
        return false;
    }
    
    /**
     * 
     * 
     * @remarks Similar to isThingOnThing, but more specifically used for
     *          isCharacterOnSolid and isCharacterOnResting
     */
    function isThingOnSolid(thing, other) {
        // If thing is too far to the right, they're not touching
        if(thing.left + thing.EightBitter.unitsize > other.right) {
            return false;
        }
        
        // If thing is too far to the left, they're not touching
        if(thing.right - thing.EightBitter.unitsize < other.left) {
            return false;
        }
        
        // If thing's bottom is below other's top, factoring thing's velocity
        // and other's tolerance, they're touching
        if(thing.bottom - thing.yvel <= other.top + other.toly + thing.yvel) {
            return true;
        }
        
        // Same as before, but with velocity as the absolute difference between
        // their two velocities
        if(thing.bottom <= other.top + other.toly
                + Math.abs(thing.yvel - other.yvel)) {
            return true;
        }
        
        // None of the above checks passed for true, so this is false (thing's
        // bottom is above other's top
        return false;
    }
    
    /**
     * 
     */
    function isCharacterOnSolid(thing, other) {
        // If character is resting on solid, this is automatically true
        if(thing.resting === other) {
            return true;
        }                // If the character is jumping upwards, it's not on a solid        // (removing this check would cause Mario to have "sticky" behavior when        // jumping at the corners of solids)        if(thing.yvel < 0) {            return false;        }
        
        // The character and solid must be touching appropriately
        if(!thing.EightBitter.isThingOnSolid(thing, other)) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the right (false)
        if(thing.left + thing.xvel + thing.EightBitter.unitsize === other.right) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the left (false)
        if(thing.right - thing.xvel - thing.EightBitter.unitsize === other.left) {
            return false;
        }
        
        // None of the above checks caught a falsity, so this must be true
        return true;
    }
    
    /**
     * 
     */
    function isCharacterOnResting(thing, other) {
        if(!thing.EightBitter.isThingOnSolid(thing, other)) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the right (false)
        if(thing.left + thing.xvel + thing.EightBitter.unitsize == other.right) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the left (false)
        if(thing.right - thing.xvel - thing.EightBitter.unitsize == other.left) {
            return false;
        }
        
        // None of the above checks caught a falsity, so this must be true
        return true;
    }
    
    /**
     * 
     */
    function isCharacterTouchingCharacter(thing, other) {
        if(thing.nocollidechar && !other.player) {
            return false;
        }
        
        if(other.nocollidechar && !thing.player) {
            return false;
        }
        
        return thing.EightBitter.isThingTouchingThing(thing, other);
    }
    
    /**
     * 
     * @param {Thing} thing
     * @param {Thing} other
     */
    function isCharacterTouchingSolid(thing, other) {        // Hidden solids can only be touched by the player bottom-bumping them,
        // or by specifying collide_hidden
        if(other.hidden && !other.collide_hidden) {            if(!thing.player || !thing.EightBitter.isSolidOnCharacter(other, thing)) {                return false;            }
        }
        
        if(thing.nocollidesolid) {
            return false;
        }
        
        return thing.EightBitter.isThingTouchingThing(thing, other);
    }
    
    /**
     * 
     */
    function isCharacterAboveEnemy(thing, other) {
        return thing.bottom < other.top + other.toly;
    }
    
    /**
     * 
     */
    function isCharacterBumpingSolid(thing, other) {
        return thing.top + thing.toly + Math.abs(thing.yvel) > other.bottom;
    }
    
    /**
     * 
     * 
     * @remarks Similar to isThingOnThing, but more specifically used for
     *          characterTouchedSolid
     * @remarks This sets the character's .midx property
     */    function isSolidOnCharacter(thing, other) {
        // This can never be true if other is falling
        if(other.yvel >= 0) {
            return false;
        }
        
        // Horizontally, all that's required is for the other's midpoint to
        // be within the thing's left and right
        other.midx = thing.EightBitter.getMidX(other);
        if(other.midx <= thing.left || other.midx >= thing.right) {
            return false;
        }
        
        // If the thing's bottom is below the other's top, factoring
        // tolerance and velocity, that's false (this function assumes they're
        // already touching)
        if(thing.bottom - thing.yvel > other.top + other.toly - other.yvel) {
            return false;
        }
        
        // The above checks never caught falsities, so this must be true
        return true;
    }
    
    /**
     * 
     */
    function isCharacterAlive(thing) {
        return thing && thing.alive && !thing.dead;
    }
    

    /* Physics functions 
    */
    
    /**
     * 
     * 
     * @remarks This must be kept using "this.", since it can be applied to
     *          Quadrants during scrollWindow events.
     */
    function shiftBoth(thing, dx, dy) {
        if(!thing.noshiftx) {
            if(thing.parallax) {
                this.shiftHoriz(thing, thing.parallax * dx);
            } else {
                this.shiftHoriz(thing, dx);
            }
        }
        if(!thing.noshifty) {
            this.shiftVert(thing, dy);
        }
    }
    
    /**
     * 
     */
    function shiftThings(things, dx, dy) {
        for(var i = things.length - 1; i >= 0; i -= 1) {
            this.shiftBoth(things[i], dx, dy);
        }
    }
    
    /**
     * 
     */
    function shiftAll(dx, dy) {
        this.GroupHolder.callAll(this, shiftThings, dx, dy);
    }

    /**
     * 
     */
    function setWidth(thing, width, update_sprite, update_size) {        thing.width = width;
        thing.unitwidth = width * thing.EightBitter.unitsize;
        
        if(update_sprite) {
            thing.spritewidth = width;
            thing.spritewidthpixels = width * thing.EightBitter.unitsize;
        }
        
        if(update_size) {
            thing.EightBitter.updateSize(thing);
            // PixelDrawer.setThingSprite(thing);
            if(!window.warned_update_set_width) {
                console.log("Should update thing canvas on setWidth", thing.title);
                window.warned_update_set_width = true;
            }
        }
    }
    
    /**
     * 
     */
    function setHeight(thing, height, update_sprite, update_size) {
        thing.height = height;
        thing.unitheight = height * thing.EightBitter.unitsize;
        
        if(update_sprite) {
            thing.spriteheight = height;
            thing.spriteheightpixels = height * thing.EightBitter.unitsize;
        }
        
        if(update_size) {
            thing.EightBitter.updateSize(thing);
            // setThingSprite(thing);
            if(!window.warned_update_set_height) {
                console.log("Should update thing canvas on setHeight", thing.title);
                window.warned_update_set_height = true;
            }
        }
    }
    
    /**
     * 
     */
    function setSize(thing, width, height, update_sprite, update_size) {
        thing.EightBitter.setWidth(thing, width, update_sprite, update_size);
        thing.EightBitter.setHeight(thing, height, update_sprite, update_size);
    }
    
    /**
     * 
     */
    function updatePosition(thing, hard) {
        if(!thing.nomove || hard) {
            thing.EightBitter.shiftHoriz(thing, thing.xvel);
        }
        
        // if(!thing.nofall || hard) {
            thing.EightBitter.shiftVert(thing, thing.yvel);
        // }
    }
    
    /**
     * 
     */
    function updateSize(thing) {
        thing.unitwidth = thing.width * thing.EightBitter.unitsize;
        thing.unitheight = thing.height * thing.EightBitter.unitsize;
        thing.spritewidthpixels = thing.spritewidth * thing.EightBitter.unitsize;
        thing.spriteheightpixels = thing.spriteheight * thing.EightBitter.unitsize;
        
        if(thing.canvas !== undefined) {
            thing.canvas.width = thing.spritewidthpixels;
            thing.canvas.height = thing.spriteheightpixels;
            thing.EightBitter.PixelDrawer.setThingSprite(thing);
        }
    }
    
    /**
     * 
     */
    function reduceHeight(thing, dy, see) {
        thing.top += dy;
        thing.height -= dy / thing.EightBitter.unitsize;
        
        if(see) {
            thing.EightBitter.updateSize(thing);
        }
    }
    
    /**
     * 
     */
    function increaseHeight(thing, dy) {
        thing.top -= dy;
        thing.height += dy / thing.EightBitter.unitsize;
        thing.unitheight = thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function thingStoreVelocity(thing, keep_movement) {
        thing.xvel_old = thing.xvel || 0;
        thing.yvel_old = thing.yvel || 0;
        
        thing.nofall_old = thing.nofall || false;
        thing.nocollide_old = thing.nocollide || false;
        thing.movement_old = thing.movement || thing.movement_old;
        
        thing.nofall = thing.nocollide = true;
        thing.xvel = thing.yvel = false;
        
        if(!keep_movement) {
            thing.movement = false;
        }
    }
    
    /**
     * 
     */
    function thingRetrieveVelocity(thing, no_velocity) {
        if(!no_velocity) {
            thing.xvel = thing.xvel_old || 0;
            thing.yvel = thing.yvel_old || 0;
        }
        
        thing.movement = thing.movement_old || thing.movement;
        thing.nofall = thing.nofall_old || false;
        thing.nocollide = thing.nocollide_old || false;
    }
    
    /**
     * 
     */
    function setOpacity(thing, opacity) {
        thing.opacity = opacity;
        thing.canvas.opacity = opacity;
        thing.context.opacity = opacity;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }
    
    
    /* Collision reactions
    */
    
    /**
     * 
     */
    function gainLife(amount, nosound) {
        amount = Number(amount) || 1;
        
        this.StatsHolder.increase("lives", amount);
        
        if(!nosound) {
            this.AudioPlayer.play("Gain Life");
        }
    }
    
    /**
     * Basic function for Mario causing an item to jump slightly into the air, 
     * such as from hitting a solid below it. 
     * 
     * @param {Thing} thing
     * @remarks This simply moves the thing up slightly and decreases its
     *          y-velocity, without considering x-direction.
     */
    function itemJump(thing) {
        thing.yvel -= FullScreenMario.unitsize * 1.4;
        this.shiftVert(thing, -FullScreenMario.unitsize);
    }
    
    /**
     * 
     */
    function jumpEnemy(thing, other) {
        if(thing.keys.up) {
            thing.yvel = thing.EightBitter.unitsize * -1.4;
        } else {
            thing.yvel = thing.EightBitter.unitsize * -.7;
        }
        
        thing.xvel *= .91;
        thing.EightBitter.AudioPlayer.play("Kick");
        
        if(other.group !== "item" || other.shell) {
            thing.jumpcount += 1;
            thing.EightBitter.scoreOn(
                thing.EightBitter.findScore(thing.jumpcount + thing.jumpers),
                other
            );
        }
        
        thing.jumpers += 1;
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.jumpers -= 1;
        }, 1, thing);
    }
    
    /**
     * 
     */
    function playerShroom(thing) {
        if(thing.shrooming) {
            return;
        }
        
        thing.EightBitter.AudioPlayer.play("Powerup");
        thing.EightBitter.StatsHolder.increase("power");
        
        thing.EightBitter.scoreOn(1000, thing.EightBitter.player);
        
        if(thing.power < 3) {
            thing.shrooming = true;
            thing.power += 1;
            
            if(thing.power === 3) {
                thing.EightBitter.playerGetsFire(thing.EightBitter.player);
            } else {
                thing.EightBitter.playerGetsBig(thing.EightBitter.player);
            }
        }
    }
    
    /**
     * 
     */
    function playerShroom1Up(thing, other) {
        if(thing.player) {
            thing.EightBitter.gainLife(1);
        }
    }
    
    /**
     * 
     */
    function playerStarUp(thing, timeout) {
        thing.star += 1;
        
        thing.EightBitter.switchClass(thing, "normal", "star");
        
        thing.EightBitter.AudioPlayer.play("Powerup");
        thing.EightBitter.AudioPlayer.playTheme("Star", true);
        
        thing.EightBitter.TimeHandler.addClassCycle(thing, [
            "star1", "star2", "star3", "star4"
        ], "star", 5);
        
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.playerStarDown, 
            timeout || 560, 
            thing
        );
    }
    
    /**
     * 
     */
    function playerStarDown(thing, other) {
        if(!thing.player) {
            return;
        }
        
        thing.star -= 1;
        if(thing.star) {
            return;
        }
        
        thing.EightBitter.removeClasses(thing, "star star1 star2 star3 star4");
        thing.EightBitter.addClass(thing, "normal");
        
        thing.EightBitter.TimeHandler.clearClassCycle(thing, "star");
        
        thing.EightBitter.AudioPlayer.playTheme();
    }
    
    /**
     * 
     */
    function playerGetsBig(thing, no_animation) {
        thing.keys.down = 0;
        thing.EightBitter.setPlayerSizeLarge(thing);
        thing.EightBitter.removeClasses(thing, "crouching small");
        thing.EightBitter.updateBottom(thing, 0);
        thing.EightBitter.updateSize(thing);
        
        if(no_animation) {
            thing.EightBitter.addClass(thing, "large");
        } else {
            thing.EightBitter.playerGetsBigAnimation(thing);
        }
    }
    
    /**
     * 
     */
    function playerGetsBigAnimation(thing) {
        var stages = [
                'shrooming1', 'shrooming2', 'shrooming1', 'shrooming2',
                'shrooming3', 'shrooming2', 'shrooming3'
            ],
            i;
        
        thing.EightBitter.addClass(thing, "shrooming");
        thing.EightBitter.thingStoreVelocity(thing);
        
        // The last stage in the events clears it, resets movement, and stops
        stages.push(function (thing, stages) {
            thing.shrooming = stages.length = 0;
            
            thing.EightBitter.addClass(thing, "large");
            thing.EightBitter.removeClasses(thing, "shrooming shrooming3");
            thing.EightBitter.thingRetrieveVelocity(thing);
            
            return true;
        });
        
        thing.EightBitter.TimeHandler.addClassCycle(thing, stages, "shrooming", 6);
    }
    
    /**
     * 
     */
    function playerGetsSmall(thing) {
        console.warn("playerGetsSmall uses some global and global-style stuff.");
        console.warn("\tthingStoreVelocity, thingRetrieveVelocity, flicker");
        
        var bottom = thing.bottom;
        thing.keys.down = 0;
        thing.EightBitter.thingStoreVelocity(thing);
        
        // Step one
        thing.nocollidechar = true;
        thing.EightBitter.animateFlicker(thing);
        thing.EightBitter.removeClasses(thing, "running skidding jumping fiery");
        thing.EightBitter.addClasses(thing, "paddling small");
        
        // Step two (t+21)
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.EightBitter.removeClass(thing, "large");
            thing.EightBitter.setPlayerSizeSmall(thing);
            thing.EightBitter.setBottom(thing, bottom - FullScreenMario.unitsize);
        }, 21, thing);
        
        // Step three (t+42)
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.EightBitter.thingRetrieveVelocity(thing, false);
            thing.EightBitter.removeClass(thing, "paddling");
            if(thing.running || thing.xvel) {
                thing.EightBitter.addClass(thing, "running");
            }
            thing.EightBitter.PixelDrawer.setThingSprite(thing);
        }, 42, thing);
        
        // Step four (t+70)
        thing.EightBitter.TimeHandler.addEvent(function (thing) {
            thing.nocollidechar = false;
        }, 70, thing);
    }
    
    /**
     * 
     */
    function playerGetsFire(thing) {
        thing.shrooming = false;
        thing.EightBitter.removeClass(thing, "intofiery");
        thing.EightBitter.addClass(thing, "fiery");
    }
    
    /**
     * 
     */
    function setPlayerSizeSmall(thing) {
        thing.EightBitter.setSize(thing, 8, 8, true);
        thing.EightBitter.updateSize(thing);
    }
    
    /**
     * 
     */
    function setPlayerSizeLarge(thing) {
        thing.EightBitter.setSize(thing, 8, 16, true);
        thing.EightBitter.updateSize(thing);
    }
    
    /**
     * 
     */
    function animatePlayerRemoveCrouch() {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        EightBitter.player.crouching = false;
        EightBitter.player.toly = EightBitter.player.toly_old || 0;
        
        if(EightBitter.player.power !== 1) {
            EightBitter.setHeight(EightBitter.player, 16, true, true);
            EightBitter.player.EightBitter.removeClass(EightBitter.player, "crouching");
            EightBitter.player.EightBitter.updateBottom(EightBitter.player, 0);
            EightBitter.player.EightBitter.updateSize(EightBitter.player);
        }
    }
    
    /**
     * 
     * 
     * @param {Thing} thing   A character attached to other
     * @param {Other} other   A solid the thing is attached to
     */
    function unattachPlayer(thing, other) {
        thing.nofall = false;
        thing.nocollide = false;
        thing.skipoverlaps = false;
        thing.attachedSolid = undefined;
        thing.xvel = thing.keys.run;
        thing.movement = thing.EightBitter.movePlayer;
        
        thing.EightBitter.addClass(thing, "jumping");
        thing.EightBitter.removeClasses(thing, "climbing", "animated");
        
        other.attachedCharacter = undefined;
    }
    
    
    /* Spawn / activate functions
    */
    
    /**
     * 
     */
    function spawnHammerBro(thing) {
        thing.counter = 0;
        thing.gravity = thing.EightBitter.MapScreener.gravity / 2.1;
        thing.EightBitter.TimeHandler.addEvent(animateThrowingHammer, 35, thing, 7);
        thing.EightBitter.TimeHandler.addEventInterval(animateJump, 140, Infinity, thing);
    }
    
    /** 
     * 
     */
    function spawnBowser(thing) {
        thing.counter = 0;
        thing.EightBitter.TimeHandler.addEventInterval(thing.EightBitter.animateBowserJump, 117, Infinity, thing);
        thing.EightBitter.TimeHandler.addEventInterval(thing.EightBitter.animateBowserFire, 280, Infinity, thing);
        thing.EightBitter.TimeHandler.addEventInterval(thing.EightBitter.animateBowserFire, 350, Infinity, thing);
        thing.EightBitter.TimeHandler.addEventInterval(thing.EightBitter.animateBowserFire, 490, Infinity, thing);
    }
    
    /**
     * 
     */
    function spawnPiranha(thing) {
        thing.counter = 0;
        thing.direction = -.1;
    }
    
    /**
     * 
     */
    function spawnBlooper(thing) {
        thing.squeeze = 0;
        thing.counter = 0;
    }
    
    /**
     * 
     */
    function spawnPodoboo(thing) {
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.animatePodobooJumpUp,
            thing.frequency,
            Infinity,
            thing
        );
    }
    
    /**
     * 
     */
    function spawnLakitu(thing) {
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            if(thing.alive) {
                thing.EightBitter.animateLakituThrowingSpiny(thing);
            } else {
                return true;
            }
        }, 140, Infinity);
    }
    
    /**
     * 
     */
    function spawnCannon(thing) {
        if(!thing.nofire) {
            thing.EightBitter.TimeHandler.addEventInterval(
                thing.EightBitter.animateCannonFiring,
                thing.frequency,
                thing.frequency,
                thing
            );
        }
    }
    
    /**
     * 
     */
    function spawnCastleBlock(thing) {
        if(!thing.fireballs) {
            return;
        }
        
        var balls = new Array(thing.fireballs);
        
        for(var i = 0; i < thing.fireballs; i += 1) {
            balls[i] = thing.EightBitter.addThing("CastleFireball");
            thing.EightBitter.setMidObj(balls[i], thing);
        }
        
        if(thing.speed >= 0) {
            thing.dt = .07;
            thing.angle = .25;
        } else {
            thing.dt = -.07;
            thing.angle = -.25;
        }
        
        thing.EightBitter.TimeHandler.addEventInterval(
            thing.EightBitter.animateCastleBlock,
            Math.round(7 / Math.abs(thing.speed)),
            Infinity,
            thing,
            balls
        );
    }
    
    /**
     * 
     */
    function spawnDetector(thing) {
        thing.activate(thing);
        thing.EightBitter.killNormal(thing);
    }
    
    /**
     * 
     */
    function activateWindowDetector(thing) {
        if(thing.EightBitter.MapScreener.right - thing.EightBitter.MapScreener.left < thing.left) {
            console.log("ah", FSM.MapScreener.width, thing.left);
            return;
        }
        
        
        thing.activate(thing);
        thing.EightBitter.killNormal(thing);
    }
    
    /**
     * 
     */
    function activateScrollBlocker(thing) {
        thing.EightBitter.MapScreener.canscroll = false;
    }
    
    
    /* Collision functions
    */

    /**
     * // thing = character
     * // other = solid
     * 
     * @param {Thing} thing
     * @param {Thing} other
     */
    function hitCharacterSolid(thing, other) {
        // "Up" solids are special (they kill things that aren't their .up)
        if(other.up && thing !== other.up) {
            return thing.EightBitter.collideCharacterSolidUp(thing, other);
        }
        
        other.collide(thing, other);
        
        // If a character is bumping into the bottom, call that
        if(thing.undermid) {
            if(thing.undermid.bottomBump) {
                thing.undermid.bottomBump(thing.undermid, thing);
            }
        }
        else if(thing.under && thing.under.bottomBump) {
            thing.under.bottomBump(thing.under, thing);
        }
    }

    /**
     *  
     * @param {Thing} thing
     * @param {Thing} other
     */
    function hitCharacterCharacter(thing, other) {
        // The player calls the other's collide function, such as playerStar
        if(thing.player) {
            if(other.collide) {
                return other.collide(thing, other);
            }
        }
        // Otherwise just use thing's collide function
        else if(thing.collide) {
            thing.collide(other, thing);
        }
    }
    
    /**
     * 
     */
    function collideFriendly(thing, other) {
        if(thing.player) {
            if(other.action) {
                other.action(thing, other);
            }
            other.death(other);
        }
    }
    
    /**
     * 
     */
    function collideCharacterSolid(thing, other) {
        if(other.up === thing) {
            return;
        }
        
        // Character on top of solid
        if(thing.EightBitter.isCharacterOnSolid(thing, other)) {
            if(other.hidden && !other.collide_hidden) {
                return;
            }
            thing.resting = other;
            if(thing.onResting) {
                thing.onResting(thing, other);
            }
        }
        // Solid on top of character
        else if(thing.EightBitter.isSolidOnCharacter(other, thing)) {
            var midx = thing.EightBitter.getMidX(thing);
            
            if(midx > other.left && midx < other.right) {
                thing.undermid = other;
            } else if(other.hidden && !other.collide_hidden) {
                return;
            }
            
            if(!thing.under) {
                thing.under = [other];
            } else {
                thing.under.push(other);
            }
            
            if(thing.player) {
                thing.keys.jump = 0;
                thing.EightBitter.setTop(thing, other.bottom - thing.toly + other.yvel);
            }
            
            thing.yvel = other.yvel;
        }
        
        if(other.hidden && !other.collide_hidden) {
            return;
        }
        
        // Character bumping into the side of the solid
        if(!thing.EightBitter.isCharacterBumpingSolid(thing, other)
                && !thing.EightBitter.isThingOnThing(thing, other)
                && !thing.EightBitter.isThingOnThing(other, thing) && !thing.under) {
            
            // Character to the left of the solid
            if(thing.right <= other.right) {
                thing.xvel = Math.min(thing.xvel, 0);
                thing.EightBitter.shiftHoriz(thing,
                        Math.max(other.left + thing.EightBitter.unitsize - thing.right,
                        thing.EightBitter.unitsize / -2));
            }
            // Character to the right of the solid
            else {
                thing.xvel = Math.max(thing.xvel, 0);
                thing.EightBitter.shiftHoriz(thing,
                        Math.min(other.right - thing.EightBitter.unitsize - thing.left,
                        thing.EightBitter.unitsize / 2));
            }
            
            // Non-players flip horizontally
            if(!thing.player) {
                thing.moveleft = !thing.moveleft;
                // Some items require fancy versions (e.g. Shell)
                if(thing.group === "item") {
                    thing.collide(other, thing);
                }
            }
            // Players trigger other actions (e.g. Pipe -> mapExitPipeHorizontal)
            else if(other.actionLeft) {
                other.actionLeft(thing, other, other.transport);
            }
        }
    }
    
    /**
     * 
     */
    function collideCharacterSolidUp(thing, other) {
        switch(thing.group) {
            case "item":
                thing.EightBitter.animateCharacterHop(thing);
                thing.moveleft = thing.EightBitter.objectToLeft(thing, other);
                break;
            case "coin":
                thing.animate(thing);
                break;
            default:
                thing.EightBitter.scoreOn(thing.scoreBelow, thing);
                thing.death(thing, 2);
                break;
        }
    }
    
    /**
     * 
     */
    function collideCoin(thing, other) {
        if(thing.player) {
            thing.EightBitter.AudioPlayer.play("Coin");
            thing.EightBitter.StatsHolder.increase("score", 200);
            thing.EightBitter.StatsHolder.increase("coins", 1);
            thing.EightBitter.killNormal(other);
        }
    }
    
    /**
     * 
     */
    function collideStar(thing, other) {
        if(!thing.player || thing.star) {
            return;
        }
        
        thing.EightBitter.playerStarUp(thing);
    }
    
    /**
     * 
     * 
     * @remarks thing is character, other is fireball
     */
    function collideFireball(thing, other) {
        if(!thing.EightBitter.isCharacterAlive(thing) 
                || thing.height < thing.EightBitter.unitsize) {
            return;
        }
        
        if(thing.nofire) {
            if(thing.nofire > 1) {
                other.death(other);
            }
            return;
        }
        
        if(!thing.firedeath) {
            thing.EightBitter.AudioPlayer.playLocal("Bump", thing.EightBitter.getMidX(other));
        } else {
            thing.EightBitter.AudioPlayer.playLocal("Kick", thing.EightBitter.getMidX(other));
            thing.death(thing, 2);
            thing.EightBitter.scoreOn(thing.scoreFire, thing);
        }
        other.death(other);
    }
    
    /**
     * 
     */
    function collideShell(thing, other) {
        // If only one is a shell, it should be other, not thing
        if(thing.shell) {
            if(other.shell) {
                return thing.EightBitter.collideShellShell(thing, other);
            }
            return thing.EightBitter.collideShell(thing, other);
        }
        
        // Hitting a solid (e.g. wall) 
        if(thing.grouptype === "Solid") {
            return thing.EightBitter.collideShellSolid(thing, other);
        }
        
        // Hitting the player
        if(thing.player) {
            return thing.EightBitter.collideShellPlayer(thing, other);
        }
        
        // Assume anything else to be an enemy, which only moving shells kill
        if(other.xvel) {
            thing.EightBitter.killFlip(thing);
            if(thing.shellspawn) {
                thing = thing.EightBitter.killSpawn(thing);
            }
            
            thing.EightBitter.AudioPlayer.play("Kick");
            thing.EightBitter.scoreOn(thing.EightBitter.findScore(other.enemyhitcount), thing);
            other.enemyhitcount += 1;
        } else {
            thing.moveleft = thing.EightBitter.objectToLeft(thing, other);
        }
    }
    
    /**
     * 
     */
    function collideShellSolid(thing, other) {
        if(other.right < thing.right) {
            thing.EightBitter.AudioPlayer.playLocal("Bump", thing.left);
            thing.EightBitter.setRight(other, thing.left);
            other.xvel = -other.speed;
            other.moveleft = true;
        } else {
            thing.EightBitter.AudioPlayer.playLocal("Bump", thing.right);
            thing.EightBitter.setLeft(other, thing.right);
            other.xvel = other.speed;
            other.moveleft = false;
        }
    }
    
    /**
     * 
     */
    function collideShellPlayer(thing, other) {
        console.warn("collideShellPlayer uses some global-style functions.");
        var shelltoleft = thing.EightBitter.objectToLeft(other, thing),
            playerjump = thing.yvel > 0 && (
                thing.bottom <= other.top + thing.EightBitter.unitsize * 2
            );
        
        // Star players kill the shell no matter what
        if(thing.star) {
            thing.EightBitter.scorePlayerShell(thing, other);
            other.death(other, 2);
            return;
        }
        
        // If the shell is already being landed on by the player, see if it's
        // still being pushed to the side, or has reversed direction (is deadly)
        if(other.landing) {
            // Equal shelltoleft measurements: it's still being pushed
            if(other.shelltoleft === shelltoleft) {
                // Tepmorarily increase the landing count of the shell; if it is 
                // just being started, that counts as the score hit
                other.landing += 1;
                if(other.landing === 1) {
                    thing.EightBitter.scorePlayerShell(thing, other);
                }
                thing.EightBitter.TimeHandler.addEvent(function (other) {
                    other.landing -= 1;
                }, 2, other);
            }
            // Different shelltoleft measurements: it's deadly
            else {
                thing.death(thing);
            }
            return;
        }
        
        // If the shell is being kicked by the player, either by hitting a still
        // shell or jumping onto an already moving one
        if(other.xvel === 0 || playerjump) {
            // thing.EightBitter.scorePlayerShell(thing, other);
            
            // Reset any signs of peeking from the shell
            other.counting = 0;
            if(other.peeking) {
                other.peeking = false;
                thing.EightBitter.removeClass(other, "peeking");
                other.height -= thing.EightBitter.unitsize / 8;
                thing.EightBitter.updateSize(other);
            }
            
            // If the shell is standing still, make it move
            if(other.xvel === 0) {
                if(shelltoleft) {
                    other.moveleft = true;
                    other.xvel = -other.speed;
                } else {
                    other.moveleft = false;
                    other.xvel = other.speed;
                }
                other.hitcount += 1;
                thing.EightBitter.TimeHandler.addEvent(function (other) {
                    other.hitcount -= 1;
                }, 2, other);
            }
            // Otherwise it was moving, but should now be still
            else {
                other.xvel = 0;
            }
            
            // If the player is landing on the shell (with movements and xvels
            // already set), the player should then jump up a bit
            if(playerjump) {
                thing.EightBitter.AudioPlayer.play("Kick");
                
                if(!other.xvel) {
                    thing.EightBitter.jumpEnemy(thing, other);
                    thing.yvel *= 2;
                    // thing.EightBitter.scorePlayerShell(thing, other);
                    thing.EightBitter.setBottom(thing, other.top - thing.EightBitter.unitsize, true);
                } else {
                    // thing.EightBitter.scorePlayerShell(thing, other);
                }
                
                other.landing += 1;
                other.shelltoleft = shelltoleft;
                thing.EightBitter.TimeHandler.addEvent(function (other) {
                    other.landing -= 1;
                }, 2, other);
            }
        } 
        // Since the player is touching the shell normally, that's a death if
        // the shell isn't moving away
        else {
            if(!other.hitcount && (
                (shelltoleft && other.xvel > 0) 
                || (!shelltoleft && other.xvel < 0)
            )) {
                thing.death(thing);
            }
        }
    }
    
    /**
     * 
     */
    function collideShellShell(thing, other) {
        if(thing.xvel !== 0) {
            if(other.xvel !== 0) {
                var temp = thing.xvel;
                thing.xvel = other.xvel;
                other.xvel = temp;
                
                thing.EightBitter.shiftHoriz(thing, thing.xvel);
                thing.EightBitter.shiftHoriz(other, other.xvel);
            } else {
                thing.EightBitter.StatsHolder.increase("score", 500);
                other.death(other);
            }
        } else {
            thing.EightBitter.StatsHolder.increase("score", 500);
            thing.death(thing);
        }
    }
    
    /**
     * 
     */
    function collideEnemy(thing, other) {
        // If either is a player, make it thing (not other)
        if(!thing.player && other.player) {
            return thing.EightBitter.collideEnemy(thing, other);
        }
        
        // Death: nothing happens
        if(!thing.EightBitter.isCharacterAlive(thing)
            || !thing.EightBitter.isCharacterAlive(other)) {
            return;
        }
        
        // Items
        if(thing.group === "item") {
            if(thing.collide_primary) {
                return thing.collide(other, thing);
            }
            return;
        }
        
        if(!window.collideEnemyWarned) {
            window.collideEnemyWarned = true;
            console.warn("collideEnemy uses scoreEnemyStar, etc.");
        }
        // Player interacting with enemies
        if(thing.player) {
            // Player landing on top of an enemy
            if(!thing.EightBitter.MapScreener.underwater 
                && ((thing.star && !other.nostar)
                    || (!other.deadly && isThingOnThing(thing, other)))) {
                
                // Enforces toly (not touching means stop)
                if(thing.EightBitter.isCharacterAboveEnemy(thing, other)) {
                    return;
                }
                
                // A star player just kills the enemy, no matter what
                if(thing.star) {
                    other.nocollide = true;
                    other.death(other, 2);
                    thing.EightBitter.scoreOn(other.scoreStar, other);
                }
                // A non-star player kills the enemy with spawn, and hops
                else {
                    thing.EightBitter.setBottom(thing, 
                                Math.min(thing.bottom, 
                                        other.top + thing.EightBitter.unitsize));
                    thing.EightBitter.TimeHandler.addEvent(jumpEnemy, 0, thing, other);
                    
                    // thing.EightBitter.scoreOn(other.scoreStomp, other);
                    other.death(other, thing.star ? 2 : 0);
                    
                    thing.EightBitter.addClass(thing, "hopping");
                    thing.EightBitter.removeClasses(thing, "running skidding jumping one two three");
                    thing.hopping = true;
                    
                    if(thing.power === 1) {
                        thing.EightBitter.setPlayerSizeSmall(thing); 
                    }
                }
            }
            // Player being landed on by an enemy
            else if(!thing.EightBitter.isCharacterAboveEnemy(thing, other)) {
                thing.death(thing);
            }
        }
        // For non-players, it's just to characters colliding: they bounce
        else {
            thing.moveleft = thing.EightBitter.objectToLeft(thing, other);
            other.moveleft = !thing.moveleft;
        }
        
    }
    
    
    /**
     * 
     * @remarks thing is solid, other is character
     */
    function collideBottomBrick(thing, other) {
        if(other.solid && !thing.solid) {
            return thing.EightBitter.collideBottomBrick(other, thing);
        }
        
        if(thing.up || !other.player) {
            return;
        }
        
        thing.EightBitter.AudioPlayer.play("Bump");
        
        if(thing.used) {
            return;
        }
        
        thing.up = other;
        if(other.power > 1 && thing.breakable && !thing.contents) {
            thing.EightBitter.TimeHandler.addEvent(
                thing.EightBitter.killBrick, 2, thing, other
            );
            return;
        }
        
        thing.EightBitter.animateSolidBump(thing);
        
        if(thing.contents) {
            thing.EightBitter.TimeHandler.addEvent(function () {
                var output = thing.EightBitter.animateSolidContents(thing, other);
                
                if(thing.contents !== "Coin") {
                    thing.EightBitter.animateBlockBecomesUsed(thing);
                } else {
                    if(thing.lastcoin) {
                        thing.EightBitter.animateBlockBecomesUsed(thing);
                    } else {
                        thing.EightBitter.TimeHandler.addEvent(function () {
                            thing.lastcoin = true;
                        }, 245);
                    }
                }
            }, 7);
        }
    }
    
    /**
     * 
     */
    function collideBottomBlock(thing, other) {
        if(other.solid && !thing.solid) {
            return thing.EightBitter.collideBottomBlock(other, thing);
        }
        
        if(thing.up || !other.player) {
            return;
        }
        
        if(thing.used) {
            thing.EightBitter.AudioPlayer.play("Bump");
            return;
        }
        
        thing.used = true;
        thing.hidden = false;
        thing.up = other;
        
        thing.EightBitter.animateSolidBump(thing);
        thing.EightBitter.removeClass(thing, "hidden");
        thing.EightBitter.switchClass(thing, "unused", "used");
        thing.EightBitter.TimeHandler.addEvent(thing.EightBitter.animateSolidContents, 7, thing, other);
    }
    
    /**
     * 
     */
    function collideVine(thing, other) {
        if(!thing.player || thing.attachedSolid || thing.climbing) {
            return;
        }
        
        if(thing.bottom > other.bottom + thing.EightBitter.unitsize * 2) {
            return;
        }
        
        other.attachedCharacter = thing;
        thing.attachedSolid = other;
        
        thing.nofall = true;
        thing.skipoverlaps = true;
        thing.resting = undefined;
        
        // To the left of the vine
        if(thing.right < other.right) {
            thing.lookleft = false;
            thing.moveleft = false;
            thing.attachedDirection = -1;
            thing.EightBitter.unflipHoriz(thing);
        }
        // To the right of the vine
        else {
            thing.lookleft = true;
            thing.moveleft = true;
            thing.attachedDirection = 1;
            thing.EightBitter.flipHoriz(thing);
        }
        
        thing.EightBitter.addClass(thing, "climbing");
        thing.EightBitter.removeClasses(thing, "running", "jumping", "skidding");
        thing.EightBitter.thingStoreVelocity(thing);
        thing.EightBitter.TimeHandler.clearClassCycle(thing, "running");
        thing.EightBitter.TimeHandler.addClassCycle(thing, ["one", "two"], "climbing");
        
        thing.attachedLeft = !thing.EightBitter.objectToLeft(thing, other);
        thing.attachedOff = thing.attachedLeft ? 1 : -1;
        
        thing.movement = thing.EightBitter.movePlayerVine;
    }
    
    /**
     * 
     */
    function collideSpringboard(thing, other) {
        if(
            thing.player && thing.yvel >= 0 && !other.tension
            && thing.EightBitter.isCharacterOnSolid(thing, other)
        ) {
            other.tension = other.tensionSave = Math.max(
                thing.yvel * .77,
                thing.EightBitter.unitsize
            );
            thing.movement = thing.EightBitter.movePlayerSpringboardDown;
            thing.spring = other;
            thing.xvel /= 2.8;
        } else {
            thing.EightBitter.collideCharacterSolid(thing, other);
        }
    }
    
    /**
     * 
     * 
     * @notes thing is Player; other is the flag detector
     */
    function collideFlagTop(thing, other) {
        thing.star = true;
        thing.nocollidechar = true;
        thing.EightBitter.MapScreener.nokeys = true;
        thing.EightBitter.MapScreener.notime = true;
        
        thing.EightBitter.killNPCs();
        thing.EightBitter.thingStoreVelocity(thing);
        thing.EightBitter.setRight(thing, other.left + thing.EightBitter.unitsize * 2);
        
        thing.EightBitter.removeClasses(thing, "running jumping skidding");
        thing.EightBitter.addClass(thing, "climbing animated");
        thing.EightBitter.TimeHandler.addClassCycle(thing, ["one", "two"], "climbing");
        
        thing.EightBitter.AudioPlayer.pause();
        thing.EightBitter.AudioPlayer.play("Flagpole");
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize);
            
            if(thing.bottom > other.bottom) {
                thing.movement = false;
                thing.EightBitter.setBottom(thing, other.bottom);
                thing.EightBitter.TimeHandler.clearClassCycle(thing, "climbing");
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.collideFlagBottom(thing, other);
                }, 21);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * 
     */
    function collideFlagBottom(thing, other) {
        thing.keys.run = 1;
        thing.maxspeed = thing.walkspeed;
        
        thing.EightBitter.flipHoriz(thing);
        thing.EightBitter.shiftHoriz(thing, (thing.width + 1) * thing.EightBitter.unitsize);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.AudioPlayer.play("Stage Clear");
            thing.EightBitter.animatePlayerOffPole(thing, true);
        }, 14);
    }
    
    /**
     * 
     * 
     * @param {Thing} thing   player
     * @param {Thing} other   axe
     */
    function collideCastleAxe(thing, other) {
        if(!thing.EightBitter.isCharacterAlive(thing)) {
            return;
        }
        
        if(
            thing.right < other.left + other.EightBitter.unitsize
            || thing.bottom > other.bottom - other.EightBitter.unitsize
        ) {
            return;
        }
        
        thing.EightBitter.thingStoreVelocity(thing);
        thing.EightBitter.killNormal(other);
        thing.EightBitter.killNPCs();
        
        thing.EightBitter.MapScreener.nokeys = true;
        thing.EightBitter.MapScreener.notime = true;
        
        thing.EightBitter.AudioPlayer.playTheme("World Clear");
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.yvel = 0;
            thing.keys.run = 1;
            thing.maxspeed = thing.walkspeed;
            thing.EightBitter.thingRetrieveVelocity(thing);
            thing.EightBitter.MapScreener.canscroll = true;
        }, 140);
    }
    
    /**
     * 
     */
    function collideCastleDoor(thing, other) {
        var time = thing.EightBitter.StatsHolder.get("time"),
            timeStr = String(time),
            numFireworks = Number(timeStr[timeStr.length - 1]);
        
        thing.EightBitter.killNormal(thing);
        if(!thing.player) {
            return;
        }
        
        if(!(numFireworks === 1 || numFireworks === 3 || numFireworks === 6)) {
            numFireworks = 0;
        }
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.StatsHolder.decrease("time");
            thing.EightBitter.StatsHolder.increase("score", 50);
            thing.EightBitter.AudioPlayer.play("Coin");
            
            if(thing.EightBitter.StatsHolder.get("time") <= 0) {
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.animateEndLevelFireworks(thing, numFireworks);
                }, 35);
                return true;
            }
        }, 1, Infinity);
    }
    
    /** 
     * 
     */
    function collideCastleNPC(thing, other) {
        var text = other.text,
            interval = 21,
            i = 0;
        
        thing.keys.run = 0;
        thing.EightBitter.killNormal(other);
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            console.log("Placing text", i, text[i]);
            
            i += 1;
        }, interval, text.length);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.nextLevel();
        }, (interval * text.length) + 280)
    }
    
    /**
     * 
     */
    function collideTransport(thing, other) {
        thing.EightBitter.collideCharacterSolid(me, other);
        if(thing.resting !== other) {
            return;
        }

        other.xvel = thing.EightBitter.unitsize / 2;
        other.movement = thing.EightBitter.movePlatform;
        other.collide = thing.EightBitter.collideCharacterSolid;
    }
    
    /**
     * 
     * 
     * thing is character; other is detector
     */
    function collideDetector(thing, other) {
        if(!thing.player) {
            if(other.activate_fail) {
                other.activate_fail(thing);
            }
            return;
        }
        other.activate(thing, other);
        thing.EightBitter.killNormal(other);
    }
    
    /**
     * 
     */
    function collideLevelTransport(thing, other) {
        if(other.transport) {
            switch(other.transport.type) {
                case "location":
                    thing.EightBitter.setLocation(other.transport.value);
                    break;
                case "map":
                    thing.EightBitter.setMap(other.transport.value);
                    break;
                default:
                    throw new Error("Unknown transport type:", other.transport);
            }
        } else {
            thing.EightBitter.nextLevel();
        }
    }   
    
    
    /* Movement functions
    */
    
    /**
     * Base, generic movement function for simple characters. The Thing moves
     * at a constant rate in either the x or y direction, and switches direction
     * only if directed by the engine (e.g. when it hits a Solid)
     * 
     * @param {Thing} thing
     * @remarks thing.speed is the only required member attribute; .direction
     *          and .moveleft should be set by the game engine.
     *          * thing.direction - what direction it should be moving
     *          * thing.moveleft - what direction is actually is moving
     *          * thing.speed - the Thing's typical speed
     */
    function moveSimple(thing) {
        // If the thing is looking away from the intended direction, flip it
        if(thing.direction != thing.moveleft) {
            // thing.moveleft is truthy: it should now be looking to the right
            if(thing.moveleft) {
                thing.xvel = -thing.speed;
                if(!thing.noflip) {
                    thing.EightBitter.unflipHoriz(thing);
                }
            }
            // thing.moveleft is falsy: it should now be looking to the left
            else {
                thing.xvel = thing.speed;
                if(!thing.noflip) {
                    thing.EightBitter.flipHoriz(thing);
                }
            }
            thing.direction = thing.moveleft;
        }
    }
    
    /**
     * Extension of the moveSimple movement function for Things that shouldn't
     * fall off the edge of their resting blocks
     * @param {Thing} thing
     */
    function moveSmart(thing) {
        // Start off by calling moveSimple for normal movement
        moveSimple(thing);
        
        // If this isn't resting, it's the same as moveSimple
        if(!thing.resting) {
            return;
        }
        
        // Check for being over the edge in the direction of movement
        if(thing.moveleft) {
            if(thing.left + thing.EightBitter.unitsize <= thing.resting.left) {
                thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize);
                thing.moveleft = false;
            }
        } else {
            if(thing.right - thing.EightBitter.unitsize >= thing.resting.right) {
                thing.EightBitter.shiftHoriz(thing, -thing.EightBitter.unitsize);
                thing.moveleft = true;
            }
        }
    }
    
    /**
     * Extension of the moveSimple movement function for Things that should
     * jump whenever they hit a resting block.
     * @param {Thing} thing
     * @remarks thing.jumpheight is required to know how high to jump
     */
    function moveJumping(thing) {
        // Start off by calling moveSimple for normal movement
        thing.EightBitter.moveSimple(thing);
        
        // If .resting, jump!
        if(thing.resting) {
            thing.yvel = -Math.abs(thing.jumpheight);
            thing.resting = undefined;
        }
    }
    
    /**
     * 
     * 
     * @remarks thing.counter must be a number set elsewhere
     */
    function movePacing(thing) {
        thing.counter += .007;
        thing.xvel = Math.sin(Math.PI * thing.counter) / 2.1;
    }
    
    /**
     * 
     */
    function moveHammerBro(thing) {
        thing.EightBitter.movePacing(thing);
        thing.EightBitter.lookTowardsPlayer(thing);
        thing.nocollidesolid = thing.yvel < 0 || thing.falling;
    }
    
    /**
     * 
     */
    function moveBowser(thing) {
        thing.EightBitter.movePacing(thing);
    }
    
    /**
     * 
     */
    function moveBowserFire(thing) {
        if(Math.round(thing.bottom) === Math.round(thing.ylev)) {
            thing.movement = undefined;
            return;
        }
        thing.EightBitter.shiftVert(
            thing,
            Math.min(Math.max(0, thing.ylev - thing.bottom), thing.EightBitter.unitsize)
        );
    }
    
    /**
     * Initial movement function for Things that float up and down (vertically).
     * 
     * @param {Thing} thing
     * @remarks thing.begin and thing.end are used as the vertical endpoints;
     *          .begin is the bottom and .end is the top (since begin <= end)
     */
    function moveFloating(thing) {
        // // Make sure thing.begin <= thing.end
        // thing.EightBitter.setPlatformEndpoints(thing);
        
        // // Make thing.begin and thing.end relative to the area's floor
        // thing.begin = thing.EightBitter.MapScreener.floor * thing.EightBitter.unitsize - thing.begin;
        // thing.end = thing.EightBitter.MapScreener.floor * thing.EightBitter.unitsize - thing.end;
        
        // // Use moveFloatingReal as the actual movement function from now on
        // (thing.movement = thing.EightBitter.moveFloatingReal)(thing);
    }
    
    /**
     * Actual movement function for Things that float up and down (vertically).
     * If the Thing has reached thing.begin or thing.end, it gradually switches
     * thing.yvel
     * 
     * @param {Thing} thing
     * @remarks thing.maxvel is used as the maximum absolute speed vertically
     */
    function moveFloatingReal(thing) {
        // If above the endpoint:
        if(thing.top <= thing.end) {
            thing.yvel = Math.min(thing.yvel + thing.EightBitter.unitsize / 32, thing.maxvel);
        }
        // If below the endpoint:
        else if(thing.bottom >= thing.begin) {
            thing.yvel = Math.max(thing.yvel - thing.EightBitter.unitsize / 32, -thing.maxvel);
        }
        
        // Deal with velocities and whether the player is resting on this
        movePlatform(thing);
    }
    
    /**
     * Initial movement function for Things that float sideways (horizontally).
     * 
     * @param {Thing} thing
     * @remarks thing.begin and thing.end are used as the horizontal endpoints;
     *          .begin is the left and .end is the right (since begin <= end)
     */
    function moveSliding(thing) {
        // Make sure thing.begin <= thing.end
        thing.EightBitter.setPlatformEndpoints(thing);
        
        // Use moveSlidingReal as the actual movement function from now on
        (thing.movement = thing.EightBitter.moveSlidingReal)(thing);
    }
    
    /**
     * Actual movement function for Things that float sideways (horizontally).
     * If the Thing has reached thing.begin or thing.end, it gradually switches
     * thing.xvel
     * 
     * @param {Thing} thing
     * @remarks thing.maxvel is used as the maximum absolute speed horizontally
     */
    function moveSlidingReal(thing) {
        // If to the left of the endpoint:
        if(thing.EightBitter.MapScreener.left + thing.left <= thing.begin) {
            thing.xvel = Math.min(thing.xvel + thing.EightBitter.unitsize / 32, thing.maxvel);
        }
        // If to the right of the endpoint:
        else if(thing.EightBitter.MapScreener.left + thing.right > thing.end) {
            thing.xvel = Math.max(thing.xvel - thing.EightBitter.unitsize / 32, -thing.maxvel);
        }
        
        // Deal with velocities and whether the player is resting on this
        movePlatform(thing);
    }
    
    /**
     * Ensures thing.begin <= thing.end (so there won't be glitches pertaining
     * to them in functions like moveFloating and moveSliding
     * 
     * @param {Thing} thing
     */
    function setPlatformEndpoints(thing) {
        if(thing.begin > thing.end) {
            var temp = thing.begin;
            thing.begin = thing.end;
            thing.end = temp;
        }
    }
    
    /**
     * Moves a platform by its velocities, and checks for whether the player
     * is resting on it (if so, the player must be moved accordingly)
     * 
     * @param {Thing} thing
     */
    function movePlatform(thing) {
        thing.EightBitter.shiftHoriz(thing, thing.xvel);
        thing.EightBitter.shiftVert(thing, thing.yvel);
        
        // If the player is resting on this and this is alive, move the player
        if(thing === thing.EightBitter.player.resting && thing.EightBitter.player.alive) {
            thing.EightBitter.setBottom(thing.EightBitter.player, thing.top);
            thing.EightBitter.shiftHoriz(thing.EightBitter.player, thing.xvel);
            
            // If the player is too far to the right or left, stop that overlap
            if(thing.EightBitter.player.right > thing.EightBitter.MapScreener.innerWidth) {
                thing.EightBitter.setRight(
                    thing.EightBitter.player, 
                    thing.EightBitter.MapScreener.innerWidth
                );
            } else if(thing.EightBitter.player.left < 0) {
                thing.EightBitter.setLeft(thing.EightBitter.player, 0);
            }
        }
    }
    
    /**
     * 
     */
    function movePlatformSpawn(thing) {
        if(thing.bottom < 0) {
            thing.EightBitter.setTop(thing, thing.EightBitter.MapScreener.bottom_platform_max);
        } else if(thing.top > thing.EightBitter.MapScreener.bottom_platform_max) {
            thing.EightBitter.setBottom(thing, 0);
        } else {
            thing.EightBitter.movePlatform(thing);
            return;
        }
        
        if(thing.EightBitter.player && thing.EightBitter.player.resting === thing) {
            thing.EightBitter.player.resting = undefined;
        }
    }
    
    /**
     * 
     */
    function moveVine(thing) {
        thing.EightBitter.increaseHeight(thing, thing.speed);
        
        if(thing.attachedSolid) {
            thing.EightBitter.setBottom(thing, thing.attachedSolid.top);
        }
        
        if(thing.attachedCharacter) {
            thing.EightBitter.shiftVert(thing.attachedCharacter, -thing.speed); 
        }
    }
    
    /**
     * 
     */
    function moveSpringboardUp(thing) {
        var player = thing.EightBitter.player;
        
        thing.EightBitter.reduceHeight(thing, -thing.tension, true);
        thing.tension *= 2;
            
        // If the spring height is past the normal, it's done moving
        if(thing.height > thing.heightNormal) {
            thing.EightBitter.reduceHeight(
                thing, 
                (thing.height - thing.heightNormal) * thing.EightBitter.unitsize
            );
            if(thing === player.spring) {
                player.yvel = Math.max(
                    thing.EightBitter.unitsize * -2,
                    thing.tensionSave * -.98
                );
                player.resting = player.spring = undefined;
                player.movement = FullScreenMario.prototype.movePlayer;
            }
            thing.tension = 0;
            thing.movement = undefined;
        } else {
            thing.EightBitter.setBottom(player, thing.top);
        }
        
        if(thing === player.spring) {
            if(!thing.EightBitter.isThingTouchingThing(player, thing)) {
                player.spring = undefined;
                player.movement = FullScreenMario.prototype.movePlayer;
            }
        }
    }        /**     *      */    function moveFalling(thing) {        // If the player isn't resting on this thing (any more?), ignore it        if(thing !== player.resting) {            // Since the player might have been on this thing but isn't anymore,             // set the yvel to 0 just in case            thing.yvel = 0;            return;        }                // Since the player is on this thing, start falling more        thing.EightBitter.shiftVert(thing, thing.yvel += thing.EightBitter.unitsize / 8);        thing.EightBitter.setBottom(player, thing.top);                // After a velocity threshold, start always falling        if(thing.yvel >= thing.fall_threshold_start || thing.EightBitter.unitsize * 2.8) {            thing.freefall = true;            thing.movement = thing.EightBitter.moveFreeFalling;        }    }        /**     *      */    function moveFreeFalling(thing) {        // Accelerate downwards, increasing the thing's y-velocity        thing.yvel += thing.acceleration || thing.EightBitter.unitsize / 16;        thing.EightBitter.shiftVert(thing, thing.yvel);                // After a velocity threshold, stop accelerating        if(thing.yvel >= thing.fall_threshold_end || thing.EightBitter.unitsize * 2) {            thing.movement = movePlatform;        }    }
    
    /**
     * 
     */
    function moveShell(thing) {
        if(thing.xvel !== 0) {
            return;
        }
        thing.counting += 1;
        
        if(thing.counting === 350) {
            thing.peeking = true;
            thing.height += thing.EightBitter.unitsize / 8;
            thing.EightBitter.addClass(thing, "peeking");
            thing.EightBitter.updateSize(thing);
        } else if(thing.counting === 490) {
            thing.spawnsettings = {
                "smart": thing.smart
            };
            thing.EightBitter.killSpawn(thing);
        }
    }
    
    /**
     * 
     */
    function movePiranha(thing) {
        var bottom = thing.bottom,
            height = thing.height + thing.direction,
            at_end = false;
        
        if(height <= 0) {
            height = thing.height = 0;
            at_end = true;
        } else if(height >= thing.constructor.prototype.height) {
            height = thing.height = thing.constructor.prototype.height;
            at_end = true;
        }
        
        thing.EightBitter.setHeight(thing, height, true, true);
        thing.EightBitter.setBottom(thing, bottom);
        
        if(at_end) {
            thing.counter = 0;
            thing.movement = movePiranhaLatent;
        }
    }
    
    /**
     * 
     */
    function movePiranhaLatent(thing) {
        var playerx = thing.EightBitter.getMidX(thing.EightBitter.player);

        if (thing.counter >= thing.countermax
                && (thing.height > 0
                    || playerx < thing.left - thing.EightBitter.unitsize * 8
                    || playerx > thing.right + thing.EightBitter.unitsize * 8)) {
            thing.movement = undefined;
            thing.direction *= -1;
            
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.movement = thing.EightBitter.movePiranha;
            }, 7);
        } else {
            thing.counter += 1;
        }
    }
    
    /**
     * 
     */
    function moveBlooper(thing) {
        switch(thing.counter) {
            case 56: 
                thing.squeeze = true; 
                thing.counter += 1;
                break;
            case 63:
                thing.EightBitter.moveBlooperSqueezing(thing); 
                break;
            default: 
                thing.counter += 1;
                if(thing.top < thing.EightBitter.unitsize * 18) {
                    thing.EightBitter.moveBlooperSqueezing(thing);
                }
                break;
        }

        if(thing.squeeze) {
            thing.yvel = Math.max(thing.yvel + .021, .7); // going down
        } else {
            thing.yvel = Math.min(thing.yvel - .035, -.7); // going up
        }
        
        thing.EightBitter.shiftVert(thing, thing.yvel, true);

        if(!thing.squeeze) {
            if(thing.EightBitter.player.left > thing.right + thing.EightBitter.unitsize * 8) {
                // Go to the right
                thing.xvel = Math.min(thing.speed, thing.xvel + thing.EightBitter.unitsize / 32);
            }
            else if(thing.EightBitter.player.right < thing.left - thing.EightBitter.unitsize * 8) {
                // Go to the left
                thing.xvel = Math.max(-thing.speed, thing.xvel - thing.EightBitter.unitsize / 32);
            }
        }
    }
    
    /**
     * 
     */
    function moveBlooperSqueezing(thing) {
        if (thing.squeeze != 2) {
            thing.squeeze = 2;
            thing.EightBitter.addClass(thing, "squeeze");
            thing.EightBitter.setHeight(thing, 10, true, true);
        }
        
        if (thing.squeeze < 7) {
            thing.xvel /= 1.4;
        } else if (thing.squeeze === 7) {
            thing.xvel = 0;
        }
        
        thing.squeeze += 1;
        
        if (thing.top > thing.EightBitter.player.bottom || thing.bottom > 360) {
            thing.EightBitter.animateBlooperUnsqueezing(thing);
        }
    }
    
    /**
     * 
     */
    function movePodobooFalling(thing) {
        if(thing.top >= thing.starty) {
            thing.yvel = 0;
            thing.movement = undefined;
            thing.EightBitter.unflipVert(thing);
            thing.EightBitter.setTop(thing, thing.starty);
            return;
        }
        
        if(thing.yvel >= thing.speed) {
            thing.yvel = thing.speed;
            return;
        }
        
        if(!thing.flipVert && thing.yvel > 0) {
            thing.EightBitter.flipVert(thing);
        }
        
        thing.yvel += thing.acceleration;
    }
    
    /**
     * 
     */
    function moveLakitu(thing) {
        var player = thing.EightBitter.player;
        // If the player is moving quickly to the right, move in front and stay there
        if(
            player.xvel > thing.EightBitter.unitsize / 8
            && player.left > thing.EightBitter.MapScreener.width / 2
        ) {
            if(thing.left < player.right + thing.EightBitter.unitsize * 16) {
                // slide to xloc
                thing.EightBitter.slideToX(
                    thing,
                    player.right + player.xvel + thing.EightBitter.unitsize * 32,
                    player.maxspeed * 1.4
                );
                thing.counter = 0;
            }
        } else {
            thing.counter += .007;
            thing.EightBitter.slideToX(
                thing,
                player.left + player.xvel + Math.sin(Math.PI * thing.counter) * 117,
                player.maxspeed * .7
            );
        }
    }
    
    /**
     * 
     */
    function moveLakituInitial(thing) {
        if(thing.right < thing.EightBitter.player.left) {
            thing.counter = 0;
            thing.movement = thing.EightBitter.moveLakitu;
            thing.movement(thing);
            return;
        }
        
        thing.EightBitter.shiftHoriz(thing, -thing.EightBitter.unitsize);
    }
    
    /**
     * 
     */
    function moveCoinEmerge(thing, parent) {
        thing.EightBitter.shiftVert(thing, thing.yvel);
        if(parent && thing.bottom >= thing.blockparent.bottom) {
            thing.EightBitter.killNormal(thing);
        }
    }
    
    /**
     * 
     * 
     * This is one of the worst written functions in the engine. Kill me please.
     */
    function movePlayer(thing) {
        // Not jumping
        if(!thing.keys.up) {
            thing.keys.jump = 0;
        }
        // Jumping
        else if(thing.keys.jump > 0 
                && (thing.yvel <= 0 || thing.EightBitter.MapScreener.underwater)) {
            if(thing.EightBitter.MapScreener.underwater) {
                thing.EightBitter.animatePlayerPaddling(thing);
                thing.EightBitter.removeClass(thing, "running");
            }
            
            if(thing.resting) {
                if(thing.resting.xvel) {
                    thing.xvel += thing.resting.xvel;
                }
                thing.resting = undefined;
            }
            // Jumping, not resting
            else {
                if(!thing.jumping && !thing.EightBitter.MapScreener.underwater) {
                    thing.EightBitter.switchClass(thing, "running skidding", "jumping");
                }
                thing.jumping = true;
            }
            if(!thing.EightBitter.MapScreener.underwater) {
                thing.keys.jumplev += 1;
                var dy = FullScreenMario.unitsize 
                    / (Math.pow(thing.keys.jumplev, thing.EightBitter.MapScreener.jumpmod - .0014 * thing.xvel));
                thing.yvel = Math.max(thing.yvel - dy, thing.EightBitter.MapScreener.maxyvelinv);
            }
        }
      
        // Crouching
        if(thing.keys.crouch && !thing.crouching && thing.resting) {
            if(thing.power != 1) {
                thing.crouching = true;
                thing.EightBitter.addClass(thing, "crouching");
                thing.EightBitter.setHeight(thing, 11, true, true);
                thing.height = 11;
                thing.toly_old = thing.toly;
                thing.toly = thing.EightBitter.unitsize * 4;
                thing.EightBitter.updateBottom(thing, 0);
                thing.EightBitter.updateSize(thing);
            }
            // Pipe movement
            if(thing.resting.actionTop) {
                thing.resting.actionTop(thing, thing.resting);
            }
        }
      
        // Running
        var decel = 0 ; // (how much extra to decrease)
        // If a button is pressed, hold/increase speed
        if(thing.keys.run != 0 && !thing.crouching) {
            var dir = thing.keys.run,
                // No sprinting underwater
                sprinting = (thing.keys.sprint && !thing.EightBitter.MapScreener.underwater) || 0,
                adder = dir * (.098 * (sprinting + 1));
            
            // Reduce the speed, both by subtracting and dividing a little
            thing.xvel += adder || 0;
            thing.xvel *= .98;
            decel = .0007;
            
            // If you're accelerating in the opposite direction from your current velocity, that's a skid
            if((thing.keys.run > 0) == thing.moveleft) {
                if(!thing.skidding) {
                    thing.EightBitter.addClass(thing, "skidding");
                    thing.skidding = true;
                }
            }
            // Not accelerating: make sure you're not skidding
            else if(thing.skidding) {
                thing.EightBitter.removeClass(thing, "skidding");
                thing.skidding = false;
            }
        }
        // Otherwise slow down a bit
        else {
            thing.xvel *= .98;
            decel = .035;
        }

        if(thing.xvel > decel) {
            thing.xvel -= decel;
        } else if(thing.xvel < -decel) {
            thing.xvel += decel;
        } else if(thing.xvel != 0) {
            thing.xvel = 0;
            if(!thing.EightBitter.MapScreener.nokeys && thing.keys.run == 0) {
                if(thing.keys.left_down) {
                    thing.keys.run = -1;
                } else if(thing.keys.right_down) {
                    thing.keys.run = 1;
                }
            }  
        }
      
        // Movement mods
        // Slowing down
        if(Math.abs(thing.xvel) < .14) {
            if(thing.running) {
                thing.running = false;
                if(thing.power == 1) {
                    thing.EightBitter.setPlayerSizeSmall(thing);
                }
                thing.EightBitter.removeClasses(thing, "running skidding one two three");
                thing.EightBitter.addClass(thing, "still");
                thing.EightBitter.TimeHandler.clearClassCycle(thing, "running");
            }
        }
        // Not moving slowly
        else if(!thing.running) {
            thing.running = true;
            thing.EightBitter.switchClass(thing, "still", "running");
            thing.EightBitter.animatePlayerRunningCycle(thing);
            if(thing.power == 1) {
                thing.EightBitter.setPlayerSizeSmall(thing);
            }
        }
        if(thing.xvel > 0) {
            thing.xvel = Math.min(thing.xvel, thing.maxspeed);
            if(thing.moveleft && (thing.resting || thing.EightBitter.MapScreener.underwater)) {
                thing.EightBitter.unflipHoriz(thing);
                thing.moveleft = false;
            }
        }
        else if(thing.xvel < 0) {
            thing.xvel = Math.max(thing.xvel, thing.maxspeed * -1);
            if(!thing.moveleft && (thing.resting || thing.EightBitter.MapScreener.underwater)) {
                thing.moveleft = true;
                thing.EightBitter.flipHoriz(thing);
            }
        }
      
        // Resting stops a bunch of other stuff
        if(thing.resting) {
            // Hopping
            if(thing.hopping) {
                thing.hopping = false;
                thing.EightBitter.removeClass(thing, "hopping");
                if(thing.xvel) {
                    thing.EightBitter.addClass(thing, "running");
                }
            }
            // Jumping
            thing.keys.jumplev = thing.yvel = thing.jumpcount = 0;
            if(thing.jumping) {
                thing.jumping = false;
                thing.EightBitter.removeClass(thing, "jumping");
                if(thing.power == 1) {
                    thing.EightBitter.setPlayerSizeSmall(thing);
                }
                thing.EightBitter.addClass(thing, Math.abs(thing.xvel) < .14 ? "still" : "running");
            }
            // Paddling
            if(thing.paddling) {
                thing.paddling = thing.swimming = false;
                thing.EightBitter.TimeHandler.clearClassCycle(thing, "paddling");
                thing.EightBitter.removeClasses(thing, "paddling swim1 swim2");
                thing.EightBitter.addClass(thing, "running");
            }
        }
    }
    
    /**
     * 
     */
    function movePlayerVine(thing) {
        var attachedSolid = thing.attachedSolid,
            animatedClimbing;
        
        if(!attachedSolid) {
            thing.movement = thing.EightBitter.movePlayer;
            return;
        }
        
        if(thing.bottom < thing.attachedSolid.top) {
            thing.EightBitter.unattachPlayer(thing, thing.attachedSolid);
            return;
        }
        
        // Running away from the vine means dropping off
        if(thing.keys.run !== 0 && thing.keys.run === thing.attachedDirection) {
            // Leaving to the left
            if(thing.attachedDirection === -1) {
                thing.EightBitter.setRight(thing, attachedSolid.left - thing.EightBitter.unitsize);
            }
            // Leaving to the right
            else if(thing.attachedDirection === 1) {
                thing.EightBitter.setLeft(thing, attachedSolid.right + thing.EightBitter.unitsize);
            }
            
            thing.EightBitter.unattachPlayer(thing, attachedSolid);
            return;
        }
        
        // If the player is moving up, simply move up
        if(thing.keys.up) {
            animatedClimbing = true;
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / -4);
        }
        // If the thing is moving down, move down and check for unattachment
        else if(thing.keys.crouch) {
            animatedClimbing = true;
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / 2);
            if(thing.top > attachedSolid.bottom) {
                thing.EightBitter.unattachPlayer(thing, thing.attachedSolid);
            }
            return;
        } else {
            animatedClimbing = false;
        }
        
        if(animatedClimbing && !thing.animatedClimbing) {
            thing.EightBitter.addClass(thing, "animated");
        } else if(!animatedClimbing && thing.animatedClimbing) {
            thing.EightBitter.removeClass(thing, "animated");
        }
        
        thing.animatedClimbing = animatedClimbing;
        
        if(thing.bottom < thing.EightBitter.MapScreener.top - thing.EightBitter.unitsize * 4) {
            thing.EightBitter.setLocation(thing.attachedSolid.entrance);
        }
    }
    
    /**
     * 
     */
    function movePlayerSpringboardDown(thing) {
        var other = thing.spring;
        
        // If the player has moved off the spring, get outta here
        if(!thing.EightBitter.isThingTouchingThing(thing, other)) {
            thing.movement = thing.EightBitter.movePlayer;
            other.movement = thing.EightBitter.moveSpringboardUp;
            thing.spring = false;
            return;
        }
        
        // If the spring is fully contracted, go back up
        if(
            other.height < thing.EightBitter.unitsize * 2.5
            || other.tension < thing.EightBitter.unitsize / 32
        ) {
            thing.movement = undefined;
            other.movement = thing.EightBitter.moveSpringboardUp;
            return;
        }
        
        // Make sure it's hard to slide off
        if(
            thing.left < other.left + thing.EightBitter.unitsize * 2
            || thing.right > other.right - thing.EightBitter.unitsize * 2
        ) {
            thing.xvel /= 1.4;
        }
        
        thing.EightBitter.reduceHeight(other, other.tension, true);
        other.tension /= 2;
        thing.EightBitter.setBottom(thing, other.top);
        thing.EightBitter.updateSize(other);
    }
    
    
    // Animations
    
    /**
     * 
     */
    function animateSolidBump(thing) {
        var direction = -3;
        
        thing.EightBitter.TimeHandler.addEventInterval(function (thing) {
            thing.EightBitter.shiftVert(thing, direction);
            direction += .5;
            if(direction === 3.5) {
                thing.up = false;
                return true;
            }
        }, 1, Infinity, thing);
    }
    
    /**
     * 
     */
    function animateBlockBecomesUsed(thing) {
        thing.used = true;
        thing.EightBitter.switchClass(thing, "unused", "used");
    }
    
    /**
     * 
     */
    function animateSolidContents(thing, other) {
        var output;

        if(other && other.player && other.power > 1 && thing.contents === "Mushroom") {
            thing.contents = "FireFlower";
        }
        
        var output = thing.EightBitter.addThing(thing.contents);
        thing.EightBitter.setMidXObj(output, thing);
        thing.EightBitter.setTop(output, thing.top);
        output.blockparent = thing;
        output.animate(output, thing);
        
        return output;
    }
    
    /**
     * 
     */
    function animateBrickShards(thing) {
        var unitsize = thing.EightBitter.unitsize,
            shard,
            left, top,
            i;
        
        for(i = 0; i < 4; i += 1) {
            left = thing.left + (i < 2) * thing.width * unitsize - unitsize * 2;
            top = thing.top + (i % 2) * thing.height * unitsize - unitsize * 2;
            
            shard = thing.EightBitter.addThing("BrickShard", left, top);
            shard.xvel = shard.speed = unitsize / 2 - unitsize * (i > 1);
            shard.yvel = unitsize * -1.4 + i % 2;
            
            thing.EightBitter.TimeHandler.addEvent(thing.EightBitter.killNormal, 70, shard);
        }
    }
    
    /**
     * 
     */
    function animateEmerge(thing, other) {
        thing.nomove = thing.nocollide = thing.nofall = thing.alive = true;
        
        thing.EightBitter.flipHoriz(thing);
        thing.EightBitter.AudioPlayer.play("Powerup Appears");
        // thing.EightBitter.GroupHolder.switchObjectGroup(thing, "Scenery", "Character");
        thing.EightBitter.arraySwitch(thing, 
            thing.EightBitter.GroupHolder.getCharacterGroup(), 
            thing.EightBitter.GroupHolder.getSceneryGroup());
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / -8);
            
            // Only stop once the bottom has reached the solid's top
            if(thing.bottom > other.top) {
                return;
            }
            
            thing.EightBitter.setBottom(thing, other.top);
            thing.EightBitter.GroupHolder.switchObjectGroup(thing, "Scenery", "Character");
            thing.nomove = thing.nocollide = thing.nofall = thing.moveleft = false;
            
            if(thing.emergeOut) {
                thing.emergeOut(thing, other);
            }
            
            // Wait for movement until moveSimple moves this off the solid
            if(thing.movement) {
                thing.movementSave = thing.movement;
                thing.movement = thing.EightBitter.moveSimple;
                
                thing.EightBitter.TimeHandler.addEventInterval(function () {
                    if(thing.resting !== other) {
                        thing.EightBitter.TimeHandler.addEvent(function () {
                            thing.movement = thing.movementSave;
                        }, 1);
                        return true;
                    }
                }, 1, Infinity);
            }
            
            return true;
        }, 1, Infinity);
    }
    
    /**
     *
     */
    function animateEmergeCoin(thing, solid) {
        thing.nocollide = thing.alive = thing.nofall = true;
        thing.yvel -= thing.EightBitter.unitsize;
        
        thing.EightBitter.switchClass(thing, "still", "anim");
        thing.EightBitter.GroupHolder.switchObjectGroup(thing, "Character", "Scenery");
        
        thing.EightBitter.AudioPlayer.play("Coin");
        thing.EightBitter.StatsHolder.increase("coins", 1);
        thing.EightBitter.StatsHolder.increase("score", 200);
        
        thing.EightBitter.TimeHandler.clearClassCycle(thing, 0);
        thing.EightBitter.TimeHandler.addClassCycle(thing, [
            "anim1", "anim2", "anim3", "anim4", "anim3", "anim2"
        ], 0, 5);
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.moveCoinEmerge(thing, solid);
            return !thing.EightBitter.isCharacterAlive(thing);
        }, 1, Infinity);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.killNormal(thing);
        }, 49);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.yvel *= -1;
        }, 25);
    }
    
    /**
     * 
     */
    function animateEmergeVine(thing, solid) {
        // This allows the thing's movement to keep it on the solid
        thing.attachedSolid = solid;
        
        thing.EightBitter.setHeight(thing, 0);
        thing.EightBitter.AudioPlayer.play("Vine Emerging");
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.nocollide = false;
        }, 14);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.movement = undefined;
        }, 700);
    }
    
    /**
     * 
     */
    function animateFlicker(thing, cleartime, interval) {
        cleartime = Math.round(cleartime) || 49;
        interval = Math.round(interval) || 3;
        
        thing.flickering = true;
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.hidden = !thing.hidden;
        }, interval, cleartime);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.flickering = thing.hidden = false;
        }, cleartime * interval + 1);
    }
    
    /**
     * 
     * 
     * @remarks This could probably be re-written.
     */
    function animateThrowingHammer(thing, count) {
        if( 
            !thing.EightBitter.isCharacterAlive(thing)
            || thing.right < thing.EightBitter.unitsize * -32
        ) {
            return true;
        }
        
        if(count !== 3) {
            thing.EightBitter.switchClass(thing, "thrown", "throwing");
        }
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            if(!thing.EightBitter.isCharacterAlive(thing)) {
                return;
            }
            
            // Throw the hammer...
            if(count !== 3) {
                thing.EightBitter.switchClass(thing, "throwing", "thrown");
                thing.EightBitter.addThing(
                    ["Hammer", {
                        "xvel": thing.lookleft 
                            ? thing.EightBitter.unitsize / -1.4
                            : thing.EightBitter.unitsize / 1.4,
                        "yvel": thing.EightBitter.unitsize * -1.4,
                        "gravity": thing.EightBitter.MapScreener.gravity / 2.1
                    }],
                    thing.left - thing.EightBitter.unitsize * 2,
                    thing.top - thing.EightBitter.unitsize * 2
                );
            }
            
            // ...and go again
            if(count > 0) {
                thing.EightBitter.TimeHandler.addEvent(
                    thing.EightBitter.animateThrowingHammer,
                    7, thing, count - 1
                );
            } else {
                thing.EightBitter.TimeHandler.addEvent(
                    thing.EightBitter.animateThrowingHammer,
                    70, thing, 7
                );
                thing.EightBitter.removeClass(thing, "thrown");
            }
        }, 14);
    }
    
    /**
     * 
     */
    function animateBowserJump(thing) {
        if(!thing.EightBitter.isCharacterAlive(thing)) {
            return true;
        }
        
        if(!thing.resting || !thing.lookleft) {
            return;
        }
        
        thing.resting = undefined;
        thing.yvel = thing.EightBitter.unitsize * -1.4;
        
        // If there is a platform, don't bump into it
        thing.nocollidesolid = true;
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            if(thing.dead || thing.yvel > thing.EightBitter.unitsize) {
                thing.nocollidesolid = false;
                return true;
            }
        }, 3, Infinity);
    }
    
    /**
     * 
     */
    function animateBowserFire(thing) {
        if(thing.lookleft === false || !thing.EightBitter.player) {
            return;
        }
        
        if(
            !thing.EightBitter.isCharacterAlive(thing)
            || !thing.EightBitter.isCharacterAlive(thing.EightBitter.player)
        ) {
            return true;
        }
        
        // Close the mouth
        thing.EightBitter.addClass(thing, "firing");
        thing.EightBitter.AudioPlayer.playLocal("Bowser Fires", thing.left);
        
        // After a bit, re-open and fire
        thing.EightBitter.TimeHandler.addEvent(function () {
            var unitsize = thing.EightBitter.unitsize,
                ylev = Math.max(
                    -thing.height * unitsize,
                    Math.round(thing.EightBitter.player.bottom / (unitsize * 8)) * unitsize * 8
                );
            thing.EightBitter.removeClass(thing, "firing");
            thing.EightBitter.addThing(
                ["BowserFire", {
                    "ylev": ylev
                }],
                thing.left - thing.EightBitter.unitsize * 8,
                thing.top + thing.EightBitter.unitsize * 4
            );
        }, 14);
    }
    
    /**
     * 
     */
    function animateBowserFreeze(thing) {
        thing.nofall = true;
        thing.nothrow = true;
        thing.movement = false;
        thing.EightBitter.thingStoreVelocity(thing);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.nofall = false;
        }, 70);
    }
    
    /**
     * 
     */
    function animateJump(thing) {
        // Finish
        if(!thing.EightBitter.isCharacterAlive(thing)) {
            return true;
        }
        
        // Skip
        if(!thing.resting) {
            return;
        }
        
        // Jump up?
        if(
            thing.EightBitter.MapScreener.floor - (thing.bottom / thing.EightBitter.unitsize) >= 30
            && thing.resting.title !== "Floor"
            && Math.floor(thing.EightBitter.random() * 2)
        ) {
            thing.falling = true;
            thing.yvel = thing.EightBitter.unitsize * -.7;
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.falling = false;
            }, 42);
        }
        // Jump down
        else {
            thing.nocollidesolid = true;
            thing.yvel = thing.EightBitter.unitsize * -2.1;
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.nocollidesolid = false;
            }, 42);
        }
        
        thing.resting = undefined;
    }
    
    /**
     * 
     */
    function animateBlooperUnsqueezing(thing) {
        thing.counter = 0;
        thing.squeeze = false;
        
        thing.EightBitter.removeClass(thing, "squeeze");
        thing.EightBitter.setHeight(thing, 12, true, true);
    }
    
    /**
     * 
     */
    function animatePodobooJumpUp(thing) {
        thing.starty = thing.top;
        thing.yvel = thing.speed * -1;
        
        thing.EightBitter.TimeHandler.addEvent(
            thing.EightBitter.animatePodobooJumpDown,
            thing.jumpHeight, 
            thing
        );
    }
    
    /**
     * 
     */
    function animatePodobooJumpDown(thing) {
        thing.movement = thing.EightBitter.movePodobooFalling;
    }
    
    /**
     * 
     */
    function animateLakituThrowingSpiny(thing) {
        thing.EightBitter.switchClass(thing, "out", "hiding");
        thing.EightBitter.TimeHandler.addEvent(function () {
            if(thing.dead) {
                return;
            }
            var spawn = thing.EightBitter.addThing("SpinyEgg", thing.left, thing.top);
            spawn.yvel = thing.EightBitter.unitsize * -2.1;
            thing.EightBitter.switchClass(thing, "hiding", "out");
        }, 21);
    }
    
    /**
     * 
     */
    function animateSpinyEggHatching(thing) {
        var spawn = thing.EightBitter.addThing("Spiny", thing.left, thing.top - thing.yvel);
        spawn.moveleft = thing.EightBitter.objectToLeft(thing.EightBitter.player, spawn);
        thing.EightBitter.killNormal(thing);
    }
    
    /**
     * 
     */
    function animateFireballEmerge(thing) {
        thing.EightBitter.AudioPlayer.play("Fireball");
    }
    
    /**
     * 
     */
    function animateFireballExplode(thing, level) {
        thing.EightBitter.killNormal(thing);
        if(level === 2) {
            return;
        }
        
        var output = thing.EightBitter.addThing("Firework");
        thing.EightBitter.setMidXObj(output, thing);
        thing.EightBitter.setMidYObj(output, thing);
        output.animate(output);
    }
    
    /**
     * 
     */
    function animateFirework(thing) {
        var name = thing.className + " n",
            i;
        
        for(i = 0; i < 3; i += 1) {
            thing.EightBitter.TimeHandler.addEvent(function (i) {
                thing.EightBitter.setClass(thing, name + String(i + 1));
            }, i * 7, i);
        }
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.killNormal(thing);
        }, i * 7);
    }
    
    /**
     * 
     */
    function animateEndLevelFireworks(thing, numFireworks) {
        var flag = thing.EightBitter.addThing("CastleFlag", 
                thing.left,
                thing.top - thing.EightBitter.unitsize * 30),
            flagMovements = 40,
            fireInterval = 42,
            fireworkPositions = [
                [0, -48],
                [-8, -40],
                [8, -40],
                [-8, -32],
                [0, -48],
                [-8, -40]
            ],
            i = 0,
            firework;
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftVert(flag, thing.EightBitter.unitsize * -.25);
        }, 1, flagMovements);
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            firework = thing.EightBitter.addThing("Firework",
                thing.left + fireworkPositions[i][0] * thing.EightBitter.unitsize,
                thing.top + fireworkPositions[i][1] * thing.EightBitter.unitsize);
            firework.animate(firework);
            i += 1;
        }, fireInterval, numFireworks);
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.AudioPlayer.addEventImmediate("Stage Clear", "ended", function () {
                thing.EightBitter.nextLevel();
            });
        }, i * fireInterval + 420);
    }
    
    /**
     * 
     */
    function animateCannonFiring(thing) {
        // Don't fire if Player is too close
        if(
            thing.EightBitter.player.right > thing.left - thing.EightBitter.unitsize * 8
            && thing.EightBitter.player.left < thing.right + thing.EightBitter.unitsize * 8
        ) {
            return;
        }
        
        var spawn = thing.EightBitter.ObjectMaker.make("BulletBill");
        if(thing.EightBitter.objectToLeft(thing.EightBitter.player, thing)) {
            spawn.direction = spawn.moveleft = true;
            spawn.xvel *= -1;
            thing.EightBitter.flipHoriz(spawn);
            thing.EightBitter.addThing(spawn, thing.left, thing.top);
        } else {
            thing.EightBitter.addThing(spawn, thing.left + thing.width, thing.top);
        }
        
        thing.EightBitter.AudioPlayer.playLocal("Bump", thing.right);
    }
    
    /**
     * 
     */
    function animatePlayerFire(thing) {
        if(thing.numballs >= 2) {
            return;
        }
        
        thing.numballs += 1;
        thing.EightBitter.addClass(thing, "firing");
        
        var ball = thing.EightBitter.ObjectMaker.make("Fireball", {
                "moveleft": thing.moveleft,
                "speed": thing.EightBitter.unitsize * 1.75,
                "jumpheight": thing.EightBitter.unitsize * 1.56,
                // "gravity": thing.EightBitter.MapScreener.gravity * 1.56, // not there!
                "gravity": thing.EightBitter.MapScreener.gravity * 1.56,
                "yvel": thing.EightBitter.unitsize,
                "movement": thing.EightBitter.moveJumping
            }),
            xloc = thing.moveleft
                ? (thing.left - thing.EightBitter.unitsize / 4)
                : (thing.right + thing.EightBitter.unitsize / 4);
        
        thing.EightBitter.addThing(ball, xloc, thing.top + thing.EightBitter.unitsize * 8);
        ball.animate(ball);
        ball.onDelete = function () {
            thing.numballs -= 1;
        };
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.removeClass(thing, "firing");
        }, 7);
    }
    
    /**
     * 
     */
    function animateCastleBlock(thing, balls) {
        var ax = Math.cos(thing.angle * Math.PI) * thing.EightBitter.unitsize * 4,
            ay = Math.sin(thing.angle * Math.PI) * thing.EightBitter.unitsize * 4,
            i;
        
        for(i = 1; i < balls.length; i += 1) {
            thing.EightBitter.setMidX(balls[i], thing.left + ax * i);
            thing.EightBitter.setMidY(balls[i], thing.top + ay * i);
        }
        
        thing.angle += thing.dt;
    }
    
    /**
     * 
     */
    function animateCastleBridgeOpen(thing) {
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.EightBitter.TimeHandler.addEventInterval(function () {
                thing.right -= thing.EightBitter.unitsize * 2;
                thing.EightBitter.setWidth(thing, thing.width - 2);
                
                if(thing.width <= 0) {
                    return true;
                }
            }, 1, Infinity);
        }, 7);
    }
    
    /**
     * 
     */
    function animateCastleChainOpen(thing) {
        thing.EightBitter.TimeHandler.addEvent(killNormal, 7, thing);
    }
    
    /**
     * 
     */
    function animatePlayerPaddling(thing) {
        if(!thing.paddling) {
            thing.EightBitter.removeClass(thing, "skidding paddle1 paddle2 paddle3 paddle4 paddle5");
            thing.EightBitter.addClass(thing, "paddling");
            thing.EightBitter.TimeHandler.clearClassCycle(thing, "paddling_cycle");
            thing.EightBitter.TimeHandler.addClassCycle(thing, 
                ["paddle1", "paddle2", "paddle3", "paddle2", "paddle1",
                function () {
                    return thing.paddling = false;
                },
                "paddling_cycle", 3]);
        }
        thing.paddling = thing.swimming = true;
        thing.yvel = thing.EightBitter.unitsize * -.84;
    }
    
    /**
     * 
     */
    function animatePlayerLanding(thing) {
        if(thing.EightBitter.MapScreener.underwater) {
            thing.EightBitter.removeClass(thing, "paddling");
        }
    }
    
    /**
     * 
     */
    function animatePlayerBubbling(thing) {
        thing.EightBitter.addThing("Bubble", thing.right, thing.top);
    }
    
    /**
     * 
     */
    function animatePlayerRunningCycle(thing) {
        thing.running = thing.EightBitter.TimeHandler.addClassCycle(thing, [
            "one", "two", "three", "two"
        ], "running", function (event) {
            event.timeout = 5 + Math.ceil(thing.maxspeedsave - Math.abs(thing.xvel));
        });
    }
    
    /**
     * 
     */
    function animateCharacterHop(thing) {
        thing.resting = undefined;
        thing.yvel = thing.EightBitter.unitsize * -1.4;
    }
    
    /**
     * 
     */
    function animatePlayerPipingStart(thing) {
        thing.nocollide = thing.nofall = true;
        thing.xvel = thing.yvel = 0;
        thing.movementOld = thing.movement;
        thing.movement = undefined;
        
        thing.EightBitter.GroupHolder.switchObjectGroup(thing, "Character", "Scenery");
        thing.EightBitter.TimeHandler.clearAllCycles(thing);
    }
    
    /**
     * 
     */
    function animatePlayerPipingEnd(thing) {
        thing.movement = thing.movementOld;
        
        thing.nocollide = thing.nofall = false;
        
        thing.EightBitter.GroupHolder.switchObjectGroup(thing, "Scenery", "Character");
    }
    
    /**
     * 
     */
    function animatePlayerOffPole(thing, doRun) {
        thing.EightBitter.removeClasses(thing, "climbing running");
        thing.EightBitter.addClass(thing, "jumping");
        
        thing.xvel = 1.4;
        thing.yvel = -1.4;
        thing.nocollide = thing.nofall = false;
        thing.gravity = thing.EightBitter.MapScreener.gravity / 14;
        
        thing.EightBitter.TimeHandler.addEvent(function () {
            thing.movement = thing.EightBitter.movePlayer;
            thing.gravity = thing.EightBitter.MapScreener.gravity;
            
            thing.EightBitter.unflipHoriz(thing);
            
            if(doRun) {
                thing.EightBitter.addClass(thing, "running");
                thing.EightBitter.animatePlayerRunningCycle(thing);
            }
        }, 21);
    }
    
    
    /* Appearance utilities
    */
    
    /**
     * 
     */
    function setTitle(thing, string) {
        thing.title = string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }
    
    /**
     * 
     */
    function setClass(thing, string) {
        thing.className = string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }
    
    /**
     * 
     */
    function setClassInitial(thing, string) {
        thing.className = string;
    }
    
    /**
     * 
     */
    function addClass(thing, string) {
        thing.className += " " + string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }
    
    /**
     * 
     */
    function addClasses(thing) {
        var strings, arr, i, j;
        for(i = 1; i < arguments.length; i += 1) {
            arr = arguments[i];
            
            if(!(arr instanceof Array)) {
                arr = arr.split(' ');
            }
            
            for(j = arr.length - 1; j >= 0; j -= 1) {
                thing.EightBitter.addClass(thing, arr[j]);
            }
        }
    }
    
    /**
     * 
     */
    function removeClass(thing, string) {
        if(!string) {
            return;
        }
        if(string.indexOf(" ") !== -1) {
            thing.EightBitter.removeClasses(thing, string);
        }
        thing.className = thing.className.replace(new RegExp(" " + string, "gm"), "");
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }
    
    /**
     * 
     */
    function removeClasses(thing) {
      var strings, arr, i, j;
      for(i = 1; i < arguments.length; ++i) {
        arr = arguments[i];
        if(!(arr instanceof Array)) {
            arr = arr.split(" ");
        }
        for(j = arr.length - 1; j >= 0; --j)
          thing.EightBitter.removeClass(thing, arr[j]);
      }
    }
    
    /**
     * 
     */
    function switchClass(thing, string_out, string_in) {
        thing.EightBitter.removeClass(thing, string_out);
        thing.EightBitter.addClass(thing, string_in);
    }
    
    /**
     * 
     */
    function flipHoriz(thing) {
        thing.flipHoriz = true;
        thing.EightBitter.addClass(thing, "flipped");
    }
    
    /**
     * 
     */
    function flipVert(thing) {
        thing.flipVert = true;
        thing.EightBitter.addClass(thing, "flip-vert");
    }
    
    /**
     * 
     */
    function unflipHoriz(thing) {
        thing.flipHoriz = false;
        thing.EightBitter.removeClass(thing, "flipped");
    }
    
    /**
     * 
     */
    function unflipVert(thing) {
        thing.flipVert = false;
        thing.EightBitter.removeClass(thing, "flip-vert");
    }
    
    /**
     * 
     */
    function lookTowardsThing(thing, other) {
        // Case: other is to the left
        if(other.right <= thing.left) {
            thing.lookleft = true;
            thing.moveleft = true;
            thing.EightBitter.unflipHoriz(thing);
        }
        // Case: other is to the right
        else if(other.left >= thing.right) {
            thing.lookleft = false;
            thing.moveleft = false;
            thing.EightBitter.flipHoriz(thing);
        }
    }
    
    /**
     * 
     */
    function lookTowardsPlayer(thing, big) {
        // Case: Player is to the left
        if(thing.EightBitter.player.right <= thing.left) {
            if(!thing.lookleft || big) {
                thing.lookleft = true;
                thing.moveleft = false;
                thing.EightBitter.unflipHoriz(thing);
            }
        }
        // Case: Player is to the right
        else if(thing.EightBitter.player.left >= thing.right) {
            if(thing.lookleft || big) {
                thing.lookleft = false;
                thing.moveleft = true;
                thing.EightBitter.flipHoriz(thing);
            }
        }
    }
    
    
    /* Death functions
    */
    
    /**
     * 
     */
    function killNormal(thing) {
        if(!thing) {
            return;
        }
        
        thing.hidden = thing.dead = true;
        thing.alive = thing.resting = thing.movement = false;
        
        if(thing.EightBitter) {
            thing.EightBitter.TimeHandler.clearAllCycles(thing);
        }
    }
    
    /**
     * 
     */
    function killFlip(thing, extra) {
        thing.EightBitter.flipVert(thing);
        
        if(!extra) {
            extra = 0;
        }
        
        if(thing.bottomBump) {
            thing.bottomBump = undefined;
        }
        
        thing.nocollide = thing.dead = true;
        thing.resting = thing.movement = thing.speed = thing.xvel = thing.nofall = false;
        thing.yvel -= thing.EightBitter.unitsize;
        thing.EightBitter.TimeHandler.addEvent(thing.EightBitter.killNormal, 70 + extra, thing);
    }
    
    /**
     * 
     */
    function killSpawn(thing, big) {
        if(big) {
            thing.EightBitter.killNormal(thing);
            return;
        }
        
        if(thing.spawntype) {
            var spawn = thing.EightBitter.ObjectMaker.make(
                thing.spawntype, thing.spawnsettings || {}
            );
            thing.EightBitter.addThing(spawn);
            thing.EightBitter.setBottom(spawn, thing.bottom);
            thing.EightBitter.setMidXObj(spawn, thing);
        } else {
            console.warn("Thing " + thing.title + " has no .spawntype.");
        }
        
        thing.EightBitter.killNormal(thing);
        
        return spawn;
    }
    
    /**
     * 
     */
    function killGoomba(thing, big) {
        if(big) {
            thing.EightBitter.killFlip(thing);
            return;
        }
        
        thing.EightBitter.killSpawn(thing);
    }
    
    /**
     * For now, this just returns killToShell. In the future it should
     * intelligently remove flying from the Koopa if need be.
     * If thing.jumping is true when hopped upon while flying, it should
     * be reduced to jumping; otherwise it should be reduced to walking.
     */
    function killKoopa(thing, big) {
        return thing.EightBitter.killToShell(thing, big);
    }
    
    /**
     * 
     */
    function killBowser(thing, big) {
        if(big) {
            thing.nofall = false;
            thing.movement = undefined;
            thing.EightBitter.killFlip(thing);
            return;
        }
        
        thing.deathcount += 1;
        if(thing.deathcount === 5) {
            thing.yvel = 0;
            thing.speed = 0;
            thing.movement = 0;
            thing.EightBitter.killFlip(thing, 350);
            thing.EightBitter.scoreOn(5000, thing);
        }
    }
    
    /**
     * 
     */
    function killToShell(thing, big) {
        var spawn;
        
        thing.spawnsettings = {
            "smart": thing.smart
        };
            
        if(thing.winged || (big && big !== 2)) {
            thing.spawntype = thing.title;
        } else {
            thing.spawntype = thing.shelltype || "Shell";
        }
        spawn = thing.EightBitter.killSpawn(thing);
        
        thing.EightBitter.killNormal(thing);
        
        if(big === 2) {
            thing.EightBitter.killFlip(spawn);
        }
    }
    
    /**
     * Wipes the screen of any characters or solids that should be gone during
     * an important cutscene, such as hitting an end-of-level flag.
     * For characters, they're deleted if .nokillonend isn't truthy. If they
     * have a .killonend function, that's called on them.
     * Solids are only deleted if their .killonend is true.
     * 
     * @remarks If thing.killonend is a function, it is called on the thing.
     * @todo   Rename .killonend to be more accurate
     */
    function killNPCs() {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            group, thing, i;
        
        // Characters: they must opt out of being killed with .nokillonend, and
        // may opt into having a function called instead (such as Lakitus).
        group = EightBitter.GroupHolder.getCharacterGroup();
        for(i = group.length - 1; i >= 0; --i) {
            thing = group[i];
            
            if(!thing.nokillend) {
                thing.EightBitter.arrayDeleteMember(thing, group, i);
            } else if(thing.killonend) {
                thing.killonend(thing);
            }
        }
        
        // Solids: they may opt into being deleted
        group = EightBitter.GroupHolder.getSolidGroup();
        for(i = group.length - 1; i >= 0; --i) {
            thing = group[i];
            
            if(thing.killonend) {
                if(thing.killonend instanceof Function) {
                    thing.killonend(thing, group, i);
                } else {
                    thing.EightBitter.arrayDeleteMember(thing, group, i);
                }
            }
        }
    }
    
    /**
     * 
     */
    function killBrick(thing, other) {
        thing.EightBitter.AudioPlayer.play("Break Block");
        thing.EightBitter.TimeHandler.addEvent(thing.EightBitter.animateBrickShards, 1, thing);
        thing.EightBitter.killNormal(thing);
        
        if(other instanceof thing.EightBitter.ObjectMaker.getFunction("Thing")) {
            thing.up = other;
        } else {
            thing.up = undefined;
        }
    }
    
    /**
     * 
     */
    function killPlayer(thing, big) {
        if(!thing.alive || thing.flickering || thing.dying) {
            return;
        }
        console.warn("killPlayer still uses global gravity, characters, setMap, gameOver");
        
        // Large big: real, no-animation death
        if(big == 2) {
            thing.EightBitter.MapScreener.notime = true;
            thing.dead = thing.dying = true;
        }
        // Regular big: regular (enemy, time, etc.) kill
        else {
            // If the player can survive this, just power down
            if(!big && thing.power > 1) {
                thing.power = 1;
                thing.EightBitter.AudioPlayer.play("Power Down");
                thing.EightBitter.playerGetsSmall(thing);
                return;
            }
            // The player can't survive this: animate a death
            else {
                thing.dying = true;
                
                thing.EightBitter.setSize(thing, 7.5, 7, true);
                thing.EightBitter.updateSize(thing);
                thing.EightBitter.setClass(thing, "character player dead");
                thing.EightBitter.thingStoreVelocity(thing);
                thing.EightBitter.arrayToEnd(thing, thing.EightBitter.GroupHolder.getGroup(thing.grouptype));
                
                thing.EightBitter.MapScreener.notime = true;
                thing.EightBitter.MapScreener.nokeys = true;
                
                thing.EightBitter.TimeHandler.clearAllCycles(thing);
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.thingRetrieveVelocity(thing, true);
                    thing.nocollide = true;
                    thing.movement = thing.resting = undefined;
                    thing.gravity = thing.EightBitter.MapScreener.gravity / 2.1;
                    thing.yvel = FullScreenMario.unitsize * -1.4;
                }, 7);
            }
        }
        
        thing.nocollide = thing.nomove = 1;
        thing.EightBitter.MapScreener.nokeys = true;
        thing.EightBitter.AudioPlayer.pause();
        thing.EightBitter.StatsHolder.decrease("lives");
        
        if(thing.EightBitter.StatsHolder.get("lives") > 0) {
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.EightBitter.setMap();
            }, 280);
        } else {
            thing.EightBitter.TimeHandler.addEvent(function () {
                thing.EightBitter.gameOver();
            }, 280);
        }
    }
    
    
    /* Scoring
    */
    
    /**
     * 
     */
    function findScore(level) {
        if(level < this.point_levels.length) {
            return this.point_levels[level];
        } else {
            this.gainLife(1);
        }
    }
    
    /**
     * Driver function to score some number of points for the player and show
     * the gains via an animation.
     * 
     * @param {Number} value   How many points the player is receiving.
     * @param {Boolean} continuation   Whether the game shouldn't increase the 
     *                                 score amount in the StatsHoldr (this will
     *                                 only be false on the first score() call).
     * @remarks   For point gains that should not have a visual animation, 
     *            directly call StatsHolder.increase("score", value).
     * @remarks   The calling chain will be: 
     *                score -> scoreOn -> scoreAnimateOn -> scoreAnimate          
     */
    function score(value, continuation) {
        console.warn("Score still using global player");
        if(!value) {
            return;
        }
        scoreOn(value, player, true);
        
        if(!continuation) {
            this.StatsHolder.increase("score", value);
        }
    }
    
    /**
     * Scores a given number of points for the player, and shows the gains via
     * an animation centered at the top of a thing.
     * 
     * @param {Number} value   How many points the player is receiving.
     * @param {Thing} thing   An in-game Thing to place the visual score text
     *                        on top of and centered.
     * @param {Boolean} continuation   Whether the game shouldn't increase the 
     *                                 score amount in the StatsHoldr (this will
     *                                 only be false on the first score() call).
     * @remarks   The calling chain will be: 
     *                scoreOn -> scoreAnimateOn -> scoreAnimate     
     */
    function scoreOn(value, thing, continuation) {
        if(!value) {
            return;
        }
        var text = thing.EightBitter.ObjectMaker.make("Text" + value, {
            "value": value,
            "style": {
                "position": "absolute",
                "text-align": "left"
            }
        });
        thing.EightBitter.addThing(text);
        
        thing.EightBitter.scoreAnimateOn(text, thing);
        
        if(!continuation) {
            this.StatsHolder.increase("score", value);
        }
    }
    
    /**
     * Centers a text associated with some points gain on the top of a Thing,
     * and animates it updward, setting an event for it to die.
     * 
     * @param {Number} value   How many points the player is receiving.
     * @param {Thing} thing   An in-game Thing to place the visual score text
     *                        on top of and centered.
     * @param {Boolean} continuation   Whether the game shouldn't increase the 
     *                                 score amount in the StatsHoldr (this will
     *                                 only be false on the first score() call).
     * @remarks   The calling chain will be: 
     *                scoreAnimateOn -> scoreAnimate     
     */
    function scoreAnimateOn(text, thing) {
        thing.EightBitter.setMidXObj(text, thing);
        thing.EightBitter.setBottom(text, thing.top);
        thing.EightBitter.scoreAnimate(text);
    }
    
    /**
     * 
     * 
     * @param {Thing} thing   
     * @param {Number} [timeout]   How many game ticks to wait before killing
     *                             the text (defaults to 35).
     * @remarks   This is the last function in the score() calling chain:
     *                scoreAnimate <- scoreAnimateOn <- scoreOn <- score
     */
    function scoreAnimate(thing, timeout) {
        timeout = timeout || 28;
        thing.EightBitter.TimeHandler.addEventInterval(thing.EightBitter.shiftVert, 1, timeout, thing, -thing.EightBitter.unitsize / 6);
        thing.EightBitter.TimeHandler.addEvent(thing.EightBitter.killNormal, timeout, thing);
    }
    
    /**
     * 
     * 
     * @remarks See http://themushroomkingdom.net/smb_breakdown.shtml
     * (Assume thing is the player and other is the shell)
     */
    function scorePlayerShell(thing, other) {
        // Star player: 200 points
        if(thing.star) {
            thing.EightBitter.scoreOn(200, other);
            return;
        }
        
        // Shells in the air: 8000 points (see guide, this may be wrong)
        if(!other.resting) {
            thing.EightBitter.scoreOn(8000, other);
            return;
        }
        
        // Peeking shells: 1000 points
        if(other.peeking) {
            thing.EightBitter.scoreOn(1000, other);
            return;
        }
        
        // All other cases: the shell's default
        thing.EightBitter.scoreOn(100, other);
    }
    
    /**
     * 
     * 
     * @remarks See http://themushroomkingdom.net/smb_breakdown.shtml
     */
    function scorePlayerFlag(player, difference) {
        var amount;
        
        if(difference < 28) {
            amount = difference < 8 ? 100 : 400;
        } else if(difference < 40) {
            amount = 800;
        } else {
            amount = difference < 62 ? 2000 : 5000;
        }
        
        player.EightBitter.scoreOn(amount, player);
    }
    
    
    /* Map sets
    */
    
    /**
     * 
     * 
     * @param {Mixed} [name]
     * @param {Mixed} [location]
     */
    function setMap(name, location) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        if(typeof(name) === "undefined") {
            name = EightBitter.MapsHandler.getMapName();
        }
        
        EightBitter.QuadsKeeper.resetQuadrants();
        EightBitter.MapsHandler.setMap(name);
        
        EightBitter.StatsHolder.set("world", name);
        
        EightBitter.InputWriter.restartHistory();
        
        EightBitter.ModAttacher.fireEvent("onSetMap");
        
        EightBitter.setLocation(location || 0);
    }
    
    /**
     * 
     * 
     * 
     * @param {Mixed} [location]
     */
    function setLocation(name) {
        console.warn("FSM.setLocation does not respect FSM.player.power");
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            location;
        
        EightBitter.MapScreener.nokeys = false;
        EightBitter.MapScreener.notime = false;
        EightBitter.MapScreener.canscroll = true;
        EightBitter.MapScreener.clearScreen();
        EightBitter.AudioPlayer.pause();
        EightBitter.GroupHolder.clearArrays();
        EightBitter.TimeHandler.clearAllEvents();
        
        EightBitter.MapsHandler.setLocation(name || 0);
        EightBitter.MapScreener.setVariables();
        location = EightBitter.MapsHandler.getLocation(name || 0);
        
        EightBitter.TimeHandler.addEventInterval(function () {
            if(!EightBitter.MapScreener.notime) {
                EightBitter.StatsHolder.decrease("time", 1);
            }
        }, 25, Infinity);
        
        EightBitter.StatsHolder.set("time", EightBitter.MapsHandler.getArea().time);
  
        EightBitter.MapsHandler.spawnMap(EightBitter.MapScreener.width / EightBitter.unitsize);
        
        location.entry(EightBitter, location);
        
        EightBitter.ModAttacher.fireEvent("onSetLocation");
        
        EightBitter.GamesRunner.unpause();
    }
    
    /* Map entrances
    */
    
    /**
     * 
     */
    function mapEntranceGeneral(EightBitter, left, bottom) {
        EightBitter.player = EightBitter.addPlayer(left, bottom);
        EightBitter.shiftVert(
            EightBitter.player, 
            EightBitter.player.height * EightBitter.unitsize * -1
        );
    }
     
     /**
      * 
      */
     function mapEntranceNormal(EightBitter) {
        EightBitter.mapEntranceGeneral(
            EightBitter,
            EightBitter.unitsize * 16,
            EightBitter.unitsize * 16
        );
     }
    
    /**
     * 
     */
     function mapEntrancePlain(EightBitter) {
        EightBitter.mapEntranceGeneral(
            EightBitter,
            EightBitter.unitsize * 16,
            EightBitter.MapScreener.floor * EightBitter.unitsize
        );
        
     }
     
     /**
      * 
      */
     function mapEntranceWalking(EightBitter) {
        EightBitter.mapEntrancePlain(EightBitter);
        
        EightBitter.player.keys.run = 1;
        EightBitter.player.maxspeed = EightBitter.player.walkspeed;
        
        EightBitter.MapScreener.nokeys = true;
        EightBitter.MapScreener.notime = true;
     }
     
    /**
     * 
     */
    function mapEntranceCastle(EightBitter) {
        EightBitter.mapEntranceGeneral(
            EightBitter,
            EightBitter.unitsize * 2,
            EightBitter.unitsize * 56
        );
    }
    
    
    /**
     * 
     */
    function mapEntrancePipeVertical(EightBitter, location) {
        EightBitter.scrollWindow(location.xloc * EightBitter.unitsize);
        
        EightBitter.mapEntranceGeneral(
            EightBitter,
            location.entrance.left + EightBitter.player.width * EightBitter.unitsize / 2,
            location.entrance.top + EightBitter.player.height * EightBitter.unitsize
        );
        
        EightBitter.animatePlayerPipingStart(EightBitter.player);
        
        EightBitter.TimeHandler.addEventInterval(function () {
            EightBitter.shiftVert(EightBitter.player, EightBitter.unitsize / -4);
            
            if(EightBitter.player.bottom <= location.entrance.top) {
                EightBitter.animatePlayerPipingEnd(EightBitter.player);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * 
     */
    function mapEntrancePipeHorizontal(EightBitter, location) {
        throw new Error("mapEntrancePipeHorizontal is not yet implemented.");
    }

    
    
    /* Map exits
    */
    
    /**
     * 
     * 
     * @notes thing is player, other is pipe
     */
    function mapExitPipeVertical(thing, other) {
        if(!thing.resting || typeof(other.transport) === "undefined"
                || thing.right + thing.EightBitter.unitsize * 2 > other.right 
                || thing.left - thing.EightBitter.unitsize * 2 < other.left) {
            return;
        }
        
        thing.EightBitter.animatePlayerPipingStart(thing);
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftVert(thing, thing.EightBitter.unitsize / 4);
            
            if(thing.top > other.top) { 
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.setLocation(other.transport);
                }, 42);
                return true;
            }
        }, 1, Infinity);
    }
    
    /**
     * 
     * 
     * @notes thing is player, other is pipe
     */
    function mapExitPipeHorizontal(thing, other) {
        if(!thing.resting && !thing.paddling) {
            return;
        }
        
        thing.EightBitter.animatePlayerPipingStart(thing);
        
        thing.EightBitter.TimeHandler.addEventInterval(function () {
            thing.EightBitter.shiftHoriz(thing, thing.EightBitter.unitsize / 4);
            
            if(thing.left > other.left) { 
                thing.EightBitter.TimeHandler.addEvent(function () {
                    thing.EightBitter.setLocation(other.transport);
                }, 42);
                return true;
            }
        }, 1, Infinity);
    }
    
    
    /* Map macros
    */
    
    /**
     * Gets the distance from the absolute base (bottom of the user's viewport)
     * to a specific height above the floor (in the form given by map functions,
     * distance from the floor).
     * 
     * @param {Number} yloc   A height to find the distance to the floor from.
     * @param {Boolean} [correct_unitsize]   Whether the yloc accounts for 
     *                                       unitsize expansion (e.g. 48 rather
     *                                       than 12, for unitsize=4).
     * @return {Number}
     */
    function getAbsoluteHeight(yloc, correct_unitsize) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            height = yloc + EightBitter.MapScreener.bottom_death_difference;
        
        if (!correct_unitsize) {
            height *= EightBitter.unitsize;
        }
        
        return height;
    }
    
    /**
     * Sample macro with no functionality, except to console.log a listing of 
     * the arguments provided to each macro function.
     * For all real macros, arguments are listed as the keys given as members of
     * the reference object.
     * They also ignore the "x" and "y" arguments, which 
     * are the x-location and y-location of the output (and both default to 0),
     * and the "macro" argument, which is listed as their alias.
     * 
     * @alias Example
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Array. This should 
     *                             be treated as static!
     * @param {Object[]} prethings   The Area's actual .creation Array, which
     *                               consists of a bunch of reference Objects.
     * @param {Area} area   The area currently being generated.
     * @param {Map} map   The map containing the area currently being generated.
     */
    function macroExample(reference, prethings, area, map, scope) {
        console.log("This is a macro that may be called by a map creation.");
        console.log("The arguments are:\n");
        console.log("Reference (the listing from area.creation):  ", reference);
        console.log("Prethings (the area's listing of prethings): ", prethings);
        console.log("Area      (the currently generated area):    ", area);
        console.log("Map       (the map containing the area):     ", map);
        console.log("Scope     (the custom scope container):      ", scope);
    }
    
    /**
     * Macro to place a single type of Thing multiple times, drawing from a
     * bottom/left corner to a top/right corner.
     * 
     * @alias Fill
     * @param {String} thing   The name of the Thing to fill (e.g. "Brick").
     * @param {Number} xnum   How many times to repeat the Thing horizontally
     *                        to the right (defaults to 1)
     * @param {Number} ynum   How many times to repeat the Thing vertically
     *                        upwards (defaults to 1)
     * @param {Number} xwidth   How many units are between the left edges of 
     *                          placed Things horizontally (defaults to 0)
     * @param {Number} yheight   How many units are between the top edges of
     *                           placed Things vertically (defaults to 0)
     * @example   { "macro": "Fill", "thing": "Brick",
     *              "x": 644, "y": 64, "xnum": 5, "xwidth": 8 }
     */
    function macroFillPreThings(reference, prethings, area, map, scope) {
        if(!scope.ObjectMaker.getPropertiesFull()[reference.thing]) {
            debugger;
        }
        var defaults = scope.ObjectMaker.getPropertiesFull(),
            xnum = reference.xnum || 1,
            ynum = reference.ynum || 1,
            xwidth = reference.xwidth || defaults[reference.thing].width,
            yheight = reference.yheight || defaults[reference.thing].height,
            x = reference.x || 0,
            yref = reference.y || 0,
            ynum = reference.ynum || 1,
            outputs = new Array(xnum * ynum),
            output,
            o = 0, y, i, j;
        
        for(i = 0; i < xnum; ++i) {
            y = yref;
            for(j = 0; j < ynum; ++j) {
                output = {
                    "x": x,
                    "y": y,
                    "macro": undefined
                };
                outputs[o] = proliferate(output, reference, true);
                o += 1;
                y += yheight;
            }
            x += xwidth;
        }
        return outputs;
    }
    
    /**
     * Macro to continuously place a listing of Things multiple times, from left
     * to right. This is commonly used for repeating background scenery.
     * 
     * @alias Pattern
     * @param {String} pattern   The name of the pattern to print, from the
     *                           listing in this.patterns.
     * @param {Number} repeat   How many times to repeat the overall pattern.
     */
    function macroFillPrePattern(reference, prethings, area, map, scope) {
        // Make sure the pattern exists before doing anything
        if(!FullScreenMario.prototype.settings.maps.patterns[reference.pattern]) {
            console.warn("An unknown pattern is referenced: " + reference);
            return;
        }
        var pattern = FullScreenMario.prototype.settings.maps.patterns[reference.pattern],
            length = pattern.length,
            defaults = scope.ObjectMaker.getPropertiesFull(),
            repeats = reference.repeat || 1,
            xpos = reference.x || 0,
            ypos = reference.y || 0,
            outputs = new Array(length * repeats),
            o = 0,
            output, prething, i, j;
        
        // For each time the pattern should be repeated:
        for(i = 0; i < repeats; i += 1) {
            // For each Thing listing in the pattern:
            for(j = 0; j < length; j += 1) {
                prething = pattern[j];
                output = {
                    "thing": prething[0],
                    "x": xpos + prething[1],
                    "y": ypos + prething[2]
                };
                output.y += defaults[prething[0]].height;
                
                outputs[o] = output;
                o += 1;
            }
            xpos += pattern.width;
        }
        
        return outputs;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroFloor(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            floor = proliferate({
                "thing": "Floor",
                "x": x,
                "y": y,
                "width": (reference.width || 8),
                "height": "Infinity",
            }, reference, true );
        floor.macro = undefined;
        return floor;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroPipe(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            height = reference.height || 16,
            pipe = proliferate({
                "thing": "Pipe",
                "x": x,
                "y": y,
                "width": 16,
                "height": reference.height || 8
            }, reference, true),
            output = [pipe];
            
        pipe.macro = undefined;
        
        if(height == "Infinity") {
            pipe.height = scope.MapScreener.height;
        } else {
            pipe.y += height;
        }
        
        if(reference.piranha) {
            output.push({
                "thing": "Piranha",
                "x": reference.x + 4,
                "y": pipe.y + 12
            });
        }
        
        return output;
    }

    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroTree(reference, prethings, area, map, scope) {
        // Although the tree trunks in later trees overlap earlier ones, it's ok
        // because the pattern is indistinguishible when placed correctly.
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 24,
            output = [
                { "thing": "TreeTop", "x": x, "y": y, "width": width }
            ];
        
        if(width > 16) {
            output.push({
                "thing": "TreeTrunk", "x": x + 8, "y": y - 8, "width": width - 16, "height": "Infinity"
            });
        };
        
        return output;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroShroom(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = reference.width || 24,
            output = [
                { "thing": "ShroomTop", "x": x, "y": y, "width": width }
            ];
        
        if(width > 16) {
            output.push({
                "thing": "ShroomTrunk", "x": x + (width - 8) / 2, "y": y - 8, "height": "Infinity" 
            });
        }
        
        return output;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroWater(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = (reference.y || 0) + 2, // water is 3.5 x 5.5
            output = proliferate({
                "thing": "Water",
                "x": x,
                "y": y,
                "height": "Infinity",
                "macro": undefined
            }, reference, true);
        
        return output;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroCeiling(reference) {
        return {
            "macro": "Fill",
            "thing": "Brick",
            "x": reference.x,
            "y": 88,
            "xnum": Math.floor(reference.width / 8),
            "xwidth": 8
        };
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroBridge(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = Math.max(reference.width || 0, 16),
            output = [];

        // A beginning column reduces the width and pushes it forward
        if(reference.begin) {
            width -= 8;
            output.push({ "thing": "Stone", "x": x, "y": y, "height": "Infinity" });
            x += 8;
        }

        // An ending column just reduces the width 
        if(reference.end) {
            width -= 8;
            output.push({ "thing": "Stone", "x": x + width, "y": y, "height": "Infinity" });
        }

        // Between any columns is a BridgeBase with a Railing on top
        output.push({ "thing": "BridgeBase", "x": x, "y": y, "width": width });
        output.push({ "thing": "Railing", "x": x, "y": y + 4, "width": width });

        return output;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroPlatformGenerator(reference, prethings, area, map, scope) {
        var output = [],
            direction = reference.direction || 1,
            levels = direction > 0 ? [0, 48] : [8, 56],
            width = reference.width || 4,
            x = reference.x || 0,
            yvel = direction * scope.unitsize * .42,
            i;
        
        for(i = 0; i < levels.length; i += 1) {
            output.push({
                "thing": "Platform",
                "width": width,
                "x": x,
                "y": levels[i],
                "yvel": yvel,
                "movement": scope.movePlatformSpawn
            });
        }
        
        return output;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroCastleSmall(reference) {
        var output = [],
            x = reference.x || 0,
            y = reference.y || 0,
            i, j;
        
        // Base filling left
        for(i = 0; i < 2; i += 1) { // x
            output.push({ 
                "thing": "BrickHalf", 
                "x": x + i * 8,
                "y": y,
                "position": "end"
            });
            
            for(j = 0; j < 3; j += 1) { // y
                output.push({
                    "thing": "BrickPlain",
                    "x": x + 24 + i * 8,
                    "y": y + 4 + j * 8,
                    "position": "end"
                });
            }
        }
        
        // Base filling right
        for(i = 0; i < 2; i += 1) { // x
            output.push({ 
                "thing": "BrickHalf", 
                "x": x + 40 + i * 8,
                "y": y,
                "position": "end"
            });
            
            for(j = 0; j < 3; j += 1) { // y
                output.push({
                    "thing": "BrickPlain",
                    "x": x + 48 + i * 8,
                    "y": y + 4 + j * 8,
                    "position": "end"
                });
            }
        }
        
        // Medium railing left
        output.push({
            "thing": "CastleRailing",
            "x": x + 24,
            "y": y + 24,
            "position": "end"
        });
        
        // Medium railing center
        for(i = 0; i < 3; i += 1) {
            output.push({
                "thing": "CastleRailingFilled",
                "x": x + 32 + i * 8,
                "y": y + 24,
                "position": "end"
            });
        }
        
        // Medium railing right
        output.push({
            "thing": "CastleRailing",
            "x": x + 56,
            "y": y + 24,
            "position": "end"
        });
        
        // Top railing
        for(i = 0; i < 3; i += 1) {
            output.push({
                "thing": "CastleRailing",
                "x": x + 32 + i * 8,
                "y": y + 40,
                "position": "end"
            });
        }
        
        // Top bricking
        for(i = 0; i < 2; i += 1) {
            output.push({
                "thing": "CastleTop",
                "x": x + 32 + i * 12,
                "y": y + 36,
                "position": "end"
            });
        }
        
        // Door, and detector if required
        output.push({
            "thing": "CastleDoor",
            "x": x + 40,
            "y": y + 20,
            "position": "end"
        });
        if(reference.transport) {
            output.push({
                "thing": "DetectCollision",
                "x": x + 56,
                "y": y + 20,
                "height": 16,
                "activate": FullScreenMario.prototype.collideCastleDoor,
                "position": "end"
            });
        }
        
        return output;
    }
    
    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroStartInsideCastle(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            width = (reference.width || 0) - 40,
            output = [
                { "thing": "Stone", "x": x, "y": y + 48, "width": 24, "height": "Infinity" },
                { "thing": "Stone", "x": x + 24, "y": y + 40, "width": 8, "height": "Infinity" },
                { "thing": "Stone", "x": x + 32, "y": y + 32, "width": 8, "height": "Infinity" }
            ];
        
        if(width > 0) {
            output.push({ "macro": "Floor", "x": x + 40, "y": y + 24, "width": width });
        }
        
        return output;
    }
    
    /**
     * 
     *
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroEndOutsideCastle(reference) {
        var x = reference.x || 0,
            y = reference.y || 0,
            output;

        // Output starts off with the general flag & collision detection
        console.warn("macroEndOutsideCastle: thing.active, etc. should give strings");
        output = [
            // Initial collision detector
            { thing: "DetectCollision", x: x + 8, y: y + 108, height: 100, 
                    activate: FullScreenMario.prototype.collideFlagTop,
                    activate_fail: FullScreenMario.prototype.killNormal },
            // Flag (scenery)
            { thing: "Flag", x: x - 4.5, y: y + 79.5, "id": "endflag" },
            { thing: "FlagTop", x: x + 1.5, y: y + 84 },
            { thing: "FlagPole", x: x + 3, y: y + 80 },
            // Bottom stone
            { thing: "Stone", x: x, y: y + 8 },
        ];
        
        output.push({
            "macro": "CastleSmall",
            "x": x + 8,
            "y": y,
            "transport": "setNextLevel"
        });

        // If this is a big castle (*-3), a large ending castle is used
        // if(reference.big) {
        //    
        // }
        // else {
        // output.push({ thing: "DetectCollision", x: x + 60, y: y + 16, height: 16, activate: endLevelPoints });
        // }

        return output;
    }

    /**
     * 
     * 
     * @param {Object} reference   A listing of the settings for this macro,
     *                             from an Area's .creation Object.
     */
    function macroEndInsideCastle(reference, prethings, area, map, scope) {
        var x = reference.x || 0,
            y = reference.y || 0,
            npc = reference.npc || "Toad",
            text = reference.text || "",
            style = reference.style || {};

        if(!text) {
            if(npc === "Toad") {
                text = [
                    "THANK YOU MARIO!",
                    "",
                    "BUT OUR PRINCESS IS IN ANOTHER CASTLE!"
                ];
                style = {
                    "textAlign": "left"
                };
            } else if(npc === "Peach") {
                text = [
                    "THANK YOU MARIO!",
                    "",
                    "YOUR QUEST IS OVER.",
                    "WE PRESENT YOU A NEW QUEST.",
                    "",
                    "PRESS BUTTON B",
                    "TO SELECT A WORLD"
                ];
                style = {
                    "textAlign": "center"
                };
            }
        }
        
        return [
            { "thing": "Stone", "x": x, "y": y + 88, "width": 256 },
            { "macro": "Water", "x": x, "y": y, "width": 104 },
            // Bridge & Bowser area
            { "thing": "CastleBridge", "x": x, "y": y + 24, "width": 104 },
            { "thing": "Bowser", "x": x + 69, "y": y + 42, "hard": reference.hard },
            { "thing": "CastleChain", "x": x + 96, "y": y + 32 },
            // Axe area
            { "thing": "CastleAxe", "x": x + 104, "y": y + 40 },
            { "thing": "ScrollBlocker", "x": x + 112 },
            { "macro": "Floor", "x": x + 104, "y": y, "width": 152 },
            { "thing": "Stone", "x": x + 104, "y": y + 32, "width": 24, "height": 32 },
            { "thing": "Stone", "x": x + 112, "y": y + 80, "width": 16, "height": 24 },
            // Peach's Magical Happy Chamber of Fantastic Love
            { "thing": "DetectCollision", "x": x + 180, "activate": scope.collideCastleNPC, "text": text },
            { "thing": npc, "x": x + 194, "y": 13 },
            { "thing": "ScrollBlocker", "x": x + 256 }
        ];
    }
      
    
    // Add all registered functions from above to the FullScreenMario prototype
    proliferateHard(FullScreenMario.prototype, {
        // Global manipulations
        "gameStart": gameStart,
        "gameOver": gameOver,
        "nextLevel": nextLevel,
        "addThing": addThing,
        "addPlayer": addPlayer,
        "thingProcess": thingProcess,
        "thingProcessAttributes": thingProcessAttributes,
        "scrollWindow": scrollWindow,
        "scrollPlayer": scrollPlayer,
        // Upkeep maintenence
        "maintainSolids": maintainSolids,
        "maintainCharacters": maintainCharacters,
        "maintainPlayer": maintainPlayer,
        // Collision detectors
        "canThingCollide": canThingCollide,
        "isThingTouchingThing": isThingTouchingThing,
        "isThingOnThing": isThingOnThing,
        "isThingOnSolid": isThingOnSolid,
        "isCharacterTouchingSolid": isCharacterTouchingSolid,
        "isCharacterTouchingCharacter": isCharacterTouchingCharacter,
        "isCharacterOnSolid": isCharacterOnSolid,
        "isCharacterOnResting": isCharacterOnResting,
        "isCharacterAboveEnemy": isCharacterAboveEnemy,
        "isCharacterBumpingSolid": isCharacterBumpingSolid,
        "isSolidOnCharacter": isSolidOnCharacter,
        "isCharacterAlive": isCharacterAlive,
        // Collision reactions
        "gainLife": gainLife,
        "itemJump": itemJump,
        "jumpEnemy": jumpEnemy,
        "playerShroom": playerShroom,
        "playerShroom1Up": playerShroom1Up,
        "playerStarUp": playerStarUp,
        "playerStarDown": playerStarDown,
        "playerGetsBig": playerGetsBig,
        "playerGetsBigAnimation": playerGetsBigAnimation,
        "playerGetsSmall": playerGetsSmall,
        "playerGetsFire": playerGetsFire,
        "setPlayerSizeSmall": setPlayerSizeSmall,
        "setPlayerSizeLarge": setPlayerSizeLarge,
        "animatePlayerRemoveCrouch": animatePlayerRemoveCrouch,
        "unattachPlayer": unattachPlayer,
        // Spawn / actions
        "spawnHammerBro": spawnHammerBro,
        "spawnBowser": spawnBowser,
        "spawnPiranha": spawnPiranha,
        "spawnBlooper": spawnBlooper,
        "spawnPodoboo": spawnPodoboo,
        "spawnLakitu": spawnLakitu,
        "spawnCannon": spawnCannon,
        "spawnCastleBlock": spawnCastleBlock,
        "spawnDetector": spawnDetector,
        "activateWindowDetector": activateWindowDetector,
        "activateScrollBlocker": activateScrollBlocker,
        // Collision / actions
        "hitCharacterSolid": hitCharacterSolid,
        "hitCharacterCharacter": hitCharacterCharacter,
        "collideFriendly": collideFriendly,
        "collideCharacterSolid": collideCharacterSolid,
        "collideCharacterSolidUp": collideCharacterSolidUp,
        "collideCoin": collideCoin,
        "collideStar": collideStar,
        "collideFireball": collideFireball,
        "collideShell": collideShell,
        "collideShellSolid": collideShellSolid,
        "collideShellPlayer": collideShellPlayer,
        "collideShellShell": collideShellShell,
        "collideEnemy": collideEnemy,
        "collideBottomBrick": collideBottomBrick,
        "collideBottomBlock": collideBottomBlock,
        "collideVine": collideVine,
        "collideSpringboard": collideSpringboard,
        "collideFlagTop": collideFlagTop,
        "collideFlagBottom": collideFlagBottom,
        "collideCastleAxe": collideCastleAxe,
        "collideCastleDoor": collideCastleDoor,
        "collideCastleNPC": collideCastleNPC,
        "collideTransport": collideTransport,
        "collideDetector": collideDetector,
        "collideLevelTransport": collideLevelTransport,
        // Movement
        "moveSimple": moveSimple,
        "moveSmart": moveSmart,
        "moveJumping": moveJumping,
        "movePacing": movePacing,
        "moveHammerBro": moveHammerBro,
        "moveBowser": moveBowser,
        "moveBowserFire": moveBowserFire,
        "moveFloating": moveFloating,
        "moveFloatingReal": moveFloatingReal,
        "moveSliding": moveSliding,
        "moveSlidingReal": moveSlidingReal,
        "movePlatform": movePlatform,
        "movePlatformSpawn": movePlatformSpawn,
        "moveVine": moveVine,
        "moveSpringboardUp": moveSpringboardUp,        "moveFalling": moveFalling,        "moveFreeFalling": moveFreeFalling,
        "moveShell": moveShell,
        "movePiranha": movePiranha,
        "moveBlooper": moveBlooper,
        "moveBlooperSqueezing": moveBlooperSqueezing,
        "movePodobooFalling": movePodobooFalling,
        "moveLakitu": moveLakitu,
        "moveLakituInitial": moveLakituInitial,
        "moveCoinEmerge": moveCoinEmerge,
        "movePlayer": movePlayer,
        "movePlayerVine": movePlayerVine,
        "movePlayerSpringboardDown": movePlayerSpringboardDown,
        // Animations
        "animateSolidBump": animateSolidBump,
        "animateSolidContents": animateSolidContents,
        "animateBlockBecomesUsed": animateBlockBecomesUsed,
        "animateBrickShards": animateBrickShards,
        "animateEmerge": animateEmerge,
        "animateEmergeCoin": animateEmergeCoin,
        "animateEmergeVine": animateEmergeVine,
        "animateFlicker": animateFlicker,
        "animateJump": animateJump,
        "animateThrowingHammer": animateThrowingHammer,
        "animateBowserJump": animateBowserJump,
        "animateBowserFire": animateBowserFire,
        "animateBowserFreeze": animateBowserFreeze,
        "animateBlooperUnsqueezing": animateBlooperUnsqueezing,
        "animatePodobooJumpUp": animatePodobooJumpUp,
        "animatePodobooJumpDown": animatePodobooJumpDown,
        "animateLakituThrowingSpiny": animateLakituThrowingSpiny,
        "animateSpinyEggHatching": animateSpinyEggHatching,
        "animateFireballEmerge": animateFireballEmerge,
        "animateFireballExplode": animateFireballExplode,
        "animateFirework": animateFirework,
        "animateEndLevelFireworks": animateEndLevelFireworks,
        "animateCannonFiring": animateCannonFiring,
        "animateCastleBlock": animateCastleBlock,
        "animateCastleBridgeOpen": animateCastleBridgeOpen,
        "animateCastleChainOpen": animateCastleChainOpen,
        "animatePlayerFire": animatePlayerFire,
        "animatePlayerPaddling": animatePlayerPaddling,
        "animatePlayerLanding": animatePlayerLanding,
        "animatePlayerBubbling": animatePlayerBubbling,
        "animatePlayerRunningCycle": animatePlayerRunningCycle,
        "animatePlayerPipingStart": animatePlayerPipingStart,
        "animatePlayerPipingEnd": animatePlayerPipingEnd,
        "animatePlayerOffPole": animatePlayerOffPole,
        "animateCharacterHop": animateCharacterHop,
        // Physics & similar
        "shiftBoth": shiftBoth,
        "shiftThings": shiftThings,
        "shiftAll": shiftAll,
        "setWidth": setWidth,
        "setHeight": setHeight,
        "setSize": setSize,
        "updatePosition": updatePosition,
        "updateSize": updateSize,
        "reduceHeight": reduceHeight,
        "increaseHeight": increaseHeight,
        "thingStoreVelocity": thingStoreVelocity,
        "thingRetrieveVelocity": thingRetrieveVelocity,
        "setOpacity": setOpacity,
        // Appearance utilities
        "setTitle": setTitle,
        "setClass": setClass,
        "setClassInitial": setClassInitial,
        "addClass": addClass,
        "addClasses": addClasses,
        "removeClass": removeClass,
        "removeClasses": removeClasses,
        "switchClass": switchClass,
        "flipHoriz": flipHoriz,
        "flipVert": flipVert,
        "unflipHoriz": unflipHoriz,
        "unflipVert": unflipVert,
        "lookTowardsThing": lookTowardsThing,
        "lookTowardsPlayer": lookTowardsPlayer,
        // Death functions
        "killNormal": killNormal,
        "killFlip": killFlip,
        "killSpawn": killSpawn,
        "killGoomba": killGoomba,
        "killKoopa": killKoopa,
        "killBowser": killBowser,
        "killToShell": killToShell,
        "killNPCs": killNPCs,
        "killBrick": killBrick,
        "killPlayer": killPlayer,
        // Scoring
        "findScore": findScore,
        "score": score,
        "scoreOn": scoreOn,
        "scoreAnimateOn": scoreAnimateOn,
        "scoreAnimate": scoreAnimate,
        "scorePlayerShell": scorePlayerShell,
        "scorePlayerFlag": scorePlayerFlag,
        // Map sets
        "setMap": setMap,
        "setLocation": setLocation,
        // Map entrances
        "mapEntranceGeneral": mapEntranceGeneral,
        "mapEntranceNormal": mapEntranceNormal,
        "mapEntrancePlain": mapEntrancePlain,
        "mapEntranceWalking": mapEntranceWalking,
        "mapEntranceCastle": mapEntranceCastle,
        "mapEntrancePipeVertical": mapEntrancePipeVertical,
        "mapEntrancePipeHorizontal": mapEntrancePipeHorizontal,
        // Map exits
        "mapExitPipeVertical": mapExitPipeVertical,
        "mapExitPipeHorizontal": mapExitPipeHorizontal,
        // Map macros
        "getAbsoluteHeight": getAbsoluteHeight,
        "macroExample": macroExample,
        "macroFillPreThings": macroFillPreThings,
        "macroFillPrePattern": macroFillPrePattern,
        "macroFloor": macroFloor,
        "macroPipe": macroPipe,
        "macroTree": macroTree,
        "macroShroom": macroShroom,
        "macroWater": macroWater,
        "macroCastleSmall": macroCastleSmall,
        "macroCeiling": macroCeiling,
        "macroBridge": macroBridge,
        "macroPlatformGenerator": macroPlatformGenerator,
        "macroStartInsideCastle": macroStartInsideCastle,
        "macroEndOutsideCastle": macroEndOutsideCastle,
        "macroEndInsideCastle": macroEndInsideCastle
    });
    
    return FullScreenMario;
})();