function WorldSeedr(settings) {
    "use strict";
    if (!this || this === window) {
        return new WorldSeedr(settings);
    }
    var self = this,
        
        // A very large hashtable of possibilities, by title
        all_possibilities,
        
        // A function used to generate a random number, by default Math.random
        random;
    
    /**
     * 
     */
    self.reset = function (settings) {
        all_possibilities = settings.possibilities
        random = settings.random || Math.random.bind(Math);
    };
    
    /**
     * 
     */
    self.getPossibilities = function () {
        return all_possibilities;
    }
    
    
    /* Hardcore generation functions
    */
    
    /**
     * 
     */
    self.generate = function (name, position) {
        var schema = all_possibilities[name];
        
        if(!schema) {
            throw new Error("No possibility exists under '" + name + "'");
        }
        
        if(!schema.contents) {
            throw new Error("The schema for '" + name + "' has no possibile outcomes");
        }
        
        return generateContentChildren(schema, position);
    }
    
    /**
     * 
     */
    function generateContentChildren(schema, position) {
        var contents = schema.contents,
            direction = contents.direction,
            positionSaved = positionSave(position),
            leftSave = position.left,
            children, 
            child;
        
        switch(contents.mode) {
            case "Certain":
                children = contents.children.map(function (choice) {
                    child = parseChoice(choice, position, direction);
                    shrinkPositionByChild(position, child, direction);
                    return child;
                });
                break;
            case "Random":
                children = [];
                while(position.left < position.right) {
                    child = generateChild(contents, position, direction);
                    if(!child) {
                        break;
                    }
                    shrinkPositionByChild(position, child, direction);
                    debugger;
                    children.push(child);
                }
                break;
        }
        
        positionRestore(position, positionSaved);
        
        return {
            "children": children,
            "left": position.left,
            "right": position.right,
            "top": position.top,
            "bottom": position.bottom
        };
    }
    
    /**
     * 
     */
    function generateChild(contents, position, direction) {
        var choice = chooseAmongPosition(contents.children, position),
            schema;
        
        if(!choice) {
            return undefined;
        }
        
        return parseChoice(choice, position);
    }
    
    
    
    /* Utilities
    */
    
    /**
     * 
     */
    function parseChoice(choice, position, direction) {
        var schema = all_possibilities[choice.title],
            width = (choice.arguments && choice.arguments.width) 
                ? choice.arguments.width 
                : schema.width;
        
        if(choice.type === "Known") {
            return {
                "left": position.left,
                "bottom": position.bottom,
                "top": position.top,
                "right": position.left + width,
                "type": "Known",
                "title": choice.title,
                "arguments": schema.arguments 
                    ? chooseAmongPosition(schema.arguments, position) 
                    : undefined
            };
        }
        
        if(choice.type === "Random") {
            return generateContentChildren(schema, {
                "left": position.left,
                "bottom": position.bottom,
                "top": position.top,
                "right": position.left + width,
            });
        }
    }
    
    
    /* Randomization utilities
    */
    
    /**
     * From an array of Objects conforming to the Arguments or 
     * children schema types, returns one chosen at random.
     * 
     * @remarks There will be a need to make this filter the 
     *          children for being greater than a width or height
     */
    function chooseAmong(children) {
        if(!children.length) {
            return undefined;
        }
        if(children.length === 1) {
            return children[0];
        }
        
        var choice = randomPercentage(),
            sum = 0,
            i;
        
        for(i = 0; i < children.length; i += 1) {
            sum += children[i].percent;
            if(sum >= choice) {
                return children[i];
            }
        }
    }
    
    /**
     * 
     */
    function chooseAmongPosition(children, position) {
        var width = position.right - position.left,
            height = position.top - position.bottom;
        
        return chooseAmong(children.filter(function (choice) {
            choice = all_possibilities[choice.title];
            return doesChoiceFit(choice, width, height);
        }));
    }
    
    /**
     * Checks whether a choice can fit within a width and height.
     * 
     * @param {Object} choice   An object that contains .width and .height.
     * @param {Number} width
     * @param {Number} height
     * @return {Boolean} The boolean equivalent of the choice fits
     *                   within the position.
     */
    function doesChoiceFit(choice, width, height) {
        return choice.width <= width && choice.height <= height;
    }
    
    /**
     * Checks whether a choice can fit within a position.
     * 
     * @param {Object} choice   An object that contains .width and .height.
     * @param {Object} position   An object that contains .left, .right, .top, 
     *                            and .bottom.
     * @return {Boolean} The boolean equivalent of the choice fits
     *                   within the position.
     * @remarks When calling multiple times on a position (such as in 
     *          chooseAmongPosition), it's more efficient to store the width
     *          and height separately and just use doesChoiceFit.                
     *        
     */
     function doesChoiceFitPosition(choice, position) {
        return doesChoiceFit(
            choice,
            position.right - position.left, 
            position.top - position.bottom
        );
     }
    
    /**
     * Chooses a number in [1, 100] at random.
     * 
     * @return Number
     */
    function randomPercentage() {
        return Math.floor(random() * 100) + 1;
    }
    
    
    /* Position manipulation utilities
    */
    
    /**
     * Creates and returns a copy of a position (really just a shallow copy).
     * 
     * @param {Object} position
     * @return {Object}
     */
    function positionSave(position) {
        var output = {},
            i;
        
        for(i in position) {
            if(position.hasOwnProperty(i)) {
                output[i] = position[i];
            }
        }
        
        return output;
    }
    
    /**
     * Copies a position's saved attributes to another position
     * (really just a shallow copy).
     * 
     * @param {Object} position   An object to have attributes copied to.
     * @param {object} positionSaved   An object to copy attributes from.
     */
    function positionRestore(position, positionSaved) {
        var i;
        for(i in positionSaved) {
            if(positionSaved.hasOwnProperty(i)) {
                position[i] = positionSaved[i];
            }
        }
    }
    
    /**
     * Shrinks a position by the size of a child, in a particular direction.
     * 
     * @param {Object} position   An object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {Object} child   An object that contains .left, .right, .top, and
     *                         .bottom.
     * @param {String} direction   A string direction to shrink the position by:
     *                             "top", "right", "bottom", or "left".
     */
    function shrinkPositionByChild(position, child, direction) {
        switch(direction) {
            case "top":
                position.bottom = child.top;
                break;
            case "right":
                position.left = child.right;
                break;
            case "bottom":
                position.top = child.bottom;
                break;
            case "left":
                position.right = child.left;
                break;
        }
    }
    
    
    self.reset(settings || {});
}