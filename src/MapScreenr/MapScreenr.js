/**
 * 
 */
function MapScreenr(settings) {
    "use strict";
    if(!this || this === window) {
        return new MapScreenr(settings);
    }
    var self = this;
    
    /**
     * 
     */
    self.reset = function(settings) {
        var name, len, i;
        
        for(i = 0, len = self.required.length; i < len; i += 1) {
            if(!settings.hasOwnProperty(self.required[i])) {
                throw new Error("No " + required[i] + " given to MapScreenr.");
            }
        }
        
        for(i = 0, len = self.barred.length; i < len; i += 1) {
            if(settings.hasOwnProperty(self.barred[i])) {
                throw new Error(requried[i] + " not allowed as setting.");
            }
        }
        
        // 
        for(name in settings) {
            if(settings.hasOwnProperty(name)) {
                self[name] = settings[name];
            }
        }
        
        // 
        self.left = 0;
        self.top = 0;
        
        // 
        self.right = self.left + self.width;
        self.bottom = self.top + self.height;
        
        // 
        self.setMiddleX();
        self.setMiddleY();
        self.setBottomMax();
        self.setBottomDeath();
    }
    
    
    /* Simple gets
    */
    
    /**
     * 
     */
    self.setMiddleX = function() {
        self.middlex = (self.left + self.right) / 2;
    };
    
    /**
     * 
     */
    self.setMiddleY = function() {
        self.middley = (self.top + self.bottom) / 2;
    };
    
    /**
     * 
     */
    self.setBottomMax = function() {
        self.bottom_max = self.height - self.ceiling_max;
    };
    
    /**
     * 
     */
    self.setBottomDeath = function() {
        self.bottom_death = self.bottom + self.bottom_death_difference;
    };
    
    
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
    }
    
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
        self.ceiling_max += dy;
        self.setBottomDeath();
    };
    
    self.reset(settings || {});
}

// Required properties that must be in a constructor's given settings
MapScreenr.prototype.required = [
    "width", "height", "ceiling_max", "bottom_death_difference"
];

// Barred properties that must not be in a constructor's given settings
MapScreenr.prototype.barred = [
    "left", "top"
];