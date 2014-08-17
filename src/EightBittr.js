/**
 * EightBittr.js
 * 
 * Contains a set of useful default functions for the FullScreenMario engine.
 */
window.EightBittr = (function() {
    "use strict";
    
    /**
     * 
     * 
     * @constructor
     */
    function EightBittr(settings) {
        var self = this,
            constants,
            i;
        
        settings = settings || {};
        
        // Constants, such as unitsize and scale, are always copied first
        self.constructor = settings.constructor || EightBittr,
        constants = settings.constants;
        if(constants) {
            for(i = 0; i < constants.length; i += 1) {
                self[constants[i]] = self.constructor[constants[i]];
            }
        }
        
        if(settings.requirements) {
            if(settings.requirements.global) {
                checkRequirements(window, settings.requirements.global, "global");
            }
            if(settings.requirements.self) {
                checkRequirements(self, settings.requirements.self, "self");
            }
            if(settings.requirements.settings) {
                checkRequirements(self.settings, settings.requirements.settings, "settings");
            }
        }
        
        if(settings.resets) {
            doResets(self, settings.resets, settings.customs);
        }
    }
    
    /**
     * Given an associate array of requirement names to the files that should
     * include them, this makes sure each of those requirements is a property of
     * the given object. 
     * 
     * @param {Object} self    Generally either the window (for global checks,
     *                         such as utility classes) or an EightBitter       
     * @param {Object} requirements   An associative array of properties to 
     *                                check for under self
     * @param {String} name   The name referring to self, printed out in an
     *                        Error if needed.
     * @remarks This has no return type, as it throws an error with information
     *          on missing requirements instead.
     */
    function checkRequirements(self, requirements, name) {
        var fails = [],
            requirement;
        
        // For each requirement in the given object, if it isn't visible as a
        // member of self (evaluates to falsy), complain
        for(requirement in requirements) {
            if(requirements.hasOwnProperty(requirement) && !self[requirement]) {
                fails.push(requirement);
            }
        }
        
        // If there was at least one failure added to the fails array, throw
        // an error with each fail split by endlines
        if(fails.length) {
            throw new Error("Missing " + fails.length + " requirement(s) "
                + "in " + name + ".\n"
                + fails.map(function (requirement, i) {
                    return i + ". " + requirement + ": is the '"
                            + requirements[requirement] + "' file included?";
                }).join("\n"));
        }
    }
    
    /**
     * 
     * 
     * 
     */
    function doResets(self, resets, customs) {
        var i;
        
        for(i = 0; i < resets.length; ++i) {
            resets[i](self, customs)
        }
    }
    
    /**
     * EightBittr.get is provided as a shortcut function to make binding member
     * functions, particularily those using "this.unitsize" (where this needs to
     * be an EightBitter, not an external calling object). At the very simplest,
     * this.get(func) acts as a shortcut to this.bind(this, func).
     * In addition, if the name is given as "a.b", EightBitter.followPath will
     * be used on "a.b".split() (so EightBitter.prototype[a][b] is returned).
     * 
     * @param {Mixed} name   Either the function itself, or a string of the path
     *                       to the function (after ".prototype.").
     * @return {Function}   A function, bound to set "this" to the calling
     *                      EightBitter
     */
    
    // In order to bind settings such as unitsize and scale correctly, 
    // this shortcut to bind 
    EightBittr.prototype.get = function(name) {
        var func;
        
        // If name is a string, turn it into a function path, and follow it
        if(name instanceof String || typeof(name) == "string") {
            func = followPathHard(this, name.split('.'), 0);
        }
        // If it's already a path (array), follow it
        else if(name instanceof Array) {
            func = followPathHard(this, name, 0);
        }
        // Otherwise func is just name
        else {
            func = name;
        }
        
        // Don't allow func to be undefined or some non-function object
        if(typeof(func) !== "function") {
            throw new Error(name + " is not defined in this EightBitter", self);
        }
        
        // Bind the function to this
        return func.bind(this);
    };
    
    
    /* Collision functions
    */
    
    /**
     * 
     */
    function canThingCollide(thing) {
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
            multiplier = multiplier || this.unitsize;
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
        thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function setRight(thing, right) {
        thing.right = right;
        thing.left = thing.left - thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function setBottom(thing, bottom) {
        thing.bottom = bottom;
        thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function setLeft(thing, left) {
        thing.left = left;
        thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function setMid(thing, x, y) {
        thing.EightBitter.setMidX(thing, x);
        thing.EightBitter.setMidY(thing, y);
    }
    
    /**
     * 
     */
    function setMidX(thing, x) {
        thing.EightBitter.setLeft(thing, x + thing.left * thing.EightBitter.unitsize / 2);
    }
    
    /**
     * 
     */
    function setMidY(thing, y) {
        thing.EightBitter.setTop(thing, y + thing.height * thing.EightBitter.unitsize / 2);
    }
    
    /**
     * 
     */
    function getMidX(thing) {
        return thing.left + thing.width * thing.EightBitter.unitsize / 2;
    }
    
    /**
     * 
     */
    function getMidY(thing) {
        return thing.top + thing.height * thing.EightBitter.unitsize / 2;
    }
    
    /**
     * 
     */
    function setMidObj(thing, other) {
        thing.EightBitter.setMidXObj(thing, other);
        thing.EightBitter.setMidYObj(thing, other);
    }
    
    /**
     * 
     */
    function setMidXObj(thing, other) {
        thing.EightBitter.setLeft(thing, thing.EightBitter.getMidX(other) - (thing.width * thing.EightBitter.unitsize / 2));
    }
    
    /**
     * 
     */
    function setMidYObj(thing, other) {
        thing.EightBitter.setTop(thing, thing.EightBitter.getMidY(other) - (thing.height * thing.EightBitter.unitsize / 2));
    }
    
    /**
     * 
     */
    function objectToLeft(thing, other) {
        return thing.EightBitter.getMidX(thing) < thing.EightBitter.getMidX(other);
    }
    
    /**
     * 
     */
    function updateTop(thing, dy) {
        // If a dy is provided, move the thing's top that much
        thing.top += dy | 0;
        
        // Make the thing's bottom dependent on the top
        thing.bottom = thing.top + thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function updateRight(thing, dx) {
        // If a dx is provided, move the thing's right that much
        thing.right += dx | 0;
        
        // Make the thing's left dependent on the right
        thing.left = thing.right - thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function updateBottom(thing, dy) {
        // If a dy is provided, move the thing's bottom that much
        thing.bottom += dy | 0;
        
        // Make the thing's top dependent on the top
        thing.top = thing.bottom - thing.height * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function updateLeft(thing, dx) {
        // If a dx is provided, move the thing's left that much
        thing.left += dx | 0;
        
        // Make the thing's right dependent on the left
        thing.right = thing.left + thing.width * thing.EightBitter.unitsize;
    }
    
    /**
     * 
     */
    function slideToX(thing, x, maxspeed) {
        var midx = thing.EightBitter.getMidX(thing);
        
        // If no maxspeed is provided, assume Infinity (so it doesn't matter)
        maxspeed = maxspeed || Infinity;
        
        // 
        if(midx < x) {
            thing.EightBitter.shiftHoriz(thing, Math.min(maxspeed, (x - midx)));
        }
        // 
        else {
            thing.EightBitter.shiftHoriz(thing, Math.max(-maxspeed, (x - midx)));
        }
    }
    
    /**
     * 
     */
    function slideToY(thing, y, maxspeed) {
        var midy = thing.EightBitter.getMidY(thing);
        
        // If no maxspeed is provided, assume Infinity (so it doesn't matter)
        maxspeed = maxspeed || Infinity;
        
        //
        if(midy < y) {
            thing.EightBitter.shiftVert(thing, Math.min(maxspeed, (y - midy)));
        }
        //
        else {
            thing.EightBitter.shiftVert(thing, Math.max(-maxspeed, (y - midy)));
        }
    }
    
    
    /* EightBittr utilities
    */
    
    /**
     * Ensures the current object is an EightBittr by throwing an error if it 
     * is not. This should be used for functions in any EightBittr descendants
     * that have to call 'this' to ensure their caller is what the programmer
     * expected it to be.
     * 
     * @param {any} current   
     */
    function ensureCorrectCaller(current) {
        if(!current instanceof EightBittr) {
            throw new Error("A function that requires the caller ('this') to "
                + "be the manipulated EightBittr object. Unfortunately, 'this' "
                + "is a " + typeof(this) + ".");
        }
        return current;
    }
    
    
    /* General utilities
    */
    
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
     * 
     */
    function createElement(type) {
        var element = document.createElement(type || "div"),
            i;// = arguments.length;
        
        // For each provided object, add those settings to the element
        for(i = 1; i < arguments.length; i += 1) {
            proliferate(element, arguments[i]);
        }
        
        return element;
    }
    
    /**
     * Identical to proliferate, but instead of checking whether the recipient
     * hasOwnProperty on properties, it just checks if they're truthy
     * 
     * @remarks this may not be good with JSLint, but it works for prototypal
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
    
    /**
     * Identical to followPath, but instead of checking whether the recipient
     * hasOwnProperty on properties, it just checks if they're truthy
     * 
     * @remarks this may not be good with JSLint, but it works for prototypal
     *          inheritance, since hasOwnProperty only is for the current class
     */
    function followPathHard(obj, path, num) {
        for(var num = num || 0, len = path.length; num < len; ++num) {
            if(!obj[path[num]]) {
                return undefined;
            }
            else {
                obj = obj[path[num]];
            }
        }
        return obj;
    }
    
    /**
     * 
     */
    function arraySwitch(thing, arrayOld, arrayNew) {
        arrayOld.splice(arrayOld.indexOf(thing), 1);
        arrayNew.push(thing);
    }
    
    /**
     * Sets an object's position within an array to the front by removing the
     * object and unshifting it.
     * 
     * 
     */
    function arrayToBeginning(thing, array) {
        array.splice(array.indexOf(thing), 1);
        array.unshift(thing);
    }
    
    /**
     * Sets an object's position within an array to the end by removing the
     * object and pushing it.
     * 
     * 
     */
    function arrayToEnd(thing, array) {
        array.splice(array.indexOf(thing), 1);
        array.push(thing);
    }
    
    /**
     * 
     */
    function arrayDeleteMember(thing, array, location) {
        if(typeof location === "undefined") {
            location = array.indexOf(thing);
            if(location === -1) {
                return;
            }
        }
        
        array.splice(location, 1);
        
        if(typeof(thing.onDelete) === "function") {
            thing.onDelete(thing);
        }
    }
    
    /* Prototype function holders
    */
    
    proliferateHard(EightBittr.prototype, {
        // Collisions
        "canThingCollide": canThingCollide,
        // HTML
        "getCanvas": getCanvas,
        // Physics
        "shiftVert": shiftVert,
        "shiftHoriz": shiftHoriz,
        "setTop": setTop,
        "setRight": setRight,
        "setBottom": setBottom,
        "setLeft": setLeft,
        "setMid": setMid,
        "setMidY": setMidY,
        "setMidX": setMidX,
        "getMidY": getMidY,
        "getMidX": getMidX,
        "setMidObj": setMidObj,
        "setMidXObj": setMidXObj,
        "setMidYObj": setMidYObj,
        "objectToLeft": objectToLeft,
        "updateTop": updateTop,
        "updateRight": updateRight,
        "updateBottom": updateBottom,
        "updateLeft": updateLeft,
        "slideToY": slideToY,
        "slideToX": slideToX,
        // EightBittr utilities
        "ensureCorrectCaller": ensureCorrectCaller,
        // General utilities
        "proliferate": proliferate,
        "proliferateHard": proliferateHard,
        "createElement": createElement,
        "arraySwitch": arraySwitch,
        "arrayToBeginning": arrayToBeginning,
        "arrayToEnd": arrayToEnd,
        "arrayDeleteMember": arrayDeleteMember
    });
    
    EightBittr.ensureCorrectCaller = ensureCorrectCaller;
    
    return EightBittr;
})();