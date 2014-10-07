function WorldSeedr(settings) {
    "use strict";
    if (!this || this === window) {
        return new WorldSeedr(settings);
    }
    var self = this,
        
        // A very large hashtable of possibilities, by title
        all_possibilities,
        
        // A function use dto generate a random number, by default Math.random
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
        
        if(!schema.children) {
            throw new Error("The schema for '" + name + "' has no possibile outcomes");
        }
        
        return generateChildren(schema, position);
    }
    
    /**
     * 
     */
    function generateChildren(schema, position) {
        var children = [],
            choices = schema.children.choices,
            left = position.left,
            child;
        
        while(position.left < position.right) {
            child = generateChild(choices, position);
            position.left = child.right;
            children.push(child);
        }
        position.left = left;
        
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
    function generateChild(choices, position) {
        var choice = chooseAmong(choices, position),
            schema = all_possibilities[choice.title];
        
        if(choice.type === "Known") {
            console.log("Placing", choice.title, position.left);
            return {
                "left": position.left,
                "bottom": position.bottom,
                "top": position.top,
                "right": position.left + schema.width,
                "type": "Known",
                "title": choice.title,
                "arguments": schema.arguments ? chooseAmong(schema.arguments) : undefined
            };
        }
        
        if(choice.type === "Random") {
            return generateChildren(schema, {
                "left": position.left,
                "bottom": position.bottom,
                "top": position.top,
                "right": position.left + schema.width,
            });
        }
    }
    
    
    /* Utilities
    */
    
    /**
     * From an array of Objects conforming to the Arguments or 
     * Choices schema types, returns one chosen at random.
     * 
     * @remarks There will be a need to make this filter the 
     *          choices for being greater than a width or height
     */
    function chooseAmong(choices, position) {
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
     * Chooses a number in [1, 100] at random.
     * 
     * @return Number
     */
    function randomPercentage() {
        return Math.floor(random() * 100) + 1;
    }
    
    self.reset(settings || {});
}