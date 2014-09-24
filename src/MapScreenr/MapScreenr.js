/**
 * 
 */
function MapScreenr(settings) {
    "use strict";
    if(!this || this === window) {
        return new MapScreenr(settings);
    }
    var self = this,
        
        // An object of variables to be computed on screen changes, as "name"=>Function
        variables,
        
        // Arguments to be passed into variable computation functions, as an Array
        variable_args;
    
    /**
     * 
     */
    self.reset = function(settings) {
        for(var name in settings) {
            if(settings.hasOwnProperty(name)) {
                self[name] = settings[name];
            }
        }
        
        variables = settings.variables || {};
        variable_args = settings.variable_args || [];
    }
    
    
    /* State changes
    */
    
    /**
     * 
     */
    self.clearScreen = function () {
        // 
        self.left = 0;
        self.top = 0;
        
        // 
        self.right = self.left + self.width;
        self.bottom = self.top + self.height;
        
        // 
        setMiddleX();
        setMiddleY();
        
        // 
        self.setVariables();
    };
    
    /**
     * 
     */
    function setMiddleX() {
        self.middlex = (self.left + self.right) / 2;
    }
    
    /**
     * 
     */
    function setMiddleY() {
        self.middley = (self.top + self.bottom) / 2;
    }
    
    /**
     * 
     */
    self.setVariables = function () {
        for(var i in variables) {
            self[i] = variables[i].apply(self, variable_args);
        }
    }
    
    
    /* Element shifting
    */
    
    /**
     * 
     */
    self.shift = function(dx, dy) {
        if(dx) {
            self.shiftX(dx);
        }
        
        if(dy) {
            self.shiftY(dy);
        }
    };
    
    /**
     * 
     */
    self.shiftX = function(dx) {
        self.left += dx;
        self.right += dx;
    };
    
    /**
     * 
     */
    self.shiftY = function(dy) {
        self.top += dy;
        self.bottom += dy;
        setBottomDeath();
    };
    
    self.reset(settings || {});
}