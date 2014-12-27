/**
 * ThingHittr.js
 * 
 * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
 * Things contained in the GroupHoldr's groups have automated collision checking
 * aainst configurable sets of other groups, along with performance 
 * optimizations to help with over-reoptimization of Functions.
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function ThingHittr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ThingHittr(settings);
    }
    var self = this,
        
        // GroupHoldr object used to hold the groups and manipulate contents.
        GroupHolder,
        
        // Names of groups to check collisions within.
        groupNames,
        
        // Check Functions for Things within groups to see if they're able to
        // collide in the first place.
        globalChecks,
        
        // Collision detection Functions to check two Things for collision.
        hitChecks,
        
        // Hit Function callbacks for when two Things do collide.
        hitFunctions,
        
        // Function generators for globalChecks.
        globalCheckGenerators,
        
        // Function generators for hitChecks.
        hitCheckGenerators,
        
        // Function generators for hitFunctions.
        hitFunctionGenerators,
        
        // A listing of which groupNames have had their hitCheck cached.
        cachedGroupNames,
        
        // A listing of which types have had their checkHitsOf cached.
        cachedTypeNames;
    
    /**
     * Resets the ThingHittr.
     * 
     * @constructor
     * @param {Object} globalCheckGenerators   The Function generators used for
     *                                         each group to test if a contained
     *                                         Thing may collide, keyed by
     *                                         group name.
     * @param {Object} hitCheckGenerators   The Function generators used for
     *                                      hitChecks, as an Object with 
     *                                      sub-Objects for each group, which
     *                                      have sub-Objects for each group they
     *                                      may collide with.
     * @param {Object} hitFunctionGenerators   The Function generators used for
     *                                         collisions, as an Object with
     *                                         sub-Objects for each group, which
     *                                         have sub-Objects for each group
     *                                         they may collide with.
     * @param {String[]} groupNames   The names of the groups within the 
     *                                GroupHoldr to manipulate.
     * @param {GroupHoldr} [GroupHolder]   The GroupHoldr to manipulate. If not
     *                                     provided, a new one is created with
     *                                     the same settings Object.
     * 
     */
    self.reset = function(settings) {
        globalCheckGenerators = settings.globalCheckGenerators;
        hitCheckGenerators = settings.hitCheckGenerators;
        hitFunctionGenerators = settings.hitFunctionGenerators;
        
        groupNames = settings.groupNames;
        
        GroupHolder = settings.GroupHolder || new GroupHoldr(settings);
        
        hitChecks = {};
        globalChecks = {};
        hitFunctions = {};
        
        cachedGroupNames = {};
        cachedTypeNames = {};
        
        self.checkHitsOf = {};
    };
    
    
    /* Simple gets
    */
    
    /**
     * @return {GroupHoldr} The internal GroupHoldr.
     */
    self.getGroupHolder = function () {
        return GroupHolder;
    };
    
    
    /* Runtime preparation
    */
    
    /**
     * Caches the hit checks for a 
     * 
     * 
     * 
     */
    self.cacheHitCheckGroup = function (groupName) {
        if (cachedGroupNames[groupName]) {
            return;
        }
        
        cachedGroupNames[groupName] = true;
        
        if (typeof globalCheckGenerators[groupName] !== "undefined") {
            globalChecks[groupName] = cacheGlobalCheck(groupName);
        }
    };
    
    /**
     * 
     */
    self.cacheHitCheckType = function (typeName, groupName) {
        if (cachedTypeNames[typeName]) {
            return;
        }
        
        if (typeof globalCheckGenerators[groupName] !== "undefined") {
            globalChecks[typeName] = cacheGlobalCheck(groupName);
        }
        
        if (typeof hitCheckGenerators[groupName] !== "undefined") {
            hitChecks[typeName] = cacheFunctionGroup(
                hitCheckGenerators, groupName
            );
        }
        
        if (typeof hitFunctionGenerators[groupName] !== "undefined") {
            hitFunctions[typeName] = cacheFunctionGroup(
                hitFunctionGenerators, groupName
            );
        }

        cachedTypeNames[typeName] = true;
        self.checkHitsOf[typeName] = self.generateHitsCheck(typeName);
    };
    
    /**
     * 
     */
    self.generateHitsCheck = function (typeName) {
        /**
         * 
         */
        return function checkHitsGenerated(thing) {
            var others, other, hitCheck,
                i, j, k;
             
            // Don't do anything if the thing shouldn't be checking
            if (!globalChecks[typeName](thing)) {
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
                        
                        // If they are the same, breaking prevents double hits
                        if (thing === other) { 
                            break;
                        }
                        
                        // Do nothing if these two shouldn't be colliding
                        if (!globalChecks[other.grouptype](other)) {
                            continue;
                        }
                        
                        // If they do hit, call the corresponding hitFunction
                        if (hitCheck(thing, other)) {
                            hitFunctions[typeName][other.grouptype](
                                thing, other
                            );
                        }
                    }
                }
            }
        };
    };
    
    /**
     * 
     */
    function cacheGlobalCheck(groupName) {
        return globalCheckGenerators[groupName]();
    };
    
    /**
     * 
     */
    function cacheFunctionGroup(functions, groupName) {
        var group = functions[groupName],
            output = {},
            i;
        
        for (i in group) {
            output[i] = group[i]();
        }
        
        return output;
    };
    
    
    self.reset(settings || {});
}