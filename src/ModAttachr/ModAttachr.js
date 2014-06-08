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
        mods;
    
    /**
     * 
     */
    self.reset = function (settings) {
        mods = {};
        events = {};
        
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
     * 
     * 
     */
    self.getEvents = function () {
        return events;
    };
    
    
    /* Alterations 
    */
    
    /**
     * Adds a mod to the pool of mods, listing it under all the relevant events.
     * The "onModEnable" event for that mod is triggered.
     * 
     * @param {Object} mod
     */
    self.addMod = function (mod) {
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
        
        mods[mod.name] = mod;
        if(mod.events["onModEnable"]) {
            self.fireModEvent("onModEnable", mod.name, undefined, arguments);
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
            self.fireModEvent("onModEnable", mod.name, undefined, arguments);
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
            self.fireModEvent("onModDisable", mod.name, undefined, arguments);
        }
    };
    
    
    /* Actions
    */
    
    /**
     * Fires an event, which calls all functions listed undder mods for that 
     * event. A scope may be given, as well as any number of arguments after the
     * scope.
     * 
     * @param {String} event   The name of the event to fire.
     * @param {Mixed} [scope]   An optional scope to bind the event to.
     */
    self.fireEvent = function (event, scope) {
        var fires = events[event],
            args = Array.prototype.splice.call(arguments, 1),
            mod, i;
        
        if(!fires) {
            // console.warn("Unknown event name triggered: '" + name + "'");
            return;
        }
        
        for(i = 0; i < fires.length; i += 1) {
            mod = fires[i];
            args[0] = mod;
            if(mod.enabled) {
                mod.events[event].apply(scope, args);
            }
        }
    };
    
    /**
     * Fires an event specifically for one mod, rather than all mods containing
     * that event.
     * 
     * @param {String} event   The name of the event to fire.
     * @param {String} mod   The name of the mod to fire the event.
     * @param {Mixed} [scope]   An optional scope to bind the event to.
     */
    self.fireModEvent = function (event, mod, scope) {
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
        
        fires.apply(scope, args);
    }
    
    
    self.reset(settings || {});
}