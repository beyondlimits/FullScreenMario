function WorldSeedr(settings) {
    "use strict";
    if (!this || this === window) {
        return new WorldSeedr(settings);
    }
    var self = this,
        
        // A very large hashtable of possibilities, by title
        all_possibilities,
        
        // A function used to generate a random number, by default Math.random
        random,
        
        // A constant listing of direction opposites, like top-bottom
        directionOpposites = {
            "top": "bottom",
            "right": "left",
            "bottom": "top",
            "left": "right"
        },
        
        directionSizing = {
            "top": "height",
            "right": "width",
            "bottom": "height",
            "left": "width"
        },
        
        // A constant Array of direction names
        directionNames = Object.keys(directionOpposites),
        
        // A constant Array of the dimension descriptors
        sizingNames = ["width", "height"];
    
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
        
        return generateContentChildren(schema, positionSave(position));
    };
    
    /**
     * 
     */
    function generateContentChildren(schema, position, direction) {
        var contents = schema.contents,
            positionExtremes,
            children, 
            child;
        
        direction = contents.direction || direction;
        
        switch(contents.mode) {
            case "Certain":
                children = generateContentChildrenCertain(contents, position, direction);
                break;
            case "Random":
                children = generateContentChildrenRandom(contents, position, direction);
                break;
        }
        
        return getPositionExtremes(children);
    }
    
    /**
     * 
     */
    function generateContentChildrenCertain(contents, position, direction) {
        var child;
        return contents.children.map(function (choice) {
            child = parseChoice(choice, position, direction);
            if(child) {
                shrinkPositionByChild(position, child, direction);
                child.contents = self.generate(child.title, position);
            }
            return child;
        }).filter(function (child) {
            return child;
        });
    }
    
    /**
     * 
     */
    function generateContentChildrenRandom(contents, position, direction) {
        var children = [],
            child;
        
        while(positionIsNotEmpty(position, direction)) {
            child = generateChild(contents, position, direction);
            if(!child) {
                break;
            }
            shrinkPositionByChild(position, child, direction);
            children.push(child);
        }
        
        return children;
    }
    
    /**
     * 
     */
    function generateChild(contents, position, direction) {
        var choice = chooseAmongPosition(contents.children, position);
        
        if(!choice) {
            return undefined;
        }
        
        return parseChoice(choice, position, direction);
    }
    
    
    
    /* Utilities
    */
    
    /**
     * Creates a parsed version of a choice given the position and direction.
     * This is the function that parses and manipulates the positioning of the
     * new choice.
     * 
     * 
     */
    function parseChoice(choice, position, direction) {
        var title = choice.title,
            schema = all_possibilities[title],
            sizing = choice["sizing"],
            output = {
                "title": choice.title,
                "arguments": choice["arguments"]
            },
            output, name, i;
        
        for(i in sizingNames) {
            name = sizingNames[i];
            
            output[name] = (sizing && sizing[name])
                ? sizing[name]
                : schema[name];
        }
        
        for(i in directionNames) {
            name = directionNames[i];
            output[name] = position[name];
        }
        output[direction] = output[directionOpposites[direction]]
            + output[directionSizing[direction]];
        
        switch(schema.contents.snap) {
            case "top":
                output["bottom"] = output["top"] - output["height"];
                break;
            case "right":
                output["left"] = output["right"] - output["width"];
                break;
            case "bottom":
                output["top"] = output["bottom"] + output["height"];
                break;
            case "left":
                output["right"] = output["left"] + output["width"];
                break;
        }
        
        return output;
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
     * 
     */
    function positionIsNotEmpty(position, direction) {
        if(direction === "right" || direction === "left") {
            return position.left < position.right;
        } else {
            return position.top > position.bottom;
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
                return;
            case "right":
                position.left = child.right;
                return;
            case "bottom":
                position.top = child.bottom;
                return;
            case "left":
                position.right = child.left;
                return;
        }
    }
    
    /**
     * 
     */
    function getPositionExtremes(children) {
        var position, child, i;
        
        if(!children || !children.length) {
            return {};
        }
        
        child = children[0];
        position = {
            "top": child.top,
            "right": child.right,
            "bottom": child.bottom,
            "left": child.left,
            "children": children
        };
        
        if(children.length === 1) {
            return position;
        }
        
        for(i = 1; i < children.length; i += 1) {
            child = children[i];
            
            if(!Object.keys(child).length) {
                return position;
            }
            
            position["top"] = Math.max(position["top"], child["top"]);
            position["right"] = Math.max(position["right"], child["right"]);
            position["bottom"] = Math.min(position["bottom"], child["bottom"]);
            position["left"] = Math.min(position["left"], child["left"]);
        }
        
        return position;
    }
    
    self.reset(settings || {});
}