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
        thing_group_name,
        
        // An Array of string names a Thing may be placed into 
        group_names,

        // Callback for when Quadrants are added or removed, respectively
        on_add,
        on_remove;
        

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

        on_add = settings.on_add;
        on_remove = settings.on_remove;

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
        thing_group_name = settings.thing_group_name || "group";
    };
    
    
    /* Simple gets
    */
    
    /**
     * 
     */
    self.getQuadrantRows = function () {
        return quadrant_rows;
    };
    
    /**
     * 
     */
    self.getQuadrantCols = function () {
        return quadrant_cols;
    };
    
    /**
     * 
     */
    self.getNumRows = function () {
        return num_rows;
    };
    
    /**
     * 
     */
    self.getNumCols = function () {
        return num_cols;
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
    
    /**
     8 
     */
    self.shiftQuadrants = function (x, y) {
        var row, col;
        
        x = x | 0;
        y = y | 0;
        
        offset_x += x;
        offset_y += y;
        
        self.top += y;
        self.right += x;
        self.bottom += y;
        self.left += x;
        
        for(row = 0; row < num_rows; row += 1) {
            quadrant_rows[row].top += y;
            quadrant_rows[row].left += x;
        }
        
        for(col = 0; col< num_cols; col += 1) {
            quadrant_cols[col].top += y;
            quadrant_cols[col].left += x;
        }
        
        for(row = 0; row < num_rows; row += 1) {
            for(col = 0; col < num_cols; col += 1) {
                shiftQuadrant(quadrant_rows[row].quadrants[col], x, y);
            }
        }
        
        adjustOffsets();
    }
    
    /** 
     * 
     */
    function adjustOffsets() {
        // Quadrant shift: add to the right
        while(-offset_x > quadrant_width) {
            self.shiftQuadrantCol(true);
            self.pushQuadrantCol(true);
            offset_x += quadrant_width;
        }
        
        // Quadrant shift: add to the left
        while(offset_x > quadrant_width) {
            self.popQuadrantCol(true);
            self.unshiftQuadrantCol(true);
            offset_x -= quadrant_width;
        }
        
        // Quadrant shift: add to the bottom
        while(-offset_y > quadrant_height) {
            self.unshiftQuadrantRow(true);
            self.pushQuadrantRow(true);
            offset_y += quadrant_height;
        }
        
        // Quadrant shift: add to the top
        while(offset_y > quadrant_height) {
            self.popQuadrantRow(true);
            self.unshiftQuadrantRow(true);
            offset_y -= quadrant_height;
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
        quadrant.changed = true;
    }
    
    
    /* Quadrant placements
    */
    
    /**
     * 
     */
    self.resetQuadrants = function () {
        var left = start_left,
            top = start_top,
            quadrant,
            i, j;
        
        self.top = start_top;
        self.right = start_left + quadrant_width * num_cols;
        self.bottom = start_top + quadrant_height * num_rows;
        self.left = start_left;
        
        quadrant_rows = [];
        quadrant_cols = [];
        
        offset_x = 0;
        offset_y = 0;
        
        for(i = 0; i < num_rows; i += 1) {
            quadrant_rows.push({
                "left": start_left,
                "top": top,
                "quadrants": []
            });
            top += quadrant_height;
        }
        
        for(j = 0; j < num_cols; j += 1) {
            quadrant_cols.push({
                "left": left,
                "top": start_top,
                "quadrants": []
            });
            left += quadrant_width;
        }
        
        top = start_top;
        for(i = 0; i < num_rows; i += 1) {
            left = start_left;
            for(j = 0; j < num_cols; j += 1) {
                quadrant = createQuadrant(left, top);
                quadrant_rows[i].quadrants.push(quadrant);
                quadrant_cols[j].quadrants.push(quadrant);
                left += quadrant_width;
            }
            top += quadrant_height;
        }
        
        on_add("xInc", self.top, self.right, self.bottom, self.left);
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
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new row's bounding box.
     */
    self.pushQuadrantRow = function (callUpdate) {
        var row = createQuadrantRow(self.left, self.bottom),
            i;
        
        num_rows += 1;
        quadrant_rows.push(row);
        
        for(i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].quadrants.push(row.quadrants[i]);
        }
        
        self.bottom += quadrant_height;
        
        if(callUpdate && on_add) {
            on_add(
                "yInc",
                self.bottom, 
                self.right, 
                self.bottom - quadrant_height, 
                self.left
            );
        }
        
        return row;
    };
    
    /**
     * Adds a Quadrant col to the end of the quadrant_cols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new col's bounding box.
     */
    self.pushQuadrantCol = function (callUpdate) {
        var col = createQuadrantCol(self.right, self.top),
            i;
        
        num_cols += 1;
        quadrant_cols.push(col);
    
        for(i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].quadrants.push(col.quadrants[i]);
        }
        
        self.right += quadrant_width;
        
        if(callUpdate && on_add) {
            on_add(
                "xInc", 
                self.top,
                self.right - offset_y, 
                self.bottom, 
                self.right - quadrant_width - offset_y
            );
        }
        
        return col;
    };
    
    /**
     * Removes the last Quadrant row from the end of the quadrant_rows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new row's bounding box.
     */
    self.popQuadrantRow = function (callUpdate) {
        for(var i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].quadrants.pop();
        }
        
        num_rows -= 1;
        quadrant_rows.pop();
        
        if(callUpdate && on_remove) {
            on_remove(
                "yDec",
                self.bottom, 
                self.right, 
                self.bottom - quadrant_height, 
                self.left
            );
        }
        
        self.bottom -= quadrant_height;
    };
    
    /**
     * Removes the last Quadrant col from the end of the quadrant_cols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new row's bounding box.
     */
    self.popQuadrantCol = function (callUpdate) {
        for(var i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].quadrants.pop();
        }
        
        num_cols -= 1;
        quadrant_cols.pop();
        
        if(callUpdate && on_remove) {
            on_remove(
                "xDec", 
                self.top,
                self.right - offset_y, 
                self.bottom, 
                self.right - quadrant_width - offset_y
            );
        }
        
        self.right -= quadrant_width;
    };
    
    /**
     * Adds a Quadrant row to the beginning of the quadrant_rows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new row's bounding box.
     */
    self.unshiftQuadrantRow = function (callUpdate) {
        var row = createQuadrantRow(self.left, self.top - quadrant_height),
            i;
        
        num_rows += 1;
        quadrant_rows.unshift(row);
        
        for(i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].quadrants.unshift(row.quadrants[i]);
        }
        
        self.top -= quadrant_height;
        
        if(callUpdate && on_add) {
            on_add(
                "yInc",
                self.top,
                self.right, 
                self.top + quadrant_height, 
                self.left
            );
        }
        
        return row;
    };
    
    /**
     * Adds a Quadrant col to the beginning of the quadrant_cols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new row's bounding box.
     */
    self.unshiftQuadrantCol = function (callUpdate) {
        var col = createQuadrantCol(self.left - quadrant_width, self.top),
            i;
        
        num_cols += 1;
        quadrant_cols.unshift(col);
        
        for(i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].quadrants.unshift(col.quadrants[i]);
        }
        
        self.left -= quadrant_width;
        
        if(callUpdate && on_add) {
            on_add(
                "xInc",
                self.top,
                self.left,
                self.bottom, 
                self.left + quadrant_width
            );
        }
        
        return col;
    };
    
    /**
     * Removes a Quadrant row from the beginning of the quadrant_rows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new row's bounding box.
     */
    self.shiftQuadrantRow = function (callUpdate) {
        for(var i = 0; i < quadrant_cols.length; i += 1) {
            quadrant_cols[i].quadrants.shift();
        }
        
        num_rows -= 1;
        quadrant_rows.pop();
        
        if(callUpdate && on_remove) {
            on_remove(
                "yDec",
                self.top,
                self.right, 
                self.top + quadrant_height, 
                self.left
            );
        }
        
        self.top += quadrant_height;
    };
    
    /**
     * Removes a Quadrant col from the beginning of the quadrant_cols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the on_add 
     *                               trigger with the new row's bounding box.
     */
    self.shiftQuadrantCol = function (callUpdate) {
        for(var i = 0; i < quadrant_rows.length; i += 1) {
            quadrant_rows[i].quadrants.shift();
        }
        
        num_cols -= 1;
        quadrant_cols.pop();
        
        if(callUpdate && on_remove) {
            on_remove(
                "xDec",
                self.top,
                self.left,
                self.bottom, 
                self.left + quadrant_width
            );
        }
        
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
                quadrant_rows[row].quadrants[col].numthings[group] = 0;
            }
        }
        
        things.forEach(self.determineThingQuadrants);
    };
        
    /**
     * 
     */
    self.determineThingQuadrants = function (thing) {
        var group = thing[thing_group_name],
            rowStart = findQuadrantRowStart(thing),
            colStart = findQuadrantColStart(thing),
            rowEnd = findQuadrantRowEnd(thing),
            colEnd = findQuadrantColEnd(thing),
            row, col;
        
        // Mark each of the Thing's Quadrants as changed
        // This is done first because the old Quadrants are changed
        if(thing[thing_changed]) {
            markThingQuadrantsChanged(thing);
        }
        
        // The Thing no longer has any Quadrants: rebuild them!
        thing[thing_num_quads] = 0;
        
        for(row = rowStart; row <= rowEnd; row += 1) {
            for(col = colStart; col <= colEnd; col += 1) {
                self.setThingInQuadrant(group, thing, quadrant_rows[row].quadrants[col]);
            }
        }
        
        // Mark the Thing's new Quadrants as changed
        if(thing[thing_changed]) {
            markThingQuadrantsChanged(thing);
        }
        
        // The thing is no longer considered changed, since quadrants know it
        thing[thing_changed] = false;
    };
    
    /**
     * 
     */
    self.setThingInQuadrant = function (group, thing, quadrant) {
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
        return Math.max(Math.floor((thing.top - self.top) / quadrant_height), 0);
    }
    
    /**
     * 
     */
    function findQuadrantRowEnd(thing) {
        return Math.min(Math.floor((thing.bottom - self.top) / quadrant_height), num_rows - 1);
    }
    
    /**
     * 
     */
    function findQuadrantColStart(thing) {
        return Math.max(Math.floor((thing.left - self.left) / quadrant_width), 0);
    }
    
    /**
     * 
     */
    function findQuadrantColEnd(thing) {
        return Math.min(Math.floor((thing.right - self.left) / quadrant_width), num_cols - 1);
    }
    
    
    self.reset(settings || {});
}