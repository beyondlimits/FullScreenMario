function QuadsKeepr(settings) {
    "use strict";
    if (!this || this === window) {
        return new QuadsKeepr(settings);
    }
    var self = this,
        
        // The ObjectMakr factory used to create Quadrant objects
        ObjectMaker,
        
        // Function used to create a canvas of a given width and height
        createCanvas,
        
        // How many rows and columns of quadrants there should be
        numRows,
        numCols,
        
        // Scrolling offsets during gameplay (initially 0)
        offset_x,
        offset_y,
        
        // Starting coordinates for rows & cols
        startLeft,
        start_top,
        
        quadrantRows,
        
        quadrantCols,
        
        quadrantWidth,
        
        quadrantHeight,

        // Names under which external Things should store Quadrant information
        thingLeft,
        thing_top,
        thingRight,
        thing_bottom,
        thing_num_quads,
        thing_max_quads,
        thing_quadrants,
        thing_changed,
        thing_tolerance_x,
        thing_tolerance_y,
        thing_group_name,
        
        // An Array of string names a Thing may be placed into 
        groupNames,

        // Callback for when Quadrants are added or removed, respectively
        onAdd,
        onRemove;
        

    /**
     * 
     */
    self.reset = function (settings) {
        ObjectMaker = settings.ObjectMaker;
        createCanvas = settings.createCanvas;
        
        numRows = settings.numRows;
        numCols = settings.numCols;
        
        startLeft = settings.startLeft | 0;
        start_top = settings.start_top | 0;
        
        quadrantWidth = settings.quadrantWidth | 0;
        quadrantHeight = settings.quadrantHeight | 0;
        
        groupNames = settings.groupNames;

        onAdd = settings.onAdd;
        onRemove = settings.onRemove;

        thingLeft = settings.thingLeft || "left";
        thingRight = settings.thingRight || "right";
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
        return quadrantRows;
    };
    
    /**
     * 
     */
    self.getQuadrantCols = function () {
        return quadrantCols;
    };
    
    /**
     * 
     */
    self.getNumRows = function () {
        return numRows;
    };
    
    /**
     * 
     */
    self.getNumCols = function () {
        return numCols;
    };
    
    /**
     * 
     */
    self.getQuadrantWidth = function () {
        return quadrantWidth;
    };
    
    /**
     * 
     */
    self.getQuadrantHeight = function () {
        return quadrantHeight;
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
        
        for (row = 0; row < numRows; row += 1) {
            quadrantRows[row].top += y;
            quadrantRows[row].left += x;
        }
        
        for (col = 0; col< numCols; col += 1) {
            quadrantCols[col].top += y;
            quadrantCols[col].left += x;
        }
        
        for (row = 0; row < numRows; row += 1) {
            for (col = 0; col < numCols; col += 1) {
                shiftQuadrant(quadrantRows[row].quadrants[col], x, y);
            }
        }
        
        adjustOffsets();
    }
    
    /** 
     * 
     */
    function adjustOffsets() {
        // Quadrant shift: add to the right
        while(-offset_x > quadrantWidth) {
            self.shiftQuadrantCol(true);
            self.pushQuadrantCol(true);
            offset_x += quadrantWidth;
        }
        
        // Quadrant shift: add to the left
        while(offset_x > quadrantWidth) {
            self.popQuadrantCol(true);
            self.unshiftQuadrantCol(true);
            offset_x -= quadrantWidth;
        }
        
        // Quadrant shift: add to the bottom
        while(-offset_y > quadrantHeight) {
            self.unshiftQuadrantRow(true);
            self.pushQuadrantRow(true);
            offset_y += quadrantHeight;
        }
        
        // Quadrant shift: add to the top
        while(offset_y > quadrantHeight) {
            self.popQuadrantRow(true);
            self.unshiftQuadrantRow(true);
            offset_y -= quadrantHeight;
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
        var left = startLeft,
            top = start_top,
            quadrant,
            i, j;
        
        self.top = start_top;
        self.right = startLeft + quadrantWidth * numCols;
        self.bottom = start_top + quadrantHeight * numRows;
        self.left = startLeft;
        
        quadrantRows = [];
        quadrantCols = [];
        
        offset_x = 0;
        offset_y = 0;
        
        for (i = 0; i < numRows; i += 1) {
            quadrantRows.push({
                "left": startLeft,
                "top": top,
                "quadrants": []
            });
            top += quadrantHeight;
        }
        
        for (j = 0; j < numCols; j += 1) {
            quadrantCols.push({
                "left": left,
                "top": start_top,
                "quadrants": []
            });
            left += quadrantWidth;
        }
        
        top = start_top;
        for (i = 0; i < numRows; i += 1) {
            left = startLeft;
            for (j = 0; j < numCols; j += 1) {
                quadrant = createQuadrant(left, top);
                quadrantRows[i].quadrants.push(quadrant);
                quadrantCols[j].quadrants.push(quadrant);
                left += quadrantWidth;
            }
            top += quadrantHeight;
        }
        
        onAdd("xInc", self.top, self.right, self.bottom, self.left);
    };
    
    /**
     * 
     */
    function createQuadrant(left, top) {
        var quadrant = ObjectMaker.make("Quadrant"),
            canvas = createCanvas(quadrantWidth, quadrantHeight),
            i;
        
        quadrant.changed = true;
        quadrant.things = {};
        quadrant.numthings = {};
        
        for (i = 0; i < groupNames.length; i += 1) {
            quadrant.things[groupNames[i]] = [];
            quadrant.numthings[groupNames[i]] = 0;
        }
        
        quadrant.left = left;
        quadrant.top = top;
        quadrant.right = left + quadrantWidth;
        quadrant.bottom = top + quadrantHeight;
        
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
        
        for (i = 0; i < numCols; i += 1) {
            row.quadrants.push(createQuadrant(left, top));
            left += quadrantWidth;
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
        
        for (i = 0; i < numRows; i += 1) {
            col.quadrants.push(createQuadrant(left, top));
            top += quadrantHeight;
        }
        
        return col;
    };
    
    /**
     * Adds a Quadrant row to the end of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.pushQuadrantRow = function (callUpdate) {
        var row = createQuadrantRow(self.left, self.bottom),
            i;
        
        numRows += 1;
        quadrantRows.push(row);
        
        for (i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.push(row.quadrants[i]);
        }
        
        self.bottom += quadrantHeight;
        
        if (callUpdate && onAdd) {
            onAdd(
                "yInc",
                self.bottom, 
                self.right, 
                self.bottom - quadrantHeight, 
                self.left
            );
        }
        
        return row;
    };
    
    /**
     * Adds a Quadrant col to the end of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new col's bounding box.
     */
    self.pushQuadrantCol = function (callUpdate) {
        var col = createQuadrantCol(self.right, self.top),
            i;
        
        numCols += 1;
        quadrantCols.push(col);
    
        for (i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.push(col.quadrants[i]);
        }
        
        self.right += quadrantWidth;
        
        if (callUpdate && onAdd) {
            onAdd(
                "xInc", 
                self.top,
                self.right - offset_y, 
                self.bottom, 
                self.right - quadrantWidth - offset_y
            );
        }
        
        return col;
    };
    
    /**
     * Removes the last Quadrant row from the end of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.popQuadrantRow = function (callUpdate) {
        for (var i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.pop();
        }
        
        numRows -= 1;
        quadrantRows.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "yInc",
                self.bottom, 
                self.right, 
                self.bottom - quadrantHeight, 
                self.left
            );
        }
        
        self.bottom -= quadrantHeight;
    };
    
    /**
     * Removes the last Quadrant col from the end of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.popQuadrantCol = function (callUpdate) {
        for (var i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.pop();
        }
        
        numCols -= 1;
        quadrantCols.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "xDec", 
                self.top,
                self.right - offset_y, 
                self.bottom, 
                self.right - quadrantWidth - offset_y
            );
        }
        
        self.right -= quadrantWidth;
    };
    
    /**
     * Adds a Quadrant row to the beginning of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.unshiftQuadrantRow = function (callUpdate) {
        var row = createQuadrantRow(self.left, self.top - quadrantHeight),
            i;
        
        numRows += 1;
        quadrantRows.unshift(row);
        
        for (i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.unshift(row.quadrants[i]);
        }
        
        self.top -= quadrantHeight;
        
        if (callUpdate && onAdd) {
            onAdd(
                "yInc",
                self.top,
                self.right, 
                self.top + quadrantHeight, 
                self.left
            );
        }
        
        return row;
    };
    
    /**
     * Adds a Quadrant col to the beginning of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.unshiftQuadrantCol = function (callUpdate) {
        var col = createQuadrantCol(self.left - quadrantWidth, self.top),
            i;
        
        numCols += 1;
        quadrantCols.unshift(col);
        
        for (i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.unshift(col.quadrants[i]);
        }
        
        self.left -= quadrantWidth;
        
        if (callUpdate && onAdd) {
            onAdd(
                "xInc",
                self.top,
                self.left,
                self.bottom, 
                self.left + quadrantWidth
            );
        }
        
        return col;
    };
    
    /**
     * Removes a Quadrant row from the beginning of the quadrantRows Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.shiftQuadrantRow = function (callUpdate) {
        for (var i = 0; i < quadrantCols.length; i += 1) {
            quadrantCols[i].quadrants.shift();
        }
        
        numRows -= 1;
        quadrantRows.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "yInc",
                self.top,
                self.right, 
                self.top + quadrantHeight, 
                self.left
            );
        }
        
        self.top += quadrantHeight;
    };
    
    /**
     * Removes a Quadrant col from the beginning of the quadrantCols Array.
     * 
     * @param {Boolean} callUpdate   Whether this should call the onAdd 
     *                               trigger with the new row's bounding box.
     */
    self.shiftQuadrantCol = function (callUpdate) {
        for (var i = 0; i < quadrantRows.length; i += 1) {
            quadrantRows[i].quadrants.shift();
        }
        
        numCols -= 1;
        quadrantCols.pop();
        
        if (callUpdate && onRemove) {
            onRemove(
                "xInc",
                self.top,
                self.left + quadrantWidth,
                self.bottom,
                self.left
            );
        }
        
        self.left += quadrantWidth;
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
        
        for (row = 0; row < numRows; row += 1) {
            for (col = 0; col < numCols; col += 1) {
                quadrantRows[row].quadrants[col].numthings[group] = 0;
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
        if (thing[thing_changed]) {
            markThingQuadrantsChanged(thing);
        }
        
        // The Thing no longer has any Quadrants: rebuild them!
        thing[thing_num_quads] = 0;
        
        for (row = rowStart; row <= rowEnd; row += 1) {
            for (col = colStart; col <= colEnd; col += 1) {
                self.setThingInQuadrant(group, thing, quadrantRows[row].quadrants[col]);
            }
        }
        
        // Mark the Thing's new Quadrants as changed
        if (thing[thing_changed]) {
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
        for (var i = 0; i < thing[thing_num_quads]; i += 1) {
            thing[thing_quadrants][i].changed = true;
        }
    }
    
    /**
     * 
     */
    function findQuadrantRowStart(thing) {
        return Math.max(Math.floor((thing.top - self.top) / quadrantHeight), 0);
    }
    
    /**
     * 
     */
    function findQuadrantRowEnd(thing) {
        return Math.min(Math.floor((thing.bottom - self.top) / quadrantHeight), numRows - 1);
    }
    
    /**
     * 
     */
    function findQuadrantColStart(thing) {
        return Math.max(Math.floor((thing.left - self.left) / quadrantWidth), 0);
    }
    
    /**
     * 
     */
    function findQuadrantColEnd(thing) {
        return Math.min(Math.floor((thing.right - self.left) / quadrantWidth), numCols - 1);
    }
    
    
    self.reset(settings || {});
}