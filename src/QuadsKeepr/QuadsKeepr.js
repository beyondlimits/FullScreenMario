/* The actual code!
 */
function QuadsKeepr(settings) {
    "use strict";
    if (!this || this === window) {
        return new QuadsKeepr(settings);
    }
    var self = this,
        
        // The ObjectMakr factory used to create Quadrant objects
        ObjectMaker,
        
        // Function used to create a canvas of a given width and height
        getCanvas,

        // Quadrants, listed as a raw array
        quadrants,

        // Quadrants, listed by columns
        columns,

        // How many quadrants, rows, and cols
        num_quads,
        num_rows,
        num_cols,

        // Sizes of the entire screen
        screen_width,
        screen_height,

        // Sizes of each each quadrant
        quad_width,
        quad_height,

        // How far off from a quadrant will still count as being in it
        tolerance,

        // When to delete a column
        delx,

        // How far to the right the spawning column should go
        out_difference,

        // The left- and right-most quads (for delx checking)
        leftmost,
        rightmost,

        // Names under which external Things should store Quadrant information
        thing_left,
        thing_top,
        thing_right,
        thing_bottom,
        thing_num_quads,
        thing_max_quads,
        thing_quadrants,
        thing_changed,
        thing_group_name,
        
        // An Array of string names a Thing may be placed into 
        group_names,

        // Callback for when Quadrants get updated
        onUpdate;

    self.reset = function (settings) {
        quadrants = [];
        columns = [];
        
        ObjectMaker = settings.ObjectMaker;
        
        getCanvas = settings.getCanvas;

        num_rows = settings.num_rows;
        num_cols = settings.num_cols;
        num_quads = num_rows * num_cols;

        quad_width = settings.quad_width | 0;
        quad_height = settings.quad_height | 0;

        tolerance = settings.tolerance || 0;
        delx = settings.delx || quad_width * -2;
        out_difference = quad_width;

        thing_left = settings.thing_left || "left";
        thing_right = settings.thing_right || "right";
        thing_top = settings.thing_top || "top";
        thing_bottom = settings.thing_bottom || "bottom";
        thing_num_quads = settings.thing_num_quads || "numquads";
        thing_max_quads = settings.thing_max_quads || "maxquads";
        thing_quadrants = settings.thing_quadrants || "quadrants";
        thing_changed = settings.thing_changed || "changed";
        thing_group_name = settings.thing_group_name || "group";
        
        group_names = settings.group_names;

        onUpdate = settings.onUpdate;

        self.resetQuadrants();
    }


    /* Public gets
    */
    
    self.getQuadrants = function () {
        return quadrants;
    };
    
    self.getNumQuads = function () {
        return num_quads;
    };
    
    self.getNumRows = function () {
        return num_rows;
    };
    
    self.getNumCols = function () {
        return num_cols;
    };
    
    self.getQuadWidth = function () {
        return quad_width;
    };
    
    self.getQuadHeight = function () {
        return quad_height;
    };
    
    self.getDelX = function () {
        return delx;
    };
    
    self.getOutDifference = function () {
        return out_difference;
    };


    /* Quadrant creation & initialization
    */

    // Public: resetQuadrants
    self.resetQuadrants = function () {
        // Clear the member arrays
        quadrants.length = 0;
        columns.length = 0;

        // Create the quadrants themselves
        for (var i = 0; i < num_cols; ++i) {
            addQuadCol((i - 2) * quad_width);
        }

        // Record the leftmost quad
        leftmost = quadrants[0];
    };

    // Quadrant Constructor
    function createQuadrant(row, left) {
        var canvas = getCanvas(quad_width, quad_height),
            quadrant = ObjectMaker.make("Quadrant", {
                "changed": true,
                "numthings": 0
            }), i;
        
        // Keep track of contained Things with an Array for each group type
        quadrant.things = {};
        quadrant.numthings = {};
        for(i = 0; i < group_names.length; i += 1) {
            quadrant.things[group_names[i]] = [];
            quadrant.numthings[group_names[i]] = 0;
        }
        
        quadrant.left = left;
        quadrant.top = (row - 1) * quad_height;
        quadrant.right = quadrant.left + quad_width;
        quadrant.bottom = quadrant.top + quad_height;

        quadrant.canvas = canvas;
        quadrant.context = canvas.getContext("2d");
        
        return quadrant;
    }


    /* Quadrant shuffling
    */

    // Public: update
    // Adds new columns to the right, if necessary
    self.updateQuadrants = function (xdiff) {
        xdiff = xdiff || 0;
        out_difference += xdiff;
        // As many times as needed, while the leftmost is out of bounds
        while (leftmost.left <= delx) {
            // Delete the offending columns
            shiftQuadCol();
            // Add a new one instead
            addQuadCol(rightmost.right);
            // If there's a callback for this, run it
            if (onUpdate) {
                onUpdate();
            }
        }
    };

    // Add a new quadrant column to the right of an x-location
    function addQuadCol(xloc) {
        var column = [],
            i;

        // Create a num_rows number of quadrants...
        for (i = 0; i < num_rows; ++i) {
            // (rightmost has to be kept track of anyway)
            rightmost = createQuadrant(i, xloc);
            // Placing each in the column and master list
            column.push(rightmost);
            quadrants.push(rightmost);
        }

        // Add the column to the master list of columns
        columns.push(column);
    }

    // Deletes the leftmost column of quadrants
    function shiftQuadCol() {
        var i;
        
        // Deleting the first column is easy
        columns.shift();

        // Deleting the first num_rows quadrants, slightly less so
        for (i = 0; i < num_rows; ++i) {
            quadrants.shift();
        }

        // Reset the leftmost quadrant, and the out_difference
        leftmost = quadrants[0];
        out_difference = quad_width;
    }


    /* Thing manipulations
    */

    // Public: determineAllQuadrants
    // Sets the Things (in any number of given arrays) against all Quadrants
    self.determineAllQuadrants = function () {
        var i, j;

        // Set each quadrant not to have anything in it
        for (i = 0; i < num_quads; i += 1) {
            for(j = 0; j < group_names.length; j += 1) {
                quadrants[i].numthings[group_names[j]] = 0;
            }
        }

        // For each argument, set each of its Things
        for (i = 0; i < arguments.length; i += 1) {
            determineThingArrayQuadrants(arguments[i]);
        }
    };

    // Calls determineThingQuadrants on every member of an array
    function determineThingArrayQuadrants(things) {
        things.forEach(self.determineThingQuadrants);
    }

    // Public: determineThingQuadrants
    // Checks and sets the correct quadrants for a Thing
    self.determineThingQuadrants = function(thing) {
        // Mark each of the thing's quadrants as changed
        if(thing[thing_changed]) {
            markThingQuadrantsChanged(thing);
        }
        
        thing[thing_num_quads] = 0;
        
        // Check each Quadrant for collision
        // (to do: mathematically determine this)
        for (var i = 0; i < num_quads; ++i) {
            if (isThingInQuadrant(thing, quadrants[i])) {
                setThingInQuadrant(thing, quadrants[i]);
                if (thing[thing_num_quads] > thing[thing_max_quads]) {
                    break;
                }
            }
        }
        
        // Mark the thing's quadrants as changed again, in case they changed
        if(thing[thing_changed]) {
            markThingQuadrantsChanged(thing);
        }
    }

    // Let a Thing and Quadrant know they're related
    // This assumes the thing already has a [thing_quadrants] array
    function setThingInQuadrant(thing, quadrant) {
        var group = thing[thing_group_name];
        
        // Place the Quadrant in the Thing
        thing[thing_quadrants][thing[thing_num_quads]] = quadrant;
        thing[thing_num_quads] += 1;

        // Place the Thing in the Quadrant
        quadrant.things[group][quadrant.numthings[group]] = thing;
        quadrant.numthings[group] += 1;
    }

    // Checks if a Thing is in a Quadrant
    function isThingInQuadrant(thing, quadrant) {
        return (
            thing[thing_right] + tolerance >= quadrant.left 
            && thing[thing_left] - tolerance <= quadrant.right 
            && thing[thing_bottom] + tolerance >= quadrant.top 
            && thing[thing_top] - tolerance <= quadrant.bottom
        );
    }
    
    /**
     * 
     */
    function markThingQuadrantsChanged(thing) {
        for(var i = 0; i < thing[thing_num_quads]; i += 1) {
            thing[thing_quadrants][i].changed = true;
        }
    }

    self.reset(settings || {});
}