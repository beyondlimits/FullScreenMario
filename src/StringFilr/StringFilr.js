/* StringFilr
 * Simple data structure for storing strings based on nested class names
 * This uses a tree structure
 */
 
/**
 * StringFilr.js
 * 
 * A general utility for retrieving data from an Object based on nested class
 * names. You can think of the internal "library" Object as a tree structure,
 * such that you can pass in a listing (in any order) of the path to data for 
 * retrieval.
 * 
 * @constructor
 * @this {StringFilr}
 * @param {Object} settings   See self.reset for arguments.
 * 
 * 
 */
function StringFilr(settings) {
    "use strict";
    if (!this || this === window) {
        return new StringFilr(settings);
    }
    var self = this,

        // A library of sprite strings
        library,

        // Listing of previously found lookups, for speed's sake
        cache,

        // Optional default class to use when no suitable option is found
        normal,

        // Whether to remove instances of the normal class in this.get()
        normalize,

        // Whether this should warn when a sub-object in reset has no normal child
        warnNoNormal,

        // Whether this always gives an array for results, instead of strings
        // That array is [parent, index] (which is more efficient)
        giveResultParent;

    /**
     * 
     */
    self.reset = function (settings) {
        library = settings.library;
        normal = settings.normal || "normal";
        normalize = settings.normalize;
        warnNoNormal = settings.warnNoNormal;
        giveResultParent = settings.giveResultParent;
        
        cache = {};

        if (warnNoNormal) {
            if (!normal) {
                throw new Error("warnNoNormal is given to StringFilr, but a normal class was not.");
            }
            checkNumNoNorm(library, "");
        }
    };

    /**
     * 
     */
    self.getLibrary = function () {
        return library;
    }

    /**
     * 
     */
    self.getCache = function () {
        return cache;
    }

    /**
     * 
     */
    self.setGiveParent = function(give_new) {
        giveResultParent = give_new;
    }

    // Either clears the entire cache or a specific item
    /**
     * 
     */
    self.clear = function(className) {
        if (typeof className === "undefined") {
            cache = {};
            return;
        }
        
        if (normalize) {
            className = className.replace(normal, '');
        }
        
        delete cache[className];
    }

    // Typical retrieval function
    // Takes in a className and returns the deepest matching part in the library
    // If giveResultParent is true, it returns the parent of whatever matches
    /**
     * 
     */
    self.get = function(className) {
        // Normalizing removes all instances of the normal keyword, since they don't matter
        if (normalize) className = className.replace(normal, '');

        // Quickly return a cached result if it exists
        if (cache.hasOwnProperty(className)) return cache[className];

        var result = followClass(className.split(/\s+/g), library);

        // If giveResultParent is true, the results will be in reverse order
        if (giveResultParent) result = results_final(result);
        return cache[className] = result;
    }

    // rename current to something different from library?
    // Fancy version of followPath that accounts for normal and giveResultParent
    /**
     * 
     */
    function followClass(names, current) {
        // If names runs out, we're done
        if (!names || !names.length) {
            return current;
        }

        var name, i;
        // For each name in the current array...
        for (i in names) {
            name = names[i];
            // ...if it matches, recurse on the other names
            if (current.hasOwnProperty(name)) {
                names.splice(i, 1);
                i = followClass(names, current[name], giveResultParent);
                return (giveResultParent && i.constructor != Object) ? [current, name, i] : i;
            }
        }

        // If no name matched, try the normal (default)
        if (normal && current.hasOwnProperty(normal)) {
            i = followClass(names, current[normal], giveResultParent);
            return (giveResultParent && i.constructor != Object) ? [current, normal, i] : i;
        }
        // Nothing matches anymore, we're done.
        return current;
    }

    // Recursively checks the library for tree branches that have no [normal]
    /**
     * 
     */
    function checkNumNoNorm(current, path) {
        var has_norm = false;
        for (var i in current) {
            if (i == normal) has_norm = true;
            if (typeof current[i] == "object") {
                console.warn("No normal specified:", path);
                checkNumNoNorm(current[i], path + "->" + i);
            }
        }
    }

    // Simple utility to get the last (deepest) parts of reverse-order results
    /**
     * 
     */
    function results_final(results) {
        if (typeof results[2] === "object") {
            return results_final(results[2]);
        }
        
        return results;
    }
    

    self.reset(settings || {});
}