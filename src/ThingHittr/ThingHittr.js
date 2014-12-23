/**
 * 
 */
function ThingHittr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ThingHittr(settings);
    }
    var self = this,
        
        // GroupHoldr object used to hold the groups and manipulate contents
        GroupHolder,
        
        // QuadsKeepr object used for collision checking
        QuadsKeeper,
        
        // Names of groups to check collisions within
        groupNames,
        
        // Container for functions to collision check between specific types
        // E.x. ["character"] = { "solid": function(a,b) {...} }
        hitChecks,
        // Quick reference of Object.keys(hitChecks)
        hitCheckKeys,
        
        // Container for functions to react to collisions between specific types
        // E.x. ["character"] = { "solid": function(a,b) {...} }
        hitFunctions,
        
        // Container for functions to check and react to objects having overlaps
        overlapFunctions,
        
        // Global check functions, such as canCollide
        globalChecks,
        
        cachedTypeNames,
        
        // Optional scope variable to bind important functions to
        scope;
    
    /**
     * 
     */
    self.reset = function(settings) {
        // Get the main containers from settings, or make new ones if necessary
        GroupHolder = settings.GroupHolder || new GroupHoldr(settings);
        QuadsKeeper = settings.QuadsKeeper || new QuadsKeepr(settings);
        
        
        // Collision checking information should be given in the settings
        if (!settings.groupNames) {
            throw new Error("No groupNames given to ThingHittr");
        }
        if (!settings.hitChecks) {
            throw new Error("No hitChecks given to ThingHittr");
        }
        groupNames = settings.groupNames;
        hitChecks = settings.hitChecks;
        hitCheckKeys = Object.keys(hitChecks);
        
        // Collision functions should be given in the settings
        if (!settings.hitFunctions) {
            throw new Error("No hitFunctions given to ThingHittr");
        }
        hitFunctions = settings.hitFunctions;
        
        // Overlap functions may be given in the settings
        overlapFunctions = settings.overlapFunctions || {};
        
        // Global checks should be given in the settings
        if (!settings.globalChecks) {
            throw new Error("No globalChecks given to ThingHittr");
        }
        globalChecks = settings.globalChecks;
        
        // If a scope is provided, make external hit checks and functions use it
        // as their "this" variable (very good for EightBittr objects)
        if (settings.scope) {
            setScopeAll(hitChecks, settings.scope);
            setScopeAll(hitFunctions, settings.scope);
            setScopeAll(overlapFunctions, settings.scope);
            setScopeAll(globalChecks, settings.scope);
        }
        
        cachedTypeNames = {};
    };
    
    
    /* Simple gets
    */
    
    /**
     * 
     */
    self.getGroupHolder = function () {
        return GroupHolder;
    };
    
    /**
     * 
     */
    self.getQuadsKeeper = function () {
        return QuadsKeeper;
    };
    
    
    /* Runtime preparation
    */
    
    /**
     * 
     */
    self.cacheHitCheckType = function (thing, typeName, groupName) {
        if (cachedTypeNames[typeName]) {
            return;
        }
        cachedTypeNames[typeName] = true;
        
        if (typeof globalChecks[groupName] !== "undefined") {
            globalChecks[typeName] = cacheGlobalCheck(groupName);
        }
        
        if (typeof hitChecks[groupName] !== "undefined") {
            hitChecks[typeName] = cacheHitCheck(groupName);
        }
        
        self["checkHitsOfOne" + typeName] = function checkHitsGenerated(thing) {
            var others, other, hitCheck,
                i, j, k;
             
            // Don't do anything if the thing shouldn't be checking
            if (!globalChecks[typeName].canCollide(thing)) {
                return;
            }
            
            // For each quadrant this is in, look at that quadrant's groups
            for (i = 0; i < thing.numquads; i += 1) {
                for (j = 0; j < groupNames.length; j += 1) {
                    others = thing.quadrants[i].things[groupNames[j]];
                    hitCheck = hitChecks[typeName][groupNames[j]];
                    
                    // If no hit check exists for this combo, don't bother
                    if (!hitCheck) {
                        continue;
                    }
                    
                    // For each 'other' in this group that should be checked...
                    for (k = 0; k < others.length; k += 1) {
                        other = others[k];
                        
                        // If the two are the same, breaking prevents double hits
                        if (thing === other) { 
                            break;
                        }
                        
                        // Do nothing if these two shouldn't be colliding
                        if (!globalChecks[other.grouptype].canCollide(other)) {
                            continue;
                        }
                        
                        // If they do hit, great! Do the corresponding hit_function
                        if (hitCheck(thing, other)) {
                            hitFunctions[thing.grouptype][other.grouptype](thing, other);
                        }
                    }
                }
            }
        };
    };
    
    /**
     * 
     * 
     * @todo Use a function generator
     */
    function cacheGlobalCheck(groupName) {
        return globalChecks[groupName];
    };
    
    /**
     * 
     * 
     * @todo Use a function generator
     */
    function cacheHitCheck(groupName) {
        return hitChecks[groupName];
    };
    
    /**
     * 
     */
    function setScopeAll(functions, scope) {
        var i;
        for (i in functions) {
            if (functions.hasOwnProperty(i)) {
                switch (typeof functions[i]) {
                    case "function":
                        functions[i] = functions[i].bind(scope);
                        break;
                    case "object":
                        setScopeAll(functions[i], scope);
                        break;
                }
            }
        }
    }
    
    self.reset(settings || {});
}