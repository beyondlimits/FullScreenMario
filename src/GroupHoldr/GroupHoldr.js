/**
 * 
 */
function GroupHoldr(settings) {
    "use strict";
    if(!this || this === window) {
        return new GroupHoldr(settings);
    }
    var self = this,
        
        // Associative array of strings to groups, where groups are each some
        // sort of array (either typical or associative).
        groups,
        
        // Associative array containing "add", "del", "get", and "set" keys to
        // those appropriate functions (e.x. functions.add.MyGroup is the same
        // as self.addMyGroup).
        functions,
        
        // Array of string names, each of which is tied to a group.
        group_names,
        
        // Associative array keying each group to the function it uses: Array
        // for regular arrays, and Object for associative arrays.
        group_types,
        
        // Associative array keying each group to the string name of the
        // function it uses: "Array" for regular arrays, and "Object" for
        // associative arrays.
        group_type_names;
    
    /**
     * @constructor
     */
    self.reset = function(settings) {
        // The group_names and group_types arguments must be provided
        if(!settings.hasOwnProperty("group_names")) {
            throw new Error("No group_names array provided to GroupHoldr");
        }
        if(!settings.hasOwnProperty("group_types")) {
            throw new Error("No group_types object provided to GroupHoldr");
        }
        
        // The functions containers start blank, but are filled in setGroupNames 
        functions = {
            "set": {},
            "get": {},
            "add": {},
            "del": {}
        };
        setGroupNames(settings.group_names, settings.group_types);
    };
    
    /** 
     * Meaty function to reset, given an array of names an object of types
     * Any pre-existing functions are cleared, and new ones are added as
     * member objects and to {functions}
     * 
     * @param {String[]} names   An array of names of groupings to be made
     * @param {Object} types   An associative array of the function types of the
     *                         names given in names. This may also be taken in
     *                         as a string, to be converted to an Object.
     */
    function setGroupNames(names, types) {
        if(!(names instanceof Array)) {
            throw new Error("No array of names given to setGroupNames");
        }
        
        // If there already were group names, clear them
        if(group_names) {
            clearFunctions();
        }
        
        // Reset the group types and type names, to be filled next
        group_types = {}
        group_type_names = {};
        
        // Set the new group_names, as ucFirst
        group_names = names.map(ucFirst);
        group_names.sort();
        
        // If group_types is an object, set custom group types for everything
        if(typeof(types) == "object") {
            group_names.forEach(function(name) {
                group_types[name] = getTypeFunction(types[name]);
                group_type_names[name] = getTypeName(types[name]);
            });
        }
        // Otherwise assume everything uses the same one, such as from a string
        else {
            var type_func = getTypeFunction(types),
                type_name = getTypeName(types);
            group_names.forEach(function(name) {
                group_types[name] = type_func;
                group_type_names[name] = type_name;
            });
        }
        
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
            delete self["set" + name + "Group"];
            delete self["get" + name + "Group"];
            delete self["add" + name];
            delete self["del" + name];
            
            // Delete functions under .functions by making each type a new {}
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
        functions.set[name] = self["set" + name + "Group"] = function(value) {
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
        functions.get[name] = self["get" + name + "Group"] = function(key) {
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
            functions.del[name] = self["del" + name] = function(key) {
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
            functions.del[name] = self["del" + name] = function(key) {
                group = group.splice(group.indexOf(key), 1);
                return self;
            };
        }
    }
    
    
    /* Group/ordering manipulators
    */
    
    /**
     * Deletes a given object from a group by calling Array.splice on
     * the result of Array.indexOf
     * 
     * @param {String} group_name   The string name of the group to delete an
     *                              object from.
     * @param {Number} object   The object to be deleted from the group.
     */
    self.deleteObject = function(group_name, object) {
        groups[group_name].splice(groups[group_name].indexOf(object), 1);
    };
    
    /**
     * Deletes a given index from a group by calling Array.splice. 
     * 
     * @param {String} group_name   The string name of the group to delete an
     *                              object from.
     * @param {Number} index   The index to be deleted from the group.
     * @param {Number} [max]   How many elements to delete after that index (if
     *                         falsy, just the first 1).
     */
    self.deleteIndex = function(group_name, index, max) {
        groups[group_name].splice(index, max || 1);
    };
    
    /**
     * Switches an object from group_old to group_new by removing it from the
     * old group and adding it to the new. If the new group uses an associative
     * array, a key should be passed in (which defaults to undefined).
     * 
     * @param {Mixed} object   The object to be moved from one group to another.
     * @param {String} group_old   The string name of the object's old group.
     * @param {String} group_new   The string name of the object's new group.
     * @param {String} [key_new]   A key for the object to be placed in the new
     *                             group, required only if the group contains an
     *                             associative array.
     */
    self.switchObjectGroup = function(object, group_old, group_new, key_new) {
        self.deleteObject(group_old, object);
        functions.add[group_new](object, key_new);
    };
    
    
    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed in an array after scope and func, as in
     * Function.apply's standard.
     * 
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to self).
     * @param {Function} func   A function to apply to each group.
     * @param {Array} [args]   An optional array of arguments to pass to the 
     *                         function after each group.
     */
    self.applyAll = function(scope, func, args) {
        var i;
        
        if(!args) {
            args = [ undefined ];
        } else {
            args.unshift(undefined);
        }
       
        if(!scope) {
            scope = self;
        }
        
        for(i = group_names.length - 1; i >= 0; i -= 1) {
            args[0] = groups[group_names[i]];
            func.apply(scope, args);
        }
    };
    
    /**
     * Calls a function for each group, with that group as the first argument.
     * Extra arguments may be passed after scope and func natively, as in 
     * Function.call's standard.
     * 
     * @param {Mixed} [scope]   An optional scope to call this from (if falsy, 
     *                          defaults to self).
     * @param {Function} func   A function to apply to each group.
     */
    self.callAll = function(scope, func) {
        var args = Array.prototype.slice.call(arguments, 1),
            group, i, i;
        
        if(!scope) {
            scope = self;
        }
        
        for(i = group_names.length - 1; i >= 0; i -= 1) {
            args[0] = groups[group_names[i]];
            func.apply(scope, args);
        }
    };
    
    /**
     * 
     */
    self.clearArrays = function () {
        var group, name, i;
        
        for(i = 0; i < group_names.length; i += 1) {
            group = groups[group_names[i]];
            
            if(group instanceof Array) {
                group.length = 0;
            }
        }
    }
    
    /* Simple gets
    */
    
    self.getFunctions = function () {
        return functions;
    };
    
    self.getGroups = function () {
        return groups;
    };
    
    self.getGroup = function(name) {
        return groups[name];
    };
    
    self.getGroupNames = function () {
        return group_names;
    };
    
    
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
    
    self.reset(settings || {});
}