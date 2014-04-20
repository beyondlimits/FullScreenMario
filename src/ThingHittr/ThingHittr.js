function ThingHittr(settings) {
    "use strict";
    if(!this || this === window) {
        return new ThingHittr(settings);
    }
    var self = this,
        
        // GroupHoldr object used to hold the groups and manipulate contents
        GroupHolder,
        
        // QuadsKeepr object used for collision checking
        QuadsKeeper,
        
        // Container for functions to collision check between specific types
        // E.x. ["character"] = { "solid": function(a,b) {...} }
        hit_checks,
        // Quick reference of Object.keys(hit_checks)
        hit_check_keys;
    
    self.reset = function(settings) {
        // Get the main containers from settings, or make new ones if necessary
        GroupHolder = settings.GroupHolder || new GroupHoldr(settings);
        QuadsKeeper = settings.QuadsKeeper || new QuadsKeepr(settings);
        
        // Collision checking information should be given in the settings
        if(!settings.hit_checks) {
            throw new Error("No hit_checks given to ThingHittr");
        }
        hit_checks = settings.hit_checks;
        hit_check_keys = Object.keys(hit_checks);
    };
    
    
    /* Runtime
    */
    
    self.checkHits = function() {
        hit_check_keys.forEach(self.checkHitsOf);
    };
    
    self.checkHitsOf = function(type) {
        GroupHolder["get" + type + "Group"]().forEach(self.checkHitsOfOne);
        
    }
    
    self.checkHitsOfOne = function(thing) {
        console.log("checking", thing.title, "with", thing.numquads);
        for(var i = 0; i < thing.numquads; ++i) {
            console.log("\t", thing.quadrants[i].things);
        }
        
    }
    
    // upkeepjs::maintainCharacters -> utility.js::determineThingCollisions
    
    /* Simple gets
    */
    
    self.getGroupHolder = function() {
        return GroupHolder;
    }
    
    self.getQuadsKeeper = function() {
        return QuadsKeeper;
    }
    
    self.getHitChecks = function(a, b) {
        switch(arguments.length) {
            case 0:
                return hit_checks;
            case 1:
                return hit_checks[a];
            default:
                return hit_checks[a][b];
        }
    }
    
    
    self.reset(settings || {});
}