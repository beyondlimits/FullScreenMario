/**
 * EightBittr.js
 * 
 * Contains a set of useful default functions for the FullScreenMario engine.
 */
window.EightBittr = (function(settings) {
    "use strict";
    
    /**
     * 
     */
    function EightBittr(settings) {
        settings = settings || {};
        self.unitsize = settings.unitsize || 1;
        self.scale = settings.scale || 1;
    }
    
    /* Collision functions
    */
    
    /**
     * 
     */
    function thingCanCollide(thing) {
        return thing.alive && !thing.nocollide;
    }
    
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
            multiplier = multiplier || self.unitsize;
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
        thing.bottom = thing.top + thing.height * self.unitsize;
    }
    
    /**
     * 
     */
    function setRight(thing, right) {
        thing.right = right;
        thing.left = thing.left - thing.width * self.unitsize;
    }
    
    /**
     * 
     */
    function setBottom(thing, bottom) {
        thing.bottom = bottom;
        thing.top = thing.bottom - thing.height * self.unitsize;
    }
    
    /**
     * 
     */
    function setLeft(thing, left) {
        thing.left = left;
        thing.right = thing.left + thing.width * self.unitsize;
    }
    
    /**
     * 
     */
    function setMidX(thing, x) {
        setLeft(thing, x + thing.left * self.unitsize /2);
    }
    
    /**
     * 
     */
    function setMidY(thing, y) {
        setTop(thing, y + thing.height * self.unitsize / 2);
    }
    
    /**
     * 
     */
    function getMidX(thing) {
        return thing.left + thing.width * self.unitsize / 2;
    }
    
    /**
     * 
     */
    function getMidY(thing) {
        return thing.top + thing.height * self.unitsize / 2;
    }
    
    /**
     * 
     */
    function setMidXObj(thing, other) {
        setLeft(thing, getMidX(other) - (thing.width * self.unitsize / 2));
    }
    
    /**
     * 
     */
    function objectToLeft(thing, other) {
        return getMidX(thing) < getMidX(other);
    }
    
    /**
     * 
     */
    function setMidYObj(thing, other) {
        setTop(thing, getMidY(other) - (thing.height * self.unitsize / 2));
    }
    
    /**
     * 
     */
    function updateTop(thing, dy) {
        // If a dy is provided, move the thing's top that much
        thing.top += dy | 0;
        
        // Make the thing's bottom dependent on the top
        thing.bottom = thing.top + thing.height * self.unitsize;
    }
    
    /**
     * 
     */
    function updateRight(thing, dx) {
        // If a dx is provided, move the thing's right that much
        thing.right += dx | 0;
        
        // Make the thing's left dependent on the right
        thing.left = thing.right - thing.width * self.unitsize;
    }
    
    /**
     * 
     */
    function updateBottom(thing, dy) {
        // If a dy is provided, move the thing's bottom that much
        thing.bottom += dy | 0;
        
        // Make the thing's top dependent on the top
        thing.top = thing.bottom - thing.height * self.unitsize;
    }
    
    /**
     * 
     */
    function updateLeft(thing, dx) {
        // If a dx is provided, move the thing's left that much
        thing.left += dx | 0;
        
        // Make the thing's right dependent on the left
        thing.right = thing.left + thing.width * self.unitsize;
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
    
    
    /* Utility
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
    
    /**
     * 
     */
    function proliferate(recipient, donor, no_override) {
        var setting, i;
      
        // For each attribute of the donor:
        for(i in donor) {
            if(donor.hasOwnProperty(i)) {
                // If no_override, don't override already existing properties
                if(no_override && recipient.hasOwnProperty(i)) {
                    continue;
                }

                // If it's an object, recurse on a new version of it
                if(typeof(setting = donor[i]) == "object") {
                  if(!recipient.hasOwnProperty(i)) {
                     recipient[i] = new setting.constructor();
                  }
                  proliferate(recipient[i], setting, no_override);
                }
                // Regular primitives are easy to copy otherwise
                else {
                    recipient[i] = setting;
                }
            }
        }
        return recipient;
    }
    
    /**
     * Identical to proliferate, but instead of checking whether the recipient
     * has properties, it just checks if they're truthy
     * 
     * @remarks This may not be good with JSLint, but it works for prototypal
     *          inheritance, since hasOwnProperty only is for the current class
     */
    function proliferateHard(recipient, donor, no_override) {
        var setting, i;
      
        // For each attribute of the donor:
        for(i in donor) {
            if(donor.hasOwnProperty(i)) {
                // If no_override, don't override already existing properties
                if(no_override && recipient[i]) {
                    continue;
                }

                // If it's an object, recurse on a new version of it
                if(typeof(setting = donor[i]) == "object") {
                  if(!recipient[i]) {
                     recipient[i] = new setting.constructor();
                  }
                  proliferate(recipient[i], setting, no_override);
                }
                // Regular primitives are easy to copy otherwise
                else {
                    recipient[i] = setting;
                }
            }
        }
        return recipient;
    }
    
    /* Prototype function holders
    */
    
    EightBittr.prototype = {
        "collisions": {
            "thingCanCollide": thingCanCollide
        },
        "html": {
            "getCanvas": getCanvas
        },
        "physics": {
            "shiftVert": shiftVert,
            "shiftHoriz": shiftHoriz,
            "setTop": setTop,
            "setRight": setRight,
            "setBottom": setBottom,
            "setLeft": setLeft,
            "setMidY": setMidY,
            "setMidX": setMidX,
            "getMidY": getMidY,
            "getMidX": getMidX,
            "setMidYObj": setMidYObj,
            "setMidXObj": setMidXObj,
            "objectToLeft": objectToLeft,
            "updateTop": updateTop,
            "updateRight": updateRight,
            "updateBottom": updateBottom,
            "updateLeft": updateLeft,
            "slideToY": slideToY,
            "slideToX": slideToX
        },
        "utility": {
            "clearAllTimeouts": clearAllTimeouts,
            "proliferate": proliferate,
            "proliferateHard": proliferateHard
        }
    };
    
    return EightBittr;
})();