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
     * Generates a large collection of randomly chosen possibilities based on a
     * given schema mapping. These will fit within the given position.
     * 
     * @param {Object} schema   A simple Object with basic information on the
     *                          chosen possibility.
     * @param {String} name   The name of the possibility schema to start from.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    self.generate = function (name, position) {
        var schema = all_possibilities[name];
        
        if(!schema) {
            throw new Error("No possibility exists under '" + name + "'");
        }
        
        if(!schema.contents) {
            throw new Error("The schema for '" + name + "' has no possibile outcomes");
        }
        
        return generateContentChildren(schema, positionCopy(position), undefined);
    };
    
    /**
     * Generates the children for a given schema, position, and direction. This
     * is the real hardcore function called by self.generate, which calls the
     * differnt subroutines based on whether the contents are in "Certain" or
     * "Random" mode.
     * 
     * @param {Object} schema   A simple Object with basic information on the
     *                          chosen possibility.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} [direction]   A string direction to check the position 
     *                               by ("top", "right", "bottom", or "left")
     *                               as a default if contents.direction isn't
     *                               provided.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    function generateContentChildren(schema, position, direction, fixSizeMax) {
        var contents = schema.contents,
            spacing = contents.spacing || 0,
            positionExtremes,
            children, 
            child;
        
        direction = contents.direction || direction;
        
        switch(contents.mode) {
            case "Certain":
                children = generateContentChildrenCertain(contents, position, direction, spacing);
                break;
            case "Random":
                children = generateContentChildrenRandom(contents, position, direction, spacing);
                break;
        }
        
        return getPositionExtremes(children);
    }
    
    /**
     * Generates a schema's children that are known to follow a set listing of
     * sub-schemas.
     * 
     * @param {Object} contents   The Array of known possibilities, in order.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Number} spacing   How much space there should be between each
     *                           child.
     * @return {Object}   An Object containing a position within the given 
     *                    position and some number of children.
     */
    function generateContentChildrenCertain(contents, position, direction, spacing) {
        var child;
        return contents.children.map(function (choice) {
            child = parseChoice(choice, position, direction);
            if(child) {
                if(child.type !== "Known") {
                    child.contents = self.generate(child.title, position);
                }
                shrinkPositionByChild(position, child, direction, spacing);
            }
            return child;
        }).filter(function (child) {
            return child;
        });
    }
    
    /**
     * Generates a schema's children that are known to be randomly chosen from a
     * list of possibilities until there is no more room.
     * 
     * @param {Object} contents   The Array of known possibilities, with 
     *                            probability percentages.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Number} spacing   How much space there should be between each 
     *                           child.
     * @return 
     */
    function generateContentChildrenRandom(contents, position, direction, spacing) {
        var children = [],
            child;
        
        while(positionIsNotEmpty(position, direction)) {
            child = generateChild(contents, position, direction);
            if(!child) {
                break;
            }
            
            shrinkPositionByChild(position, child, direction, spacing);
            children.push(child);
        }
        
        return children;
    }
    
    
    
    /* Choice parsing
    */
    
    /**
     * Shortcut function to choose a choice from an allowed set of choices, and
     * parse it for positioning and sub-choices.
     * 
     * @param {Object} contents   An Array of choice Objects, each of which must
     *                            have a .percentage.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position by:
     *                             "top", "right", "bottom", or "left".
     * @return {Object}   An Object containing the bounding box position of a
     *                    parsed child, with the basic schema (.title) info 
     *                    added as well as any optional .arguments.
     */
    function generateChild(contents, position, direction) {
        var choice = chooseAmongPosition(contents.children, position);
        
        if(!choice) {
            return undefined;
        }
        
        return parseChoice(choice, position, direction);
    }
    
    /**
     * Creates a parsed version of a choice given the position and direction.
     * This is the function that parses and manipulates the positioning of the
     * new choice.
     * 
     * @param {Object} choice   The simple definition of the object chosen from
     *                          a choices array. It should have at least .title,
     *                          and optionally .sizing or .arguments.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to shrink the position by:
     *                             "top", "right", "bottom", or "left".
     * @return {Object}   An Object containing the bounding box position of a
     *                    parsed child, with the basic schema (.title) info 
     *                    added as well as any optional .arguments.
     */
    function parseChoice(choice, position, direction) {
        var title = choice.title,
            schema = all_possibilities[title],
            sizing = choice["sizing"],
            output = {
                "title": choice.title,
                "type": choice.type,
                "arguments": choice["arguments"],
            },
            name, i;
        
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
     * From an Array of potential choice objects, returns one chosen at random.
     * 
     * @param {Array} choice   An Array of objects with .width and .height.
     * @return {Boolean}
     */
    function chooseAmong(choices) {
        if(!choices.length) {
            return undefined;
        }
        if(choices.length === 1) {
            return choices[0];
        }
        
        var choice = randomPercentage(),
            sum = 0,
            i;
        
        for(i = 0; i < choices.length; i += 1) {
            sum += choices[i].percent;
            if(sum >= choice) {
                return choices[i];
            }
        }
    }
    
    /**
     * From an Array of potential choice objects, filtered to only include those
     * within a certain size, returns one chosen at random.
     *
     * @param {Array} choice   An Array of objects with .width and .height.
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @return {Boolean}
     */
    function chooseAmongPosition(choices, position) {
        var width = position.right - position.left,
            height = position.top - position.bottom;
        
        return chooseAmong(choices.filter(function (choice) {
            choice = all_possibilities[choice.title];
            return doesChoiceFit(choice, width, height);
        }));
    }
    
    /**
     * Checks whether a choice can fit within a width and height.
     * 
     * @param {Object} choice   An Object that contains .width and .height.
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
     * @param {Object} choice   An Object that contains .width and .height.
     * @param {Object} position   An Object that contains .left, .right, .top, 
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
    function positionCopy(position) {
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
     * Checks and returns whether a position has open room in a particular
     * direction (horizontally for left/right and vertically for top/bottom).
     * 
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {String} direction   A string direction to check the position in:
     *                             "top", "right", "bottom", or "left".
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
     * @param {Object} position   An Object that contains .left, .right, .top, 
     *                            and .bottom.
     * @param {Object} child   An Object that contains .left, .right, .top, and
     *                         .bottom.
     * @param {String} direction   A string direction to shrink the position by:
     *                             "top", "right", "bottom", or "left".
     * @param {Number} [spacing]   How much space there should be between each
     *                             child (defaults to 0).
     */
    function shrinkPositionByChild(position, child, direction, spacing) {
        switch(direction) {
            case "top":
                position.bottom = child.top + spacing;
                return;
            case "right":
                position.left = child.right + spacing;
                return;
            case "bottom":
                position.top = child.bottom - spacing;
                return;
            case "left":
                position.right = child.left - spacing;
                return;
        }
    }
    
    /**
     * Generates the bounding box position Object (think rectangle) for a set of
     * children. The top, right, etc. member variables become the most extreme
     * out of all the possibilities.
     * 
     * @param {Object} children   An Array of objects with .top, .right,
     *                            .bottom, and .left.
     * @return {Object}   An Object with .top, .right, .bottom, and .left.
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