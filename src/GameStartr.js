/**
 * GameStartr.js
 * 
 * Virtual / abstract constructor for games
 */
var GameStartr = (function (EightBittr) {
    "use strict";
    
    // Use an EightBittr as the class parent, with EightBittr's constructor
    var EightBitterProto = new EightBittr(),
        
        // Used for combining arrays from the prototype to this
        proliferate = EightBitterProto.proliferate,
        proliferateHard = EightBitterProto.proliferateHard;
    
    /**
     * 
     */
    function GameStartr(customs) {
        if (typeof(customs) === "undefined") {
            customs = {};
        }
        
        EightBittr.call(this, {
            "constants": customs.constants,
            "constructor": customs.constructor || GameStartr,
            "customs": customs,
            "requirements": {
                "global": {
                    "AudioPlayr": "src/AudioPlayr/AudioPlayr.js",
                    "ChangeLinr": "src/ChangeLinr/ChangeLinr.js",
                    "FPSAnalyzr": "src/FPSAnalyzr/FPSAnalyzr.js",
                    "GamesRunnr": "src/GamesRunnr/GamesRunnr.js",
                    "GroupHoldr": "src/GroupHoldr/GroupHoldr.js",
                    "InputWritr": "src/InputWritr/InputWritr.js",
                    "LevelEditr": "src/LevelEditr/LevelEditr.js",
                    "NumberMakr": "src/NumberMakr/NumberMakr.js",
                    "MapScreenr": "src/MapScreenr/MapScreenr.js",
                    "MapsHandlr": "src/MapsHandlr/MapsHandlr.js",
                    "ModAttachr": "src/ModAttachr/ModAttachr.js",
                    "ObjectMakr": "src/ObjectMakr/ObjectMakr.js",
                    "PixelDrawr": "src/PixelDrawr/PixelDrawr.js",
                    "PixelRendr": "src/PixelRendr/PixelRendr.js",
                    "QuadsKeepr": "src/QuadsKeepr/QuadsKeepr.js",
                    "StatsHoldr": "src/StatsHoldr/StatsHoldr.js",
                    "StringFilr": "src/StringFilr/StringFilr.js",
                    "ThingHittr": "src/ThingHittr/ThingHittr.js",
                    "TimeHandlr": "src/TimeHandlr/TimeHandlr.js"
                }
            }
        });
    }
    
    GameStartr.prototype = EightBitterProto;
    
    // Subsequent settings will be stored in GameStartr.prototype.settings
    EightBitterProto.settings = {};
    EightBitterProto.resets = [
        "resetObjectMaker",
        "resetPixelRender",
        "resetTimeHandler",
        "resetAudioPlayer",
        "resetQuadsKeeper",
        "resetGamesRunner",
        "resetStatsHolder",
        "resetThingHitter",
        "resetMapScreener",
        "resetPixelDrawer",
        "resetNumberMaker",
        "resetMapsCreator",
        "resetMapsHandler",
        "resetInputWriter",
        "resetLevelEditor",
        "resetWorldSeeder",
        "resetModAttacher",
        "startModAttacher",
        "resetContainer"
    ];
    
    /* Resets
    */
    
    /**
     * 
     */
    function reset(EightBitter, customs) {
        EightBittr.prototype.reset(EightBitter, EightBitter.resets, customs);
    };
    
    /**
     * 
     */
    function resetTimed(EightBitter, customs) {
        return EightBittr.prototype.resetTimed(EightBitter, EightBitter.resets, customs);
    };
    
    /**
     * Sets self.ObjectMaker.
     * 
     * Because many Thing functions require access to other FSM modules, each is
     * given a reference to this container FSM via properties.Thing.EightBitter. 
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ObjectMakr (src/ObjectMakr/ObjectMakr.js)
     *                          objects.js (settings/objects.js)
     */
    function resetObjectMaker(EightBitter, customs) {
        EightBitter.ObjectMaker = new ObjectMakr(proliferate({
            "properties": {
                "Quadrant": {
                    "EightBitter": EightBitter
                },
                "Thing": {
                    "EightBitter": EightBitter
                }
            }
        }, EightBitter.settings.objects));
    }
    
    /**
     * Sets self.QuadsKeeper.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): QuadsKeepr (src/QuadsKeepr/QuadsKeepr.js)
     *                          quadrants.js (settings/quadrants.js)
     */
    function resetQuadsKeeper(EightBitter, customs) {
        var quadrant_width = customs.width / (EightBitter.settings.quadrants.num_cols - 3),
            quadrant_height = customs.height / (EightBitter.settings.quadrants.num_rows - 2);
        
        EightBitter.QuadsKeeper = new QuadsKeepr(proliferate({
            "ObjectMaker": EightBitter.ObjectMaker,
            "getCanvas": EightBitter.getCanvas,
            "quadrant_width": quadrant_width,
            "quadrant_height": quadrant_height,
            "start_left": -quadrant_width,
            "start_height": -quadrant_height,
            "on_add": EightBitter.onAreaSpawn.bind(EightBitter, EightBitter),
            "on_remove": EightBitter.onAreaUnspawn.bind(EightBitter, EightBitter),
        }, EightBitter.settings.quadrants));
    }
    
    /**
     * Sets self.PixelRender.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): PixelRendr (src/PixelRendr/PixelRendr.js)
     *                          sprites.js (settings/sprites.js)
     */
    function resetPixelRender(EightBitter, customs) {
        EightBitter.PixelRender = new PixelRendr(proliferate({
            "QuadsKeeper": EightBitter.QuadsKeeper,
            "unitsize": EightBitter.unitsize,
            "scale": EightBitter.scale
        }, EightBitter.settings.sprites));
    }
    
    /**
     * Sets self.PixelDrawer.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): PixelDrawr (src/PixelDrawr/PixelDrawr.js)
     *                          renderer.js (settings/renderer.js)
     */
    function resetPixelDrawer(EightBitter, customs) {
        EightBitter.PixelDrawer = new PixelDrawr(proliferate({
            "PixelRender": EightBitter.PixelRender,
            "MapScreener": EightBitter.MapScreener,
            "getCanvas": EightBitter.getCanvas,
            "unitsize": EightBitter.unitsize,
            "innerWidth": customs.width,
            "generateObjectKey": EightBitter.generateObjectKey
        }, EightBitter.settings.renderer));
    }
    
    /**
     * Sets EightBitter.TimeHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): TimeHandlr (src/TimeHandlr/TimeHandlr.js)
     *                          events.js (settings/events.js)
     */
    function resetTimeHandler(EightBitter, customs) {
        EightBitter.TimeHandler = new TimeHandlr(proliferate({
            "classAdd": EightBitter.addClass,
            "classRemove": EightBitter.removeClass
        }, EightBitter.settings.events));
    }
    
    /**
     * Sets self.AudioPlayer.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): AudioPlayr (src/AudioPlayr/AudioPlayr.js)
     *                          audio.js (settings/audio.js)
     */
    function resetAudioPlayer(EightBitter, customs) {
        EightBitter.AudioPlayer = new AudioPlayr(proliferate({
            "getVolumeLocal": EightBitter.getVolumeLocal.bind(EightBitter, EightBitter),
            "getThemeDefault": EightBitter.getAudioThemeDefault.bind(EightBitter, EightBitter),
            "statistics": {
                "proliferate": EightBitter.proliferate
            }
        }, EightBitter.settings.audio));
    }
    
    /**
     * Sets self.GamesRunner.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): GamesRunnr (src/GamesRunnr/GamesRunnr.js)
     *                          runner.js (settings/runner.js)
     */
    function resetGamesRunner(EightBitter, customs) {
        EightBitter.GamesRunner = new GamesRunnr(proliferate({
            "scope": EightBitter,
            "onPause": EightBitter.onGamePause.bind(EightBitter, EightBitter),
            "onUnpause": EightBitter.onGameUnpause.bind(EightBitter, EightBitter)
        }, EightBitter.settings.runner));
    }
    
    /**
     * Sets self.StatsHolder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): StatsHoldr (src/StatsHoldr/StatsHoldr.js)
     *                          statistics.js (settings/statistics.js)
     */
    function resetStatsHolder(EightBitter, customs) {
        EightBitter.StatsHolder = new StatsHoldr(proliferate({
            "callbackArgs": [EightBitter],
            "proliferate": EightBitter.proliferate,
            "createElement": EightBitter.createElement
        }, EightBitter.settings.statistics));
    }
    
    /**
     * Sets self.ThingHitter.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ThingHittr (src/ThingHittr/ThingHittr.js)
     *                          collisions.js (settings/collisions.js)
     */
    function resetThingHitter(EightBitter, customs) {
        EightBitter.ThingHitter = new ThingHittr(proliferate({
            "scope": EightBitter
        }, EightBitter.settings.collisions));
        
        EightBitter.GroupHolder = EightBitter.ThingHitter.getGroupHolder();
    }
    
    /**
     * Sets self.MapScreener.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapScreenr (src/MapScreenr/MapScreenr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapScreener(EightBitter, customs) {
        EightBitter.MapScreener = new MapScreenr({
            "EightBitter": EightBitter,
            "unitsize": FullScreenMario.unitsize,
            "width": customs.width,
            "height": customs.height,
            "variable_args": [EightBitter],
            "variables": EightBitter.settings.maps.screen_variables
        });
    }
    
    /**
     * Sets self.NumberMaker.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): NumberMaker (src/NumberMakr/NumberMakr.js)
     *                          numbers.js (settings/numbers.js)    
     */
    function resetNumberMaker(EightBitter, customs) {
        EightBitter.NumberMaker = new NumberMakr(EightBitter.settings.numbers);
    }
    
    /**
     * Sets self.MapCreator.
     * 
     * @param {EightBittr} EightBitter
     * @remarks Requirement(s): MapCreatr (src/MapCreatr/MapCreatr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsCreator(EightBitter, customs) {
        EightBitter.MapsCreator = new MapsCreatr({
            "ObjectMaker": EightBitter.ObjectMaker,
            "groupTypes": ["Character", "Scenery", "Solid", "Text"],
            "macros": EightBitter.settings.maps.macros,
            "entrances": EightBitter.settings.maps.entrances,
            "maps": EightBitter.settings.maps.library,
            "scope": EightBitter
        });
    }
    
    /**
     * Sets self.MapsHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapsHandlr (src/MapsHandlr/MapsHandlr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsHandler(EightBitter, customs) {
        EightBitter.MapsHandler = new MapsHandlr({
            "MapsCreator": EightBitter.MapsCreator,
            "MapScreener": EightBitter.MapScreener,
            "screen_attributes": EightBitter.settings.maps.screen_attributes,
            "on_spawn": EightBitter.settings.maps.on_spawn,
            "stretch_add": EightBitter.mapAddStretched.bind(EightBitter),
            "on_stretch": EightBitter.mapStretchThing,
            "after_add": EightBitter.mapAddAfter.bind(EightBitter)
        });
    }
    
    /**
     * Sets self.InputWriter.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): InputWritr (src/InputWritr/InputWritr.js)
     *                          input.js (settings/input.js)
     */
    function resetInputWriter(EightBitter, customs) {
        EightBitter.InputWriter = new InputWritr(proliferate({
            "can_trigger": EightBitter.canInputsTrigger.bind(EightBitter, EightBitter)
        }, EightBitter.settings.input.InputWritrArgs));
    }
    
    /**
     * Sets self.LevelEditor.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): LevelEditr (src/LevelEditr/LevelEditr.js)
     *                          editor.js (settings/editor.js)
     */
    function resetLevelEditor(EightBitter, customs) {
        EightBitter.LevelEditor = new LevelEditr(proliferate({
            "GameStarter": EightBitter,
			"beautifier": js_beautify // Eventually there will be a custom beautifier... maybe
        }, EightBitter.settings.editor));
    }
    
    /**
     * Sets self.WorldSeeder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): WorldSeedr (src/WorldSeedr/WorldSeedr.js)
     *                          generator.js (settings/generator.js)
     */
    function resetWorldSeeder(EightBitter, customs) {
        EightBitter.WorldSeeder = new WorldSeedr(proliferate({
            "random": EightBitter.NumberMaker.random,
            "on_placement": EightBitter.mapPlaceRandomCommands.bind(EightBitter, EightBitter)
        }, EightBitter.settings.generator));
    }
    
    /**
     * Sets self.ModAttacher.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ModAttachr (src/ModAttachr/ModAttachr.js)
     *                          mods.js (settings/mods.js)
     */
    function resetModAttacher(EightBitter, customs) {
        EightBitter.ModAttacher = new ModAttachr(proliferate({
            "scopeDefault": EightBitter,
            "StatsHoldr": StatsHoldr,
            "proliferate": EightBitter.proliferate,
            "createElement": EightBitter.createElement
        }, EightBitter.settings.mods));
    }
    
    /** 
     * 
     */
    function startModAttacher(EightBitter, customs) {
        var mods = customs.mods,
            i;
        
        if (mods) {
            for (i in mods) {
                if (mods[i]) {
                    EightBitter.ModAttacher.enableMod(i);
                }
            }
        }
        
        EightBitter.ModAttacher.fireEvent("onReady", EightBitter, EightBitter);
    }
    
    /**
     * 
     */
    function resetContainer(EightBitter, customs) {
        EightBitter.container = EightBitter.createElement("div", {
            "className": "FullScreenMario EightBitter",
            "style": EightBitter.proliferate({
                "position": "relative",
                "width": customs.width + "px",
                "height": customs.height + "px"
            }, customs.style)
        });
        
        EightBitter.canvas = EightBitter.getCanvas(customs.width, customs.height);
        EightBitter.PixelDrawer.setCanvas(EightBitter.canvas);
        
        EightBitter.container.appendChild(EightBitter.canvas);
        EightBitter.container.appendChild(EightBitter.StatsHolder.getContainer());
    }
    
    
    /* Global manipulations
    */
    
    /**
     * 
     */
    function scrollWindow(dx, dy) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        
        dx = dx | 0;
        dy = dy | 0;
        
        if (!dx && !dy) {
            return;
        }
        
        EightBitter.MapScreener.shift(dx, dy);
        EightBitter.shiftAll(-dx, -dy);
        
        EightBitter.QuadsKeeper.shiftQuadrants(-dx, -dy);
    }
    
    /**
     * 
     */
    function scrollThing(thing, dx, dy) {
        var saveleft = thing.left,
            savetop = thing.top;
        
        thing.EightBitter.scrollWindow(dx, dy);
        thing.EightBitter.setLeft(thing, saveleft);
        thing.EightBitter.setTop(thing, savetop);
    }
    
    /**
     * 
     */
    function onAreaSpawn(EightBitter, direction, top, right, bottom, left) {
        EightBitter.MapsHandler.spawnMap(
            direction,
            (top + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (right + EightBitter.MapScreener.left) / EightBitter.unitsize,
            (bottom + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (left + EightBitter.MapScreener.left) / EightBitter.unitsize
        );
    }
    
    /**
     * 
     */
    function onAreaUnspawn(EightBitter, direction, top, right, bottom, left) {
        EightBitter.MapsHandler.unspawnMap(
            direction,
            top / EightBitter.unitsize,
            (right + EightBitter.MapScreener.left) / EightBitter.unitsize,
            bottom / EightBitter.unitsize,
            (left + EightBitter.MapScreener.left) / EightBitter.unitsize
        );
    }
    
    /**
     * 
     * 
     * 
     */
    function addThing(thing, left, top) {
        if (typeof(thing) === "string" || thing instanceof String) {
            thing = this.ObjectMaker.make(thing);
        } else if (thing.constructor === Array) {
            thing = this.ObjectMaker.make.apply(this.ObjectMaker, thing);
        }
        
        if (arguments.length > 2) {
            thing.EightBitter.setLeft(thing, left);
            thing.EightBitter.setTop(thing, top);
        } else if (arguments.length > 1) {
            thing.EightBitter.setLeft(thing, left);
        }
        
        thing.EightBitter.updateSize(thing);
        
        thing.EightBitter.GroupHolder.getFunctions().add[thing.grouptype](thing);
        thing.placed = true;
        
        // This will typically be a TimeHandler.cycleClass call
        if (thing.onThingAdd) {
            thing.onThingAdd(thing);
        }
        
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        
        // This will typically be a spawn* call
        if (thing.onThingAdded) {
            thing.onThingAdded(thing);
        }
        
        thing.EightBitter.ModAttacher.fireEvent("onAddThing", thing, left, top);
        
        return thing;
    }
    
    /**
     * 
     */
    function thingProcess(thing, type, settings, defaults) {
        // If the Thing doesn't specify its own title, use the type by default
        thing.title = thing.title || type;
        
        // If a width/height is provided but no spritewidth/height,
        // use the default spritewidth/height
        if (thing.width && !thing.spritewidth) {
            thing.spritewidth = defaults.spritewidth || defaults.width;
        }
        if (thing.height && !thing.spriteheight) {
            thing.spriteheight = defaults.spriteheight || defaults.height;
        }
        
        // "Infinity" height refers to objects that reach exactly to the bottom
        if (thing.height === "Infinity") {
            thing.height = thing.EightBitter.getAbsoluteHeight(thing.y) / thing.EightBitter.unitsize;
        }
        
        // Each thing has at least 4 maximum quadrants (for the QuadsKeepr)
        var maxquads = 4,
            num;
        num = Math.floor(thing.width 
            * (FullScreenMario.unitsize / thing.EightBitter.QuadsKeeper.getQuadrantWidth()));
        if (num > 0) {
            maxquads += ((num + 1) * maxquads / 2);
        }
        num = Math.floor(thing.height 
            * (FullScreenMario.unitsize / thing.EightBitter.QuadsKeeper.getQuadrantHeight()));
        if (num > 0) {
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
        
        if (thing.opacity !== 1) {
            thing.EightBitter.setOpacity(thing, thing.opacity);
        }
        
        // Attributes, such as Koopa.smart
        if (thing.attributes) {
            thingProcessAttributes(thing, thing.attributes, settings);
        }
        
        // Important custom functions
        if (thing.onThingMake) {
            thing.onThingMake(thing, settings);
        }
        
        // Initial class / sprite setting
        thing.EightBitter.setSize(thing, thing.width, thing.height);
        thing.EightBitter.setClassInitial(thing, thing.name || thing.title);
        
        // Sprite cycles
        var cycle;
        if (cycle = thing.spriteCycle) {
            thing.EightBitter.TimeHandler.addClassCycle(
                thing, cycle[0], cycle[1] || null, cycle[2] || null
            );
        }
        if (cycle = thing.spriteCycleSynched) {
            thing.EightBitter.TimeHandler.addClassCycleSynched(
                thing, cycle[0], cycle[1] || null, cycle[2] || null
            );
        }
        
        // flipHoriz and flipVert initially 
        if (thing.flipHoriz) {
            thing.EightBitter.flipHoriz(thing);
        }
        if (thing.flipVert) {
            thing.EightBitter.flipVert(thing);
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
        for (attribute in attributes) {
            // If the thing has that attribute as true:
            if (thing[attribute]) {
                // Add the extra options
                proliferate(thing, attributes[attribute]);
                // Also add a marking to the name, which will go into the className
                if (thing.name) {
                    thing.name += ' ' + attribute;
                } else {
                    thing.name = thing.title + ' ' + attribute;
                }
            }
        }
    }
    
    
    /* Physics & similar
    */
    
    /** 
     * Sets a Thing's "changed" flag to true, which indicates to the
     * PixelDrawer to redraw the Thing and its quadrant.
     * 
     * @param {Thing} thing
     */
    function markChanged(thing) {
        thing.changed = true;
    }
    
    /**
     * 
     */
    function shiftVert(thing, dy, notChanged) {
        EightBittr.prototype.shiftVert(thing, dy);
        
        if (!notChanged) {
            thing.EightBitter.markChanged(thing);
        }
    }
    
    /**
     * 
     */
    function shiftHoriz(thing, dx, notChanged) {
        EightBittr.prototype.shiftHoriz(thing, dx);
        
        if (!notChanged) {
            thing.EightBitter.markChanged(thing);
        }
    }
    
    /**
     * 
     */
    function setTop(thing, top) {
        EightBittr.prototype.setTop(thing, top);
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function setRight(thing, right) {
        EightBittr.prototype.setRight(thing, right);
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function setBottom(thing, bottom) {
        EightBittr.prototype.setBottom(thing, bottom);
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function setLeft(thing, left) {
        EightBittr.prototype.setLeft(thing, left);
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     * 
     */
    function shiftBoth(thing, dx, dy, notChanged) {
        dx = dx || 0;
        dy = dy || 0;
        
        if (!thing.noshiftx) {
            if (thing.parallax) {
                thing.EightBitter.shiftHoriz(thing, thing.parallax * dx, notChanged);
            } else {
                thing.EightBitter.shiftHoriz(thing, dx, notChanged);
            }
        }
        if (!thing.noshifty) {
            thing.EightBitter.shiftVert(thing, dy, notChanged);
        }
    }
    
    /**
     * 
     */
    function shiftThings(things, dx, dy, notChanged) {
        for (var i = things.length - 1; i >= 0; i -= 1) {
            things[i].EightBitter.shiftBoth(things[i], dx, dy, notChanged);
        }
    }
    
    /**
     * 
     */
    function shiftAll(dx, dy) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        EightBitter.GroupHolder.callAll(EightBitter, EightBitter.shiftThings, dx, dy, true);
    }

    /**
     * 
     */
    function setWidth(thing, width, update_sprite, update_size) {
        thing.width = width;
        thing.unitwidth = width * thing.EightBitter.unitsize;
        
        if (update_sprite) {
            thing.spritewidth = width;
            thing.spritewidthpixels = width * thing.EightBitter.unitsize;
        }
        
        if (update_size) {
            thing.EightBitter.updateSize(thing);
        }
        
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function setHeight(thing, height, update_sprite, update_size) {
        thing.height = height;
        thing.unitheight = height * thing.EightBitter.unitsize;
        
        if (update_sprite) {
            thing.spriteheight = height;
            thing.spriteheightpixels = height * thing.EightBitter.unitsize;
        }
        
        if (update_size) {
            thing.EightBitter.updateSize(thing);
        }
        
        thing.EightBitter.markChanged(thing);
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
        if (!thing.nomove || hard) {
            thing.EightBitter.shiftHoriz(thing, thing.xvel);
        }
        
        // if (!thing.nofall || hard) {
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
        
        if (thing.canvas !== undefined) {
            thing.canvas.width = thing.spritewidthpixels;
            thing.canvas.height = thing.spriteheightpixels;
            thing.EightBitter.PixelDrawer.setThingSprite(thing);
        }
        
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function reduceHeight(thing, dy, see) {
        thing.top += dy;
        thing.height -= dy / thing.EightBitter.unitsize;
        
        if (see) {
            thing.EightBitter.updateSize(thing);
        } else {
            thing.EightBitter.markChanged(thing);
        }
    }
    
    /**
     * 
     */
    function reduceWidth(thing, dx, see) {
        thing.right -= dx;
        thing.width -= dx / thing.EightBitter.unitsize;
        
        if (see) {
            thing.EightBitter.updateSize(thing);
        } else {
            thing.EightBitter.markChanged(thing);
        }
    }
    
    /**
     * 
     */
    function increaseHeight(thing, dy) {
        thing.top -= dy;
        thing.height += dy / thing.EightBitter.unitsize;
        thing.unitheight = thing.height * thing.EightBitter.unitsize;
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function increaseWidth(thing, dx) {
        thing.right += dx;
        thing.width += dx / thing.EightBitter.unitsize;
        thing.unitwidth = thing.width * thing.EightBitter.unitsize;
        thing.EightBitter.markChanged(thing);
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
        
        if (!keep_movement) {
            thing.movement = false;
        }
    }
    
    /**
     * 
     */
    function thingRetrieveVelocity(thing, no_velocity) {
        if (!no_velocity) {
            thing.xvel = thing.xvel_old || 0;
            thing.yvel = thing.yvel_old || 0;
        }
        
        thing.movement = thing.movement_old || thing.movement;
        thing.nofall = thing.nofall_old || false;
        thing.nocollide = thing.nocollide_old || false;
    }
    
    
    /* Appearance utilities
    */
    
    /**
     * 
     */
    function generateObjectKey(thing) {
        return thing.EightBitter.MapsHandler.getArea().setting 
                + ' ' + thing.libtype + ' ' 
                + thing.title + ' ' + thing.className;
    }
    
    /**
     * 
     */
    function setTitle(thing, string) {
        thing.title = string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function setClass(thing, string) {
        thing.className = string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        thing.EightBitter.markChanged(thing);
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
        thing.EightBitter.markChanged(thing);
    }
    
    /**
     * 
     */
    function addClasses(thing) {
        var strings, arr, i, j;
        for (i = 1; i < arguments.length; i += 1) {
            arr = arguments[i];
            
            if (!(arr instanceof Array)) {
                arr = arr.split(' ');
            }
            
            for (j = arr.length - 1; j >= 0; j -= 1) {
                thing.EightBitter.addClass(thing, arr[j]);
            }
        }
    }
    
    /**
     * 
     */
    function removeClass(thing, string) {
        if (!string) {
            return;
        }
        if (string.indexOf(" ") !== -1) {
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
        for (i = 1; i < arguments.length; ++i) {
            arr = arguments[i];
            if (!(arr instanceof Array)) {
                arr = arr.split(" ");
            }
            
            for (j = arr.length - 1; j >= 0; --j) {
                thing.EightBitter.removeClass(thing, arr[j]);
            }
        }
    }
    
    /**
     * 
     */
    function hasClass(thing, string) {
        return thing.className.indexOf(string) !== -1;
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
    function setOpacity(thing, opacity) {
        thing.opacity = opacity;
        thing.canvas.opacity = opacity;
        thing.context.opacity = opacity;
        // thing.EightBitter.PixelDrawer.setThingSprite(thing);
        thing.EightBitter.markChanged(thing);
    }
    
    
    /* Miscellaneous utilities
    */
    
    /**
     * 
     */
    function takeScreenshot(name) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            format = "image/png",
            link = EightBitter.createElement("a", {
                "download": (name || "FullScreenMario Screenshot")+ ".png",
                "href": EightBitter.canvas.toDataURL(format)
                    .replace(format, "image/octet-stream")
            });
            
        link.click();
    }
    
    
    // Add all registered functions from above to the GameStartr prototype
    proliferateHard(EightBitterProto, {
        // Resets
        "reset": reset,
        "resetTimed": resetTimed,
        "resetObjectMaker": resetObjectMaker,
        "resetQuadsKeeper": resetQuadsKeeper,
        "resetPixelRender": resetPixelRender,
        "resetTimeHandler": resetTimeHandler,
        "resetAudioPlayer": resetAudioPlayer,
        "resetGamesRunner": resetGamesRunner,
        "resetStatsHolder": resetStatsHolder,
        "resetThingHitter": resetThingHitter,
        "resetMapScreener": resetMapScreener,
        "resetPixelDrawer": resetPixelDrawer,
        "resetNumberMaker": resetNumberMaker,
        "resetMapsCreator": resetMapsCreator,
        "resetMapsHandler": resetMapsHandler,
        "resetInputWriter": resetInputWriter,
        "resetLevelEditor": resetLevelEditor,
        "resetWorldSeeder": resetWorldSeeder,
        "resetModAttacher": resetModAttacher,
        "startModAttacher": startModAttacher,
        "resetContainer": resetContainer,
        // Global manipulations
        "scrollWindow": scrollWindow,
        "scrollThing": scrollThing,
        "onAreaSpawn": onAreaSpawn,
        "onAreaUnspawn": onAreaUnspawn,
        "addThing": addThing,
        "thingProcess": thingProcess,
        "thingProcessAttributes": thingProcessAttributes,
        // Physics & similar
        "markChanged": markChanged,
        "shiftVert": shiftVert,
        "shiftHoriz": shiftHoriz,
        "setTop": setTop,
        "setRight": setRight,
        "setBottom": setBottom,
        "setLeft": setLeft,
        "shiftBoth": shiftBoth,
        "shiftThings": shiftThings,
        "shiftAll": shiftAll,
        "setWidth": setWidth,
        "setHeight": setHeight,
        "setSize": setSize,
        "updatePosition": updatePosition,
        "updateSize": updateSize,
        "reduceHeight": reduceHeight,
        "reduceWidth": reduceWidth,
        "increaseHeight": increaseHeight,
        "increaseWidth": increaseWidth,
        "thingStoreVelocity": thingStoreVelocity,
        "thingRetrieveVelocity": thingRetrieveVelocity,
        // Appearance utilities
        "generateObjectKey": generateObjectKey,
        "setTitle": setTitle,
        "setClass": setClass,
        "setClassInitial": setClassInitial,
        "addClass": addClass,
        "addClasses": addClasses,
        "removeClass": removeClass,
        "removeClasses": removeClasses,
        "hasClass": hasClass,
        "switchClass": switchClass,
        "flipHoriz": flipHoriz,
        "flipVert": flipVert,
        "unflipHoriz": unflipHoriz,
        "unflipVert": unflipVert,
        "setOpacity": setOpacity,
        // Miscellaneous utilities
        "takeScreenshot": takeScreenshot
    });
    
    return GameStartr;
})(EightBittr);