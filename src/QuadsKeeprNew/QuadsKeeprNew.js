/* The actual code!
 */
function QuadsKeeprNew(settings) {
    "use strict";
    if (!this || this === window) {
        return new QuadsKeeprNew(settings);
    }
    var self = this,
        
        // The ObjectMakr factory used to create Quadrant objects
        ObjectMaker,
        
        // Function used to create a canvas of a given width and height
        getCanvas,
        
        // How many rows and columns of quadrants there should be
        num_rows,
        num_cols,
        
        quadrant_rows,
        
        quadrant_cols,
        
        quadrant_width,
        
        quadrant_height,

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
        

    /**
     * 
     */
    self.reset = function (settings) {
        ObjectMaker = settings.ObjectMaker;
        getCanvas = settings.getCanvas;
        
        num_rows = settings.num_rows;
        num_cols = settings.num_cols;
        quadrant_width = settings.quadrant_width | 0;
        quadrant_height = settings.quadrant_height | 0;
        
        group_names = settings.group_names;

        onUpdate = settings.onUpdate; 

        thing_left = settings.thing_left || "left";
        thing_right = settings.thing_right || "right";
        thing_top = settings.thing_top || "top";
        thing_bottom = settings.thing_bottom || "bottom";
        thing_num_quads = settings.thing_num_quads || "numquads";
        thing_max_quads = settings.thing_max_quads || "maxquads";
        thing_quadrants = settings.thing_quadrants || "quadrants";
        thing_changed = settings.thing_changed || "changed";
        thing_group_name = settings.thing_group_name || "group";
        
        self.resetQuadrants();
    };
    
    
    /* Simple gets
    */
    
    self.getRows = function () {
        return quadrant_rows;
    };
    
    self.getCols = function () {
        return quadrant_cols;
    };
    
    
    /* Quadrant resetting
    */
    
    /**
     * 
     */
    self.resetQuadrants = function () {
        var position, quadrant, row, col;
        
        quadrant_rows = [];
        quadrant_cols = [];
        
        position = 0;
        for(row = 0; row < num_rows; row += 1) {
            quadrant_rows[row] = {
                "left": position,
                "quadrants": []
            };
            position += quadrant_width;
        }
        
        position = 0;
        for(col = 0; col < num_cols; col += 1) {
            quadrant_cols[col] = {
                "left": position,
                "quadrants": []
            };
            position += quadrant_height;
        }
        
        for(row = 0; row < num_rows; row += 1) {
            for(col = 0; col < num_cols; col += 1) {
                quadrant = createQuadrant(row, col);
                quadrant_rows[row].quadrants.push(quadrant);
                quadrant_cols[col].quadrants.push(quadrant);
            }
        }
    };
    
    /**
     * 
     */
    function createQuadrant(row, col) {
        var quadrant = ObjectMaker.make("Quadrant"),
            canvas = getCanvas(quadrant_width, quadrant_height),
            i;
        
        quadrant.changed = true;
        quadrant.things = {};
        quadrant.numthings = {};
        
        for(i = 0; i < group_names.length; i += 1) {
            quadrant.things[group_names[i]] = [];
            quadrant.numthings[group_names[i]] = 0;
        }
        
        quadrant.left = (col - 1) * quadrant_width;
        quadrant.top = (row - 1) * quadrant_height;
        quadrant.right = quadrant.left + quadrant_width;
        quadrant.bottom = quadrant.top + quadrant_height;
        
        quadrant.canvas = canvas;
        quadrant.context = canvas.getContext("2d");
        
        return quadrant;
    }
    
    
    self.reset(settings || {});
}