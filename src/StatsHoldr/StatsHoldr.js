/* StatsHoldr.js
 * A storage container used for Full Screen Mario
 
This acts as a fancy associative array, storing a listing of keys and their values.
Each key may also have other properties, such as localStorage and a display element.

*/
function StatsHoldr(settings) {
    "use strict";
    if (!this || this === window) {
        return new StatsHoldr(settings);
    }
    var self = this,

        // The names of the objects being stored, as "name"=>{settings}
        values,

        // Default attributes for value, as "name"=>{setting}
        defaults,
        
        // A reference to localStorage, or a replacement object
        localStorage,

        // A prefix to store things under in localStorage
        prefix,

        // A container element containing a div for each visible stored member
        container,

        // An array of elements as createElement arguments, outside-to-inside
        containers,

        // A bit of text between an element's label and value
        separator,

        // An Array of objects to be passed to triggered events
        callbackArgs,
        
        // Helper function to copy Object attributes, such as given by an EightBittr
        proliferate,
        
        // Helper function to create an element, such as given by an EightBittr
        createElement;
    
    /**
     * 
     */
    self.reset = function (settings) {
        localStorage = settings.localStorage || window.localStorage || {};
        prefix = settings.prefix || "";
        separator = settings.separator || "";
        proliferate = settings.proliferate;
        createElement = settings.createElement;
        callbackArgs = settings.callbackArgs;
        
        console.log("Ah", settings);

        defaults = {};
        if (settings.defaults) {
            proliferate(defaults, settings.defaults);
        }

        values = {};
        if (settings.values) {
            for (var key in settings.values) {
                self.addStatistic(key, settings.values[key]);
            }
        }

        if (settings.doMakeContainer) {
            containers = settings.containers || [
                ["div", {
                    "className": prefix + "_container"
                }]
            ]
            container = makeContainer(settings);
        }
    };

    /* Retrieval
     */
     
    /**
     * 
     */
    self.getKeyNames = function () {
        return Object.keys(values);
    };

    /**
     * 
     */
    self.get = function(key) {
        if (!checkExistence(key)) {
            return;
        }
        return values[key].value;
    }
    
    /**
     * 
     */
    self.getObject = function(key) {
        return values[key];
    }
    
    
    /* Values
    */
    
    /**
     * 
     */
    self.addStatistic = function (key, settings) {
        values[key] = new Value(key, settings);
    };
    
    /**
     * 
     */
    function Value(key, settings) {
        this.key = key;
        proliferate(this, defaults);  // value
        proliferate(this, settings);

        if (!this.hasOwnProperty("value")) {
            this.value = this.value_default;
        }
        
        if (this.has_element) {
            this.element = createElement(this.element || "div", {
                className: prefix + "_value " + key,
                innerHTML: this.key + separator + this.value
            });
        }

        if (this.storeLocally) {
            // If there exists an old version of this property, get it 
            if (localStorage.hasOwnProperty([prefix + key])) {
                var reference = localStorage[prefix + key],
                    constructor;

                // If possible, use the same type as value_default (e.g. #7 is not "7")
                if (this.hasOwnProperty("value")) {
                    if (this.value === null || this.value === undefined) {
                        constructor = false;
                    } else {
                        constructor = this.value.constructor;
                    }
                } else if (this.hasOwnProperty("value_default")) {
                    constructor = this.value_default.constructor;
                }
                
                this.value = constructor ? new constructor(reference).valueOf() : reference;
                
                // Remember that the boolean false will be stored as "false", which evaluates to true
                if (this.value.constructor == Boolean) {
                    console.warn("Key '" + key + "' is a boolean instead of a Number, which will always save to true.");
                }
            }
            // Otherwise save the new version to memory
            else {
                this.updateLocalStorage();
            }
        }
    }
    
    /**
     * 
     */
    Value.prototype.checkTriggers = function () {
        if (this.triggers.hasOwnProperty(this.value)) {
            this.triggers[this.value].apply(this, callbackArgs);
        }
    };
    
    /**
     * 
     */
    Value.prototype.checkModularity = function () {
        while (this.value >= this.modularity) {
            this.value = Math.max(0, this.value - this.modularity);
            if (this.on_modular) {
                this.on_modular.apply(this, callbackArgs);
            }
        }
    };
    
    /**
     * 
     */
    Value.prototype.update = function () {
        // Mins and maxes must be obeyed before any other considerations
        if (this.hasOwnProperty("minimum") && Number(this.value) <= Number(this.minimum)) {
            this.value = this.minimum;
            if (this.on_minimum) {
                this.on_minimum.apply(this, callbackArgs);
            }
        } else if (this.hasOwnProperty("maximum") && Number(this.value) <= Number(this.maximum)) {
            this.value = this.maximum;
            if (this.on_maximum) {
                this.on_maximum.apply(this, callbackArgs);
            }
        }

        if (this.modularity) {
            this.checkModularity();
        }
        if (this.triggers) {
            this.checkTriggers();
        }
        if (this.has_element) {
            this.updateElement();
        }
        if (this.storeLocally) {
            this.updateLocalStorage();
        }
    };
    
    /**
     * 
     */
    Value.prototype.updateElement = function () {
        this.element.innerHTML = this.key + separator + this.value;
    };
    
    /**
     * 
     */
    Value.prototype.updateLocalStorage = function () {
        localStorage[prefix + this.key] = this.value;
    };


    /* Updating values
     */
    
    /**
     * 
     */
    self.set = function(key, value) {
        if (!checkExistence(key)) {
            return;
        }

        // Giving a value sets it, otherwise the current one is used
        if (arguments.length === 2) {
            values[key].value = value;
        }
        
        values[key].update();
    }
    
    /**
     * 
     */
    self.increase = function(key, value) {
        if (!checkExistence(key)) {
            return;
        }
        if (arguments.length == 1) {
            value = 1;
        }
        values[key].value += value;
        values[key].update();
    }
    
    /**
     * 
     */
    self.decrease = function(key, value) {
        if (!checkExistence(key)) {
            return;
        }
        if (arguments.length == 1) {
            value = 1;
        }
        values[key].value -= value;
        values[key].update();
    }

    /**
     * 
     */
    // Toggling requires the type to be a bool, since true -> "true" -> NaN
    self.toggle = function(key) {
        if (!checkExistence(key)) {
            return;
        }
        values[key].value = values[key].value ? 0 : 1;
        values[key].update();
    }

    /**
     * 
     */
    function checkExistence(key) {
        if (!values.hasOwnProperty(key)) {
            console.warn("The key '" + key + "' does not exist in storage.");
            return false;
        }
        return true;
    }
    

    /* HTML
     */

    /**
     * 
     */
    self.getContainer = function () {
        return container;
    };

    /**
     * 
     */
    self.hideContainer = function () {
        container.style.visibility = "hidden";
    };

    /**
     * 
     */
    self.displayContainer = function () {
        container.style.visibility = "";
    };

    /**
     * 
     */
    function makeContainer(settings) {
        var output = createElement.apply(undefined, containers[0]),
            current = output,
            child;

        if (settings.width) {
            output.style.width = settings.width + "px";
        }

        for (var i = 1, len = containers.length; i < len; ++i) {
            child = createElement.apply(undefined, containers[i]);
            current.appendChild(child);
            current = child;
        }
        for (var key in values) {
            if (values[key].has_element) {
                child.appendChild(values[key].element);
            }
        }
        return output;
    }
    

    self.reset(settings || {});
}