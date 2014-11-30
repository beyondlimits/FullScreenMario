/**
 * 
 */
function ModAttachr(settings) {
    "use strict";
    if(this === window) {
        return new ModAttachr(settings);
    }
    var self = this,
        
        // An Object of the mods with a listing for each event
        // by event names (e.g. "onReset" => [{Mod1}, {Mod2}]
        events,
        
        // An Object of information on each mod, keyed by mod names
        // (e.g. { "MyMod": { "Name": "Mymod", "enabled": 1, ...} ...})
        mods,
        
        // The StatsHoldr constructor for the StatsHolder (optional)
        
        // A new StatsHolder object to be created to store whether each
        // mod is stored locally (optional)
        StatsHolder,
        
        // A default scope to apply mod events from (optional)
        scope_default;
    
    /**
     * 
     */
    self.reset = function (settings) {
        mods = {};
        events = {};
        scope_default = settings.scope_default;
        
        if(settings.store_locally) {
            StatsHolder = new settings.StatsHoldr({
                "prefix": settings.prefix,
                "proliferate": settings.proliferate,
                "createElement": settings.createElement
            });
        }
        
        if(settings.mods) {
            self.addMods(settings.mods);
        }
        
    };
    
    
    /* Simple gets 
    */
    
    /**
     * Returns an Array containing each mod, keyed by their name.
     * 
     * @return {Object}
     */
    self.getMods = function () {
        return mods;
    };
    
    /**
     * Returns an Object containing each event, keyed by their name.
     * 
     * @return {Object}
     */
    self.getEvents = function () {
        return events;
    };
    
    /**
     * 
     */
    self.getStatsHolder = function () {
        return StatsHolder;
    };
    
    
    /* Alterations 
    */
    
    /**
     * Adds a mod to the pool of mods, listing it under all the relevant events.
     * If the event is enabled, the "onModEnable" event for it is triggered.
     * 
     * @param {Object} mod   A summary Object for a mod, containing at the very
     *                       least a name and Object of events.
     * @param {Object} [scope]   An optional scope for the mod's events.
     */
    self.addMod = function (mod, scope) {
        var mod_events = mod.events,
            event, i;
        
        for(i in mod_events) {
            if(mod_events.hasOwnProperty(i)) {
                event = mod_events[i];
                
                if(!events.hasOwnProperty(i)) {
                    events[i] = [mod];
                } else {
                    events[i].push(mod);
                }
            }
        }
        
        mod.scope = scope || scope_default;
        
        mods[mod.name] = mod;
        if(mod.enabled && mod.events["onModEnable"]) {
            self.fireModEvent("onModEnable", mod.name, arguments);
        }
        
        if(StatsHolder) {
            StatsHolder.addStatistic(mod.name, {
                "value_default": 0,
                "store_locally": true
            });
            
            var name = mod.name;
            if(StatsHolder.get(name)) {
                self.enableMod(name);
            }
        }
    };
    
    /**
     * Adds each mod in a given Array.
     * 
     * @param {Array} mods
     */
    self.addMods = function (mods) {
        var i;
        for(i = 0; i < mods.length; i += 1) {
            self.addMod(mods[i]);
        }
    };
    
    /**
     * Enables a mod of the given name, if it exists.
     * 
     * @param {String} name   The name of the mod to enable.
     */
    self.enableMod = function (name) {
        var mod = mods[name],
            args;
        
        if(!mod) {
            throw new Error("No mod of name: '" + name + "'");
        }
        
        mod.enabled = true;
        args = Array.prototype.slice.call(arguments);
        args[0] = mod;
        
        if(mod.events["onModEnable"]) {
            self.fireModEvent("onModEnable", mod.name, arguments);
        }
        
        if(StatsHolder) {
            StatsHolder.set(name, 1);
        }
    };
    
    /**
     * Enables any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {String} [mods]
     * @param {Array} [mods]
     */
    self.enableMods = function () {
        var i;
        for(i = 0; i < arguments.length; i += 1) {
            if(arguments[i] instanceof Array) {
                self.enableMods(arguments[i]);
            } else {
                self.enableMod(arguments[i]);
            }
        }
    };
    
    /**
     * Disables a mod of the given name, if it exists.
     * 
     * @param {String} name   The name of the mod to disable.
     */
    self.disableMod = function (name) {
        var mod = mods[name],
            args;
        
        if(!mods[name]) {
            throw new Error("No mod of name: '" + name + "'");
        }
        
        mods[name].enabled = false;
        args = Array.prototype.slice.call(arguments);
        args[0] = mod;
        
        if(mod.events["onModDisable"]) {
            self.fireModEvent("onModDisable", mod.name, args);
        }
        
        if(StatsHolder) {
            StatsHolder.set(name, 0);
        }
    };
    
    /**
     * Disables any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {String} [mods]
     * @param {Array} [mods]
     */
    self.disableMods = function () {
        var i;
        for(i = 0; i < arguments.length; i += 1) {
            if(arguments[i] instanceof Array) {
                self.disableMods(arguments[i]);
            } else {
                self.disableMod(arguments[i]);
            }
        }
    };
    
    /**
     * Toggles a mod via enableMod/disableMod of the given name, if it exists.
     * 
     * @param {String} name   The name of the mod to toggle.
     */
    self.toggleMod = function (name) {
        var mod = mods[name];
        
        if(!mod) {
            throw new Error("No mod found under " + name);
        }
        
        if(mod.enabled) {
            self.disableMod(name);
        } else {
            self.enableMod(name);
        }
    };
    
    /**
     * Toggles any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {String} [mods]
     * @param {Array} [mods]
     */
    self.toggleMods = function () {
        var i;
        for(i = 0; i < arguments.length; i += 1) {
            if(arguments[i] instanceof Array) {
                self.toggleMods(arguments[i]);
            } else {
                self.toggleMod(arguments[i]);
            }
        }
    };
    
    
    /* Actions
    */
    
    /**
     * Fires an event, which calls all functions listed undder mods for that 
     * event. Any number of arguments may be given.
     * 
     * @param {String} event   The name of the event to fire.
     */
    self.fireEvent = function (event) {
        var fires = events[event],
            args = Array.prototype.splice.call(arguments, 0),
            mod, i;
        
        if(!fires) {
            // console.warn("Unknown event name triggered: '" + name + "'");
            return;
        }
        
        for(i = 0; i < fires.length; i += 1) {
            mod = fires[i];
            args[0] = mod;
            if(mod.enabled) {
                mod.events[event].apply(mod.scope, args);
            }
        }
    };
    
    /**
     * Fires an event specifically for one mod, rather than all mods containing
     * that event.
     * 
     * @param {String} event   The name of the event to fire.
     * @param {String} mod   The name of the mod to fire the event.
     */
    self.fireModEvent = function (event, mod) {
        var mod = mods[mod],
            args = Array.prototype.slice.call(arguments, 2),
            fires;
        
        if(!mod) {
            throw new Error("Unknown mod requested: '" + mod + "'");
        }
        
        args[0] = mod;
        fires = mod.events[event];
        
        if(!fires) {
            throw new Error("Mod does not contain event: '" + event + "'");
        }
        
        fires.apply(mod.scope, args);
    }
    
    
    self.reset(settings || {});
}