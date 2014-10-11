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
        
        return generateContentchildren(schema, position);
    }
    
    /**
     * 
     */
    function generateContentchildren(schema, position) {
        var //children = [],
            contents = schema.contents,
            leftSave = position.left,
            children, 
            child;
        
        if(contents.mode === "Certain") {
            children = contents.children.map(function (choice) {
                child = parseChoice(choice, position);
                position.left = child.right;
                return child;
            });
        } else {
            children = [];
            while(position.left < position.right) {
                child = generateChild(contents, position);
                if(!child) {
                    break;
                }
                position.left = child.right;
                children.push(child);
            }
        }
        
        position.left = leftSave;
        
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
    function generateChild(contents, position) {
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
    function parseChoice(choice, position) {
        var schema = all_possibilities[choice.title];
        
        if(choice.type === "Known") {
            return {
                "left": position.left,
                "bottom": position.bottom,
                "top": position.top,
                "right": position.left + schema.width,
                "type": "Known",
                "title": choice.title,
                "arguments": schema.arguments ? chooseAmongPosition(schema.arguments, position) : undefined
            };
        }
        
        if(choice.type === "Random") {
            return generateContentchildren(schema, {
                "left": position.left,
                "bottom": position.bottom,
                "top": position.top,
                "right": position.left + schema.width,
            });
        }
    }
    
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
        return chooseAmong(children.filter(function (choice) {
            choice = all_possibilities[choice.title];
            return (position.right - position.left) >= choice.width;
        }));
    }
    
    /**
     * Chooses a number in [1, 100] at random.
     * 
     * @return Number
     */
    function randomPercentage() {
        return Math.floor(random() * 100) + 1;
    }
    
    self.reset(settings || {});
}