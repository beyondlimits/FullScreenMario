function FPSAnalyzr(settings) {
    "use strict";
    if (!this || this === window) {
        return new FPSAnalyzr(settings);
    }
    var self = this,
        
        // The max number of FPS measurements to keep
        num_to_keep,
        
        // A recent history of FPS measurements (normally an Array)
        // These are stored as changes in millisecond timestamps
        measurements,
        
        // The actual number of FPS measurements currently known
        num_recorded,
        
        // The current position in the measurements Array
        ticker,
        
        // The most recent performance.now timestamp
        time_current,
        
        // A system-dependant performance.now function
        get_timestamp;
    
    var reset = self.reset = function reset(settings) {
        num_to_keep  = settings.num_to_keep || 35;
        num_recorded = 0;
        ticker       = -1;
        
        // If num_to_keep is a Number, make the measurements array that long
        // If it's infinite, make measurements an {} (infinite array)
        measurements = isFinite(num_to_keep) ? new Array(num_to_keep) : {};
        
        // Unlike InputWritr, get_timestamp won't use Date.now()
        get_timestamp = (
          performance.now
          || performance.webkitNow
          || performance.mozNow
          || performance.msNow
          || performance.oNow
        ).bind(performance);
        
        return self;
    };
    
    
    /* Public interface
    */
    
    /**
     * The first call self.measure runs: because no other times were recorded,
     * this only marks time_current and makes future self.measure calls redirect
     * to the actual measure() function.
     * 
     * @alias measureFirst
     * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
     *                                     get_timestamp() is used instead.
     */
    self.measure = function measureFirst(time) {
        time_current = time || get_timestamp();
        self.measure = measure;
    }
    
    /**
     * Standard public measurement function.
     * Gets the time difference since the last measurement, and adds it to the
     * stored measurements.
     * 
     * @alias self.measure
     * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
     *                                     get_timestamp() is used instead.
     */
    function measure(time) {
        var time_new = time || get_timestamp(),
            fps_new = 1000 / (time_new - time_current);
        self.addFPS(fps_new);
        time_current = time_new;
    }
    
    /**
     * Adds an FPS measurement to measurements, and incremends the associated
     * count variables
     * 
     * @param {Number} fps   An FPS calculated as the difference between two
     *                       timestamps (ideally 1000 / dt[DomHighResTimeStamp])
     */
    self.addFPS = function(fps) {
        ticker = (++ticker) % num_to_keep;
        measurements[ticker] = fps;
        ++num_recorded;
    }
    
    
    /* Gets
    */
    
    /**
     * Get function for a copy of the measurements listing (if the number of
     * measurements is less than the max, that size is used)
     * 
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    measurements
     */
    self.getMeasurements = function() {
        var fps_kept_real = Math.min(num_to_keep, num_recorded),
            copy, i;
        if(isFinite(num_to_keep)) {
            copy = new Array(fps_kept_real);
        } else {
            copy = {};
            copy.length = fps_kept_real;
        }
        
        for(i = fps_kept_real - 1; i >= 0; --i) {
            copy[i] = measurements[i];
        }
        
        return copy;
    }
    
    /**
     * Get function for a copy of the measurements listing, but with the FPS
     * measurements transformed back into time differences
     * 
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    time differences
     */
    self.getDifferences = function() {
        var copy = self.getMeasurements(),
            i;
        for(i = copy.length - 1; i >= 0; --i) {
            copy[i] = 1000 / copy[i];
        }
        return copy;
    }
    
    /**
     * Get function for the average recorded FPS measurement
     * 
     * @return {Number}
     */
    self.getAverage = function() {
        var total = 0,
            max = Math.min(num_to_keep, num_recorded),
            i;
        for(i = max - 1; i >= 0; --i) {
            console.log("Adding", measurements[i], "to", total);
            total += measurements[i];
        }
        return total / max;
    }
    
    /**
     * Get function for the median recorded FPS measurement
     * 
     * @remarks This is O(n*log(n)), where n is the size of the history,
     *          as it creates a copy of the history and sorts it.
     * @return {Number}
     */
    self.getMedian = function() {
        var copy = self.getMeasurements().sort(),
            fps_kept_real = copy.length,
            fps_kept_half = Math.floor(fps_kept_real / 2),
            i;
         
        if(copy.length % 2 == 0) {
            return copy[fps_kept_half];
        } else {
            return (copy[fps_kept_half - 2] + copy[fps_kept_half]) / 2;
        }
    }
    
    /**
     * Get function for an array containing the lowest and highest FPS 
     * measurements, in that order
     * 
     * @return {Number[]}
     */
    self.getExtremes = function() {
        var lowest = measurements[0],
            highest = lowest,
            max = Math.min(num_to_keep, num_recorded),
            fps,
            i;
        for(i = max - 1; i >= 0; --i) {
            fps = measurements[i];
            if(fps > highest) highest = fps;
            else if(fps < lowest) lowest = fps;
        }
        return [lowest, highest];
    }
    
    /**
     * Get function for the range of recorded FPS measurements
     * 
     * @return {Number}
     */
    self.getRange = function() {
        var extremes = self.getExtremes();
        return extremes[1] - extremes[0];
    }
    
    reset(settings || {});
}