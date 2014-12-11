/**
 * TimeHandlr.js
 * 
 * A timed events library intended to provide a flexible alternative to 
 * setTimeout and setInterval that respects pauses and resumes. Events (which 
 * really Functions with arguments pre-set) are assigned integer timestamps,
 * and can be set to repeat a number of times determined by a number or callback
 * Function. Functionality to automatically "cycle" between certain classes of
 * an Object is also provided, similar to jQuery's class toggling.
 * 
 * @example
 * // Using a TimeHandler to 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
function TimeHandlr(settings) {
    "use strict";
    if (!this || this === window) {
        return new TimeHandlr(settings);
    }
    var self = this,

        // The current (most recently reached) game time
        time,

        // An int->event hash table of events to be run
        events,

        // Default attribute names, so they can be overriden
        cycles,
        className,
        onSpriteCycleStart,
        doSpriteCycleStart,
        cycleCheckValidity,

        // Default time separations
        timingDefault,

        // Whether a copy of settings should be made in setSpriteCycle
        copyCycleSettings,

        // Function handlers
        addClass,
        removeClass;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        time = settings.time || 0;
        events = settings.events || {};

        // Attribute names
        cycles = settings.cycles || "cycles";
        className = settings.className || "className";
        onSpriteCycleStart = settings.onSpriteCycleStart || "onSpriteCycleStart";
        doSpriteCycleStart = settings.doSpriteCycleStart || "doSpriteCycleStart";
        cycleCheckValidity = settings.cycleCheckValidity;

        // Smaller settings
        timingDefault = settings.timingDefault || 7;
        
        copyCycleSettings = typeof settings.copyCycleSettings === "undefined"
            ? true : settings.copyCycleSettings;

        // Function handlers
        addClass = settings.classAdd || addClassGeneric;
        removeClass = settings.classRemove || removeClassGeneric;
    }

    
    /* Simple gets
    */
     
    /**
     * @return {Number} The current time.
     */
    self.getTime = function () {
        return time;
    };
    
    /**
     * @return {Object} The catalog of events, keyed by their time triggers.
     */
    self.getEvents = function () {
        return events;
    };

    
    /* Event Adding (simple)
     * Sample usage:
     *self.addEvent(
     *   function (name, of, arguments) { ... },
     *   time_until_execution,
     *   arg1, arg2, arg3
     * );
     */

    // Public: self.addEvent
    // Equivalent to setTimeout
    // Adds a function to execute at a particular time, with arguments
    /**
     * Adds an event in a manner similar to setTimeout, though any arguments 
     * past the timeDelay will be passed to the event callback. The added event
     * is inserted into the events container and is set to only repeat once.
     * 
     * 
     * 
     */
    self.addEvent = function (callback, timeDelay) {
        var event, args;
        
        // Make sure callback is actually a function
        if (typeof callback !== "function") {
            throw new Error("Invalid event given to addEvent.");
        }
        
        timeDelay = timeDelay || 1;

        // Grab arguments to be passed to the function, excluding callback and timeDelay
        args = arrayMake(arguments);
        args.splice(0, 2);

        // Create the event, keeping track of start and end times
        event = new Event(callback, time + timeDelay, timeDelay, args, 1);

        // Add the event to events, then return it
        insertEvent(event, event.timeDelay);
        return event;
    };

    // Public: self.addEventInterval
    // Equivalent to setInterval
    // Similar toself.addEvent, but it will be repeated a specified number of times
    // Time delay until execution is the same as the time between subsequent executions
    // Functions that return true will stop execution
    self.addEventInterval = function (callback, timeDelay, num_repeats) {
        var event, args;
        
        // Make sure callback is actually a function
        if (typeof callback !== "function") {
            throw new Error("Invalid event given to addEventInterval.");
        }
        
        timeDelay = timeDelay || 1;
        num_repeats = num_repeats || 1;

        // Grab arguments to be passed, excluding callback, timeDelay, and num_repeats
        args = arrayMake(arguments);
        args.splice(0, 3);

        // Create the event, keeping track of start and end times, and repetitions
        event = new Event(callback, time + timeDelay, timeDelay, args, num_repeats);

        // These may need to have a reference to the event from the function
        callback.event = event;

        // Add the event to events, then return it
        insertEvent(event, event.timeDelay);
        return event;
    };

    // Public: self.addEventIntervalSynched
    // Delays the typicalself.addEventInterval until it's synched with time
    // (this goes by basic modular arithmetic)
    self.addEventIntervalSynched = function (callback, timeDelay, num_repeats, me, settings) {
        var calctime = timeDelay * settings.length,
            entry = Math.ceil(time / calctime) * calctime,
            scope = self,
            addfunc = function (scope, args, me) {
                return self.addEventInterval.apply(scope, args);
            };
        
        timeDelay = timeDelay || 1;
        num_repeats = num_repeats || 1;

        // If there's no difference in times, you're good to go
        if (entry == time) {
            return addfunc(scope, arguments, me);
        }
        // Otherwise it should be delayed until the time is right
       self.addEvent(addfunc, entry - time, scope, arguments, me);
    };

    // Quick handler to add an event at a particular time
    // An array must exist so multiple events can be at the same time
    function insertEvent(event, time) {
        if (!events[time]) {
            events[time] = [event];
        } else {
            events[time].push(event);
        }
        return events[time];
    }


    /* Event Removing (simple)
     */

    // Public: clearEvent
    // Makes an event not happen again
    var clearEvent = self.clearEvent = function (event) {
        if (event) {
            event.repeat = 0;
        }
    };

    // Public: clearAllEvents
    // Completely cancels all events
    var clearAllEvents = self.clearAllEvents = function () {
        events = {};
    };

    // Given an object, clear its class cycle under a given name
    var clearClassCycle = self.clearClassCycle = function (thing, name) {
        var cycle;
        
        if (!thing[cycles] || !thing[cycles][name]) {
            return;
        }
        
        cycle = thing[cycles][name];
        cycle[0] = false;
        cycle.length = false;
        
        delete thing[cycles][name];
    };

    // Given an object, clear all its class cycles
    var clearAllCycles = self.clearAllCycles = function (me) {
        var cycles = me[cycles],
            name, cycle;
        
        for (name in cycles) {
            cycle = cycles[name];
            cycle[0] = false;
            cycle.length = 1;
            delete cycles[name];
        }
    };

    /* Sprite Cycles (advanced)
     * Functions to cycle an object's [className] attribute through an array
     * Sample usage:
     * self.addClassCycle(
     *   me,
     *   ["run_one", "run_two", "run_three"]
     *   "running",
     *   7
     * );
     * Note: These need handlers from the user, such as given by FullScreenMario
     */

    // Public: self.addClassCycle
    // Sets a sprite cycle (settings) for an object under name
    self.addClassCycle = function (me, settings, name, timing) {
        var timingIsFunc = typeof timing === "function",
            cycle;
        
        // Make sure the object has a holder for cycles...
        if (!me[cycles]) {
            me[cycles] = {};
        }
        // ...and nothing previously existing for that name
        clearClassCycle(me, name);

        name = name || 0;

        // Set the cycle under me[cycles][name]
        cycle = me[cycles][name] = setSpriteCycle(
            me, settings, timingIsFunc ? 0 : timing
        );

        // If there is a timing function, make it the count changer
        if (cycle.event && timingIsFunc) {
            cycle.event.count_changer = timing;
        }

        // Immediately run the first class cycle, then return
        cycleClass(me, settings);
        return cycle;
    };

    // Public: self.addClassCycleSynched
    // Delays the typical self.addClassCycle until it's synced with time
     self.addClassCycleSynched = function (me, settings, name, timing) {
        var cycle;
        
        // Make sure the object has a holder for cycles...
        if (!me[cycles]) {
            me[cycles] = {};
        }
        // ...and nothing previously existing for that name
        clearClassCycle(me, name);

        // Set the cycle under me[cycles][name]
        name = name || 0;
        cycle = me[cycles][name] = setSpriteCycle(me, settings, timing, true);

        // Immediately run the first class cycle, then return
        cycleClass(me, me[cycles][name]);
        return cycle;
    };

    // Initializes a sprite cycle for an object
    function setSpriteCycle(me, settings, timing, synched) {
        var callback;
        
        // If required, make a copy of settings so if multiple objects are made with
        // the same settings, object, they don't override each other's settings.loc
        if (copyCycleSettings) {
            settings = makeSettingsCopy(settings);
        }

        // Start off before the beginning of the cycle
        settings.loc = settings.oldclass = -1;

        // Let the object know to start the cycle when needed
        callback = synched ? self.addEventIntervalSynched : self.addEventInterval;
        me[onSpriteCycleStart] = function () {
            callback(cycleClass, timing || timingDefault, Infinity, me, settings);
        };

        // If it should already start, do that
        if (me[doSpriteCycleStart]) {
            me[onSpriteCycleStart]();
        }

        return settings;
    }

    // Moves an object from its current class in the sprite cycle to the next one
    // Functions that return true will cause it to stop
    function cycleClass(me, settings) {
        var current, name;
        
        // If anything has been invalidated, return true to stop
        if (
            !me || !settings || !settings.length
            || (cycleCheckValidity != null && !me[cycleCheckValidity])
        ) {
            return true;
        }

        // Get rid of the previous class, from settings (-1 by default)
        if (settings.oldclass != -1 && settings.oldclass !== "") {
            removeClass(me, settings.oldclass);
        }

        // Move to the next location in settings, as a circular list
        settings.loc = (settings.loc += 1) % settings.length;

        // Current is the sprite, bool, or function currently being added and/or run
        current = settings[settings.loc];
        // If it isn't falsy, (run if needed and) set it as the next name
        if (current) {
            name = current instanceof Function ? current(me, settings) : current;

            // If the next name is a string, set that as the old class, and add it
            if (typeof name == "string") {
                settings.oldclass = name;
                addClass(me, name);
                return false;
            }
            // For non-strings, return true (to stop) if the name evaluated to be false
            else {
                return (name === false);
            }
        }
        // Otherwise since current was false, return true (to stop) if it's === false 
        else {
            return (current === false);
        }
    }

    /* Event Handling
     */

    // Public: handleEvents
    // Increments time and runs all events at the new events[time]
    self.handleEvents = function () {
        var events_current, event, length, i;
        
        time += 1;
        events_current = events[time];
        
        // If there isn't anything to run, don't even bother
        if (!events_current) {
            return; 
        }
        
        // For each event currently scheduled:
        for (i = 0, length = events_current.length; i < length; ++i) {
            event = events_current[i];

            // Call the function, using apply to pass in arguments dynamically
            // If running it returns true, it's done; otherwise check if it should go again
            if (event.repeat > 0 && !event.callback.apply(this, event.args)) {

                // If it has a count changer (and needs to modify itself), do that
                if (event.count_changer) event.count_changer(event);

                // If repeat is a function, running it determines whether to repeat
                if (event.repeat instanceof Function) {
                    // Binding then calling is what actually runs the function
                    if ((event.repeat.bind(event))()) {
                        event.count += event.timeRepeat;
                        insertEvent(event, event.timeDelay);
                    }
                }
                // Otherwise it's a number: decrement it, and if it's > 0, repeat.
                else {
                    event.repeat -= 1;
                    if (event.repeat > 0) {
                        event.timeDelay += event.timeRepeat;
                        insertEvent(event, event.timeDelay);
                    }
                }
            }
        }

        // Once all these events are done, ignore the memory
        delete events[time];
    };
    

    /* Utility functions
    */
    
    function Event(callback, timeDelay, timeRepeat, args, repeat) {
        this.callback = callback;
        this.timeDelay = timeDelay;
        this.timeRepeat = timeRepeat;
        this.args = args;
        this.repeat = repeat;
    }

    // Looking at you, function arguments
    function arrayMake(args) {
        return [].slice.call(args);
    }

    // Creates a copy of an object / array for use in settings
    function makeSettingsCopy(settings) {
        var output = new settings.constructor(),
            i;
        
        for (i in settings) {
            output[i] = settings[i];
        }
        
        return output;
    }

    // Default addClass
    function addClassGeneric(element, string) {
        element.className += ' ' + string;
    }

    // Default removeClass
    function removeClassGeneric(element, string) {
        element.className = element.className.replace(string, '');
    }

    
    self.reset(settings || {});
}