/**
 * ObjectMakr.js
 * An Abstract Factory for classes
 * 
 * This takes in a sketch of object inheritance and listing of properties for
 * each object, and dynamically creates function "constructors" for each one.
*/
function ObjectMakr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ObjectMakr(settings);
    }
    var self = this,

        // The sketch of which objects inherit from where
        inheritance,

        // An associative array of type properties, as "name" => {properties}
        properties,
        
        // Whether a full property mapping should be made for each type
        do_properties_full,
        
        // If do_full_properties, a version of properties that contains the sum
        // properties for each type (rather than missing inherited indices)
        properties_full,

        // Stored keys for the functions to be made
        functions,

        // Optionally, how properties can be mapped from an array to an object
        index_map,

        // Optionally, an index of a function to be run when an object is made
        on_make;

    self.reset = function reset(settings) {
        inheritance = settings.inheritance;
        properties = settings.properties || {};
        index_map = settings.index_map;
        on_make = settings.on_make;
        do_properties_full = settings.do_properties_full;
        
        // An inheritance map is required; a properties map is not
        if (!inheritance) {
            console.warn("No inheritance given to ObjectMakr.");
        }

        functions = {};
        
        if(do_properties_full) {
            properties_full = {};
        }

        if (index_map) {
            processProperties(properties);
        }

        processFunctions(inheritance, Object);
    };


    /* External functions
     */

    /**
     * Creates a new instance of the given type and returns it.
     * If desired, any settings are applied to it (deep copy using proliferate)
     *
     * @param {String} type   The type for which a new object of is being made
     */
    self.make = function (type, settings) {
        var output;

        // Make sure the type actually exists in functions
        if (!functions.hasOwnProperty(type)) {
            throw new Error("Unknown type given to ObjectMakr: " + type);
        }
        
        // Create the new object, copying any given settings
        output = new functions[type]();
        if (settings) {
            proliferate(output, settings);
        }

        if (on_make && output[on_make]) {
            if(do_properties_full) {
                output[on_make](output, type, properties[type], properties_full[type]);
            } else {
                output[on_make](output, type, properties[type], functions[type].prototype);
            }
        }

        return output;
    }

    /**
     * Simple getter for the inheritance object
     * 
     * @return {Object}
     */
    self.getInheritance = function () {
        return inheritance;
    };

    /**
     * Simple getter for the properties object
     * 
     * @return {Object}
     */
    self.getProperties = function (title) {
        return title ? properties[title] : properties;
    };

    /**
     * Simple getter for the full properties object, if it's specified to exist.
     * 
     * @return {Object}
     */
    self.getPropertiesFull = function (title) {
        if(do_properties_full) {
            return title ? properties_full[title] : properties;
        }
    };
    
    /**
     * Simple getter for the functions object
     * 
     * @return {Object}
     */
    self.getFunctions = function () {
        return functions;
    };

    /**
     * Returns whether a type (function) has been defined
     * 
     * @param {String} type   The name of the function this is checking for
     * @return {Boolean}
     */
    self.hasFunction = function (type) {
        return functions.hasOwnProperty(type);
    }

    /**
     * Returns a function of the given type, or undefined if it doesn't exist
     * 
     * @param {String} type   The name of the function this is asking for
     * @return {Function}
     */
    self.getFunction = function (type) {
        return functions[type];
    }


    /* Core parsing
     */

    /**
     * Parser that calls processPropertyArray on all properties given as arrays
     *
     * @param {Object} properties   The object of function properties
     * @remarks Only call this if index_map is given as an array
     */
    function processProperties(properties) {
        var name, property;

        // For each of the given properties:
        for (name in properties) {
            if (properties.hasOwnProperty(name)) {
                // If it's an array, replace it with a mapped version
                if (properties[name] instanceof Array) {
                    properties[name] = processPropertyArray(properties[name]);
                }
            }
        }
    }

    /**
     * Creates an output properties object with the mapping shown in index_map
     *
     * @param {Array} properties   An array with indiced versions of properties
     * @example index_map = ["width", "height"];
     *          properties = [7, 14];
     *          output = processPropertyArray(properties);
     *          // output is now { "width": 7, "height": 14 }
     */
    function processPropertyArray(properties) {
        var output = {},
            i;

        // For each [i] in properties, set that property as under index_map[i]
        for (i = properties.length - 1; i >= 0; --i) {
            output[index_map[i]] = properties[i];
        }

        return output;
    }

    /**
     * Recursive parser to generate each function, starting from the base
     *
     * @param {Object} base   An object whose keys are the names of functions to
     *                        made, and whose values are objects whose keys are
     *                        for children that inherit from these functions
     * @param {Function} parent   The parent function of the functions about to
     *                            be made
     * @remarks This uses eval which is evil and almost never a good idea, but
     *          here it's the only way to make functions with dynamic names.
     */
    function processFunctions(base, Parent, parentName) {
        var name, ref;

        // For each name in the current object:
        for (name in base) {
            if (base.hasOwnProperty(name)) {
                // Clean the name, so the user can't mess anything up
                name = cleanFunctionName(name);

                // Eval is evil, you should almost never use it!
                // cleanFunctionName(name) ensures this is safe, though slow.
                eval("functions[name] = function " + name + " () {};");

                // This sets the function as inheriting from the parent
                functions[name].prototype = new Parent();
                functions[name].prototype.constructor = functions[name];

                // Add each property from properties to the function prototype
                for (ref in properties[name]) {
                    if (properties[name].hasOwnProperty(ref)) {
                        functions[name].prototype[ref] = properties[name][ref];
                    }
                }
                
                // If the entire property tree is being mapped, copy everything
                // from both this and its parent to its equivalent
                if(do_properties_full) {
                    properties_full[name] = {};
                    
                    if(parentName) {
                        for (ref in properties_full[parentName]) {
                            if (properties_full[parentName].hasOwnProperty(ref)) {
                                properties_full[name][ref] = properties_full[parentName][ref];
                            }
                        }
                    }
                    
                    for (ref in properties[name]) {
                        if (properties[name].hasOwnProperty(ref)) {
                            properties_full[name][ref] = properties[name][ref];
                        }
                    }
                }

                processFunctions(base[name], functions[name], name);
            }
        }
    }


    /* Utilities
     */

    /**
     * Takes a desired function name, and strips any unsafe characters from it.
     * Allowed chars are the RegExp \w filter, so A-Z, a-z, 0-9, and _
     *
     * @param {String} str   A potentially unsafe function name to be made safe
     * @remarks The goal of this function is to make names safe for eval (yes,
     *          eval), not to allow full semantic compatability. Function names
     *          are kept as indices in the functions object.
     */
    function cleanFunctionName(str) {
        return str.replace(/[^\w]/g, '');
    }

    /**
     * Proliferate helper
     * Proliferates all members of the donor to the recipient recursively
     * 
     * @param {Object} recipient   An object receiving the donor's members
     * @param {Object} donor   An object whose members are copied to recipient
     * @param {Boolean} no_override   If recipient properties may be overriden
     */
    function proliferate(recipient, donor, no_override) {
        var setting, i;
        // For each attribute of the donor
        for (i in donor) {
            // If no_override is specified, don't override if it already exists
            if (no_override && recipient.hasOwnProperty(i)) continue;

            // If it's an object, recurse on a new version of it
            if ((typeof (setting = donor[i]) == "object")) {
                if (!recipient.hasOwnProperty(i)) {
                    recipient[i] = new setting.constructor();
                }
                proliferate(recipient[i], setting, no_override);
            }
            // Regular primitives are easy to copy otherwise
            else {
                recipient[i] = setting;
            }
        }
        return recipient;
    }

    self.reset(settings || {});
}