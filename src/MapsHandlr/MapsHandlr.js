/**
 * 
 */
function MapsHandlr(settings) {
    "use strict";
    if(!this || this === window) {
        return new MapsManagr(settings);
    }
    var self = this,
        
        // MapsCreatr container for maps from which this obtains Thing settings
        MapsCreator,
        
        // MapScreenr container for map attributes, such as "floor" or "setting"
        MapScreener,
        
        // An Array of Strings representing the names of attributes to be copied
        // to the MapScreener during self.setLocation
        screen_attributes,
        
        // The currently referenced map from MapsCreator, set by self.setMap
        map_current, 
        
        // The currently referenced area in a map, set by self.setLocation
        area_current,
        
        // The currently referenced location in an area, set by self.setLocation
        location_current,
        
        // The name of the currently edited map, set by self.setMap
        map_name;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        // Maps themselves should have been created in the MapsCreator object
        if(!settings.MapsCreator) {
            throw new Error("No MapsCreator provided to MapsHandlr.");
        }
        MapsCreator = settings.MapsCreator;
        
        // Map/Area attributes will need to be stored in a MapScreenr object
        if(!settings.MapScreener) {
            throw new Error("No MapScreener provided to MapsHandlr.");
        }
        MapScreener = settings.MapScreener;
        
        screen_attributes  = settings.screen_attributes || [];
    };
    
    
    /* Simple gets
    */
    
    /**
     * Simple getter for the MapScreenr object where attributes are copied.
     * 
     * @return {MapScreenr}
     */
    self.getMapScreener = function getMapScreener() {
        return MapScreener;
    };
    
    /**
     * Simple getter for the Array of attribute names copied to the MapScreener.
     */
    self.getScreenAttributes = function getScreenAttributes() {
        return screen_attributes;
    };
    
    /**
     * Simple getter for the key by which the current map is located in 
     * the MapCreatr. This is typically a String.
     *
     * @return {Mixed}
     */
    self.getMapName = function getMapName() {
        return map_name;
    }
    
    /** 
     * Gets the map listed under the given name. If no name is provided, the
     * current_map is returned instead.
     * 
     * @param {Mixed} [name]   An optional key to find the map under. This will
     *                         typically be a String.
     * @return {Map}
     */
    self.getMap = function getMap(name) {
        if(arguments.length) {
            return MapsCreator.getMap(name);
        } else {
            return current_map;
        }
    }
    
    
    /* Map / location setting
    */
    
    /**
     * Sets the currently manipulated map in the handler to be the one under a
     * given name. Optionally a location in the map may be specified as well.
     * 
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @param {Number} [location]   An optional number for the location to start
     *                              the map in (by default, 0, or the first).
     *                          
     */
    self.setMap = function setMap(name, location) {
        // Get the newly current map from self.getMap normally
        map_current = self.getMap(name);
        if(!map_current) {
            throw new Error("No map found under: " + name);
        }
        // If self.getMap threw an error (map not found), this won't be called
        map_name = name;
        
        // Most of the work is done by setLocation (by default, the map's first)
        return self.setLocation(location || 0);
    };
    
    /**
     * Goes to a particular location in the given map. This is the primary,
     * meaty function for resetting attributes in the MapScreenr.
     * 
     * @param [Number] location_number   The number of the location to start
     *                                   the map in.
     */
    self.setLocation = function setLocation(location_number) {
        var location, attribute, len, i;

        // Query the location from the current map and ensure it exists
        location = current_map.locations[location_number];
        if(!location) {
            throw new Error("Unknown location given: " + location_number);
        }
        
        // Since the location is valid, mark it as current (with its area)
        location_current = location;
        area_current = location.area;

        // Copy all the settings from that area into the MapScreenr container
        for(i = 0, len = screen_attributes.length; i < len; i += 1) {
            attribute = screen_attributes[i];
            MapScreener[attribute] = area_current[attribute];
        }
        
        // Reset the area's prethings object, 
        setPrethings(location);
    }
    
    /**
     * 
     */
    function setPrethings(location) {
        
    }
    
    /**
     * 
     */
    self.spawnMap = function spawnMap(xloc_new) {
        
    };
    
    
    self.reset(settings || {});
}