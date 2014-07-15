/**
 * 
 */
function MapsHandlr(settings) {
    "use strict";
    if(!this || this === window) {
        return new MapsCreatr(settings);
    }
    var self = this,
        
        // MapsCreatr container for maps from which this obtains Thing settings
        MapsCreator,
        
        // MapScreenr container for map attributes, such as "floor" or "setting"
        MapScreener,
        
        // An Array of strings representing the names of attributes to be copied
        // to the MapScreener during self.setLocation
        screen_attributes,
        
        // The currently referenced map from MapsCreator, set by self.setMap
        map_current, 
        
        // The currently referenced area in a map, set by self.setLocation
        area_current,
        
        // The currently referenced location in an area, set by self.setLocation
        location_current,
        
        // The name of the currently edited map, set by self.setMap
        map_name,
        
        // The current area's array of prethings that are to be added in order
        // during self.spawnMap
        prethings,
        
        // When a prething needs to be spawned, this function should put it on
        // the map
        on_spawn,
        
        // The current x-location of prethings, which will be increased during
        // self.spawnMap
        xloc,
        
        // For each array within prethings, this stores the current spawn 
        // location within those arrays
        currents;
    
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
        
        screen_attributes = settings.screen_attributes || [];
        
        on_spawn = settings.on_spawn || console.log.bind(console, "Spawning:");
    };
    
    
    /* Simple gets
    */
    
    /**
     * Simple getter for the MapsCreatr object that makes the actual maps.
     * 
     * @return {MapsCreatr}
     */
    self.getMapsCreator = function getMapsCreator() {
        return MapsCreator;
    };
    
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
    };
    
    /** 
     * Gets the map listed under the given name. If no name is provided, the
     * map_current is returned instead.
     * 
     * @param {Mixed} [name]   An optional key to find the map under. This will
     *                         typically be a String.
     * @return {Map}
     */
    self.getMap = function getMap(name) {
        if(arguments.length) {
            return MapsCreator.getMap(name);
        } else {
            return map_current;
        }
    };
    
    /**
     * Simple getter pipe to the internal MapsCreator.getMaps() function.
     * 
     * @return {Object}   An associative array of maps, keyed by their names.
     */
    self.getMaps = function getMaps() {
        return MapsCreator.getMaps();
    };
    
    /**
     * Simple getter function for the area_current object.
     * 
     * @return {Object} The current area object, included area attributes.
     */
    self.getArea = function getArea() {
        return area_current;
    };
    
    /**
     * Simple getter function for a location within the current area's map.
     * 
     * @reutrn {Object} The request location object.
     */
    self.getLocation = function (location) {
        return area_current.map.locations[location];
    }
    
    /**
     * Simple getter function for the internal prethings object. This will be
     * null before the first self.setMap.
     * 
     * return {Prething[]}   An array of the current area's Prethings.
     */
    self.getPreThings = function getPreThings() {
        return prethings;
    }
    
    /* Map / location setting
    */
    
    /**
     * Sets the currently manipulated map in the handler to be the one under a
     * given name. Note that this will do very little unless a location is 
     * provided (this is by design - an EightBitter using this should set them
     * manually).
     * 
     * @param {Mixed} name   A key to find the map under. This will typically be
     *                       a String.
     * @param {Number} [location]   An optional number for a location to
     *                              immediately start the map in. 
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
        if(arguments.length > 1) {
            self.setLocation(location);
        }
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
        location = map_current.locations[location_number];
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
        
        // Reset the prethings object, enabling it to be used as a fresh start
        // for the new Area/Location placements
        prethings = MapsCreator.getPreThings(location);
        xloc = 0;
        
        // Start marking where to spawn individual groups of prethings
        currents = {};
        for(i in prethings) {
            if(prethings.hasOwnProperty(i)) {
                currents[i] = 0;
            }
        }
    };
    
    /**
     * 
     */
    self.spawnMap = function spawnMap(xloc_new) {
        var xloc_real = xloc_new ? Math.round(xloc_new) : 0;
        if(xloc_real <= xloc) {
            return;
        }
        
        var name, group, prething, i;
        
        // For each group of prethings currently able to spawn:
        for(name in prethings) {
            if(prethings.hasOwnProperty(name)) {
                group = prethings[name];
                i = currents[name];
                
                // Keep trying to spawn the rightmost thing, spawning whenever
                // a new one matches
                while(prething = group[i]) {
                    // console.log("Trying", prething.title, "(" + prething.xloc + ")");
                    if(prething.xloc > xloc_real) {
                        break;
                    }
                    i += 1;
                    
                    on_spawn(prething, prething.xloc);
                }
                
                // Save the new current index, if it changed
                currents[name] = i;
            }
        }
    };
    
    
    self.reset(settings || {});
}