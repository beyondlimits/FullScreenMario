function WorldSeedr(settings) {
    "use strict";
    if (!this || this === window) {
        return new WorldSeedr(settings);
    }
    var self = this,
        
        // A very large hashtable of possibilities, by title
        possibilities,
        
        // A function use dto generate a random number, by default Math.random
        random;
    
    /**
     * 
     */
    self.reset = function (settings) {
        possibilities = settings.possibilities
        random = settings.random || Math.random.bind(Math);
    };
    
    /**
     * 
     */
    self.getPossibilities = function () {
        return possibilities;
    }
    
    
    /* Hardcore generation functions
    */
    
    /**
     * 
     */
    self.generate = function (name, options) {
        var schema = possibilities[name];
        
        if(!schema) {
            throw new Error("No possibility exists under '" + name + "'");
        }
        
        if(schema.certainty) {
            return generateCertainty(name, schema, options);
        }
        
        if(schema.children) {
            return generateChildren(name, schema, options);
        }
        
        throw new Error("The schema for '" + name + "' has no possibile outcomes");
    }
    
    /**
     * 
     */
    function generateCertainty(name, schema, options) {
        var certainty = schema.certainty,
            args;
        
        if(certainty.arguments) {
            args = chooseArgument(certainty.arguments).values;
        }
        
        return {
            "type": certainty.type,
            "title": certainty.title,
            "arguments": args
        }
    }
    
    /**
     * 
     */
    function generateChildren(name, schema, options) {
        var output = [],
            children = schema.children,
            width = options.width,
            height = options.height,
            orientation = schema.orientation,
            // In the future, change these based on direction
            x = 0,
            y = 0,
            child;
        
        if(typeof(height) === "undefined") {
            throw new Error("The schema for '" + name + "' is being given an undefined height.");
        }
        
        if(typeof(width) === "undefined") {
            throw new Error("The schema for '" + name + "' is being given an undefined width.");
        }
        
        while(x < width) {
            console.log("Trying at", x);
            child = chooseAmong(children.possibilities);
            
            console.log("Got", child);
            break;
        }
        return child;
    }
    
    
    /* Randomization generator
    */
    
    /**
     * From an array of Objects conforming to the Arguments or 
     * Choices schema types, returns one chosen at random.
     * 
     * 
     */
    function chooseAmong(choices) {
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