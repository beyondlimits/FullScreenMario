/*
ThingHitter.getGroupHolder().setCharacterGroup(characters);
ThingHitter.checkHitsOfGroup("Character")
*/
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
        hit_check_keys,
        
        // Container for functions to react to collisions between specific types
        // E.x. ["character"] = { "solid": function(a,b) {...} }
        hit_functions,
        
        // Global check functions, such as can_collide
        global_checks;
    
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
        
        // Collision functions should be givein in the settings
        hit_functions = settings.hit_functions;
        if(!settings.hit_functions) {
            throw new Error("No hit_functions given to ThingHittr");
        }
        
        // The only required global check is can_collide, so far
        if(!settings.global_checks) {
            throw new Error("No global_checks given to ThingHittr");
        }
        global_checks = settings.global_checks;
        if(!global_checks.can_collide) {
            throw new Error("No can_collide given in ThingHittr.global_checks");
        }
    };
    
    
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
    
    
    /* Runtime
    */
    
    self.checkHits = function() {
        hit_check_keys.forEach(self.checkHitsOfGroup);
    };
    
    self.checkHitsOfGroup = function(type) {
        GroupHolder["get" + type + "Group"]().forEach(self.checkHitsOfOne);
        
    }
    
    self.checkHitsOfOne = function(thing, id) {
        var others, other,
            i, j;
        
        // For each quadrant this is in, find each other thing in that quadrant
        for(i = 0; i < thing.numquads; ++i) {
            others = thing.quadrants[i].things;
            for(j = 0; j < others.length; ++j) {
                other = others[j];
                
                // If the two are the same, breaking prevents double hits
                if(thing === other) {
                    break;
                }
                
                // Check whether a collision should be happening
                tryCollision(hit_checks[thing.grouptype][other.grouptype]
                        , thing, other);
            }
        }
    }
    
    function tryCollision(hit_check, thing, other) {
        // If there's no hit_checks[~][~], hit_check will be falsy, so skip it
        if(!hit_check) {
            return;
        }
        
        // Also do nothing if these two shouldn't be colliding
        if(!global_checks.can_collide(other)) {
            return;
        }
        
        // If they do hit, great! Do the corresponding hit_function
        if(hit_check(thing, other)) {
            hit_functions[thing.grouptype][other.grouptype](thing, other);
        }
    }
    
    // upkeepjs::maintainCharacters -> utility.js::determineThingCollisions
    
    
    self.reset(settings || {});
}