/**
 * WorldSeedr.js
 * Random map generator using JSON encoded map settings
 */
function WorldSeedr(settings) {
    "use strict";
    if (!this || this === window) {
        return new WorldSeedr(settings);
    }
    var self = this,
        
        // Large JSON object of block information
        blocks,
        
        // 
        area_paths,
        
        // 
        paths_first,
        paths_second,
        
        // Random number generator 
        DigitSeeder,
        
        // 
        ObjectMaker;
    
    var reset = self.reset = function reset(settings) {
        console.log("Doing", settings);
        blocks       = settings.blocks;
        ObjectMaker  = settings.ObjectMaker;
        paths_first  = settings.paths_first || ["top", "bottom"];
        paths_second = settings.path_second || ["left", "right"];
        DigitSeeder  = settings.DigitSeeder || new DigitSeedr();

        area_paths = {};
        for(var i = 0; i < paths_first.length; ++i) {
            area_paths[paths_first[i]] = paths_second.slice();
        }
        for(var i = 0; i < paths_second.length; ++i) {
            area_paths[paths_second[i]] = paths_second.slice();
        }
        
        if(!blocks) {
            throw "No block types given to WorldSeedr";
        }
        if(!ObjectMaker) {
            throw "No ObjectMaker given to WorldSeedr";
        }
    }
    
    
    /* Generation
    */
    
    self.seedArea = function(type) {
        if(!blocks[type]) {
            throw "Unknown type of area:" + type;
        }
        
        return getBlockExpansion(blocks[type]);
        
        // return self;
    }
    
    function getBlockExpansion(block) {
        var output = {},
            dimensions = getBlockDimensions(block),
            children = block.children,
            direction = block.direction,
            holder, thing, position, i, j;
        
        // First get the side and corner possibilities
        // These are defined in area_paths, such as children[i="top"][j="left"]
        for(i in area_paths) {
            
            // If the block has this initial section (e.g. i="top")
            if(children.hasOwnProperty(i) && area_paths.hasOwnProperty(i)) {
                
                // Make a space for this dimension in output 
                output[i] = {};
                
                // For each secondary dimension (e.g. j="left"):
                for(j = 0; j < area_paths[i].length; ++j) {
                    
                    // If the block has this secondary section (e.g. j="left")
                    if(children[i].hasOwnProperty(area_paths[i][j])) {
                            
                        // Get a possible block/thing to fit in this section
                        thing = getPossibleThing(children[i][area_paths[i][j]],
                                dimensions);
                        
                        // Create a container with the thing and its [direction]
                        holder = { "children": { 0: thing } };
                        // holder[direction] = thing[direction];
                        holder[direction] = 3;
                        
                        // Add that container to the output
                        output[i][area_paths[i][j]] = holder;
                        
                        // Reduce remaining size in [direction] appropriately
                        // dimensions[direction] -= thing[direction];
                        dimensions[direction] -= 3;
                    }
                }
                
                // Since this secondary dimension was met, fill the center
                output[i].center = holder = { "children": {} };
                position = 0;
                while(dimensions[direction] > 0) {
                    // Get a new block/thing to fit as to add to output
                    thing = getPossibleThing(children[i].center, dimensions);
                    
                    // Put it next to the previous thing's [direction]
                    holder.children[position] = thing;
                    // position += thing[direction];
                    position += 7;
                    
                    // Reduce remaining size in [direction] appropriately
                    // dimensions[direction] -= thing[direction];
                    dimensions[direction] -= 7;
                }
                holder[direction] = position;
            }
        }
        
        return output;
    }

    function getPossibleThing(options, dimensions) {
        var current = 0,
            cap,
            total,
            type;
        
        // If the section hasn't determined its total, do that
        if(!options.total) {
            setOptionsTotal(options);
        }
        total = options.total;
        
        // Get a random number in the range of the section's total
        cap = DigitSeeder.randomInc(0, total);
        
        // Iterate through the possibilities, until this number is reached
        for(type in options) {
            if(type != "total" && options.hasOwnProperty(type)) {
                current += options[type];
                if(current >= cap) {
                    break;
                }
            }
        }
        
        return type;
    }
    
    /* Utilities
    */
    
    function getBlockDimensions(block) {
        return {
            "width": block.width || 
                    DigitSeeder.randomInc(block.width_min, block.width_max),
            "height": block.height ||
                    DigitSeeder.randomInc(block.height_min, block.height_max)
        };
    }
    
    function setOptionsTotal(section) {
        var total = 0,
            i;
        
        for(i in section) {
            total += section[i];
        }
        
        section.total = total;
    }

    reset(settings || {});
}