/* ChangeLinr.js
 *
 * General utility to transform raw input to processed output
 * A series of transform functions is provided, along with an ordered
 * 'pipeline' of their names, in order of when to apply them.
 */
function ChangeLinr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ChangeLinr(settings);
    }
    var self = this,

        // Associative array of functions ("name"=>function)
        transforms,

        // Ordered array of function names to be applied to raw input
        pipeline,
        pipe_len,

        // Cached output of the pipeline: out-facing and inward, respectively
        cache,
        cache_full,
        
        // Whether this should be caching responses
        do_make_cache,

        // Whether this should be retrieving cached results
        do_use_cache,

        // Whether global functions are allowed in the pipeline (normally true)
        globals_ok;

    self.reset = function reset(settings) {
        var i;
        
        transforms = settings.transforms || {};
        pipeline = settings.pipeline || [];
        
        do_make_cache = settings.hasOwnProperty("do_make_cache") ? settings.do_make_cache : true;
        do_use_cache = settings.hasOwnProperty("do_use_cache") ? settings.do_use_cache : true;
        globals_ok = settings.globals_ok || false;
        
        pipe_len = pipeline.length;
        
        cache = {};
        cache_full = {};

        // Ensure the pipeline is formatted correctly
        for (i = 0; i < pipe_len; ++i) {
            // Don't allow null/false transforms
            if (!pipeline[i]) {
                throw new Error("Pipe[" + i + "] evaluates to false.");
            }

            // Make sure each part of the pipeline exists
            if (!transforms.hasOwnProperty(pipeline[i])) {
                if (globals_ok) {
                    transforms[pipeline[i]] = window[pipeline[i]];
                }
                if (!transforms.hasOwnProperty(pipeline[i])) {
                    throw new Error("Pipe[" + i + "] (" + pipeline[i] + ") "
                        + "not found in transforms.");
                }
            }

            // Also make sure each part of the pipeline is a function
            if (!(transforms[pipeline[i]] instanceof Function)) {
                throw new Error("Pipe[" + i + "] (" + pipeline[i] + ") "
                    + "is not a valid function from transforms.");
            }

            cache_full[i] = cache_full[pipeline[i]] = {};
        }
    };
    
    
    /* Simple gets
    */

    self.getCache = function () {
        return cache;
    };
    self.getCacheFull = function () {
        return cache_full;
    };
    
    self.getDoMakeCache = function () {
        return do_make_cache;
    };
    
    self.getDoUseCache = function () {
        return do_use_cache;
    };
    
    
    /* Simple sets
    */
    
    self.setDoMakeCache = function (value) {
        do_make_cache = value;
    };
    
    self.setDoUseCache = function (value) {
        do_use_cache = value;
    };

    // Applies the series of transforms to the raw string
    // If a key is provided, it then caches the output
    self.process = function (raw, key, attributes) {
        var result, i;

        // If this keyed input was already processed, get that
        if (do_use_cache && cache.hasOwnProperty(key))
            result = cache[key];
        // Otherwise apply and cache each transform in order
        else {
            result = raw;
            
            for (i = 0; i < pipe_len; ++i) {
                cache_full[pipeline[i]][key] 
                    = result
                    = transforms[pipeline[i]](result, key, attributes, cache, cache_full);
            }
            
            if(do_make_cache) {
                cache[key] = result;
            }
        }

        return result;
    };

    // Similar to this.process, but returns everything from cache
    self.processFull = function (raw, key, attributes) {
        var output = {},
            i;
        self.process(raw, key, attributes);
        for (i = 0; i < pipe_len; ++i) {
            output[i]
                = output[pipeline[i]]
                = cache_full[pipeline[i]][key];
        }
        return output;
    };

    self.reset(settings || {});
}