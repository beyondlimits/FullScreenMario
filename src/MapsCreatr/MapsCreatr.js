/**
 * 
 */
function MapsCreatr(settings) {
    "use strict";
    if(!this || this === window) {
        return new MapsManagr(settings);
    }
    var self = this,
        
        // ObjectMakr factory used to create Maps and Things
        ObjectMaker,
        
        // Associative array storing Map objects created by self.createMap
        maps,
        
        // An Array of Strings that represent all the possible group types
        // processed Prethings may be placed in
        group_names;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        // Maps and Things are created using an ObjectMaker factory
        if(!settings.ObjectMaker) {
            throw new Error("No ObjectMaker provided to MapsManger.");
        }
        ObjectMaker = settings.ObjectMaker;
        
        group_names = settings.group_names || [];
        
        maps = {};
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
            // The parsed container should be the same type as the original
            areas_parsed = new areas_raw.constructor(),
            area, i;
        
        // Parse all the keys in areas_raw (works for both Arrays and Objects)
        for(i in areas_raw) {
            if(areas_raw.hasOwnProperty(i)) {
                areas_parsed[i] = ObjectMaker.make("Area", areas_raw[i]);
                areas_parsed[i].map = map;
            }
        }
        
        // Store the output object in the Map, and keep the old settings for the
        // sake of debugging / user interest
        map.areas = areas_parsed;
        map.areas_raw = areas_raw;
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
                locs_parsed[i].area = map.areas[locs_parsed[i].area];
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
     * @param {Location} location 
     * @return {Object}   An associative array of Prething arrays. The keys will
     *                    be the unique group types of 
     */
    self.getPreThings = function getPreThings(location) {
        var area = location.area,
            map = area.map,
            creation = area.creation,
            prethings = fromKeys(group_names),
            i, len;
        
        xloc = 0;
        yloc = 0;
        
        for(i = 0, len = creation.length; i < len; i += 1) {
            analyzePreSwitch(creation[i], prethings, area, map);
        }
        
        sortPreThingsObject(prethings);
        
        return prethings;
    };
    
    /**
     * 
     */
    function analyzePreSwitch(reference, prethings, area, map) {
        if(reference.hasOwnProperty("location")) {
            return analyzePreLocation(reference, map);
        }
        
        if(reference.hasOwnProperty("macro")) {
            return analyzePreMacro(reference, prethings, area, map);
        }
        
        return analyzePreThing(reference, prethings, area, map);
    }
    
    /**
     * 
     */
    function analyzePreLocation(reference, map) {
        
    }
    
    /**
     * 
     */
    function analyzePreMacro(reference, prethings, area, map) {
        
    }
    
    /**
     * 
     */
    function analyzePreThing(reference, prethings, area, map) {
        
    }
    
    /**
     * 
     */
    function sortPreThingsObject(prethings) {
        var i;
        for(i in prethings) {
            sortPreThingsArray(prethings[i]);
        }
    }
    
    /**
     * 
     */
    function sortPreThingsArray(prethings) {
        
    }
    
    
    
    /* Utilities
    */
    
    /**
     * Creates an Object pre-populated with one key for each of the Strings in
     * the input Array, each pointing to undefined. 
     * 
     * @param {String[]} arr
     * @return {Object}
     * @remarks   This is the opposite of Object.keys, which takes in an Object
     *            and returns an Array of Strings.
     */
    function fromKeys(arr) {
        var output = {},
            i;
        for(i = arr.length - 1; i >= 0; i -= 1) {
            output[arr[i]] = undefined;
        }
        return output;
    }
    
    self.reset(settings || {});
}