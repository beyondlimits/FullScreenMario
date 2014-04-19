/**
 * 
 */
function GroupHoldr(settings) {
    "use strict";
    if(!this || this === window) {
        return new GroupHoldr(settings);
    }
    var self = this,
        
        groups,
        
        functions,
        
        group_names,
        
        group_types,
        group_type_names;
    
    /**
     * @constructor
     */
    var reset = self.reset = function(settings) {
        // The groups and types arguments must be provided
        if(!settings.hasOwnProperty("groups")) {
            throw new Error("No groups array provided to GroupHoldr");
        }
        if(!settings.hasOwnProperty("types")) {
            throw new Error("No types object provided to GroupHoldr");
        }
        
        // The functions containers start blank, but are filled in setGroupNames 
        functions = {
            "set": {},
            "get": {},
            "add": {},
            "del": {}
        };
        setGroupNames(settings.groups, settings.types);
    };
    
    /** 
     * Meaty function to reset, given an array of names an object of types
     * Any pre-existing functions are cleared, and new ones are added as
     * member objects and to {functions}
     * 
     * @param {String[]} names   An array of names of groupings to be made
     * @param {Object} types   An associative array of the function types of the
     *                         names given in names.
     */
    function setGroupNames(names, types) {
        if(!(names instanceof Array)) {
            throw new Error("No array of names given to setGroupNames");
        }
        
        // If there already were group names, clear them
        if(group_names) {
            clearFunctions();
        }
        
        // Set the new group_names, as ucFirst and removing duplicates
        group_names = names.map(function(name_old) {
            var name_new = ucFirst(name_old);
            // If the name changed, record the new name in types as well
            types[name_new] = types[name_old];
            return name_new;
        });
        group_names.sort();
        
        // Reset the group types and type names, to be filled next
        group_types = {}
        group_type_names = {};
        
        // Get the Function and String types of the groups
        group_names.forEach(function(name) {
            group_types[name] = getTypeFunction(types[name]);
            group_type_names[name] = getTypeName(types[name]);
        });
        
        // Create the containers, and set the modifying functions
        setGroups();
        setFunctions();
    }
    
    /**
     * Removes any pre-existing "set", "get", etc. functions
     */
    function clearFunctions() {
        group_names.forEach(function(name) {
            // Delete member variable functions
            delete self["set" + name];
            delete self["get" + name];
            delete self["add" + name];
            delete self["del" + name];
            
            // Delete functions under .functions by making each typeit a new {}
            functions.set = {};
            functions.get = {};
            functions.add = {};
            functions.del = {};
        });
    }
    
    /**
     * Resets groups to an empty object, and fills it with a new group_type for
     * each name in group_names
     */
    function setGroups() {
        groups = {};
        group_names.forEach(function(name) {
            groups[name] = new group_types[name]();
        });
    }
    
    /**
     * Calls the function setters for each name in group_names
     * @remarks Those are: createFunction<XYZ>: "Set", "Get", "Add", "Del"
     */
    function setFunctions() {
        group_names.forEach(function(name) {
            createFunctionSet(name);
            createFunctionGet(name);
            createFunctionAdd(name);
            createFunctionDel(name);
        });
    }
    
    
    /* Function generators
    */
    
    /**
     * Creates the set<type> function under self and functions.set
     * 
     * @param {String} name   The name of the group, from group_names
     */
    function createFunctionSet(name) {
        /**
         * Set function for a group of type <container> and name <name> 
         * holding objects of type <type>
         * 
         * @alias {setName}
         * @param {<container>} value   A new <container> for the group
         * @return {self}   The containing GroupHoldr
         */
        functions.set[name] = self["set" + name] = function(value) {
            if(value.constructor != group_types[name]) {
                throw new Error(name + " must be of type "
                        + group_type_names[name]);
            }
            groups[name] = value;
            return self;
        };
    }
    
    /**
     * Creates the get<type> function under self and functions.get
     * 
     * @param {String} name   The name of the group, from group_names
     */
    function createFunctionGet(name) {
        /**
         * Get function for a group of type <container> and name <name> 
         * holding objects of type <type>
         * Returns the container group itself or an object within, based on key
         * 
         * @alias {setName}
         * @param {<type>} key   The key of an item to be retrieved from the
         *                       group. If not given, the group is returned
         * @return {self}   The containing GroupHoldr
         */
        functions.get[name] = self["get" + name] = function(key) {
            var group = groups[name];
            if(arguments.length < 1) {
                return group;
            }
            return group[key];
        };
    }
    
    /**
     * Creates the add<type> function under self and functions.add
     * 
     * @param {String} name   The name of the group, from group_names
     */
    function createFunctionAdd(name) {
        var group = groups[name];
        if(group_types[name] == Object) {
            /**
             * Get function for a group of type Object and name <name> 
             * holding objects of type <type>
             * Adds the value object to the group under key
             * 
             * @alias {setName}
             * @param {<type>} key   The key of an item to be retrieved from the
             *                       group. If not given, the group is returned
             * @param value   The value, of any object type, to be added
             * @return {self}   The containing GroupHoldr
             */
            functions.add[name] = self["add" + name] = function(key, value) {
                group[key] = value;
                return self;
            };
        }
        else {
            /**
             * Get function for a group of type Array and name <name> 
             * holding objects of type <type>
             * Pushes the value object to the group
             * 
             * @alias {setName}
             * @param value   The value, of any object type, to be added
             * @return {self}   The containing GroupHoldr
             */
            functions.add[name] = self["add" + name] = function(value) {
                group.push(value);
                return self;
            };
        }
    }
    
    /**
     * Creates the del<type> (delete) function under self and functions.del
     * 
     * @param {String} name   The name of the group, from group_names
     */
    function createFunctionDel(name) {
        var group = groups[name];
        if(group_types[name] == Object) {
            /**
             * Delete function for a group of type Object and name <name> 
             * holding objects of type <type>
             * Removes the object in the group keyed by the key
             * 
             * @alias {setName}
             * @param {<type>} key   The item key to be deleted from the group
             * @return {self}   The containing GroupHoldr
             */
            self["del" + name] = function(key) {
                delete group[key];
                return self;
            };
        }
        else {
            /**
             * Delete function for a group of type Array and name <name> 
             * holding objects of type <type>
             * Removes the keyed object from the group
             * 
             * @alias {setName}
             * @param {<type>} key   The item key to be deleted from the group
             * @return {self}   The containing GroupHoldr
             */
            self["del" + name] = function(key) {
                group = group.splice(group.indexOf(key), 1);
                return self;
            };
        }
    }
    
    
    /* Simple gets
    */
    
    self.getFunctions = function() {
        return functions;
    }
    
    
    /* Utilities
    */
    
    /**
     * Returns the name of a type specified by a string ("Array" or "Object")
     * 
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {String}
     * @remarks The type is determined by the str[0]; if it exists and is 'o',
     *          the outcome is "Object", otherwise it's "Array".
     */
    function getTypeName(str) {
        if(str && str.charAt && str.charAt(0).toLowerCase() == 'o') {
            return "Object";
        }
        return "Array";
    }
    
    /**
     * Returns function specified by a string (Array or Object)
     * 
     * @param {String} str   The name of the type. If falsy, defaults to Array
     * @return {Function}
     * @remarks The type is determined by the str[0]; if it exists and is 'o',
     *          the outcome is Object, otherwise it's Array.
     */
    function getTypeFunction(str) {
        if(str && str.charAt && str.charAt(0).toLowerCase() == 'o') {
            return Object;
        }
        return Array;
    }
    
    /**
     * Uppercases the first character in a string
     * 
     * @param {String} str
     * @return {String}
     */
    function ucFirst(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
    
    reset(settings || {});
}