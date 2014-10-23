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
    
    
    /* Global manipulations
    */
    
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
    function scrollThing(thing, dx, dy) {
        var saveleft = thing.left,
            savetop = thing.top;
        
        thing.EightBitter.scrollWindow(dx, dy);
        thing.EightBitter.setLeft(thing, saveleft);
        thing.EightBitter.setTop(thing, savetop);
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
        
        if(arguments.length > 2) {
            thing.EightBitter.setLeft(thing, left);
            thing.EightBitter.setTop(thing, top);
        } else if(arguments.length > 1) {
            thing.EightBitter.setLeft(thing, left);
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
    
    /* Physics & similar
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
    function setWidth(thing, width, update_sprite, update_size) {
        thing.width = width;
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
    function setOpacity(thing, opacity) {
        thing.opacity = opacity;
        thing.canvas.opacity = opacity;
        thing.context.opacity = opacity;
        // thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }
    
    
    // Add all registered functions from above to the GameStartr prototype
    proliferateHard(GameStartr.prototype, {
        // Global manipulations
        "scrollWindow": scrollWindow,
        "scrollThing": scrollThing,
        "addThing": addThing,
        "thingProcess": thingProcess,
        "thingProcessAttributes": thingProcessAttributes,
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
        // Appearance utilities
        "generateObjectKey": generateObjectKey,
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
        "setOpacity": setOpacity
    });
    
    return GameStartr;
})(EightBittr);