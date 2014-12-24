/**
 * 
 */
function MapsCreatr(settings) {
    "use strict";
    if (!this || this === window) {
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
        macroDefaults,
        
        // Associative array storing entrance functions, keyed by string alias
        entrances,
        
        // An Array of Strings that represents all the possible group types
        // processed PreThings may be placed in
        groupTypes,
        
        // Scratch xloc and yloc to be used for location offsets with PreThings
        xloc,
        yloc,
        
        // What key to check for group type under a Thing
        keyGroupType,
        
        // What key to check for if a PreThing's Thing is a Location's entrance
        key_entrance,
        
        // An optional scope to pass to macros as an argument after maps
        scope;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        // Maps and Things are created using an ObjectMaker factory
        if (!settings.ObjectMaker) {
            throw new Error("No ObjectMaker provided to MapsManger.");
        }
        ObjectMaker = settings.ObjectMaker;
        
        // At least one group type name should be defined for PreThing output
        if (!settings.groupTypes) {
            throw new Error("No group type names provided to MapsCreatr.");
        }
        groupTypes = settings.groupTypes;
        
        keyGroupType = settings.keyGroupType || "grouptype";
        key_entrance = settings.key_entrance || "entrance";
        
        macros = settings.macros || {};
        macroDefaults = settings.macroDefaults || {};
        entrances = settings.entrances || {};
        scope = settings.scope || self;
        
        maps = {};
        if (settings.maps) {
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
     * Simple getter for a map under the maps container. If the map has not been
     * initialized (had its areas and locations set), that is done here as lazy
     * loading.
     * 
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @return {Map}
     */
    self.getMap = function getMap(name) {
        var map = maps[name];
        if (!map) {
            throw new Error("No map found under: " + name);
        }
        
        if (!map.initialized) {
            // Set the one-to-many Map->Area relationships within the Map
            setMapAreas(map);
            
            // Set the one-to-many Area->Location relationships within the Map
            setMapLocations(map);    
            
            map.initialized = true;
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
        for (var i in maps) {
            if (maps.hasOwnProperty(i)) {
                self.storeMap(i, maps[i]);
            }
        }
    };
    
    /**
     * Creates and stores a new map. The internal ObjectMaker factory is used to
     * auto-generate it based on a given settings object. The actual loading of
     * areas and locations is deferred to self.getMap as lazy loading.
     * 
     * @param {Mixed} name   A name under which the map should be stored, 
     *                       commonly a String or Array.
     * @param {Object} settings   An Object containing arguments to be sent to
     *                            the ObjectMakr being used as a maps factory.
     * @return {Map}   The newly created map.
     */
    self.storeMap = function(name, settings) {
        var map = ObjectMaker.make("Map", settings);
        
        if (!name) {
            throw new Error("Maps cannot be created with no name.");
        }
        
        if (!map.areas) {
            throw new Error("Maps cannot be used with no areas: " + name);
        }
        
        if (!map.locations) {
            throw new Error("Maps cannot be used with no locations: " + name);
        }
        
        maps[name] = map;
        return map;
    }
    
    /**
     * Converts the raw area settings in a Map into Area objects.
     * 
     * These areas are typically stored as an Array or Object inside the Map 
     * containing some number of attribute keys (such as "settings") along with
     * an Array under "Creation" that stores some number of commands for 
     * populating that area in MapsHandlr::spawnMap.
     * 
     * @param {Map} map
     */
    function setMapAreas(map) {
        var areasRaw = map.areas,
            locationsRaw = map.locations,
            // The parsed containers should be the same types as the originals
            areas_parsed = new areasRaw.constructor(),
            locations_parsed = new locationsRaw.constructor(),
            obj, i;
        
        // Parse all the Area objects (works for both Arrays and Objects)
        for (i in areasRaw) {
            if (areasRaw.hasOwnProperty(i)) {
                obj = areas_parsed[i] = ObjectMaker.make("Area", areasRaw[i]);
                obj.map = map;
                obj.name = i;
            }
            obj.boundaries = {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0
            };
        }
        
        // Parse all the Location objects (works for both Arrays and Objects)
        for (i in locationsRaw) {
            if (locationsRaw.hasOwnProperty(i)) {
                obj = locations_parsed[i] = ObjectMaker.make("Location", locationsRaw[i]);
                
                // Location entrances should actually be the keyed functions
                if (!entrances.hasOwnProperty(obj.entry)) {
                    throw new Error("Location " + i + " has unknown entry string: " + obj.entry);
                }
                obj.entryRaw = obj.entry;
                obj.entry = entrances[obj.entry];
                obj.name = i;
                obj.area = locationsRaw[i].area || 0;
            }
        }
        
        // Store the output object in the Map, and keep the raw settings for the
        // sake of debugging / user interest
        map.areas = areas_parsed;
        map.areasRaw = areasRaw;
        map.locations = locations_parsed;
        map.lcationsRaw = locationsRaw;
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
        var locsRaw = map.locations,
            // The parsed container should be the same type as the original
            locs_parsed = new locsRaw.constructor(),
            location, i;
            
        // Parse all the keys in locasRaw (works for both Arrays and Objects)
        for (i in locsRaw) {
            if (locsRaw.hasOwnProperty(i)) {
                locs_parsed[i] = ObjectMaker.make("Location", locsRaw[i]);
                
                // The area should be an object reference, under the Map's areas
                locs_parsed[i].area = map.areas[locs_parsed[i].area || 0];
                if (!locs_parsed[i].area) {
                    throw new Error("Location " + i
                            + " references an invalid area: "
                            + locsRaw[i].area);
                }
            }
        }
        
        // Store the output object in the Map, and keep the old settings for the
        // sake of debugging / user interest
        map.locations = locs_parsed;
        map.locationsRaw = locsRaw;
    }
    
    
    /* Area setup (PreThing analysis)
    */
    
    /**
     * Given a Location object, which should contain a .area reference to its
     * parent Area and .map reference to its parent Map, this returns an 
     * associative array of PreThings containers.
     * 
     * Each reference (which is a JSON object taken from an Area's .creation 
     * Array) is an instruction to this script to switch to a location, push 
     * some number of PreThings to the PreThings object via a predefined macro,
     * or push a single PreThing to the PreThings object.
     * 
     * Once those PreThing objects are obtained, they are filtered for validity
     * (e.g. location setter commands are irrelevant after a single use), and 
     * sorted on .xloc and .yloc.
     * 
     * @param {Location} location 
     * @return {Object}   An associative array of PreThing containers. The keys 
     *                    will be the unique group types of all the allowed 
     *                    Thing groups, which will be stored in the parent
     *                    EightBittr's GroupHoldr. Each container stores Arrays
     *                    of the PreThings sorted by .xloc and .yloc in both
     *                    increasing and decreasing order.
     */
    self.getPreThings = function (location) {
        var area = location.area,
            map = area.map,
            creation = area.creation,
            prethings = fromKeys(groupTypes),
            i, len;
        
        xloc = 0;
        yloc = 0;
        
        area.collections = {};
        
        for (i = 0, len = creation.length; i < len; i += 1) {
            self.analyzePreSwitch(creation[i], prethings, area, map);
        }
        
        return processPreThingsArrays(prethings);
    };
    
    /**
     * PreThing switcher: Given a JSON representation of a PreThing, this 
     * determines what to do with it. It may be a location setter (to switch the
     * x- and y- location offset), a macro (to repeat some number of actions),
     * or a raw PreThing.
     * Any modifications done in a called function will be to push some number
     * of PreThings to their respective group in the output PreThings Object.
     * 
     * @param {Object} reference   A JSON mapping of some number of PreThings. 
     * @param {Object} PreThings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    self.analyzePreSwitch = function (reference, prethings, area, map) {
        // Case: location setter
        if (reference.hasOwnProperty("location")) {
            analyzePreLocation(reference, prethings, area, map);
        }
        // Case: macro (unless it's undefined)
        else if (reference.macro) {
            self.analyzePreMacro(reference, prethings, area, map);
        }
        // Case: default (a regular PreThing)
        else {
            self.analyzePreThing(reference, prethings, area, map);
        }
    }
    
    /**
     * PreThing case: Location instruction. This modifies the currently used
     * xloc and yloc variables to match that location's.
     * 
     * @param {Object} reference   A JSON mapping of some number of PreThings. 
     * @param {Object} PreThings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    function analyzePreLocation(reference, prethings, area, map) {
        var location = reference.location;
        
        if (!map.locations.hasOwnProperty(location)) {
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
     * @param {Object} PreThings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    self.analyzePreMacro = function(reference, prethings, area, map) {
        var macro = macros[reference.macro],
            outputs, len, i;
        
        if (!macro) {
            console.warn("A non-existent macro is referenced. It will be "
                    + "ignored: " + macro, reference, prethings, area, map);
            return;
        }
        
        // Avoid modifying the original macro by creating a new object in its
        // place, while submissively proliferating any default macro settings
        outputs = macro(reference, prethings, area, map, scope);
        for (i in macroDefaults) {
            if (macroDefaults.hasOwnProperty(i) && !outputs.hasOwnProperty(i)) {
                outputs[i] = macroDefaults[i];
            }
        }
        
        // If there is any output, recurse on all components of it, Array or not
        if (outputs) {
            if (outputs instanceof Array) {
                for (i = 0, len = outputs.length; i < len; i += 1) {
                    self.analyzePreSwitch(outputs[i], prethings, area, map);
                }
            } else {
                self.analyzePreSwitch(outputs, prethings, area, map);
            }
        }
        
        return outputs;
    }
    
    /**
     * Macro case: PreThing instruction. This creates a PreThing from the
     * given reference and adds it to its respective group in PreThings (based
     * on the PreThing's [keyGroupType] variable).
     * 
     * @param {Object} reference   A JSON mapping of some number of PreThings. 
     * @param {Object} PreThings   An associative array of PreThing Arrays, 
     *                             keyed by the allowed group types.
     * @param {Area} area   The Area object to be populated by these PreThings.
     * @param {Map} map   The Map object containing the Area object.
     */
    self.analyzePreThing = function (reference, prethings, area, map, scope) {
        var thing = reference.thing,
            prething;
        
        if (!ObjectMaker.hasFunction(thing)) {
            console.warn("A non-existent Thing type is referenced. It will be "
                    + "ignored: " + thing, reference, prethings, area, map);
            return; 
        }
        
        prething = new PreThing(ObjectMaker.make(thing, reference), reference);
        thing = prething.thing;
        
        if (!prething.thing[keyGroupType]) {
            console.warn("A Thing does not contain a " + keyGroupType + ". "
                    + "It will be ignored: ",
                    prething, "\n", arguments);
            return;
        }
        
        if (groupTypes.indexOf(prething.thing[keyGroupType]) === -1) {
            console.warn("A Thing contains an unknown " + keyGroupType
                    + ". It will be ignored: " + thing[keyGroupType],
                    prething, reference, prethings, area, map);
            return;
        }
        
        prethings[prething.thing[keyGroupType]].push(prething);
        if (!thing.noBoundaryStretch && area.boundaries) {
            stretchAreaBoundaries(prething, area);
        }
        
        // If a Thing is an entrance, then the location it is an entrance to 
        // must it and its position. Note that this will have to be changed
        // for Pokemon/Zelda style games.
        if (thing[key_entrance] !== undefined && typeof thing[key_entrance] != "object") {
            map.locations[thing[key_entrance]].xloc = prething.left;
            map.locations[thing[key_entrance]].entrance = prething.thing;
        }
        
        if (reference.collectionName && area.collections) {
            ensureThingCollection(
                prething,
                reference.collectionName, 
                reference.collectionKey, 
                area
            );
        }
        
        return prething;
    }
    
    /**
     * 
     */
    function stretchAreaBoundaries(prething, area) {
        var boundaries = area.boundaries;
        
        boundaries.top = Math.min(prething.top, boundaries.top);
        boundaries.right = Math.max(prething.right, boundaries.right);
        boundaries.bottom = Math.max(prething.bottom, boundaries.bottom);
        boundaries.left = Math.min(prething.left, boundaries.left);
    }
    
    /**
     * 
     */
    function PreThing(thing, reference) {
        this.thing = thing;
        this.title = thing.title;
        this.reference = reference;
        this.spawned = false;
        
        this.left = (reference.x || reference.left) || 0;
        this.top = (reference.y || reference.top) || 0;
        
        this.right = this.left + (
            reference.width
            || ObjectMaker.getFullPropertiesOf(this.title).width
        );
        this.bottom = this.top + (
            reference.height
            || ObjectMaker.getFullPropertiesOf(this.title).height
        );
        
        if (reference.position) {
            this.position = reference.position;
        }
    }
    
    /**
     * Adds a Thing to the specified collection in the Map's Area.
     * 
     * @param {PreThing} prething
     * @param {String} collectionName
     */
    function ensureThingCollection(prething, collectionName, collectionKey, area) {
        var thing = prething.thing,
            collection = area.collections[collectionName];
        
        if (!collection) {
            collection = area.collections[collectionName] = {};
        }
        
        thing.collection = collection;
        collection[collectionKey] = thing;
    }   
    
    /**
     * Creates an Object wrapper around a PreThings Object with versions of
     * each child PreThing[]sorted by xloc and yloc, in increasing and 
     * decreasing order.
     * 
     * @param {Object} prethings
     * @return {Object} A PreThing wrapper with the keys "xInc", "xDec",
     *                  "yInc", and "yDec".
     */
    function processPreThingsArrays(prethings) {
        var output = {},
            children, i;
        
        for (i in prethings) {
            if (prethings.hasOwnProperty(i)) {
                children = prethings[i];
                output[i] = {
                    "xInc": getArraySorted(children, sortPreThingsXInc),
                    "xDec": getArraySorted(children, sortPreThingsXDec),
                    "yInc": getArraySorted(children, sortPreThingsYInc),
                    "yDec": getArraySorted(children, sortPreThingsYDec)
                };
                
                // Adding in a "push" lambda allows MapsCreatr to interact with
                // this using the same .push syntax as Arrays.
                output[i].push = (function (prethings, prething) {
                    addArraySorted(prethings["xInc"], prething, sortPreThingsXInc);
                    addArraySorted(prethings["xDec"], prething, sortPreThingsXDec);
                    addArraySorted(prethings["yInc"], prething, sortPreThingsYInc);
                    addArraySorted(prethings["yDec"], prething, sortPreThingsYDec);
                }).bind(undefined, output[i]);
            }
        }
        
        return output;
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
        for (i = arr.length - 1; i >= 0; i -= 1) {
            output[arr[i]] = [];
        }
        return output;
    }
    
    /**
     * 
     */
    function getArraySorted(arr, func) {
        arr = arr.slice();
        arr.sort(func);
        return arr;
    }
    
    /**
     * 
     * 
     * @remarks This should eventually be O(logN), instead of O(N).
     */
    function addArraySorted(arr, object, sorter) {
        for (var i = 0; i < arr.length; i += 1) {
            if (sorter(object, arr[i]) < 0) {
                arr.splice(i, 0, object);
                return;
            }
        }
        arr.push(object);
    }
    
    /**
     * 
     */
    function sortPreThingsXInc(a, b) {
        return a.left === b.left ? a.top - b.top : a.left - b.left;
    }
    
    /**
     * 
     */
    function sortPreThingsXDec(a, b) {
        return b.right === a.right ? b.bottom - a.bottom : b.right - a.right;
    }
    
    /**
     * 
     */
    function sortPreThingsYInc(a, b) {
        return a.top === b.top ? a.left - b.left : a.top - b.top;
    }
    
    /**
     * 
     */
    function sortPreThingsYDec(a, b) {
        return b.bottom === a.bottom ? b.right - a.right : b.bottom - a.bottom;
    }
    
    self.reset(settings || {});
}