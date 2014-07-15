/**
 * 
 */
function MapsCreatr(settings) {
    "use strict";
    if(!this || this === window) {
        return new MapsCreatr(settings);
    }
    var self = this,
        
        // ObjectMakr factory used to create Maps and Things
        ObjectMaker,
        
        // Associative array storing Map objects created by self.createMap
        maps,
        
        // Associative array storing macro functions, keyed by string alias
        macros,
        
        // Associative array storing default macro settings for all macros
        macro_defaults,
        
        // Associative array storing entrance functions, keyed by string alias
        entrances,
        
        // An Array of Strings that represents all the possible group types
        // processed PreThings may be placed in
        group_types,
        
        // Scratch xloc and yloc to be used for location offsets with PreThings
        xloc,
        yloc,
        
        // What key to check for group type under a Thing
        key_group_type,
        
        // What key to check for if a PreThing's Thing is a Location's entrance
        key_exit;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        // Maps and Things are created using an ObjectMaker factory
        if(!settings.ObjectMaker) {
            throw new Error("No ObjectMaker provided to MapsManger.");
        }
        ObjectMaker = settings.ObjectMaker;
        
        // At least one group type name should be defined for PreThing output
        if(!settings.group_types) {
            throw new Error("No group type names provided to MapsCreatr.");
        }
        group_types = settings.group_types;
        
        key_group_type = settings.key_group_type || "grouptype";
        key_exit = settings.key_exit || "exit";
        
        macros = settings.macros || {};
        macro_defaults = settings.macro_defaults || {};
        entrances = settings.entrances || {};
        
        maps = {};
        if(settings.maps) {
            self.storeMaps(settings.maps);
        }
    };
    
    
    /* Simple gets
    */
    
    /**
     * Simple getter for the maps container.
     * 
     * @return {Object} maps
     */
    self.getMaps = function getMaps() {
        return maps;
    };
    
    /**
     * Simple getter for a map under the maps container
     * 
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @return {Map}
     */
    self.getMap = function getMap(name) {
        var map = maps[name];
        if(!map) {
            throw new Error("No map found under: " + name);
        }
        return map;
    };
    
    /**
     * Creates and stores a set of new maps based on the key/value pairs in a 
     * given Object. These will be stored as maps by their string keys via 
     * self.storeMap.
     * 
     * @param {Object} settings   An Object containing a set of key/map pairs to
     *                            store as maps.
     * @return {Object}   The newly created maps object.
     */
    self.storeMaps = function(maps) {
        for(var i in maps) {
            if(maps.hasOwnProperty(i)) {
                self.storeMap(i, maps[i]);
            }
        }
    };
    
    /**
     * Creates and stores a new map. The internal ObjectMaker factory is used to
     * auto-generate it based on a given settings object.
     * 
     * @param {Mixed} name   A name under which the map should be stored, 
     *                       commonly a String or Array.
     * @param {Object} settings   An Object containing arguments to be sent to
     *                            the ObjectMakr being used as a maps factory.
     * @return {Map}   The newly created map.
     */
    self.storeMap = function(name, settings) {
        var map = ObjectMaker.make("Map", settings);
        
        if(!map.areas) {
            throw new Error("Maps cannot be used with no areas: " + name);
        }
        
        if(!map.locations) {
            throw new Error("Maps cannot be used with no locations: " + name);
        }
        
        if(maps.hasOwnProperty(name)) {
            console.warn("Overriding a map that already exists under: " + name);
        }
        
        // Set the one-to-many Map->Area relationships within the Map
        setMapAreas(map);
        
        // Set the one-to-many Area->Location relationships within the Map
        setMapLocations(map);
        
        maps[name] = map;
        return map;
    }
    
    /**
     * Converts the raw area settings in a Map into Area objects.
     * 
     * These areas are typically stored as an Array or Object inside the Map 
     * containing some number of attribute keys (such as "settings") along with
     * an Array under "Creation" that stores some number of commands for 
     * populating that area in self.spawnMap.
     * 
     * @param {Map} map
     */
    function setMapAreas(map) {
        var areas_raw = map.areas,
            locations_raw = map.locations,
            // The parsed containers should be the same types as the originals
            areas_parsed = new areas_raw.constructor(),
            locations_parsed = new locations_raw.constructor(),
            obj, i;
        
        // Parse all the Area objects (works for both Arrays and Objects)
        for(i in areas_raw) {
            if(areas_raw.hasOwnProperty(i)) {
                obj = areas_parsed[i] = ObjectMaker.make("Area", areas_raw[i]);
                obj.map = map;
            }
        }
        
        // Parse all the Location objects (works for both Arrays and Objects)
        for(i in locations_raw) {
            if(locations_raw.hasOwnProperty(i)) {
                obj = locations_parsed[i] = ObjectMaker.make("Location", locations_raw[i]);
                // obj.map = map;
                
                // Location entrances should actually be the keyed functions
                obj.entry_raw = obj.entry;
                obj.entry = entrances[obj.entry];
            }
        }
        
        // Store the output object in the Map, and keep the raw settings for the
        // sake of debugging / user interest
        map.areas = areas_parsed;
        map.areas_raw = areas_raw;
        map.locations = locations_parsed;
        map.lcations_raw = locations_raw;
    }
    
    /**
     * Converts the raw location settings in a Map into Location objects.
     * 
     * These locations typically have very little information, generally just a
     * container Area, x-location, y-location, and spawning function.
     * 
     * @param {Map} map
     */
    function setMapLocations(map) {
        var locs_raw = map.locations,
            // The parsed container should be the same type as the original
            locs_parsed = new locs_raw.constructor(),
            location, i;
            
        // Parse all the keys in locas_raw (works for both Arrays and Objects)
        for(i in locs_raw) {
            if(locs_raw.hasOwnProperty(i)) {
                locs_parsed[i] = ObjectMaker.make("Location", locs_raw[i]);
                
                // The area should be an object reference, under the Map's areas
                locs_parsed[i].area = map.areas[locs_parsed[i].area || 0];
                if(!locs_parsed[i].area) {
                    throw new Error("Location " + i
                            + " references an invalid area: "
                            + locs_raw[i].area);
                }
            }
        }
        
        // Store the output object in the Map, and keep the old settings for the
        // sake of debugging / user interest
        map.locations = locs_parsed;
        map.locations_raw = locs_raw;
    }
    
    
    /* Area setup (Prething analysis)
    */
    
    /**
     * Given a Location object, which should contain a .area reference to its
     * parent Area and .map reference to its parent Map, this returns an 
     * associative array of Prethings arrays.
     * 
     * Each reference (which is a JSON object taken from an Area's .creation 
     * Array) is an instruction to this script to switch to a location, push 
     * some number of PreThings to the prethings object via a predefined macro,
     * or push a single PreThing to the prethings object.
     * 
     * Once those PreThing objects are obtained, they are filtered for validity
     * (e.g. location setter commands are irrelevent after a single use), and 
     * sorted on .xloc and .yloc.
     * 
     * @param {Location} location 
     * @return {Object}   An associative array of Prething arrays. The keys will
     *                    be the unique group types of all the allowed Thing
     *                    groups, which will be stored in the parent
     *                    EightBittr's GroupHoldr.
     */
    self.getPreThings = function getPreThings(location) {
        var area = location.area,
            map = area.map,
            creation = area.creation,
            prethings = fromKeys(group_types),
            i, len;
        
        xloc = 0;
        yloc = 0;
        
        for(i = 0, len = creation.length; i < len; i += 1) {
            analyzePreSwitch(creation[i], prethings, area, map);
        }
        
        processPreThingsArray(prethings);
        
        return prethings;
    };
    
    /**
     * PreThing switcher: Given a JSON representation of a PreThing, this 
     * determines what to do with it. It may be a location setter (to switch the
     * x- and y- location offset), a macro (to repeat some number of actions),
     * or a raw PreThing.
     * Any modifications done in a called function will be to push some number
     * of PreThings to their respective group in the output prethings Object.
     * 
     * @param {Object} reference   A JSON mapping of some number of PreThings. 
     * @param {Object} prethings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    function analyzePreSwitch(reference, prethings, area, map) {
        // Case: location setter
        if(reference.hasOwnProperty("location")) {
            analyzePreLocation(reference, prethings, area, map);
        }
        // Case: macro (unless it's undefined)
        else if(reference.macro) {
            analyzePreMacro(reference, prethings, area, map);
        }
        // Case: default (a regular PreThing)
        else {
            analyzePreThing(reference, prethings, area, map);
        }
    }
    
    /**
     * PreThing case: Location instruction. This modifies the currently used
     * xloc and yloc variables to match that location's.
     * 
     * @param {Object} reference   A JSON mapping of some number of PreThings. 
     * @param {Object} prethings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    function analyzePreLocation(reference, prethings, area, map) {
        var location = reference.location;
        
        if(!map.locations.hasOwnProperty(location)) {
            console.warn("A non-existent location is referenced. It will be "
                    + "ignored: " + location, reference, prethings, area, map);
            return;
        }
        
        xloc = map.locations[location].x;
        yloc = map.locations[location].y;
    }
    
    /**
     * PreThing case: Macro instruction. This calls the macro on the same input,
     * captures the output, and recursively repeats the analyzePreSwitch driver
     * function on the output(s). 
     * 
     * @param {Object} reference   A JSON mapping of some number of PreThings. 
     * @param {Object} prethings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    function analyzePreMacro(reference, prethings, area, map) {
        var macro = macros[reference.macro],
            outputs, len, i;
        
        if(!macro) {
            console.warn("A non-existent macro is referenced. It will be "
                    + "ignored: " + macro, reference, prethings, area, map);
            return;
        }
        
        // Avoid modifying the original macro by creating a new object in its
        // place, while submissively proliferating any default macro settings
        outputs = macro(reference, prethings, area, map);
        for(i in macro_defaults) {
            if(macro_defaults.hasOwnProperty(i) && !outputs.hasOwnProperty(i)) {
                outputs[i] = macro_defaults[i];
            }
        }
        
        // If there is any output, recurse on all components of it, Array or not
        if(outputs) {
            if(outputs instanceof Array) {
                for(i = 0, len = outputs.length; i < len; i += 1) {
                    analyzePreSwitch(outputs[i], prethings, area, map);
                }
            } else {
                analyzePreSwitch(outputs, prethings, area, map);
            }
        }
    }
    
    /**
     * Macro case: PreThing instruction. This creates a PreThing from the
     * given reference and adds it to its respective group in prethings (based
     * on the PreThing's [key_group_type] variable).
     * 
     * @param {Object} reference   A JSON mapping of some number of PreThings. 
     * @param {Object} prethings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    function analyzePreThing(reference, prethings, area, map) {
        var thing = reference.thing,
            prething;
        
        if(!ObjectMaker.hasFunction(thing)) {
            console.warn("A non-existent Thing type is referenced. It will be "
                    + "ignored: " + thing, reference, prethings, area, map);
            return; 
        }
        
        prething = new PreThing(ObjectMaker.make(thing, reference), reference);
        thing = prething.thing;
        
        if(!prething.thing[key_group_type]) {
            console.warn("A Thing does not contain a " + key_group_type + ". "
                    + "It will be ignored: ",
                    prething, "\n", arguments);
            return;
        }
        
        if(group_types.indexOf(prething.thing[key_group_type]) === -1) {
            console.log("Group types are", group_types, "\n");
            console.warn("A Thing contains an unknown " + key_group_type
                    + ". It will be ignored: " + thing[key_group_type],
                    prething, reference, prethings, area, map);
            return;
        }
        
        prethings[prething.thing[key_group_type]].push(prething);
        
        // If a Thing has a .exit attribute, that indicates the location should
        // be at the same xloc as that Thing (such as a Pipe)
        if(thing[key_exit] !== undefined) {
            map.locations[thing[key_exit]].xloc = prething.xloc;
            map.locations[thing[key_exit]].entrance = prething.thing;
        }
    }
    
    /**
     * 
     */
    function PreThing(thing, reference) {
        this.thing = thing;
        this.title = thing.title;
        this.reference = reference;
        this.xloc = reference.x || reference.xloc || 0;
        this.yloc = reference.y || reference.yloc || 0;
    }
    
    /**
     * Filters and sorts...
     * 
     * 
     */
    function processPreThingsArray(prethings) {
        
    }
    
    
    
    /* Utilities
    */
    
    /**
     * Creates an Object pre-populated with one key for each of the Strings in
     * the input Array, each pointing to a new Array. 
     * 
     * @param {String[]} arr
     * @return {Object}
     * @remarks This is a rough opposite of Object.keys, which takes in an 
     *          Object and returns an Array of Strings.
     */
    function fromKeys(arr) {
        var output = {},
            i;
        for(i = arr.length - 1; i >= 0; i -= 1) {
            output[arr[i]] = [];
        }
        return output;
    }
    
    self.reset(settings || {});
}