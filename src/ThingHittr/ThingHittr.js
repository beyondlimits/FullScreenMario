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
        
        globalChecks,
        
        hitChecks,
        
        hitFunctions,
        
        hitCheckGenerators,
        
        globalCheckGenerators,
        
        hitFunctionGenerators,
        
        cachedGroupNames,
        
        cachedTypeNames;
    
    /**
     * 
     */
    self.reset = function(settings) {
        GroupHolder = settings.GroupHolder || new GroupHoldr(settings);
        QuadsKeeper = settings.QuadsKeeper || new GroupHoldr(settings);
        
        globalCheckGenerators = settings.globalCheckGenerators;
        hitCheckGenerators = settings.hitCheckGenerators;
        hitFunctionGenerators = settings.hitFunctionGenerators;
        
        hitChecks = {};
        globalChecks = {};
        hitFunctions = {};
        
        groupNames = settings.groupNames;
        cachedGroupNames = {};
        cachedTypeNames = {};
        
        self.checkHitsOf = {};
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
            hitChecks[typeName] = cacheFunctionGroup(hitCheckGenerators, groupName);
        }
        
        if (typeof hitFunctionGenerators[groupName] !== "undefined") {
            hitFunctions[typeName] = cacheFunctionGroup(hitFunctionGenerators, groupName);
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
                        
                        // If the two are the same, breaking prevents double hits
                        if (thing === other) { 
                            break;
                        }
                        
                        // Do nothing if these two shouldn't be colliding
                        if (!globalChecks[other.grouptype](other)) {
                            continue;
                        }
                        
                        // If they do hit, great! Do the corresponding hitFunction
                        if (hitCheck(thing, other)) {
                            hitFunctions[typeName][other.grouptype](thing, other);
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