/**
 * InputWritr.js
 * A middleman that manages input events and their associated triggers
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
        get_timestamp,
        // 
        starting_time,

        // An object to be passed to event calls, commonly with key information
        // (such as "Down" => 0 }
        event_information,
        
        // An optional boolean callback to disable or enable input triggers
        can_trigger,

        // Whether to record events into the history
        recording;

    /**
     *
     */
    self.reset = function (settings) {
        get_timestamp = (
            settings.get_timestamp
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
        event_information = settings.event_information;
        can_trigger = settings.can_trigger;
        recording = settings.hasOwnProperty("recording") ? settings.recording : true;
        
        self.addAliases(settings.aliases || {});
    };

    /**
     * Clears the currently tracked inputs history and resets the starting time,
     * and (optionally) saves the current history.
     *
     * @param {Boolean} [keep_history]   Whether the currently tracked history
     *                                   of inputs should be added to the master
     *                                   Array of histories (defaults to true).
     */
    self.restartHistory = function (keep_history) {
        if (history && arguments.length && keep_history) {
            histories.push(history);
        }
        history = {};
        starting_time = get_timestamp();
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
        
        for(alias in aliases) {
            output[alias] = self.getAliasAsKeyStrings(alias);
        }
        
        return output;
    };
    
    /**
     * 
     */
    self.getAliasAsKeyStrings = function (alias) {
        return aliases[alias].map(convertAliasToKeyString);
    }
    
    /**
     * 
     */
    function convertAliasToKeyString(key) {
        // String.fromCharCode((96 <= key && key <= 105)? key-48 : key)
        if(key > 96 && key < 105) {
            return String.fromCharCode(key - 48);
        }
        
        if(key > 64 && key < 97) {
            return String.fromCharCode(key);
        }
        
        switch(key) {
            case 16:
                return "shift";
            case 17:
                return "ctrl";
            case 32:
                return "space";
            case 37:
                return "left";
            case 38:
                return "up";
            case 39:
                return "right";
            case 40:
                return "down";
        }
        return "?";
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
        if(status.constructor === Boolean) {
            can_trigger = function () {
                return status;
            };
        } else {
            can_trigger = status;
        }
    }

    /**
     * Simple set function for the Boolean of whether this is recording inputs.
     *
     * @param {Boolean}
     */
    self.setRecording = function (recording_new) {
        recording = recording_new;
    };

    /**
     * Simple set function for the arguments object passed to event calls.
     *
     * @param {Object}
     */
    self.setEventInformation = function (event_info_new) {
        event_information = event_info_new;
    };

    
    /* Additions
    */
    
    /**
     * Adds a list of values by which an event may be triggered.
     * 
     * @param {String} name   The name of the event that is being given 
     *                         aliases, such as "left".
     * @param {Array} values   An array of aliases by which the event will also
     *                         be callable.
     */
    self.addAlias = function (name, values) {
        var trigger_name, trigger_group, 
            i;
        
        aliases[name] = values;
        
        // trigger_name = "onkeydown", "onkeyup", ...
        for(trigger_name in triggers) {
            if(triggers.hasOwnProperty(trigger_name)) {
                // trigger_group = { "left": function, ... }, ...
                trigger_group = triggers[trigger_name];
                
                if(trigger_group.hasOwnProperty(name)) {
                    // values[i] = 37, 65, ...
                    for(i = 0; i < values.length; i += 1) {
                        trigger_group[values[i]] = trigger_group[name];
                    }
                }
            }
        }
    };
    
    /**
     * Adds a set of alises from an Object containing "name" => [values] pairs.
     * 
     * @param {Object} aliases_raw
     */
    self.addAliases = function (aliases_raw) {
        var alias_name;
        for (alias_name in aliases_raw) {
            if (aliases_raw.hasOwnProperty(alias_name)) {
                self.addAlias(alias_name, aliases_raw[alias_name]);
            }
        }
    }
    
    /**
     * 
     * 
     * 
     */
    self.addEvent = function (trigger, label, callback) {
        if(!triggers.hasOwnProperty(trigger)) {
            throw new Error("Unknown trigger requested: '" + trigger + "'");
        }
        
        triggers[trigger][label] = callback;
        
        if(aliases.hasOwnProperty(label)) {
            for(var i = 0; i < aliases[label].length; i += 1) {
                if(triggers[trigger][label]) {
                    triggers[trigger][label][aliases[i]] = callback;
                }
            }
        }
    };
    
    /**
     * 
     */
    self.clearEvent = function (trigger, label) {
        self.addEvent(trigger, label, false);
        console.log("clearEvent called. There used to be \"debugger;\" here, not sure why.");
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
                timeouts[time] = setTimeout(call, Math.round(time - starting_time));
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
            callEvent(info[0], info[1]);
        };
    }

    /**
     * Primary driver function to run an event. The event is chosen from the
     * triggers object, and calld with event_information as the input.
     *
     * @param {Function, String} event   The event function (or string alias of
     *                                   it) that will be called.
     * @param {Number} [keycode]   The alias of the event function under
     *                             triggers[event], if event is a String.
     * @return {Mixed}
     */
    function callEvent(event, keycode) {
        if(can_trigger && !can_trigger(event, keycode)) {
            return;
        }
        
        // If the event doesn't exist, ignore it
        if (!event) {
            console.warn("Blank event given, ignoring it.");
            return;
        }

        if (typeof (event) === "string" || event instanceof String) {
            event = triggers[event][keycode];
        }

        return event(event_information);
    }

    /**
     * Creates and returns a function to run a trigger.
     *
     * @param {String} trigger   The label for the Array of functions that the
     *                           pipe function should choose from.
     * @param {String} [code_label]   An optional mapping String for the alias:
     *                                if provided, it changes the alias to a
     *                                listed alias keyed by code_label.
     * @param {Boolean} [prevent_defaults]   Whether the input to the pipe
     *                                       function will be an HTML-style
     *                                       event, where .preventDefault()
     *                                       should be clicked.
     * @return {Function}
     * @example   Creating a function that calls an onKeyUp event, with a given
     *            input's keyCode being used as the code_label.
     *            InputWriter.makePipe("onkeyup", "keyCode");
     * @example   Creating a function that calls an onContextMenu event, and
     *            preventDefault of the argument.
     *            InputWriter.makePipe("oncontextmenu", null, true);
     */
    self.makePipe = function (trigger, code_label, prevent_defaults) {
        if (!triggers.hasOwnProperty(trigger)) {
            console.warn("No trigger of label '" + trigger + "' has been defined.");
            return;
        }

        var functions = triggers[trigger],
            use_label = arguments.length >= 2;

        return function Pipe(alias) {
            // Typical usage means alias will be an event from a key/mouse input
            if (prevent_defaults && alias.preventDefault instanceof Function) {
                alias.preventDefault();
            }

            // If a code_label is needed, replace the alias with it
            if (use_label) {
                alias = alias[code_label];
            }

            // If there's a function under that alias, run it
            if (functions.hasOwnProperty(alias)) {
                if (recording) {
                    history[Math.round(get_timestamp())] = [trigger, alias];
                }
                
                callEvent(functions[alias]);
            }
        }
    }

    self.reset(settings || {});
}