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
        
        // Scrolling offsets during gameplay (initially 0)
        offset_x,
        offset_y,
        
        // Starting coordinates for rows & cols
        start_left,
        start_top,
        
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
        thing_tolerance_x,
        thing_tolerance_y,
        
        // An Array of string names a Thing may be placed into 
        group_names,

        // Callback for when Quadrants get updated
        on_update;
        

    /**
     * 
     */
    self.reset = function (settings) {
        ObjectMaker = settings.ObjectMaker;
        getCanvas = settings.getCanvas;
        
        num_rows = settings.num_rows;
        num_cols = settings.num_cols;
        
        start_left = settings.start_left | 0;
        start_top = settings.start_top | 0;
        
        quadrant_width = settings.quadrant_width | 0;
        quadrant_height = settings.quadrant_height | 0;
        
        group_names = settings.group_names;

        on_update = settings.on_update; 

        thing_left = settings.thing_left || "left";
        thing_right = settings.thing_right || "right";
        thing_top = settings.thing_top || "top";
        thing_bottom = settings.thing_bottom || "bottom";
        thing_num_quads = settings.thing_num_quads || "numquads";
        thing_max_quads = settings.thing_max_quads || "maxquads";
        thing_quadrants = settings.thing_quadrants || "quadrants";
        thing_changed = settings.thing_changed || "changed";
        thing_tolerance_x = settings.thing_tolerance_x || "tolx";
        thing_tolerance_y = settings.thing_tolerance_y || "toly";
        
        self.resetQuadrants();
    };
    
    
    /* Simple gets
    */
    
    /**
     * 
     */
    self.getRows = function () {
        return quadrant_rows;
    };
    
    /**
     * 
     */
    self.getCols = function () {
        return quadrant_cols;
    };
    
    /**
     * 
     */
    self.getQuadrantWidth = function () {
        return quadrant_width;
    };
    
    /**
     * 
     */
    self.getQuadrantHeight = function () {
        return quadrant_height;
    };
    
    
    /* Quadrant updates
    */
    
    self.shiftQuadrants = function (x, y) {
        var row, col;
        
        offset_x += x | 0;
        offset_y += y | 0;
        
        for(row = 0; row < num_rows; row += 1) {
            for(col = 0; col < num_cols; col += 1) {
                shiftQuadrant(quadrant_rows[row].quadrants[col], x, y);
            }
        }
        
        // Quadrant shift: to the right
        while(offset_x > quadrant_width) {
            self.unshiftQuadrantCol();
            self.pushQuadrantCol();
            offset_x -= quadrant_width;
        }
        
        // Quadrant shift: to the left
        while(-offset_x > quadrant_width) {
            self.popQuadrantCol();
            self.shiftQuadrantCol();
            offset_x += quadrant_width;
        }
        
        // Quadrant shift: to the bottom
        while(offset_y > quadrant_height) {
            self.unshiftQuadrantRow();
            self.pushQuadrantRow();
            offset_y -= quadrant_height;
        }
        
        // Quadrant shift: to the top
        while(-offset_y > quadrant_height) {
            self.popQuadrantRow();
            self.shiftQuadrantRow();
            offset_y += quadrant_height;
        }
    };
    
    /**
     * 
     */
    function shiftQuadrant(quadrant, x, y) {
        quadrant.top += y;
        quadrant.right += x;
        quadrant.bottom += y;
        quadrant.left += x;
    }
    
    
    /* Quadrant placements
    */
    
    /**
     * 
     */
    self.resetQuadrants = function () {
        var left = start_left,
            top = start_top,
            i;
        
        self.left = self.right = start_left;
        self.top = self.bottom = start_top;
        
        quadrant_rows = [];
        quadrant_cols = [];
        
        offset_x = 0;
        offset_y = 0;
        
        for(i = 0; i < num_rows; i += 1) {
            self.pushQuadrantRow();
        }
        for(i = 0; i < num_cols; i += 1) {
            self.pushQuadrantCol();
        }
    };
    
    /**
     * 
     */
    function createQuadrant(left, top) {
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
        
        quadrant.left = left;
        quadrant.top = top;
        quadrant.right = left + quadrant_width;
        quadrant.bottom = top + quadrant_height;
        
        quadrant.canvas = canvas;
        quadrant.context = canvas.getContext("2d");
        
        return quadrant;
    }
    
    /**
     * 
     */
    function createQuadrantRow(left, top) {
        var row = {
                "top": top,
                "quadrants": []
            },
            i;
        
        for(i = 0; i < num_cols; i += 1) {
            row.quadrants.push(createQuadrant(left, top));
            left += quadrant_width;
        }
        
        return row;
    };
    
    /**
     * 
     */
    function createQuadrantCol(left, top) {
        var col = {
                "left": left,
                "quadrants": []
            },
            i;
        
        for(i = 0; i < num_rows; i += 1) {
            col.quadrants.push(createQuadrant(left, top));
            top += quadrant_height;
        }
        
        return col;
    };
    
    /**
     * Adds a Quadrant row to the end of the quadrant_rows Array.
     */
    self.pushQuadrantRow = function () {
        var row = createQuadrantRow(self.left, self.bottom),
            i;
        
        quadrant_rows.push(row);
        
        for(i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].quadrants.push(row.quadrants[i]);
        }
        
        self.bottom += quadrant_height;
        
        if(on_update) {
            on_update(self.bottom, self.right, self.bottom - quadrant_height, self.left);
        }
        
        return row;
    };
    
    /**
     * Adds a Quadrant col to the end of the quadrant_cols Array.
     */
    self.pushQuadrantCol = function () {
        var col = createQuadrantCol(self.right, self.top),
            i;
        
        quadrant_cols.push(col);
    
        for(i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].quadrants.push(col.quadrants[i]);
        }
        
        self.right += quadrant_width;
        
        if(on_update) {
            on_update(self.top, self.right, self.bottom, self.right - quadrant_width);
        }
        
        return col;
    };
    
    /**
     * Removes the last Quadrant row from the end of the quadrant_rows Array.
     */
    self.popQuadrantRow = function () {
        for(var i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].pop();
        }
        
        quadrant_rows.pop();
        
        self.bottom -= quadrant_height;
    };
    
    /**
     * Removes the last Quadrant col from the end of the quadrant_cols Array.
     */
    self.popQuadrantCol = function () {
        for(var i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].pop();
        }
        
        quadrant_cols.pop();
        
        self.right -= quadrant_width;
    };
    
    /**
     * Adds a Quadrant row to the beginning of the quadrant_rows Array.
     */
    self.unshiftQuadrantRow = function () {
        var row = createQuadrantRow(self.left, self.top - quadrant_height),
            i;
        
        quadrant_rows.unshift(row);
        
        for(i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].quadrants.unshift(row.quadrants[i]);
        }
        
        self.top -= quadrant_height;
        
        if(on_update) {
            on_update(self.top, self.right, self.top + quadrant_height, self.left);
        }
        
        return row;
    };
    
    /**
     * Adds a Quadrant col to the beginning of the quadrant_cols Array.
     */
    self.unshiftQuadrantCol = function () {
        var col = createQuadrantCol(self.left - quadrant_width, self.top),
            i;
        
        quadrant_cols.unshift(col);
        
        for(i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].unshift(row.quadrants[i]);
        }
        
        self.left -= quadrant_width;
        
        if(on_update) {
            on_update(self.top, self.left, self.bottom, self.left + quadrant_width);
        }
        
        return col;
    };
    
    /**
     * Removes a Quadrant row from the beginning of the quadrant_rows Array.
     */
    self.shiftQuadrantRow = function () {
        for(var i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].shift();
        }
        
        quadrant_rows.pop();
        
        self.top += quadrant_height;
    };
    
    /**
     * Removes a Quadrant col from the beginning of the quadrant_cols Array.
     */
    self.shiftQuadrantCol = function () {
        for(var i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].shift();
        }
        
        quadrant_cols.pop();
        
        self.left += quadrant_width;
    };
    
    
    /* Thing manipulations
    */
    
    /**
     * Determines the quadrants for an entire Array of Things. This is done by
     * wiping each quadrant's memory of that Array's group type and determining
     * each Thing's quadrants.
     * 
     * @param {String} group_name
     * @param {Thing[]} things
     */
    self.determineAllQuadrants = function (group, things) {
        var row, col, k;
        
        for(row = 0; row < num_rows; row += 1) {
            for(col = 0; col < num_cols; col += 1) {
                quadrant_rows[i].quadrants[j].numthings[group] = 0;
            }
        }
        
        things.forEach(self.determineThingQuadrants);
    };
    
    /**
     * 
     */
    self.determineThingQuadrants = function (group, thing) {
        var rowStart = findQuadrantRowStart(thing),
            colStart = findQuadrantColStart(thing),
            rowEnd = findQuadrantRowEnd(thing),
            colEnd = findQuadrantColEnd(thing),
            quadrant = quadrant_rows[row].quadrants[col],
            row, col;
        
        // Mark each of the Thing's Quadrants as changed
        // This is done first because the old Quadrants are changed
        if(thing[thing_changed]) {
            markThingQuadrantsChanged(thing);
        }
        
        // The Thing no longer has any Quadrants: rebuild them!
        thing[thing_num_quads] = 0;
        
        for(row = rowStart; row < rowEnd; row += 1) {
            for(col = colStart; col < colEnd; col += 1) {
                setThingInQuadrant(group, thing, quadrant_rows[row].quadrants[col]);
            }
        }
        
        // Mark the Thing's new Quadrants as changed
        if(thing[thing_changed]) {
            markThingQuadrantsChanged(thing);
        }
    };
    
    /**
     * 
     */
    function setThingInQuadrant(group, thing, quadrant) {
        // Mark the Quadrant in the Thing
        thing[thing_quadrants][thing[thing_num_quads]] = quadrant;
        thing[thing_num_quads] += 1;
        
        // Mark the Thing in the Quadrant
        quadrant.things[group][quadrant.numthings[group]] = thing;
        quadrant.numthings[group] += 1;
    }
    
    /** 
     * 
     */
    function markThingQuadrantsChanged(thing) {
        for(var i = 0; i < thing[thing_num_quads]; i += 1) {
            thing[thing_quadrants][i].changed = true;
        }
    }
    
    /**
     * 
     */
    function findQuadrantRowStart(thing) {
        return Math.floor((thing - self.left) / quad_width);
    }
    
    /**
     * 
     */
    function findQuadrantRowEnd(thing) {
        return Math.floor((thing.right - self.left) / quad_width);
    }
    
    /**
     * 
     */
    function findQuadrantColStart(thing) {
        return Math.floor((thing.top - self.top) / quad_height);
    }
    
    /**
     * 
     */
    function findQuadrantColEnd(thing) {
        return Math.floor((thing.bottom - self.top) / quad_height);
    }
    
    self.reset(settings || {});
}