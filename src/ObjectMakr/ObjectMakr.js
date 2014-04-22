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

        // Stored keys for the functions to be made
        functions,

        // Optionally, how properties can be mapped from an array to an object
        index_map,

        // Optionally, an index of a function to be run when an object is made
        on_make;

    var reset = self.reset = function reset(settings) {
        inheritance = settings.inheritance;
        properties = settings.properties || {};
        index_map = settings.index_map;
        on_make = settings.on_make;

        // An inheritance map is required; a properties map is not
        if (!inheritance) {
            console.warn("No inheritance given to ObjectMakr.");
        }

        functions = {};

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
            console.error("Unknown type given to ObjectMakr:", type);
            return;
        }

        // Create the new object, copying any given settings
        output = new functions[type]();
        if (settings) {
            proliferate(output, settings);
        }

        if (on_make && output[on_make]) {
            output[on_make](output, type, properties[type], functions[type].prototype);
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
    self.getProperties = function () {
        return properties;
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
    function processFunctions(base, Parent) {
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

                // Add each property from properties to the function prototype
                for (ref in properties[name]) {
                    if (properties[name].hasOwnProperty(ref)) {
                        functions[name].prototype[ref] = properties[name][ref];
                    }
                }

                processFunctions(base[name], functions[name]);
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




















// Kept for MapsManager :(
/* ObjectMakr.js
 * A factory for JavaScript objects derived from Full Screen Mario
*/
function ObjectMakrOld(settings) {
  "use strict";
  if(!this || this === window) return new ObjectMakrOld(settings);
  var version = "1.0",
      self = this,
      
      // The default settings, applied to all objects
      defaults,
      // Settings for each of the sub-types
      type_defaults,
      
      // An associative array of types, as "name"=>{properties}
      types,
      
      // The sketch of which objects inherit from where
      inheritance,
      
      // Whether and how type defaults have some indices mapped to different strings
      index_map,
      keep_mapped_keys,
      
      // An optional member function to be run immediately on made objects
      on_make,
      
      // Whether to store the name of the object type in produced objects
      store_type,
      
      // If allowed, what to call the parent type from an object
      // Be aware this is read/write, and the end-user can mess things up!
      parent_name;
    
  var reset = this.reset = function reset(settings) {
    on_make = settings.on_make;
    parent_name = settings.parent_name;
    
    // Create the default attributes every produced Object will have
    defaults = {};
    proliferate(defaults, settings.defaults || {});
    
    // Create the initial attributes for everything
    type_defaults = {};
    proliferate(type_defaults, settings.type_defaults || {});
    // (also performing the index mapping if requested)
    if(settings.index_map)
      mapIndices(type_defaults, settings.index_map, !settings.keep_mapped_keys);
    
    // Set up the default type attributes
    // (By default, 'defaults' is the parent of everything)
    inheritance = { defaults: {} };
    types = {};
    proliferate(inheritance.defaults, settings.inheritance || {});
    // Recursively proliferate the type inheritences
    resetInheritance(defaults, inheritance, "defaults");
  }
  
  // For each type and all its children, submissively copy the type's attributes
  function resetInheritance(source, structure, name, parent) {
    var type_name, type;
    for(type_name in structure) {
      // Make sure the new type exists
      if(!type_defaults[type_name])
        type_defaults[type_name] = {};
      
      // Submissively copy over all of them
      proliferate(type_defaults[type_name], source, true);
      types[type_name] = type_defaults[type_name];
      
      // If specified, keep a reference to the parent
      if(parent_name)
        type_defaults[type_name][parent_name] = parent;
      
      // Recurse on the child type
      resetInheritance(type_defaults[type_name], structure[type_name], type_name, source);
    }
  }
  
  // make("type"[, {settings})
  // Outputs a thing of the given type, optionally with user-given settings
  this.make = function(type, settings) {
    // If type is an array, use type[0] instead
    if(type instanceof Array) {
      // Make sure settings exists
      if(!settings) settings = {};
      // Copy any extra parts of type over as settings
      for(var i = 1, len = type.length; i < len; ++i)
        proliferate(settings, type[i])
      type = type[0];
    }
    
    // Make
    if(!types.hasOwnProperty(type)) {
      console.error("The type '" + type + "' does not exist.");
      return;
    }
    return proliferateDefaults({}, type, settings);
  }
  
  // proliferateDefaults({}, "type"[, {settings})
  // Proliferates all defaults of the given type to an object
  var proliferateDefaults = this.proliferateDefaults = function(recipient, type, settings) {
    // Copy the default settings from the specified type
    proliferate(recipient, types[type]);
    
    // Override in any user-defined settings
    if(settings)
      proliferate(recipient, settings);
      
    // If specified, run a function on the object immediately
    if(on_make && recipient[on_make]) {
      recipient[on_make](type, settings, type_defaults[type]);
    }
    
    return recipient;
  }
  
  /* Simple gets
  */
  this.getInheritance = function() { return inheritance; }
  this.getDefaults = function() { return defaults; }
  this.getTypeDefaults = function() { return type_defaults; }
  this.hasType = function(type) { return types.hasOwnProperty(type); }
  
  /* Proliferate helper
   * Proliferates all members of the donor to the recipient recursively
  */
  function proliferate(recipient, donor, no_override) {
    var setting, i;
    // For each attribute of the donor
    for(i in donor) {
      // If no_override is specified, don't override if it already exists
      if(no_override && recipient.hasOwnProperty(i)) continue;
      // If it's an object, recurse on a new version of it
      if(typeof(setting = donor[i]) == "object") {
        if(!recipient.hasOwnProperty(i)) recipient[i] = new setting.constructor();
        proliferate(recipient[i], setting, no_override);
      }
      // Regular primitives are easy to copy otherwise
      else recipient[i] = setting;
    }
    return recipient;
  }
  
  /* Index mapping
   * For each index, if there's a match in the map, change it to that
  */
  function mapIndices(objects, mapping, delete_keys) {
    // To do: switch the order of the loops?
    var object, key, i;
    // For each object in objects:
    for(i in objects) {
      object = objects[i];
      // For each key of that object,
      for(key in object) {
        if(mapping.hasOwnProperty(key)) {
          object[mapping[key]] = object[key];
          if(delete_keys)
            delete object[key];
        }
      }
    }
  }
  
  reset(settings || {});
  return self;
}