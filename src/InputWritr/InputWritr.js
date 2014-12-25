/**
 * InputWritr.js
 * A middleman that manages input events and their associated triggers
 */

/**
 * InputWritr.js
 * 
 * A wrapper to link input events and associated triggers. Pipe functions are
 * available that take in user input, switch on the event code, and call the
 * appropriate callback.
 * Further utilities allow for saving and playback of input in JSON format.
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
function InputWritr(settings) {
    "use strict";
    if (!this || this === window) {
        return new InputWritr(settings);
    }
    var self = this,

        // 
        triggers,

        // The arguments to be passed to calls activated by triggers
        recipients,
        
        //
        aliases,

        // An Array of every action that has happened, with a timestamp
        history,
        // An Array of all histories, with indices set by self.saveHistory
        histories,

        // For compatibility, a var reference to getting the performance.now() timestamp
        getTimestamp,
        // 
        startingTime,

        // An object to be passed to event calls, commonly with key information
        // (such as "Down" => 0 }
        eventInformation,
        
        // An optional boolean callback to disable or enable input triggers
        canTrigger,

        // Whether to record events into the history
        recording,
        
        keyAliasesToCodes,
        
        keyCodesToAliases;

    /**
     *
     */
    self.reset = function (settings) {
        getTimestamp = (
            settings.getTimestamp
            || performance.now 
            || performance.webkitNow 
            || performance.mozNow 
            || performance.msNow 
            || performance.oNow 
            || function () {
                return new Date().getTime();
            }
        ).bind(performance);

        histories = [];
        aliases = {};
        
        triggers = settings.triggers || {};
        recipients = settings.recipients || {};
        eventInformation = settings.eventInformation;
        canTrigger = settings.canTrigger;
        recording = settings.hasOwnProperty("recording") ? settings.recording : true;
        
        self.addAliases(settings.aliases || {});
        
        keyAliasesToCodes = settings.keyAliasesToCodes || {
            "shift": 16,
            "ctrl": 17,
            "space": 32,
            "left": 37,
            "up": 38,
            "right": 39,
            "down": 40
        };
        
        keyCodesToAliases = settings.keyCodesToAliases || {
            "16": "shift",
            "17": "ctrl",
            "32": "space",
            "37": "left",
            "38": "up",
            "39": "right",
            "40": "down"
        };
    };

    /**
     * Clears the currently tracked inputs history and resets the starting time,
     * and (optionally) saves the current history.
     *
     * @param {Boolean} [keepHistory]   Whether the currently tracked history
     *                                   of inputs should be added to the master
     *                                   Array of histories (defaults to true).
     */
    self.restartHistory = function (keepHistory) {
        if (history && arguments.length && keepHistory) {
            histories.push(history);
        }
        history = {};
        startingTime = getTimestamp();
    };


    /* Simple gets
    */

    /** 
     * Returns the Object storing aliases, as "name" => [values]
     * 
     * @return {Object} aliases
     */
    self.getAliases = function () {
        return aliases;
    };
    
    /**
     * 
     */
    self.getAliasesAsKeyStrings = function () {
        var output = {},
            alias;
        
        for (alias in aliases) {
            output[alias] = self.getAliasAsKeyStrings(alias);
        }
        
        return output;
    };
    
    /**
     * 
     */
    self.getAliasAsKeyStrings = function (alias) {
        return aliases[alias].map(self.convertAliasToKeyString);
    }
    
    /**
     * 
     */
    self.convertAliasToKeyString = function (alias) {
        if (alias.constructor === String) {
            return alias;
        }
        
        if (alias > 96 && alias < 105) {
            return String.fromCharCode(alias - 48);
        }
        
        if (alias > 64 && alias < 97) {
            return String.fromCharCode(alias);
        }
        
        return typeof keyCodesToAliases[alias] !== "undefined"
            ? keyCodesToAliases[alias] : "?";
    }
    
    /**
     * 
     */
    self.convertKeyStringToAlias = function (key) {
        if (key.constructor === Number) {
            return key;
        }
        
        if (key.length === 1) {
            return key.charCodeAt(0) - 32;
        }
        
        return typeof keyAliasesToCodes[key] !== "undefined"
            ? keyAliasesToCodes[key] : -1;
    }
    
    /**
     * Get function for a single history, either the current or a past one.
     *
     * @param {String} [name]   The identifier for the old history to return. If
     *                          none is provided, the current history is used.
     * @return {Object}   A history of inputs
     */
    self.getHistory = function (name) {
        return arguments.length ? histories[name] : history;
    };

    /**
     * Simple get function for the Array of histories.
     *
     * @return {Array}
     */
    self.getHistories = function () {
        return histories;
    };

    /**
     * Simple get function for the Boolean of whether this is recording inputs.
     *
     * @return {Boolean}
     */
    self.getRecording = function () {
        return recording;
    };


    /* Simple sets
    */
     
    /**
     * Simple set function for the Function used to determine whether this is 
     * accepting inputs.
     * 
     * @param {Function}
     */
    self.setCanTrigger = function (status) {
        if (status.constructor === Boolean) {
            canTrigger = function () {
                return status;
            };
        } else {
            canTrigger = status;
        }
    }

    /**
     * Simple set function for the Boolean of whether this is recording inputs.
     *
     * @param {Boolean}
     */
    self.setRecording = function (recordingNew) {
        recording = recordingNew;
    };

    /**
     * Simple set function for the arguments object passed to event calls.
     *
     * @param {Object}
     */
    self.setEventInformation = function (eventInfoNew) {
        eventInformation = eventInfoNew;
    };

    
    /* Additions
    */
    
    /**
     * Adds a list of values by which an event may be triggered.
     * 
     * @param {String} name   The name of the event that is being given 
     *                        aliases, such as "left".
     * @param {Array} values   An array of aliases by which the event will also
     *                         be callable.
     */
    self.addAliasValues = function (name, values) {
        var triggerName, triggerGroup, 
            i;
        
        if (!aliases.hasOwnProperty(name)) {
            aliases[name] = values;
        } else {
            aliases[name].push.apply(aliases[name], values);
        }
        
        // triggerName = "onkeydown", "onkeyup", ...
        for (triggerName in triggers) {
            if (triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                triggerGroup = triggers[triggerName];
                
                if (triggerGroup.hasOwnProperty(name)) {
                    // values[i] = 37, 65, ...
                    for (i = 0; i < values.length; i += 1) {
                        triggerGroup[values[i]] = triggerGroup[name];
                    }
                }
            }
        }
    };
    
    /**
     * Removes a list of values by which an event may be triggered.
     * 
     * @param {String} name   The name of the event that is having aliases
     *                        removed, such as "left".
     * @param {Array} values   An array of aliases by which the event will no
     *                         longer be callable.
     */
    self.removeAliasValues = function (name, values) {
        var triggerName, triggerGroup, 
            i;
        
        if (!aliases.hasOwnProperty(name)) {
            return;
        }
        
        for (i = 0; i < values.length; i += 1) {
            aliases[name].splice(aliases[name].indexOf(values[i], 1));
        }
        
        // triggerName = "onkeydown", "onkeyup", ...
        for (triggerName in triggers) {
            if (triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                triggerGroup = triggers[triggerName];
                
                if (triggerGroup.hasOwnProperty(name)) {
                    // values[i] = 37, 65, ...
                    for (i = 0; i < values.length; i += 1) {
                        if (triggerGroup.hasOwnProperty(values[i])) {
                            delete triggerGroup[values[i]];
                        }
                    }
                }
            }
        }
    };
    
    /**
     * 
     */
    self.switchAliasValues = function (name, valuesOld, valuesNew) {
        self.removeAliasValues(name, valuesOld);
        self.addAliasValues(name, valuesNew);
    };
    
    /**
     * Adds a set of alises from an Object containing "name" => [values] pairs.
     * 
     * @param {Object} aliasesRaw
     */
    self.addAliases = function (aliasesRaw) {
        var aliasName;
        for (aliasName in aliasesRaw) {
            if (aliasesRaw.hasOwnProperty(aliasName)) {
                self.addAliasValues(aliasName, aliasesRaw[aliasName]);
            }
        }
    }
    
    /**
     * 
     * 
     * 
     */
    self.addEvent = function (trigger, label, callback) {
        if (!triggers.hasOwnProperty(trigger)) {
            throw new Error("Unknown trigger requested: '" + trigger + "'");
        }
        
        triggers[trigger][label] = callback;
        
        if (aliases.hasOwnProperty(label)) {
            for (var i = 0; i < aliases[label].length; i += 1) {
                if (triggers[trigger][label]) {
                    triggers[trigger][label][aliases[i]] = callback;
                }
            }
        }
    };
    
    /**
     * 
     */
    self.cancelEvent = function (trigger, label) {
        self.addEvent(trigger, label, false);
    };
    
    
    /**
     * Stores the current history in the histories Array. self.restartHistory is
     * typically called directly after.
     *
     * @param {String} [name]   An optional name to save the history as.
     * @remarks Histories are stored in an Array, so it's more performant to not
     *          provide a name if you do call this function often.
     */
    self.saveHistory = function (name) {
        histories.push(history);
        if (arguments.length) {
            histories[name] = history;
        }
    };

    /**
     * "Plays" back an Array of event information by simulating each keystroke
     * in a new call, timed by setTimeout.
     *
     * @param {Object} events   An optional events history to play back. If not
     *                          provided, the current history is used.
     * @remarks This will execute the same actions in the same order as before,
     *          but the arguments object may be different.
     */
    self.playHistory = function (events) {
        var timeouts = {},
            time, call;

        if (!arguments.length) {
            events = history;
        }

        for (time in events) {
            if (events.hasOwnProperty(time)) {
                call = makeEventCall(events[time]);
                timeouts[time] = setTimeout(call, Math.round(time - startingTime));
            }
        }
    }

    /**
     * Curry utility to create a closure that runs call() when called.
     *
     * @param {Array} info   An array containing [alias, keycode].
     */
    // Returns a closure function that actives a trigger when called
    function makeEventCall(info) {
        return function () {
            self.callEvent(info[0], info[1]);
        };
    }

    /**
     * Primary driver function to run an event. The event is chosen from the
     * triggers object, and called with eventInformation as the input.
     *
     * @param {Function, String} event   The event function (or string alias of
     *                                   it) that will be called.
     * @param {Number} [keycode]   The alias of the event function under
     *                             triggers[event], if event is a String.
     * @param {Event} [sourceEvent]   The raw event that caused the calling Pipe
     *                                to be triggered, such as a MouseEvent.
     * @return {Mixed}
     */
    self.callEvent = function (event, keycode, sourceEvent) {
        if (canTrigger && !canTrigger(event, keycode)) {
            return;
        }
        
        // If the event doesn't exist, ignore it
        if (!event) {
            console.warn("Blank event given, ignoring it.");
            return;
        }
        
        if (event.constructor === String) {
            event = triggers[event][keycode];
        }

        return event(eventInformation, sourceEvent);
    }

    /**
     * Creates and returns a function to run a trigger.
     *
     * @param {String} trigger   The label for the Array of functions that the
     *                           pipe function should choose from.
     * @param {String} [codeLabel]   An optional mapping String for the alias:
     *                                if provided, it changes the alias to a
     *                                listed alias keyed by codeLabel.
     * @param {Boolean} [preventDefaults]   Whether the input to the pipe
     *                                       function will be an HTML-style
     *                                       event, where .preventDefault()
     *                                       should be clicked.
     * @return {Function}
     * @example   Creating a function that calls an onKeyUp event, with a given
     *            input's keyCode being used as the codeLabel.
     *            InputWriter.makePipe("onkeyup", "keyCode");
     * @example   Creating a function that calls an onMouseDown event, and
     *            preventDefault of the argument.
     *            InputWriter.makePipe("onmousedown", null, true);
     */
    self.makePipe = function (trigger, codeLabel, preventDefaults) {
        if (!triggers.hasOwnProperty(trigger)) {
            console.warn("No trigger of label '" + trigger + "' has been defined.");
            return;
        }

        var functions = triggers[trigger],
            useLabel = arguments.length >= 2;

        return function Pipe(alias) {
            // Typical usage means alias will be an event from a key/mouse input
            if (preventDefaults && alias.preventDefault instanceof Function) {
                alias.preventDefault();
            }

            // If a codeLabel is needed, replace the alias with it
            if (useLabel) {
                alias = alias[codeLabel];
            }

            // If there's a function under that alias, run it
            if (functions.hasOwnProperty(alias)) {
                if (recording) {
                    history[getTimestamp() | 0] = [trigger, alias];
                }
                
                self.callEvent(functions[alias], undefined, arguments[0]);
            }
        }
    }

    self.reset(settings || {});
}