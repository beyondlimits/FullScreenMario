/* PixelDrawr.js
 * A FullScreenMario-specific object that draws Things 
 * External requirements:
 * * getCanvas
 * * window.canvas
 * * window.context
 * * innerWidth
 */

function PixelDrawr(settings) {
    "use strict";
    if(this === window) {
        return new PixelDrawr(settings);
    }
    var self = this,
        
        // A PixelRender object used to obtain raw sprite data and canvases
        PixelRender,
        
        canvas,
        
        context,
        
        // Utility function to create a canvas (typically taken from EightBittr)
        getCanvas,
        
        innerWidth,
        
        unitsize,
        
        // Whether self.refillGlobalCanvas should skip redrawing the main canvas
        // every time.
        no_refill;
    
    self.reset = function(settings) {
        getCanvas = settings.getCanvas;
        PixelRender = settings.PixelRender;
        unitsize = settings.unitsize || 4;
        no_refill = settings.no_refill;
    }
    
    
    /* Simple gets
    */
    
    /**
     * 
     */
    self.getCanvas = function () {
        return canvas;
    };
    
    /**
     * 
     */
    self.getContext = function () {
        return contextd;
    };
    
    
    /* Simple sets
    */
    
    /**
     * 
     */
    self.setNoRefill = function (enabled) {
        no_refill = enabled;
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
        // If it's set as hidden, or doesn't have a title, don't bother updating it
        if(thing.hidden || !thing.title) {
            return;
        }
        
        // PixelRender does most of the work in fetching the rendered sprite
        thing.sprite = PixelRender.decode(self.makeClassKey(thing), thing);
        
        // To do: remove dependency on .num_sprites and sprite_type
        if(thing.sprite.multiple) {
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
        var canvas = thing.canvas,
            context = thing.context,
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        PixelRender.memcpyU8(thing.sprite, imageData.data);
        context.putImageData(imageData, 0, 0);
        
        return self;
    }
    
    /**
     * For SpriteMultiples, this copies the sprite information for
     * each sub-sprite into its own canvas, and sets thing.sprites
     * 
     * @param {Thing} thing   A thing whose .canvas and .sprites must be updated
     * @return {Self}
     * @private
     */
    function refillThingCanvasMultiple(thing) {
      var sprites_raw = thing.sprite,
          sprites = thing.sprites = { multiple: true },
          canvas, context, imageData, i;
      
      thing.num_sprites = 1;
      
      for(i in sprites_raw.sprites) {
        // Make a new sprite for this individual component
        canvas = getCanvas(thing.spritewidth * unitsize, thing.spriteheight * unitsize);
        context = canvas.getContext("2d");
        
        // Copy over this sprite's information the same way as refillThingCanvas
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        PixelRender.memcpyU8(sprites_raw.sprites[i], imageData.data);
        context.putImageData(imageData, 0, 0);
        
        // Record the canvas and context in thing.sprites
        sprites[i] = {
          canvas: canvas,
          context: context
        }
        thing.num_sprites += 1;
      }
      
      return sprites;
    }
    
    
    /* Core drawing
    */
    
    /**
     * Called every upkeep to refill the entire main canvas. Right now it's 
     * hardcoded to call window.scenery, window.solids, etc. - in the future
     * this should be referencing an array passed in self.reset, which will 
     * contain all the groups in the main FSM GroupsHolder.
     * 
     * @return {Self}
     */
    self.refillGlobalCanvas = function(background) {
        var canvas = window.canvas,
            context = window.context,
            i;
        
        // context.fillStyle = window.fillStyle;
        if(!no_refill) {
            context.fillStyle = background;
            context.fillRect(0, 0, canvas.width, canvas.height);
        } 
        
        // self.setCanvas -> self.setContext should bind a member copy of 
        // self.drawThingOnCanvas to the context as the first variable, so this
        // can use .forEach
        for(i = scenery.length - 1; i >= 0; --i) self.drawThingOnCanvas(context, scenery[i]);
        for(i = solids.length - 1; i >= 0; --i) self.drawThingOnCanvas(context, solids[i]);
        for(i = characters.length - 1; i >= 0; --i) self.drawThingOnCanvas(context, characters[i]);
        for(i = texts.length - 1; i >= 0; --i) self.drawThingOnCanvas(context, texts[i]);
        
        return self;
    }
    
    /**
     * General function to draw a thing to a context
     * This will call drawThingOnCanvas[Single/Multiple] with more arguments
     * 
     * @return {Self}
     */
    self.drawThingOnCanvas = function(context, thing) {
        if(thing.hidden || thing.left > innerWidth || thing.right < 0) return;
        
        // If there's just one sprite, it's pretty simple
        if(thing.num_sprites == 1) {
            return drawThingOnCanvasSingle(context, thing.canvas, thing, thing.left, thing.top);
        }
        // For multiple sprites, some calculations will be needed
        else {
            return drawThingOnCanvasMultiple(context, thing.canvases, thing.canvas, thing, thing.left, thing.top);
        }
    }
    
    /**
     * Draws a Thing's single canvas onto a context (called by self.drawThingOnCanvas)
     * 
     * @return {Self}
     * @private
     */
    function drawThingOnCanvasSingle(context, canvas, thing, leftc, topc) {
        // If the sprite should repeat, use the pattern equivalent
        if(thing.repeat) {
            drawPatternOnCanvas(context, canvas, leftc, topc, thing.unitwidth, thing.unitheight);
        }
        // Normal sprites are directly capable
        else {
            context.drawImage(canvas, leftc, topc);
        }
    }
    
    /**
     * Draws a Thing's multiple canvases onto a context (called by self.drawThingOnCanvas)
     * 
     * @return {Self}
     * @private
     */
    function drawThingOnCanvasMultiple(context, canvases, canvas, thing, leftc, topc) {
        var sprites = thing.sprites,
            topreal = thing.top,
            leftreal = thing.left,
            rightreal = thing.right,
            bottomreal = thing.bottom,
            widthreal = thing.unitwidth,
            heightreal = thing.unitheight,
            spritewidthpixels = thing.spritewidthpixels,
            spriteheightpixels = thing.spriteheightpixels,
            sdiff, canvasref;
        
        // Vertical sprites may have 'top', 'bottom', 'middle'
        switch(thing.sprite.direction) {
            case "vertical":
                // If there's a bottom, draw that and push up bottomreal
                if(canvasref = sprites.bottom) {
                    sdiff = sprites.bottomheight || thing.spriteheightpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, bottomreal - sdiff, spritewidthpixels, Math.min(heightreal, spriteheightpixels));
                    bottomreal -= sdiff;
                    heightreal -= sdiff;
                }
                // If there's a top, draw that and push down topreal
                if(canvasref = sprites.top) {
                    sdiff = sprites.topheight || thing.spriteheightpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, spritewidthpixels, Math.min(heightreal, spriteheightpixels));
                    topreal += sdiff;
                    heightreal -= sdiff;
                }
            break;
            // Horizontal sprites may have 'left', 'right', 'middle'
            case "horizontal":
                // If there's a left, draw that and push up leftreal
                if(canvasref = sprites.left) {
                    sdiff = sprites.leftwidth || thing.spritewidthpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, leftreal, topreal, Math.min(widthreal, spritewidthpixels), spriteheightpixels);
                    leftreal += sdiff;
                    widthreal -= sdiff;
                }
                // If there's a right, draw that and push back rightreal
                if(canvasref = sprites.right) {
                    sdiff = sprites.rightwidth || thing.spritewidthpixels;
                    drawPatternOnCanvas(context, canvasref.canvas, rightreal - sdiff, topreal, Math.min(widthreal, spritewidthpixels), spriteheightpixels);
                    rightreal -= sdiff;
                    widthreal -= sdiff;
                }
            break;
        }
        
        // If there's still room/*, and it exists*/, draw the actual canvas
        if((canvas = sprites.middle) && topreal < bottomreal && leftreal < rightreal) {
            drawPatternOnCanvas(context, sprites.middle.canvas, leftreal, topreal, widthreal, heightreal);
        }
    }
    
    
    /* Utilities
    */
    
    /**
     * Class keys are used by PixelRender to look up and cache sprites
     *
     * @param {Thing} thing
     * @return {String}
     */
    self.makeClassKey = function(thing) {
        return FSM.MapsHandler.getArea().setting + ' ' + thing.libtype + ' ' + thing.title + ' ' + thing.className;
    }
    
    /**
     * Macro to draw a pattern onto a canvas because of how
     * often it's used by the regular draw functions.
     * Not a fan of this lack of control over pattern source coordinates...
     */
    function drawPatternOnCanvas(context, source, leftc, topc, unitwidth, unitheight) {
      context.translate(leftc, topc);
      context.fillStyle = context.createPattern(source, "repeat");
      context.fillRect(0, 0, unitwidth, unitheight);
      context.translate(-leftc, -topc);
    }
    
    self.reset(settings || {});
}