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
        maps;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        // Maps and Things are created using an ObjectMaker factory
        if(!settings.ObjectMaker) {
            throw new Error("No ObjectMaker provided to MapsManger.");
        }
        ObjectMaker = settings.ObjectMaker;
        
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
     * container Area, location, and spawning function.
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
                
                // The raw location lists a key for area, under the Map's areas
                locs_parsed[i].area = map.areas[locs_raw[i].area];
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
    
    self.reset(settings || {});
}