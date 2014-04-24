var FSM = (function () {
    "use strict";
    
    /* Constants
    */
    var unitsize = 4,
        scale = 2;
    
    
    /* HTML functions
    */
    
    /**
     *
     */
    function getCanvas(width, height, multiplier) {
        var canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        // If necessary, increase the visual style by the multiplier
        if (multiplier) {
            // The multiplier 1 by default, but may be different (e.g. unitsize)
            multiplier = multiplier || unitsize;
            
            canvas.style.width = (width * multiplier) + "px";
            canvas.style.height = (height * multiplier) + "px";
        }
        
        // For speed's sake, disable image smoothing in all browsers
        context.imageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.oImageSmoothingEnabled = false;
        
        return canvas;
    }
    
    /* Collision functions
    */

    /**
     * Generic checker for can_collide, used for both Solids and Characters
     * 
     * @param {Thing} thing
     * @return {Boolean}
     */
    function thingCanCollide(thing) {
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
    function thingTouchesThing(thing, other) {
        return !thing.nocollide && !other.nocollide
                && thing.right - unitsize > other.left
                && thing.left + unitsize < other.right
                && thing.bottom >= other.top
                && thing.top <= other.bottom;
    }

    /**
     *
     */
    function characterTouchesSolid(thing, other) {
        // Hidden solids can only be touched by the player bottom-bumping them
        if(other.hidden) {
            return thing.player && solidOnCharacter(other, thing);
        }
        
        return thingTouchesThing(thing, other);
    }

    /**
     *
     */
    function characterTouchesCharacter(thing, other) {
        
        return thingTouchesThing(thing, other);
    }

    /**
     * // thing = character
     * // other = solid
     */
    function characterHitsSolid(thing, other) {
        // "Up" solids are special (they kill things that aren't their .up)
        if(other.up && thing !== other.up) {
            return characterTouchesUp(thing, other);
        }
        
        // Normally, call the generic ~TouchedSolid function
        (other.collide || characterTouchedSolid)(thing, other);
        
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
     */
    function characterHitsCharacter(thing, other) {
        // console.log("Character", thing.title, "hits solid", other.title);
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


    /* Physics functions 
    */
    
    /**
     * 
     */
    function shiftVert(thing, dy) {
        thing.top += dy;
        thing.bottom += dy;
    }
    
    /**
     * 
     */
    function shiftHoriz(thing, dx) {
        thing.left += dx;
        thing.right += dx;
    }
    
    /**
     * 
     */
    function setTop(thing, top) {
        thing.top = top;
        thing.bottom = thing.top + thing.height * unitsize;
    }
    
    /**
     * 
     */
    function setRight(thing, right) {
        thing.right = right;
        thing.left = thing.left - thing.width * unitsize;
    }
    
    /**
     * 
     */
    function setBottom(thing, bottom) {
        thing.bottom = bottom;
        thing.top = thing.bottom - thing.height * unitsize;
    }
    
    /**
     * 
     */
    function setLeft(thing, left) {
        thing.left = left;
        thing.right = thing.left + thing.width * unitsize;
    }
    
    /**
     * 
     */
    function setWidth(thing, width, update_sprite, update_size) {
        thing.width = width;
        thing.unitwidth = width * unitsize;
        
        if(update_sprite) {
            thing.spritewidth = width;
            thing.spritewidthpixels = width * unitsize;
        }
        
        if(update_size) {
            updateSize(thing);
            PixelDrawer.setThingSprite(thing);
            console.log("Should update thing canvas", thing.title);
        }
    }
    
    /**
     * 
     */
    function setHeight(thing, height, update_sprite, update_size) {
        thing.height = height;
        thing.unitheight = height * unitsize;
        
        if(update_sprite) {
            thing.spriteheight = height;
            thing.spriteheightpixels = height * unitsize;
        }
        
        if(update_size) {
            updateSize(thing);
            setThingSprite(thing);
        }
    }
    
    /**
     * 
     */
    function setSize(thing, width, height, update_sprite, update_size) {
        setWidth(thing, width, update_sprite, update_size);
        setHeight(thing, height, update_sprite, update_size);
    }
    
    /**
     * 
     */
    function setMidX(thing, x) {
        setLeft(thing, x + thing.left * unitsized2);
    }
    
    /**
     * 
     */
    function setMidY(thing, y) {
        setTop(thing, y + thing.height * unitsized2);
    }
    
    /**
     * 
     */
    function getMidX(thing) {
        return thing.left + thing.width * unitsized2;
    }
    
    /**
     * 
     */
    function getMidY(thing) {
        return thing.top + thing.height * unitsized2;
    }
    
    /**
     * 
     */
    function setMidXObj(thing, other) {
        setLeft(thing, getMidX(other) - (thing.width * unitsized2));
    }
    
    /**
     * 
     */
    function setMidYObj(thing, other) {
        setTop(thing, getMidY(other) - (thing.height * unitsized2));
    }
    
    /**
     * 
     */
    function updateTop(thing, dy) {
        // If a dy is provided, move the thing's top that much
        thing.top += dy | 0;
        
        // Make the thing's bottom dependent on the top
        thing.bottom = thing.top + thing.height * unitsize;
    }
    
    /**
     * 
     */
    function updateRight(thing, dx) {
        // If a dx is provided, move the thing's right that much
        thing.right += dx | 0;
        
        // Make the thing's left dependent on the right
        thing.left = thing.right - thing.width * unitsize;
    }
    
    /**
     * 
     */
    function updateBottom(thing, dy) {
        // If a dy is provided, move the thing's bottom that much
        thing.bottom += dy | 0;
        
        // Make the thing's top dependent on the top
        thing.top = thing.bottom - thing.height * unitsize;
    }
    
    /**
     * 
     */
    function updateLeft(thing, dx) {
        // If a dx is provided, move the thing's left that much
        thing.left += dx | 0;
        
        // Make the thing's right dependent on the left
        thing.right = thing.left + thing.width * unitsize;
    }
    
    /**
     * 
     */
    function increaseHeight(thing, dy) {
        thing.top -= dy;
        thing.height += dy / unitsize;
        thing.unitheight = thing.height * unitsize;
        console.log("Increasing height of", thing.title, "in a likely inproper way");
    }
    
    /**
     * 
     */
    function slideToX(thing, x, maxspeed) {
        var midx = getMidX(thing);
        
        // If no maxspeed is provided, assume Infinity (so it doesn't matter)
        maxspeed = maxspeed || Infinity;
        
        // 
        if(midx < x) {
            shiftHoriz(thing, min(maxspeed, (x - midx)));
        }
        // 
        else {
            shiftHoriz(thing, max(-maxspeed, (x - midx)));
        }
    }
    
    /**
     * 
     */
    function slideToY(thing, y, maxspeed) {
        var midy = getMidY(thing);
        
        // If no maxspeed is provided, assume Infinity (so it doesn't matter)
        maxspeed = maxspeed || Infinity;
        
        //
        if(midy < y) {
            shiftVert(thing, min(maxspeed, (y - midy)));
        }
        //
        else {
            shiftVert(thing, max(-maxspeed, (y - midy)));
        }
    }
    
    
    /* Utility functions
    */
    
    /**
     * Removes all setTimeout calls with clearTimeout
     * @alias clearAllTimeouts
     * @remarks This is very expensive - use only on hard clearing
     */
    function clearAllTimeouts() {
        var id = setTimeout(function() {});
        while (id) {
            clearTimeout(id);
            id -= 1;
        }
    }
    
    
    return {
        "constants": {
            "unitsize": 4,
            "scale": 2
        },
        "functions": {
            "html": {
                "getCanvas": getCanvas
            },
            "collisions": {
                "thingCanCollide": thingCanCollide,
                "thingTouchesThing": thingTouchesThing,
                "characterTouchesSolid": characterTouchesSolid,
                "characterTouchesCharacter": characterTouchesCharacter,
                "characterHitsSolid": characterHitsSolid,
                "characterHitsCharacter": characterHitsCharacter
            },
            "physics": {
                "shiftVert": shiftVert,
                "shiftHoriz": shiftHoriz,
                "setTop": setTop,
                "setRight": setRight,
                "setBottom": setBottom,
                "setLeft": setLeft,
                "setWidth": setWidth,
                "setHeight": setHeight,
                "setSize": setSize,
                "setMidX": setMidX,
                "setMidY": setMidY,
                "getMidX": getMidX,
                "getMidY": getMidY,
                "setMidXObj": setMidXObj,
                "setMidYObj": setMidYObj,
                "updateTop": updateTop,
                "updateRight": updateRight,
                "updateBottom": updateBottom,
                "updateLeft": updateLeft,
                "increaseHeight": increaseHeight,
                "slideToX": slideToX,
                "slideToY": slideToY,
            },
            "utilities": {
                "clearAllTimeouts": clearAllTimeouts
            }
        }
    };
})();