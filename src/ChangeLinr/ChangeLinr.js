/* ChangeLinr.js
 * 
 * General utility to transform raw input to processed output
 * A series of transform functions is provided, along with an ordered
 * 'pipeline' of their names, in order of when to apply them.
*/
function ChangeLinr(settings) {
  "use strict";
  if(!this || this === window) return new ChangeLinr(settings);
  var version = 1.0,
      self = this,
      
      // Associative array of functions ("name"=>function)
      transforms,
      
      // Ordered array of function names to be applied to raw input
      pipeline,
      pipe_len,
      
      // Cached output of the pipeline: out-facing and inward, respectively
      cache,
      cache_full,
      
      // Whether global functions are allowed in the pipeline (normally true)
      globals_ok;
  
  var reset = this.reset = function reset(settings) {
    transforms = settings.transforms || {};
    pipeline   = settings.pipeline   || [];
    pipe_len   = pipeline.length;
    globals_ok = settings.globals_ok;
    cache      = {};
    cache_full = {};
    
    // Ensure the pipeline is formatted correctly
    for(var i = 0; i < pipe_len; ++i) {
      // Don't allow null/false transforms
      if(!pipeline[i]) {
        console.error("Pipe[" + i + "] evaluates to false.");
        continue;
      }
      // Make sure each part of the pipeline exists
      if(!transforms.hasOwnProperty(pipeline[i])) {
        if(globals_ok && window.hasOwnProperty(pipeline[i]))
          transforms[pipeline[i]] = window[pipeline[i]];
        if(!transforms.hasOwnProperty(pipeline[i])) {
          console.error("Pipe[" + i + "] (" + pipeline[i] + ") not found in transforms.");
          continue;
        }
      }
      // Also make sure each part of the pipeline is a function
      if(!(transforms[pipeline[i]] instanceof Function))
        console.error("Pipe[" + i + "] (" + pipeline[i] + ") is not a valid function from transforms.");
      
      cache_full[i] = cache_full[pipeline[i]] = {};
    }
  }
  
  // Applies the series of transforms to the raw string
  // If a key is provided, it then caches the output
  this.process = function(raw, key, attributes) {
    var result, i;
    
    // If this keyed input was already processed, get that
    if(cache.hasOwnProperty(key))
      result = cache[key];
    // Otherwise apply and cache each transform in order
    else {
      result = raw;
      for(i = 0; i < pipe_len; ++i) {
        cache_full[pipeline[i]][key]
         = result
         = transforms[pipeline[i]](result, key, attributes, cache, cache_full);
      }
      cache[key] = result;
    }
    
    return result;
  }
  
  // Similar to this.process, but returns everything from cache
  this.processFull = function(raw, key, attributes) {
    var output = {},
        i;
    this.process(raw, key, attributes);
    for(i = 0; i < pipe_len; ++i)
      output[i] = output[pipeline[i]] = cache_full[pipeline[i]][key];
    return output;
  }
  
  this.getCache = function() { return cache; }
  this.getCacheFull = function() { return cache_full; }
  
  reset(settings || {});
  return self;
}