function PixelDrawr(settings) {
    "use strict";
    if (this === window) {
        return new PixelDrawr(settings);
    }
    var self = this,
        
        // A PixelRender object used to obtain raw sprite data and canvases
        PixelRender,
        
        // A MapScreenr variable to be used for bounds checking
        MapScreener,
        
        // The canvas object each Thing is to be drawn on
        canvas,
        
        // The 2D canvas context associated with the canvas
        context,
        
        // A separate canvas that keeps the background of the scene
        backgroundCanvas,
        
        // The 2D canvas context associated with the background canvas
        backgroundContext,
        
        // Arrays of Thing[]s that are to be drawn in each refillGlobalCanvas
        thing_arrays,
        
        // Utility function to create a canvas (typically taken from EightBittr)
        createCanvas,
        
        unitsize,
        
        // A utility function to generate a class key to get an object sprite
        generateObjectKey,
        
        // The maximum size of a SpriteMultiple to pre-render
        spriteCacheCutoff,
        
        // Whether self.refillGlobalCanvas should skip redrawing the main canvas
        // every time.
        noRefill,
        
        // For refillQuadrant, an Array of string names to refill (bottom-to-top)
        groupNames,
        
        // How often the screen redraws. 1 is always, 2 is every other call, etc.
        framerateSkip,
        
        // How many frames have been drawn so far
        framesDrawn;
    
    /**
     * 
     */
    self.reset = function(settings) {
        PixelRender = settings.PixelRender;
        MapScreener = settings.MapScreener;
        createCanvas = settings.createCanvas;
        unitsize = settings.unitsize || 4;
        noRefill = settings.noRefill;
        spriteCacheCutoff = settings.spriteCacheCutoff || 0;
        groupNames = settings.groupNames;
        framerateSkip = settings.framerateSkip || 1;
        framesDrawn = 0;
        
        generateObjectKey = settings.generateObjectKey || function (object) {
            return object.toString();
        };
        
        self.resetBackground();
    }
    
    
    
    /* Simple gets & sets
    */
    
    /**
     * 
     */
    self.getFramerateSkip = function () {
        return framerateSkip;
    };
    
    /**
     * 
     */
    self.setFramerateSkip = function (skip) {
        framerateSkip = skip;
    };
    
    /**
     * 
     */
    self.setThingArrays = function (arrays) {
        thing_arrays = arrays;
    }
    
    /**
     * 
     */
    self.setCanvas = function (canvasNew) {
        canvas = canvasNew;
        context = canvas.getContext("2d");
        self.drawThingOnContextBound = self.drawThingOnContext.bind(self, context);
    }
    
    /**
     * 
     */
    self.setNoRefill = function (enabled) {
        noRefill = enabled;
    };
    
    
    /* Background manipulations
    */
    
    /**
     * 
     */
    self.resetBackground = function () {
        backgroundCanvas = createCanvas(MapScreener.width, MapScreener.height);
        backgroundContext = backgroundCanvas.getContext("2d");
    };
    
    /**
     * 
     */
    self.setBackground = function (fill) {
        backgroundContext.fillStyle = fill;
        backgroundContext.fillRect(0, 0, MapScreener.width, MapScreener.height);
    };
    
    /**
     * 
     */
    function drawBackground() {
        context.drawImage(backgroundCanvas, 0, 0);
    }
    
    
    /* Core rendering
    */
    
    /**
     * Goes through all the motions of find and parsing a thing's sprite
     * This should be called whenever the sprite's appearance changes
     * 
     * @param {Thing} thing   A thing whose sprite must be updated
     * @return {Self}
     */
    self.setThingSprite = function(thing) {
        // If it's set as hidden, don't bother updating it
        if (thing.hidden) {
            return;
        }
        
        // PixelRender does most of the work in fetching the rendered sprite
        thing.sprite = PixelRender.decode(generateObjectKey(thing), thing);
        
        // To do: remove dependency on .num_sprites and sprite_type
        if (thing.sprite.multiple) {
            thing.sprite_type = thing.sprite.type;
            refillThingCanvasMultiple(thing, thing.sprite);
        }
        else {
            thing.num_sprites = 1;
            thing.sprite_type = "normal";
            refillThingCanvasSingle(thing, thing.sprite);
        }
        
        return self;
    }
    
    /**
     * Simply draws a thing's sprite to its canvas by getting and setting
     * a canvas::imageData object via context.getImageData(...).
     * 
     * @param {Thing} thing   A thing whose .canvas must be updated
     * @return {Self}
     * @private
     */
    function refillThingCanvasSingle(thing) {
        if (thing.width < 1 || thing.height < 1) {
            return;
        }
        
        var canvas = thing.canvas,
            context = thing.context,
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        PixelRender.memcpyU8(thing.sprite, imageData.data);
        context.putImageData(imageData, 0, 0);
        
        return self;
    }
    
    /**
     * For SpriteMultiples, this copies the sprite information for each 
     * sub-sprite into its own canvas, sets thing.sprites, then draws the newly
     * rendered information onto the thing's canvas.
     * 
     * @param {Thing} thing   A thing whose .canvas and .sprites must be updated
     * @return {Self}
     * @private
     */
    function refillThingCanvasMultiple(thing) {
        if (thing.width < 1 || thing.height < 1) {
            return;
        }
        
        var sprites_raw = thing.sprite,
            canvases = thing.canvases = {
                "direction": sprites_raw.direction,
                "multiple": true 
            },
            canvas, context, imageData, i;

        thing.num_sprites = 1;

        for (i in sprites_raw.sprites) {
            // Make a new sprite for this individual component
            canvas = createCanvas(thing.spritewidth * unitsize, thing.spriteheight * unitsize);
            context = canvas.getContext("2d");

            // Copy over this sprite's information the same way as refillThingCanvas
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            PixelRender.memcpyU8(sprites_raw.sprites[i], imageData.data);
            context.putImageData(imageData, 0, 0);

            // Record the canvas and context in thing.sprites
            canvases[i] = {
                "canvas": canvas,
                "context": context
            }
            thing.num_sprites += 1;
        }
        
        if (thing.width * thing.height < spriteCacheCutoff) {
            thing.canvas.width = thing.width * unitsize;
            thing.canvas.height = thing.height * unitsize;
            drawThingOnContextMultiple(thing.context, thing.canvases, thing, 0, 0);
        } else {
            thing.canvas.width = thing.canvas.height = 0;
        }
      
        return canvases;
    }
    
    
    /* Core drawing
    */
    
    /**
     * Called every upkeep to refill the entire main canvas. All Thing arrays
     * are made to call self.refillThingArray in order.
     * 
     * @param {string} background   The background to refill the context with
     *                              before drawing anything, unless noRefill is
     *                              enabled.
     * 
     * @return {Self}
     */
    self.refillGlobalCanvas = function () {
        framesDrawn += 1;
        if (framesDrawn % framerateSkip !== 0) {
            return;
        }
        
        if (!noRefill) {
            drawBackground();
        }
        
        thing_arrays.forEach(self.refillThingArray);
        
        return self;
    };
    
    /**
     * 
     * 
     * 
     */
    self.refillThingArray = function (array) {
        array.forEach(self.drawThingOnContextBound);
    };
    
    /**
     * 
     */
    self.refillQuadrantGroups = function (groups) {
        var i;
        
        framesDrawn += 1;
        if (framesDrawn % framerateSkip !== 0) {
            return;
        }
        
        for (i = 0; i < groups.length; i += 1) {
            self.refillQuadrants(groups[i].quadrants);
        }
    };
    
    /**
     * 
     */
    self.refillQuadrants = function (quadrants) {
        var quadrant, i;
        
        for (i = 0; i < quadrants.length; i += 1) {
            quadrant = quadrants[i];
            if (
                quadrant.changed
                && quadrant.top < MapScreener.height
                && quadrant.right > 0
                && quadrant.bottom > 0
                && quadrant.left < MapScreener.width
            ) {
                self.refillQuadrant(quadrant);
                context.drawImage(
                    quadrant.canvas,
                    quadrant.left,
                    quadrant.top
                );
            }
        }
    };
    
    // var letters = '0123456789ABCDEF'.split('');
    // function getRandomColor() {
        // var color = '#';
        // for (var i = 0; i < 6; i++ ) {
            // color += letters[Math.floor(Math.random() * 16)];
        // }
        // return color;
    // }
    
    /**
     * 
     */
    self.refillQuadrant = function (quadrant) {
        var group, i, j;
        
        // quadrant.context.fillStyle = getRandomColor();
        // quadrant.context.fillRect(0, 0, quadrant.canvas.width, quadrant.canvas.height);
        
        if (!noRefill) {
            quadrant.context.drawImage(
                backgroundCanvas,
                quadrant.left,
                quadrant.top,
                quadrant.canvas.width,
                quadrant.canvas.height,
                0,
                0,
                quadrant.canvas.width,
                quadrant.canvas.height
            );
        }
        
        for (i = groupNames.length - 1; i >= 0; i -= 1) {
            group = quadrant.things[groupNames[i]];
            
            for (j = 0; j < group.length; j += 1) {
                self.drawThingOnQuadrant(group[j], quadrant);
            }
        }
        
        quadrant.changed = false;
    };
    
    /**
     * General function to draw a Thing to a context
     * This will call drawThingOnContext[Single/Multiple] with more arguments
     * 
     * @return {Self}
     */
    // self.drawThingOnContext = function(context, thing) {
    self.drawThingOnContext = function(context, thing) {
        if (
            thing.hidden
            || thing.height < 1
            || thing.width < 1
            // || thing.top > MapScreener.height
            // || thing.right < 0
            // || thing.bottom < 0
            // || thing.left > MapScreener.width
        ) {
            return;
        }
        
        // If Thing hasn't had a sprite yet (previously hidden), do that first
        if (typeof thing.num_sprites === "undefined") {
            self.setThingSprite(thing);
        }
        
        // Whether or not the thing has a regular sprite or a SpriteMultiple, 
        // that sprite has already been drawn to the thing's canvas, unless it's
        // above the cutoff, in which case that logic happens now.
        if (thing.canvas.width > 0) {
            drawThingOnContextSingle(context, thing.canvas, thing, thing.left, thing.top);
        } else {
            drawThingOnContextMultiple(context, thing.canvases, thing, thing.left, thing.top);
        }
    }
    
    /**
     * 
     */
    self.drawThingOnQuadrant = function (thing, quadrant) {
        if (
            thing.hidden
            || thing.top > quadrant.bottom
            || thing.right < quadrant.left
            || thing.bottom < quadrant.top
            || thing.left > quadrant.right
        ) {
            return;
        }
        
        // If there's just one sprite, it's pretty simple
        if (thing.num_sprites === 1) {
            return drawThingOnContextSingle(quadrant.context, thing.canvas, thing, thing.left - quadrant.left, thing.top - quadrant.top);
        }
        // For multiple sprites, some calculations will be needed
        else {
            return drawThingOnContextMultiple(quadrant.context, thing.canvases, thing, thing.left - quadrant.left, thing.top - quadrant.top);
        }
    };
    
    /**
     * Draws a Thing's single canvas onto a context (called by self.drawThingOnContext).
     * 
     * @param {CanvasRenderingContext2D} context    
     * @param {Canvas} canvas
     * @param {Thing} thing
     * @param {Number} leftc
     * @param {Number} topc
     * @return {Self}
     * @private
     */
    function drawThingOnContextSingle(context, canvas, thing, leftc, topc) {
        // If the sprite should repeat, use the pattern equivalent
        if (thing.repeat) {
            drawPatternOnCanvas(context, canvas, leftc, topc, thing.unitwidth, thing.unitheight, thing.opacity || 1);
        }
        // Opacities not equal to one must reset the context afterwards
        else if (thing.opacity !== 1) {
            context.globalAlpha = thing.opacity;
            context.drawImage(canvas, leftc, topc);
            context.globalAlpha = 1;
        } else {
            context.drawImage(canvas, leftc, topc);
        }
        
        return self;
    }
    
    /**
     * Draws a Thing's multiple canvases onto a context (called by self.drawThingOnContext)
     * 
     * @return {Self}
     * @private
     */
    function drawThingOnContextMultiple(context, canvases, thing, leftc, topc) {
        var sprite = thing.sprite,
            topreal = topc,
            leftreal = leftc,
            rightreal = leftc + thing.unitwidth,
            bottomreal = topc + thing.unitheight,
            widthreal = thing.unitwidth,
            heightreal = thing.unitheight,
            spritewidthpixels = thing.spritewidthpixels,
            spriteheightpixels = thing.spriteheightpixels,
            widthdrawn = Math.min(widthreal, spritewidthpixels),
            heightdrawn = Math.min(heightreal, spriteheightpixels),
            opacity = thing.opacity,
            diffhoriz, diffvert, canvasref;
        
        switch (canvases.direction) {
            // Vertical sprites may have 'top', 'bottom', 'middle'
            case "vertical":
                // If there's a bottom, draw that and push up bottomreal
                if ((canvasref = canvases.bottom)) {
                    diffvert = sprite.bottomheight ? sprite.bottomheight * unitsize : spriteheightpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, bottomreal - diffvert, widthreal, heightdrawn, opacity);
                    bottomreal -= diffvert;
                    heightreal -= diffvert;
                }
                // If there's a top, draw that and push down topreal
                if ((canvasref = canvases.top)) {
                    diffvert = sprite.topheight ? sprite.topheight * unitsize : spriteheightpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, widthreal, heightdrawn, opacity);
                    topreal += diffvert;
                    heightreal -= diffvert;
                }
            break;
            // Horizontal sprites may have 'left', 'right', 'middle'
            case "horizontal":
                // If there's a left, draw that and push forward leftreal
                if ((canvasref = canvases.left)) {
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth * unitsize : spritewidthpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, widthdrawn, heightreal, opacity);
                    leftreal += diffhoriz;
                    widthreal -= diffhoriz;
                }
                // If there's a right, draw that and push back rightreal
                if ((canvasref = canvases.right)) {
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth * unitsize : spritewidthpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal, opacity);
                    rightreal -= diffhoriz;
                    widthreal -= diffhoriz;
                }
            break;
            // Corner (vertical + horizontal + corner) sprites must have corners
            // in 'topRight', 'bottomRight', 'bottomLeft', and 'topLeft'.
            case "corners":
                // topLeft, left, bottomLeft
                diffvert = sprite.topheight ? sprite.topheight * unitsize : spriteheightpixels;
                diffhoriz = sprite.leftwidth ? sprite.leftwidth * unitsize : spritewidthpixels;
                drawPatternOnCanvas(context, canvases.topLeft.canvas, leftreal, topreal, widthdrawn, heightdrawn, opacity);
                drawPatternOnCanvas(context, canvases.left.canvas, leftreal, topreal + diffvert, widthdrawn, heightreal - diffvert * 2, opacity);
                drawPatternOnCanvas(context, canvases.bottomLeft.canvas, leftreal, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                leftreal += diffhoriz;
                widthreal -= diffhoriz;
                
                // top, topRight
                diffhoriz = sprite.rightwidth ? sprite.rightwidth * unitsize : spritewidthpixels;
                drawPatternOnCanvas(context, canvases.top.canvas, leftreal, topreal, widthreal - diffhoriz, heightdrawn, opacity);
                drawPatternOnCanvas(context, canvases.topRight.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightdrawn, opacity);
                topreal += diffvert;
                heightreal -= diffvert;
                
                // right, bottomLeft, bottom
                diffvert = sprite.bottomheight ? sprite.bottomheight * unitsize : spriteheightpixels;
                drawPatternOnCanvas(context, canvases.right.canvas, rightreal - diffhoriz, topreal, widthdrawn, heightreal - diffvert, opacity);
                drawPatternOnCanvas(context, canvases.bottomRight.canvas, rightreal - diffhoriz, bottomreal - diffvert, widthdrawn, heightdrawn, opacity);
                drawPatternOnCanvas(context, canvases.bottom.canvas, leftreal, bottomreal - diffvert, widthreal - diffhoriz, heightdrawn, opacity);
                rightreal -= diffhoriz;
                widthreal -= diffhoriz;
                bottomreal -= diffvert;
                heightreal -= diffvert;
            break;
        }
        
        // If there's still room/*, and it exists*/, draw the actual canvas
        if ((canvasref = canvases.middle) && topreal < bottomreal && leftreal < rightreal) {
            if (sprite.middleStretch) {
                context.globalAlpha = opacity;
                context.drawImage(canvasref.canvas, leftreal, topreal, widthreal, heightreal);
                context.globalAlpha = 1;
            } else {
                drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, widthreal, heightreal, opacity);
            }
        }
        
        return self;
    }
    
    
    /* Utilities
    */
    
    /**
     * Macro to draw a pattern onto a canvas because of how
     * often it's used by the regular draw functions.
     * Not a fan of this lack of control over pattern source coordinates...
     */
    function drawPatternOnCanvas(context, source, left, top, width, height, opacity) {
        context.globalAlpha = opacity;
        context.translate(left, top);
        context.fillStyle = context.createPattern(source, "repeat");
        context.fillRect(
            0, 0, 
            Math.min(width, MapScreener.right - left), 
            Math.min(height, MapScreener.bottom - top)
        );
        context.translate(-left, -top);
        context.globalAlpha = 1;
    }
    
    self.reset(settings || {});
}