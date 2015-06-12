/// <reference path="ChangeLinr.d.ts" />
var ChangeLinr;
(function (_ChangeLinr) {
    "use strict";
    /**
     * A general utility for transforming raw input to processed output. This is
     * done by keeping an Array of transform Functions to process input on.
     * Outcomes for inputs are cached so repeat runs are O(1).
     *
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    var ChangeLinr = (function () {
        /**
         * Resets the ChangeLinr.
         * @constructor
         * @param {String[]} pipeline   The ordered pipeline of String names of the
         *                              transforms to call.
         * @param {Object} [transforms]   An Object containing Functions keyed by
         *                                their String name.
         * @param {Boolean} [doMakeCache]   Whether a cache should be constructed
         *                                  from inputs (defaults to true).
         * @param {Boolean} [doUseCache]   Whether the cache should be used to
         *                                 cache outputs (defaults to true).
         * @param {Boolean} [doUseGlobals]   Whether global Functions may be
         *                                   referenced by the pipeline Strings,
         *                                   rather than just ones in transforms
         *                                   (defaults to false).
         */
        function ChangeLinr(settings) {
            var i;
            if (typeof settings.pipeline === "undefined") {
                throw new Error("No pipeline given to ChangeLinr.");
            }
            this.pipeline = settings.pipeline || [];
            if (typeof settings.transforms === "undefined") {
                throw new Error("No transforms given to ChangeLinr.");
            }
            this.transforms = settings.transforms || {};
            this.doMakeCache = typeof settings.doMakeCache === "undefined" ? true : settings.doMakeCache;
            this.doUseCache = typeof settings.doUseCache === "undefined" ? true : settings.doUseCache;
            this.cache = {};
            this.cacheFull = {};
            for (i = 0; i < this.pipeline.length; ++i) {
                // Don't allow null/false transforms
                if (!this.pipeline[i]) {
                    throw new Error("Pipe[" + i + "] is invalid.");
                }
                // Make sure each part of the pipeline exists
                if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                    if (!this.transforms.hasOwnProperty(this.pipeline[i])) {
                        throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") " + "not found in transforms.");
                    }
                }
                // Also make sure each part of the pipeline is a Function
                if (!(this.transforms[this.pipeline[i]] instanceof Function)) {
                    throw new Error("Pipe[" + i + "] (\"" + this.pipeline[i] + "\") " + "is not a valid Function from transforms.");
                }
                this.cacheFull[i] = this.cacheFull[this.pipeline[i]] = {};
            }
        }
        /* Simple gets
        */
        /**
         * @return {Mixed} The cached output of this.process and this.processFull.
         */
        ChangeLinr.prototype.getCache = function () {
            return this.cache;
        };
        /**
         * @param {String} key   The key under which the output was processed
         * @return {Mixed} The cached output filed under the given key.
         */
        ChangeLinr.prototype.getCached = function (key) {
            return this.cache[key];
        };
        /**
         * @return {Object} A complete listing of the cached outputs from all
         *                  processed information, from each pipeline transform.
         */
        ChangeLinr.prototype.getCacheFull = function () {
            return this.cacheFull;
        };
        /**
         * @return {Boolean} Whether the cache object is being kept.
         */
        ChangeLinr.prototype.getDoMakeCache = function () {
            return this.doMakeCache;
        };
        /**
         * @return {Boolean} Whether previously cached output is being used in new
         *                   process requests.
         */
        ChangeLinr.prototype.getDoUseCache = function () {
            return this.doUseCache;
        };
        /* Core processing
        */
        /**
         * Applies a series of transforms to input data. If doMakeCache is on, the
         * outputs of this are stored in cache and cacheFull.
         *
         * @param {Mixed} data   The data to be transformed.
         * @param {String} [key]   They key under which the data is to be stored.
         *                         If needed but not provided, defaults to data.
         * @param {Object} [attributes]   Any extra attributes to be given to the
         *                                transform Functions.
         * @return {Mixed} The final output of the pipeline.
         */
        ChangeLinr.prototype.process = function (data, key, attributes) {
            if (key === void 0) { key = undefined; }
            if (attributes === void 0) { attributes = undefined; }
            var i;
            if (typeof key === "undefined" && (this.doMakeCache || this.doUseCache)) {
                key = data;
            }
            // If this keyed input was already processed, get that
            if (this.doUseCache && this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }
            for (i = 0; i < this.pipeline.length; ++i) {
                data = this.transforms[this.pipeline[i]](data, key, attributes, this);
                if (this.doMakeCache) {
                    this.cacheFull[this.pipeline[i]][key] = data;
                }
            }
            if (this.doMakeCache) {
                this.cache[key] = data;
            }
            return data;
        };
        /**
         * A version of this.process that returns the complete output from each
         * pipelined transform Function in an Object.
         *
         * @param {Mixed} data   The data to be transformed.
         * @param {String} [key]   They key under which the data is to be stored.
         *                         If needed but not provided, defaults to data.
         * @param {Object} [attributes]   Any extra attributes to be given to the
         *                                transform Functions.
         * @return {Object} The complete output of the transforms.
         */
        ChangeLinr.prototype.processFull = function (raw, key, attributes) {
            if (attributes === void 0) { attributes = undefined; }
            var output = {}, i;
            this.process(raw, key, attributes);
            for (i = 0; i < this.pipeline.length; ++i) {
                output[i] = output[this.pipeline[i]] = this.cacheFull[this.pipeline[i]][key];
            }
            return output;
        };
        return ChangeLinr;
    })();
    _ChangeLinr.ChangeLinr = ChangeLinr;
})(ChangeLinr || (ChangeLinr = {}));
/// <reference path="StringFilr.d.ts" />
var StringFilr;
(function (_StringFilr) {
    "use strict";
    /**
     * A general utility for retrieving data from an Object based on nested class
     * names. You can think of the internal "library" Object as a tree structure,
     * such that you can pass in a listing (in any order) of the path to data for
     * retrieval.
     *
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    var StringFilr = (function () {
        /**
         * Resets the StringFilr.
         *
         * @constructor
         * @param {IStringFilrSettings} settings
         */
        function StringFilr(settings) {
            if (!settings) {
                throw new Error("No settings given to StringFilr.");
            }
            if (!settings.library) {
                throw new Error("No library given to StringFilr.");
            }
            this.library = settings.library;
            this.normal = settings.normal;
            this.requireNormalKey = settings.requireNormalKey;
            this.cache = {};
            if (this.requireNormalKey) {
                if (typeof this.normal === "undefined") {
                    throw new Error("StringFilr is given requireNormalKey, but no normal class.");
                }
                this.ensureLibraryNormal();
            }
        }
        /**
         * @return {Object} The base library of stored information.
         */
        StringFilr.prototype.getLibrary = function () {
            return this.library;
        };
        /**
         * @return {String} The optional normal class String.
         */
        StringFilr.prototype.getNormal = function () {
            return this.normal;
        };
        /**
         * @return {Object} The complete cache of cached output.
         */
        StringFilr.prototype.getCache = function () {
            return this.cache;
        };
        /**
         * @return {Mixed} A cached value, if it exists/
         */
        StringFilr.prototype.getCached = function (key) {
            return this.cache[key];
        };
        /**
         * Completely clears the cache Object.
         */
        StringFilr.prototype.clearCache = function () {
            this.cache = {};
        };
        /**
         * Clears the cached entry for a key.
         *
         * @param {String} key
         */
        StringFilr.prototype.clearCached = function (key) {
            if (this.normal) {
                key = key.replace(this.normal, "");
            }
            delete this.cache[key];
        };
        /**
         * Retrieves the deepest matching data in the library for a key.
         *
         * @param {String} keyRaw
         * @return {Mixed}
         */
        StringFilr.prototype.get = function (keyRaw) {
            var key, result;
            if (this.normal) {
                key = keyRaw.replace(this.normal, "");
            }
            else {
                key = keyRaw;
            }
            // Quickly return a cached result if it exists
            if (this.cache.hasOwnProperty(key)) {
                return this.cache[key];
            }
            // Since no existed, it must be found deep within the library
            result = this.followClass(key.split(/\s+/g), this.library);
            this.cache[key] = this.cache[keyRaw] = result;
            return result;
        };
        /**
         * Utility helper to recursively check for tree branches in the library
         * that don't have a key equal to the normal. For each sub-directory that
         * is caught, the path to it is added to output.
         *
         * @param {Object} current   The current location being searched within
         *                           the library.
         * @param {String} path   The current path within the library.
         * @param {String[]} output   An Array of the String paths to parts that
         *                           don't have a matching key.
         * @return {String[]} output
         */
        StringFilr.prototype.findLackingNormal = function (current, path, output) {
            var i;
            if (!current.hasOwnProperty(this.normal)) {
                output.push(path);
            }
            if (typeof current[i] === "object") {
                for (i in current) {
                    if (current.hasOwnProperty(i)) {
                        this.findLackingNormal(current[i], path + " " + i, output);
                    }
                }
            }
            return output;
        };
        /**
         * Utility function to follow a path into the library (this is the driver
         * for searching into the library). For each available key, if it matches
         * a key in current, it is removed from keys and recursion happens on the
         * sub-directory in current.
         *
         * @param {String[]} keys   The currently available keys to search within.
         * @param {Object} current   The current location being searched within
         *                           the library.
         * @return {Mixed} The most deeply matched part of the library.
         */
        StringFilr.prototype.followClass = function (keys, current) {
            var key, i;
            // If keys runs out, we're done
            if (!keys || !keys.length) {
                return current;
            }
            for (i = 0; i < keys.length; i += 1) {
                key = keys[i];
                // ...if it matches, recurse on the other keys
                if (current.hasOwnProperty(key)) {
                    keys.splice(i, 1);
                    return this.followClass(keys, current[key]);
                }
            }
            // If no key matched, try the normal (default)
            if (this.normal && current.hasOwnProperty(this.normal)) {
                return this.followClass(keys, current[this.normal]);
            }
            // Nothing matches anything; we're done.
            return current;
        };
        /**
         * Driver for this.findLackingNormal. If library directories are found to
         * not have a normal, it throws an error.
         */
        StringFilr.prototype.ensureLibraryNormal = function () {
            var caught = this.findLackingNormal(this.library, "base", []);
            if (caught.length) {
                throw new Error("Found " + caught.length + " library " + "sub-directories missing the normal: " + "\r\n  " + caught.join("\r\n  "));
            }
        };
        return StringFilr;
    })();
    _StringFilr.StringFilr = StringFilr;
})(StringFilr || (StringFilr = {}));
/// <reference path="References/ChangeLinr/ChangeLinr.ts" />
/// <reference path="References/StringFilr/StringFilr.ts" />
/// <reference path="References/ObjectMakr.d.ts" />
/// <reference path="References/PixelRendr.d.ts" />
/// <reference path="References/QuadsKeepr.d.ts" />
/// <reference path="PixelDrawr.d.ts" />
var PixelDrawr;
(function (_PixelDrawr) {
    "use strict";
    /**
     * PixelDrawr.js
     *
     * A front-end to PixelRendr to automate drawing mass amounts of sprites to a
     * primary canvas. A PixelRendr keeps track of sprite sources, while a
     * MapScreenr maintains boundary information on the screen. Global screen
     * refills may be done by drawing every Thing in the thingArrays, or by
     * Quadrants as a form of dirty rectangles.
     *
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    var PixelDrawr = (function () {
        /**
         * Resets the PixelDrawr.
         *
         * @constructor
         * @param {IPixelDrawrSettings} settings
         */
        function PixelDrawr(settings) {
            this.PixelRender = settings.PixelRender;
            this.MapScreener = settings.MapScreener;
            this.createCanvas = settings.createCanvas;
            this.unitsize = settings.unitsize || 1;
            this.noRefill = settings.noRefill;
            this.spriteCacheCutoff = settings.spriteCacheCutoff || 0;
            this.groupNames = settings.groupNames;
            this.framerateSkip = settings.framerateSkip || 1;
            this.framesDrawn = 0;
            this.epsilon = settings.epsilon || .007;
            this.keyWidth = settings.keyWidth || "width";
            this.keyHeight = settings.keyHeight || "height";
            this.keyTop = settings.keyTop || "top";
            this.keyRight = settings.keyRight || "right";
            this.keyBottom = settings.keyBottom || "bottom";
            this.keyLeft = settings.keyLeft || "left";
            this.keyOffsetX = settings.keyOffsetX;
            this.keyOffsetY = settings.keyOffsetY;
            this.generateObjectKey = settings.generateObjectKey || function (thing) {
                return thing.toString();
            };
            this.resetBackground();
        }
        /* Simple gets
        */
        /**
         * @return {Number} How often refill calls should be skipped.
         */
        PixelDrawr.prototype.getFramerateSkip = function () {
            return this.framerateSkip;
        };
        /**
         * @return {Array[]} The Arrays to be redrawn during refill calls.
         */
        PixelDrawr.prototype.getThingArray = function () {
            return this.thingArrays;
        };
        /**
         * @return {HTMLCanvasElement} The canvas element each Thing is to drawn on.
         */
        PixelDrawr.prototype.getCanvas = function () {
            return this.canvas;
        };
        /**
         * @return {CanvasRenderingContext2D} The 2D canvas context associated with
         *                                    the canvas.
         */
        PixelDrawr.prototype.getContext = function () {
            return this.context;
        };
        /**
         * @return {HTMLCanvasElement} The canvas element used for the background.
         */
        PixelDrawr.prototype.getBackgroundCanvas = function () {
            return this.backgroundCanvas;
        };
        /**
         * @return {CanvasRenderingContext2D} The 2D canvas context associated with
         *                                    the background canvas.
         */
        PixelDrawr.prototype.getBackgroundContext = function () {
            return this.backgroundContext;
        };
        /**
         * @return {Boolean} Whether refills should skip redrawing the background
         *                   each time.
         */
        PixelDrawr.prototype.getNoRefill = function () {
            return this.noRefill;
        };
        /**
         * @return {Number} The minimum opacity that will be drawn.
         */
        PixelDrawr.prototype.getEpsilon = function () {
            return this.epsilon;
        };
        /* Simple sets
        */
        /**
         * @param {Number} framerateSkip   How often refill calls should be skipped.
         */
        PixelDrawr.prototype.setFramerateSkip = function (framerateSkip) {
            this.framerateSkip = framerateSkip;
        };
        /**
         * @param {Array[]} thingArrays   The Arrays to be redrawn during refill calls.
         */
        PixelDrawr.prototype.setThingArrays = function (thingArrays) {
            this.thingArrays = thingArrays;
        };
        /**
         * Sets the currently drawn canvas and context, and recreates
         * drawThingOnContextBound.
         *
         * @param {HTMLCanvasElement} canvas   The new primary canvas to be used.
         */
        PixelDrawr.prototype.setCanvas = function (canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
        };
        /**
         * @param {Boolean} noRefill   Whether refills should now skip redrawing the
         *                             background each time.
         */
        PixelDrawr.prototype.setNoRefill = function (noRefill) {
            this.noRefill = noRefill;
        };
        /**
         * @param {Number} The minimum opacity that will be drawn.
         */
        PixelDrawr.prototype.setEpsilon = function (epsilon) {
            this.epsilon = epsilon;
        };
        /* Background manipulations
        */
        /**
         * Creates a new canvas the size of MapScreener and sets the background
         * canvas to it, then recreates backgroundContext.
         */
        PixelDrawr.prototype.resetBackground = function () {
            this.backgroundCanvas = this.createCanvas(this.MapScreener[this.keyWidth], this.MapScreener[this.keyHeight]);
            this.backgroundContext = this.backgroundCanvas.getContext("2d");
        };
        /**
         * Refills the background canvas with a new fillStyle.
         *
         * @param {Mixed} fillStyle   The new fillStyle for the background context.
         */
        PixelDrawr.prototype.setBackground = function (fillStyle) {
            this.backgroundContext.fillStyle = fillStyle;
            this.backgroundContext.fillRect(0, 0, this.MapScreener[this.keyWidth], this.MapScreener[this.keyHeight]);
        };
        /**
         * Draws the background canvas onto the main canvas' context.
         */
        PixelDrawr.prototype.drawBackground = function () {
            this.context.drawImage(this.backgroundCanvas, 0, 0);
        };
        /* Core rendering
        */
        /**
         * Goes through all the motions of finding and parsing a Thing's sprite.
         * This should be called whenever the sprite's appearance changes.
         *
         * @param {Thing} thing   A Thing whose sprite must be updated.
         * @return {Self}
         */
        PixelDrawr.prototype.setThingSprite = function (thing) {
            // If it's set as hidden, don't bother updating it
            if (thing.hidden) {
                return;
            }
            // PixelRender does most of the work in fetching the rendered sprite
            thing.sprite = this.PixelRender.decode(this.generateObjectKey(thing), thing);
            // To do: remove dependency on .numSprites
            // For now, kit's used to know whether it's had its sprite set, but 
            // wouldn't physically having a .sprite do that?
            if (thing.sprite.multiple) {
                thing.numSprites = 0;
                this.refillThingCanvasMultiple(thing);
            }
            else {
                thing.numSprites = 1;
                this.refillThingCanvasSingle(thing);
            }
        };
        /**
         * Simply draws a thing's sprite to its canvas by getting and setting
         * a canvas::imageData object via context.getImageData(...).
         *
         * @param {Thing} thing   A Thing whose canvas must be updated.
         */
        PixelDrawr.prototype.refillThingCanvasSingle = function (thing) {
            // Don't draw small Things.
            if (thing[this.keyWidth] < 1 || thing[this.keyHeight] < 1) {
                return;
            }
            // Retrieve the imageData from the Thing's canvas & renderingContext
            var canvas = thing.canvas, context = thing.context, imageData = context.getImageData(0, 0, canvas[this.keyWidth], canvas[this.keyHeight]);
            // Copy the thing's sprite to that imageData and into the contextz
            this.PixelRender.memcpyU8(thing.sprite, imageData.data);
            context.putImageData(imageData, 0, 0);
        };
        /**
         * For SpriteMultiples, this copies the sprite information for each
         * sub-sprite into its own canvas, sets thing.sprites, then draws the newly
         * rendered information onto the thing's canvas.
         *
         * @param {Thing} thing   A Thing whose canvas and sprites must be updated.
         */
        PixelDrawr.prototype.refillThingCanvasMultiple = function (thing) {
            if (thing[this.keyWidth] < 1 || thing[this.keyHeight] < 1) {
                return;
            }
            var spritesRaw = thing.sprite, canvases = thing.canvases = {
                "direction": spritesRaw.direction,
                "multiple": true
            }, canvas, context, imageData, i;
            thing.numSprites = 1;
            for (i in spritesRaw.sprites) {
                if (!spritesRaw.sprites.hasOwnProperty(i)) {
                    continue;
                }
                // Make a new sprite for this individual component
                canvas = this.createCanvas(thing.spritewidth * this.unitsize, thing.spriteheight * this.unitsize);
                context = canvas.getContext("2d");
                // Copy over this sprite's information the same way as refillThingCanvas
                imageData = context.getImageData(0, 0, canvas[this.keyWidth], canvas[this.keyHeight]);
                this.PixelRender.memcpyU8(spritesRaw.sprites[i], imageData.data);
                context.putImageData(imageData, 0, 0);
                // Record the canvas and context in thing.sprites
                canvases[i] = {
                    "canvas": canvas,
                    "context": context
                };
                thing.numSprites += 1;
            }
            // Only pre-render multiple sprites if they're below the cutoff
            if (thing[this.keyWidth] * thing[this.keyHeight] < this.spriteCacheCutoff) {
                thing.canvas[this.keyWidth] = thing[this.keyWidth] * this.unitsize;
                thing.canvas[this.keyHeight] = thing[this.keyHeight] * this.unitsize;
                this.drawThingOnContextMultiple(thing.context, thing.canvases, thing, 0, 0);
            }
            else {
                thing.canvas[this.keyWidth] = thing.canvas[this.keyHeight] = 0;
            }
        };
        /* Core drawing
        */
        /**
         * Called every upkeep to refill the entire main canvas. All Thing arrays
         * are made to call this.refillThingArray in order.
         */
        PixelDrawr.prototype.refillGlobalCanvas = function () {
            this.framesDrawn += 1;
            if (this.framesDrawn % this.framerateSkip !== 0) {
                return;
            }
            if (!this.noRefill) {
                this.drawBackground();
            }
            for (var i = 0; i < this.thingArrays.length; i += 1) {
                this.refillThingArray(this.thingArrays[i]);
            }
        };
        /**
         * Calls drawThingOnContext on each Thing in the Array.
         *
         * @param {Thing[]} array   A listing of Things to be drawn onto the canvas.
         */
        PixelDrawr.prototype.refillThingArray = function (array) {
            for (var i = 0; i < array.length; i += 1) {
                this.drawThingOnContext(this.context, array[i]);
            }
        };
        /**
         * Refills the main canvas by calling refillQuadrants on each Quadrant in
         * the groups.
         *
         * @param {QuadrantRow[]} groups   QuadrantRows (or QuadrantCols) to be
         *                                 redrawn to the canvas.
         */
        PixelDrawr.prototype.refillQuadrantGroups = function (groups) {
            var i;
            this.framesDrawn += 1;
            if (this.framesDrawn % this.framerateSkip !== 0) {
                return;
            }
            for (i = 0; i < groups.length; i += 1) {
                this.refillQuadrants(groups[i].quadrants);
            }
        };
        /**
         * Refills (part of) the main canvas by drawing each Quadrant's canvas onto
         * it.
         *
         * @param {Quadrant[]} quadrants   The Quadrants to have their canvases
         *                                 refilled.
         */
        PixelDrawr.prototype.refillQuadrants = function (quadrants) {
            var quadrant, i;
            for (i = 0; i < quadrants.length; i += 1) {
                quadrant = quadrants[i];
                if (quadrant.changed && quadrant[this.keyTop] < this.MapScreener[this.keyHeight] && quadrant[this.keyRight] > 0 && quadrant[this.keyBottom] > 0 && quadrant[this.keyLeft] < this.MapScreener[this.keyWidth]) {
                    this.refillQuadrant(quadrant);
                    this.context.drawImage(quadrant.canvas, quadrant[this.keyLeft], quadrant[this.keyTop]);
                }
            }
        };
        /**
         * Refills a Quadrants's canvas by resetting its background and drawing all
         * its Things onto it.
         *
         * @param {Quadrant} quadrant   A quadrant whose Things must be drawn onto
         *                              its canvas.
         */
        PixelDrawr.prototype.refillQuadrant = function (quadrant) {
            var group, i, j;
            // This may be what's causing such bad performance.
            if (!this.noRefill) {
                quadrant.context.drawImage(this.backgroundCanvas, quadrant[this.keyLeft], quadrant[this.keyTop], quadrant.canvas[this.keyWidth], quadrant.canvas[this.keyHeight], 0, 0, quadrant.canvas[this.keyWidth], quadrant.canvas[this.keyHeight]);
            }
            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                group = quadrant.things[this.groupNames[i]];
                for (j = 0; j < group.length; j += 1) {
                    this.drawThingOnQuadrant(group[j], quadrant);
                }
            }
            quadrant.changed = false;
        };
        /**
         * General Function to draw a Thing onto a context. This will call
         * drawThingOnContext[Single/Multiple] with more arguments
         *
         * @param {CanvasRenderingContext2D} context   The context to have the Thing
         *                                             drawn on it.
         * @param {Thing} thing   The Thing to be drawn onto the context.
         */
        PixelDrawr.prototype.drawThingOnContext = function (context, thing) {
            if (thing.hidden || thing.opacity < this.epsilon || thing[this.keyHeight] < 1 || thing[this.keyWidth] < 1 || this.getTop(thing) > this.MapScreener[this.keyHeight] || this.getRight(thing) < 0 || this.getBottom(thing) < 0 || this.getLeft(thing) > this.MapScreener[this.keyWidth]) {
                return;
            }
            // If Thing hasn't had a sprite yet (previously hidden), do that first
            if (typeof thing.numSprites === "undefined") {
                this.setThingSprite(thing);
            }
            // Whether or not the thing has a regular sprite or a SpriteMultiple, 
            // that sprite has already been drawn to the thing's canvas, unless it's
            // above the cutoff, in which case that logic happens now.
            if (thing.canvas[this.keyWidth] > 0) {
                this.drawThingOnContextSingle(context, thing.canvas, thing, this.getLeft(thing), this.getTop(thing));
            }
            else {
                this.drawThingOnContextMultiple(context, thing.canvases, thing, this.getLeft(thing), this.getTop(thing));
            }
        };
        /**
         * Draws a Thing onto a quadrant's canvas. This is a simple wrapper around
         * drawThingOnContextSingle/Multiple that also bounds checks.
         *
         * @param {Thing} thing
         * @param {Quadrant} quadrant
         */
        PixelDrawr.prototype.drawThingOnQuadrant = function (thing, quadrant) {
            if (thing.hidden || this.getTop(thing) > quadrant[this.keyBottom] || this.getRight(thing) < quadrant[this.keyLeft] || this.getBottom(thing) < quadrant[this.keyTop] || this.getLeft(thing) > quadrant[this.keyRight] || thing.opacity < this.epsilon) {
                return;
            }
            // If there's just one sprite, it's pretty simple
            if (thing.numSprites === 1) {
                return this.drawThingOnContextSingle(quadrant.context, thing.canvas, thing, this.getLeft(thing) - quadrant[this.keyLeft], this.getTop(thing) - quadrant[this.keyTop]);
            }
            else {
                // For multiple sprites, some calculations will be needed
                return this.drawThingOnContextMultiple(quadrant.context, thing.canvases, thing, this.getLeft(thing) - quadrant[this.keyLeft], this.getTop(thing) - quadrant[this.keyTop]);
            }
        };
        /**
         * Draws a Thing's single canvas onto a context, commonly called by
         * this.drawThingOnContext.
         *
         * @param {CanvasRenderingContext2D} context    The context being drawn on.
         * @param {Canvas} canvas   The Thing's canvas being drawn onto the context.
         * @param {Thing} thing   The Thing whose canvas is being drawn.
         * @param {Number} left   The x-position to draw the Thing from.
         * @param {Number} top   The y-position to draw the Thing from.
         */
        PixelDrawr.prototype.drawThingOnContextSingle = function (context, canvas, thing, left, top) {
            // If the sprite should repeat, use the pattern equivalent
            if (thing.repeat) {
                this.drawPatternOnContext(context, canvas, left, top, thing.unitwidth, thing.unitheight, thing.opacity || 1);
            }
            else if (thing.opacity !== 1) {
                // Opacities not equal to one must reset the context afterwards
                context.globalAlpha = thing.opacity;
                context.drawImage(canvas, left, top, canvas.width * thing.scale, canvas.height * thing.scale);
                context.globalAlpha = 1;
            }
            else {
                context.drawImage(canvas, left, top, canvas.width * thing.scale, canvas.height * thing.scale);
            }
        };
        /**
         * Draws a Thing's multiple canvases onto a context, typicall called by
         * drawThingOnContext. A variety of cases for canvases is allowed:
         * "vertical", "horizontal", and "corners".
         *
         * @param {CanvasRenderingContext2D} context    The context being drawn on.
         * @param {Canvas} canvases   The canvases being drawn onto the context.
         * @param {Thing} thing   The Thing whose canvas is being drawn.
         * @param {Number} left   The x-position to draw the Thing from.
         * @param {Number} top   The y-position to draw the Thing from.
         */
        PixelDrawr.prototype.drawThingOnContextMultiple = function (context, canvases, thing, left, top) {
            var sprite = thing.sprite, topreal = top, leftreal = left, rightreal = left + thing.unitwidth, bottomreal = top + thing.unitheight, widthreal = thing.unitwidth, heightreal = thing.unitheight, spritewidthpixels = thing.spritewidthpixels, spriteheightpixels = thing.spriteheightpixels, widthdrawn = Math.min(widthreal, spritewidthpixels), heightdrawn = Math.min(heightreal, spriteheightpixels), opacity = thing.opacity, diffhoriz, diffvert, canvasref;
            switch (canvases.direction) {
                case "vertical":
                    // If there's a bottom, draw that and push up bottomreal
                    if ((canvasref = canvases[this.keyBottom])) {
                        diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteheightpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, bottomreal - diffvert, widthreal, heightdrawn, opacity);
                        bottomreal -= diffvert;
                        heightreal -= diffvert;
                    }
                    // If there's a top, draw that and push down topreal
                    if ((canvasref = canvases[this.keyTop])) {
                        diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteheightpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthreal, heightdrawn, opacity);
                        topreal += diffvert;
                        heightreal -= diffvert;
                    }
                    break;
                case "horizontal":
                    // If there's a left, draw that and push forward leftreal
                    if ((canvasref = canvases[this.keyLeft])) {
                        diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spritewidthpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthdrawn, heightreal, opacity);
                        leftreal += diffhoriz;
                        widthreal -= diffhoriz;
                    }
                    // If there's a right, draw that and push back rightreal
                    if ((canvasref = canvases[this.keyRight])) {
                        diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spritewidthpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal, opacity);
                        rightreal -= diffhoriz;
                        widthreal -= diffhoriz;
                    }
                    break;
                case "corners":
                    // topLeft, left, bottomLeft
                    diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteheightpixels;
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spritewidthpixels;
                    this.drawPatternOnContext(context, canvases.topLeft.canvas, leftreal, topreal, widthdrawn, heightdrawn, opacity);
                    this.drawPatternOnContext(context, canvases[this.keyLeft].canvas, leftreal, topreal + diffvert, widthdrawn, heightreal - diffvert * 2, opacity);
                    this.drawPatternOnContext(context, canvases.bottomLeft.canvas, leftreal, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                    leftreal += diffhoriz;
                    widthreal -= diffhoriz;
                    // top, topRight
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spritewidthpixels;
                    this.drawPatternOnContext(context, canvases[this.keyTop].canvas, leftreal, topreal, widthreal - diffhoriz, heightdrawn, opacity);
                    this.drawPatternOnContext(context, canvases.topRight.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightdrawn, opacity);
                    topreal += diffvert;
                    heightreal -= diffvert;
                    // right, bottomRight, bottom
                    diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteheightpixels;
                    this.drawPatternOnContext(context, canvases[this.keyRight].canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal - diffvert, opacity);
                    this.drawPatternOnContext(context, canvases.bottomRight.canvas, rightreal - diffhoriz, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                    this.drawPatternOnContext(context, canvases[this.keyBottom].canvas, leftreal, bottomreal - diffvert, widthreal - diffhoriz, heightdrawn, opacity);
                    rightreal -= diffhoriz;
                    widthreal -= diffhoriz;
                    bottomreal -= diffvert;
                    heightreal -= diffvert;
                    break;
            }
            // If there's still room, draw the actual canvas
            if ((canvasref = canvases.middle) && topreal < bottomreal && leftreal < rightreal) {
                if (sprite.middleStretch) {
                    context.globalAlpha = opacity;
                    context.drawImage(canvasref.canvas, leftreal, topreal, widthreal, heightreal);
                    context.globalAlpha = 1;
                }
                else {
                    this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthreal, heightreal, opacity);
                }
            }
        };
        /* Position utilities (which should almost always be optimized)
        */
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's top position, accounting for vertical
         *                  offset if needed.
         */
        PixelDrawr.prototype.getTop = function (thing) {
            if (this.keyOffsetY) {
                return thing[this.keyTop] + thing[this.keyOffsetY];
            }
            else {
                return thing[this.keyTop];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's right position, accounting for horizontal
         *                  offset if needed.
         */
        PixelDrawr.prototype.getRight = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyRight] + thing[this.keyOffsetX];
            }
            else {
                return thing[this.keyRight];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's bottom position, accounting for vertical
         *                  offset if needed.
         */
        PixelDrawr.prototype.getBottom = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyBottom] + thing[this.keyOffsetY];
            }
            else {
                return thing[this.keyBottom];
            }
        };
        /**
         * @param {Thing} thing
         * @return {Number} The Thing's left position, accounting for horizontal
         *                  offset if needed.
         */
        PixelDrawr.prototype.getLeft = function (thing) {
            if (this.keyOffsetX) {
                return thing[this.keyLeft] + thing[this.keyOffsetX];
            }
            else {
                return thing[this.keyLeft];
            }
        };
        /* Utilities
        */
        /**
         * Draws a source pattern onto a context. The pattern is clipped to the size
         * of MapScreener.
         *
         * @param {CanvasRenderingContext2D} context   The context the pattern will
         *                                             be drawn onto.
         * @param {Mixed} source   The image being repeated as a pattern. This can
         *                         be a canvas, an image, or similar.
         * @param {Number} left   The x-location to draw from.
         * @param {Number} top   The y-location to draw from.
         * @param {Number} width   How many pixels wide the drawing area should be.
         * @param {Number} left   How many pixels high the drawing area should be.
         * @param {Number} opacity   How transparent the drawing is, in [0,1].
         */
        PixelDrawr.prototype.drawPatternOnContext = function (context, source, left, top, width, height, opacity) {
            context.globalAlpha = opacity;
            context.translate(left, top);
            context.fillStyle = context.createPattern(source, "repeat");
            context.fillRect(0, 0, width, height);
            context.translate(-left, -top);
            context.globalAlpha = 1;
        };
        return PixelDrawr;
    })();
    _PixelDrawr.PixelDrawr = PixelDrawr;
})(PixelDrawr || (PixelDrawr = {}));
