/**
 * GamesRunnr.js
 * 
 * 
 */
function GamesRunnr(settings) {
    "use strict";
    if (!this || this === window) {
        return new FPSAnalyzr(settings);
    }
    var self = this,
    
        // Array of functions to be run on each upkeep
        games,
        
        // Optional trigger functions triggered on...
        on_pause,   // self.pause()
        on_unpause, // self.unpause()
        
        // Reference to the next upkeep, such as setTimeout's returned int
        upkeep_next,
        
        // Function used to schedule the next upkeep, such as setTimeout
        upkeep_schedule,
        
        // Function used to cancel the next upkeep, such as clearTimeout
        upkeep_cancel,
        
        // Boolean: whether the game is paused
        paused,
        
        // Number: amount of time, in milliseconds, between each upkeep
        interval,
        
        // Playback rate (defaults to 1)
        speed,
        
        // The actual speed, as (1 / speed) * interval
        speed_real,
        
        // An FPSAnalyzr object that measures on each upkeep
        FPSAnalyzer,
        
        // An object to set as the scope for games (if not self)
        scope;
    
    self.reset = function(settings) {
        var i;
        
        games           = settings.games           || [];
        on_pause        = settings.on_pause;
        on_unpause      = settings.on_unpause;
        upkeep_schedule = settings.upkeep_schedule || window.setTimeout;
        upkeep_cancel   = settings.upkeep_cancel   || window.clearTimeout;
        interval        = settings.interval        || 1000 / 60;
        speed           = settings.speed           || 1;
        FPSAnalyzer     = settings.FPSAnalyzer     || new FPSAnalyzr();
        scope           = settings.scope           || self;
        
        paused = false;
        
        for(i = 0; i < games.length; i += 1) {
            games[i] = games[i].bind(scope);
        }
        
        setSpeedReal();
    };
    
    /* Runtime
    */
    
    /**
     * Meaty function, run every <interval> milliseconds
     * This marks an FPS measurement and runs every game once
     * 
     * @return {this}
     */
    self.upkeep = function() {
        if(paused) {
            return;
        }
        upkeep_next = upkeep_schedule(self.upkeep, speed_real);
        
        FPSAnalyzer.measure();
        
        games.forEach(run);
        
        return self;
    };
    
    /**
     * Calls upkeep a <num or 1> number of times, immediately
     * 
     * @param {Number} num   An optional number of times to upkeep
     * @return {this}
     */
    self.step = function(num) {
        unpause();
        self.upkeep();
        pause();
        if(num > 0) {
            self.step(num - 1);
        }
        return self;
    }
    
    /**
     * Stops execution of self.upkeep, and cancels the next call.
     * If an on_pause has been defined, it's called after.
     * 
     * @return {this}
     */
    self.pause = function() {
        if(paused) return;
        paused = true;
        
        if(on_pause) {
            on_pause();
        }
        
        upkeep_cancel(upkeep);
        
        return self;
    };
    
    
    /**
     * Continuous execution of self.upkeep by calling it.
     * If an on_unpause has been defined, it's called before.
     * 
     * @return {this}
     */
    self.unpause = function() {
        if(!paused) return;
        paused = false;
        
        if(on_unpause) {
            on_unpause();
        }
        
        self.upkeep();
        
        return self;
    };
    
    
    /**
     * Toggles whether this is paused, and calls the appropriate function.
     * 
     * @return {this}
     */
    self.togglePause = function() {
        paused ? self.unpause() : self.pause();
        return self;
    };
    
    
    /* Games manipulations
    */
    
    /**
     * Adds an extra function to the end of games, or at a position if given
     * 
     * @return {this}
     */
    self.addGame = function(game, position) {
        if(!game instanceof Function) {
            console.error("This is not a function:", game);
            return self;
        }
        games.push(game);
        return self;
    };
    
    /**
     * Removes a given game function from the games array
     * 
     * @param {Function} game   The game function to be removed
     * @return {Function[]}   An array containing the function if it was found,
     *                        or an empty array if it wasn't.
     */
    self.removeGame = function(game) {
        return games.splice(games.indexOf(game), 1);
    };
    
    /**
     * Sets the interval between between upkeeps, in milliseconds
     * 
     * @param {Number} The new time interval in milliseconds
     * @return {this}
     */
    self.setInterval = function(num) {
        var realint = Number(num);
        if(isNaN(realnum)) {
            console.error("Improper number given to setInterval:", num);
            return self;
        }
        interval = realint;
        setSpeedReal();
        return self;
    };
    
    /**
     * Sets the speed multiplier for the interval, such as 2 (twice as fast)
     * or 0.5 (half as fast).
     * 
     * @param {Number} The new speed multiplier
     * @return {this}
     */
    self.setSpeed = function(num) {
        var realnum = Number(num);
        if(isNaN(realnum)) {
            console.error("Improper number given to setSpeed:", num);
            return self;
        }
        speed = realnum;
        setSpeedReal();
        return self;
    };
    
    
    /* Gets
    */
    
    /**
     * Simple get function for the true/false paused status
     * 
     * @return {Boolean}
     */
    self.getPaused = function() {
        return paused;
    };
    
    /**
     * Simple get function for the array of game functions
     * 
     * @return {Function[]}
     */
    self.getGames = function() {
        return games;
    };
    
    /**
     * Simple get function for the interval between upkeeps
     */
    self.getInterval = function() {
        return interval;
    };
    
    /**
     * Simple get function for the speed multiplier
     * 
     * @return {Number}
     */
    self.getSpeed = function() {
        return speed;
    };
    
    
    /* Utilities
    */
    
    /**
     * Sets the private speed_real variable, which is interval * (speed inverse)
     */
    function setSpeedReal() {
        speed_real = (1 / speed) * interval;
    }
    
    /**
     * Curry function to fun a given function. Used in games.forEach(game);
     */
    function run(game) {
        game();
    }
    
    self.reset(settings || {});
}