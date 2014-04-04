/* StringFilr
 * Simple data structure for storing strings based on nested class names
 * This uses a tree structure 
*/

function StringFilr(settings) {
  "use strict";
  if(!this || this === window) return new StringFilr(settings);
  var version = "1.0",
      self = this,
      
      // A library of sprite strings
      library,
      
      // Listing of previously found lookups, for speed's sake
      cache,
      
      // Optional default class to recurse on when no suitable option is found
      normal,
      
      // Whether this should remove instances of the normal class in this.get()
      // This can be useful to ensure normal is only used as a last resort
      normalize,
      
      // Whether this should warn when a sub-object in reset has no normal child
      // This is more useful for debugging than for actual code
      warn_no_norm, 
      num_no_norm,
      
      // Whether this always gives an array for results, instead of strings
      // That array is [parent, index] (which is more efficient)
      give_parent;
  
  var reset = this.reset = function reset(settings) {
    library      = settings.library;
    cache        = {};
    normal       = settings.normal || "normal";
    normalize    = settings.normalize;
    warn_no_norm = settings.warn_no_norm;
    give_parent  = settings.give_parent;
    
    if(warn_no_norm) {
      if(!normal) console.warn("warn_no_normal is given as true, but no normal class was given.");
      else {
        num_no_norm = 0;
        checkNumNoNorm(library, "");
      }
    }
  }
  
  // Typical retrieval function
  // Takes in a className and returns the deepest matching part in the library
  // If give_parent is true, it returns the parent of whatever matches
  this.get = function(className) {
    // Normalizing removes all instances of the normal keyword, since they don't matter
    if(normalize) className = className.replace(normal, '');
    
    // Quickly return a cached result if it exists
    if(cache.hasOwnProperty(className)) return cache[className];
    
    var result = followClass(className.split(/\s+/g), library);
    
    // If give_parent is true, the results will be in reverse order
    if(give_parent) result = results_final(result);
    return cache[className] = result;
  }
  
  this.getLibrary = function() {
    return library;
  }
  
  this.getCache = function() {
    return cache;
  }
  
  this.setGiveParent = function(give_new) {
    give_parent = give_new;
  }
  
  // Either clears the entire cache or a specific item
  this.clear = function(className) {
    if(!arguments.length)
      cache = {};
    else {
      if(normalize) className = className.replace(normal, '');
      cache[className] = null;
    }
  }
  
  // rename current to something different from library?
  // Fancy version of followPath that accounts for normal and give_parent
  function followClass(names, current) {
    // If names runs out, we're done
    if(!names || !names.length) {
      return current;
    }
    
    var name, i;
    // For each name in the current array...
    for(i in names) {
      name = names[i];
      // ...if it matches, recurse on the other names
      if(current.hasOwnProperty(name)) {
        names.splice(i, 1);
        i = followClass(names, current[name], give_parent);
        return (give_parent && i.constructor != Object) ? [current, name, i] : i;
      }
    }
    
    // If no name matched, try the normal (default)
    if(normal && current.hasOwnProperty(normal)) {
      i = followClass(names, current[normal], give_parent);
      return (give_parent && i.constructor != Object) ? [current, normal, i] : i;
    }
    // Nothing matches anymore, we're done.
    return current;
  }
  
  // Recursively checks the library for tree branches that have no [normal]
  function checkNumNoNorm(current, path) {
    var has_norm = false;
    for(var i in current) {
      if(i == normal) has_norm = true;
      if(typeof(current[i]) == "object") {
        console.warn("No normal specified:", path);
        checkNumNoNorm(current[i], path + "->" + i);
      }
    }
    if(!has_norm) {
      ++num_no_norm;
    }
  }
  
  // Simple utility to get the last (deepest) parts of reverse-order results
  function results_final(results) {
    return typeof(results[2]) == "object" ? results_final(results[2]) : results; 
  }
  
  reset(settings);
  return self;
}