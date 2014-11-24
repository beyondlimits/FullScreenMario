/**
 * A new JSON-based audio player for Full Screen Mario. 
 * Influenced by Cody Lundquist: https://github.com/meenie/band.js
 */
function AudioPlayrNew(settings) {
    "use strict";
    if(!this || this === window) {
        return new AudioPlayer(settings);
    }
    var self = this,
        
        // ???
        library,
        
        // Currently playing sounds
        currentSounds,
        
        // Currently playing theme
        currentTheme,
        
        // Current volume Number in [0, 100]
        volume,
        
        // Whether all sounds should be muted (ignoring volume)
        muted,
        
        // What name to store the value of muted under localStorage
        localMutedKey,
        
        // The Function or Number used to determine what playLocal's volume is
        getVolumeLocal,
        
        // The Function or String used to get a default theme name
        getThemeDefault,
        
        // Default settings used when creating a new sound
        soundDefaults;
    
    /**
     * 
     */
    self.reset = function (settings) {
        library = settings.library || {};
        localMutedKey = settings.localMutedKey || "AudioPlayerMuted";
        getVolumeLocal = settings.getVolumeLocal || 100;
        getThemeDefault = settings.getThemeDefault || "Theme";
        
        currentSounds = {};
        currentTheme = undefined;
        
        if(localMutedKey) {
            muted = JSON.parse(localStorage[localMutedKey] || false);
        } else {
            muted = settings.muted || false;
        }
    };
    
    
    /* Library modifiers
    */
    
    /** 
     * 
     */
    self.getLibrary = function () {
        return library;
    };
    
    /**
     * 
     */
    self.setLibrary = function (libraryNew) {
        library = libraryNew;
    };
    
    /**
     * 
     */
    self.addAudio = function (key, audio) {
        library[key] = audio;
    };
    
    
    self.reset(settings || {});
}