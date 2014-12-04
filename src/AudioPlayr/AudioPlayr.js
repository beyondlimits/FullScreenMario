/* AudioPlayr.js
 * A library to play audio files derived from Full Screen Mario
 * This will:
 * 1. Load files via AJAX upon startup
 * 2. Create appropriate HTML5 <audio> elements
 * 3. Play and pause those audio files on demand
 */
function AudioPlayr(settings) {
    "use strict";
    if (!this || this === window) {
        return new AudioPlayr(settings);
    }
    var self = this,

        // A list of filenames to be turned into <audio> objects
        library,

        // What file types to add as sources to sounds
        filetypes,

        // Currently playing sound objects, keyed by name (no extensions)
        sounds,

        // The currently playing theme
        theme,

        // Directory from which audio files are AJAXed if needed
        directory,

        // The function or int used to determine what playLocal's volume is
        getVolumeLocal,

        // The function or string used to get a default theme name
        getThemeDefault,

        // Storage container for settings like volume and muted status
        StatsHolder;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        library = settings.library || {};
        filetypes = settings.filetypes || ["mp3", "ogg"];
        directory = settings.directory || "";
        getVolumeLocal = settings.getVolumeLocal || 1;
        getThemeDefault = settings.getThemeDefault || "Theme";

        // Sounds should always start blank
        sounds = {};

        // Preload everything!
        libraryLoad();
        
        StatsHolder = new StatsHoldr(settings.statistics);
        
        self.setVolume(StatsHolder.get("volume"));
        self.setMuted(StatsHolder.get("muted"));
    };
    
    
    /* Simple getters
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
    self.getFileTypes = function () {
        return filetypes;
    };
    
    /**
     * 
     */
    self.getCurrentSounds = function () {
        return sounds;
    };
    
    /**
     * 
     */
    self.getCurrentTheme = function () {
        return theme;
    };
    
    /**
     * 
     */
    self.getDirectory = function () {
        return directory;
    };
    
    
    /* Playback modifiers
    */
    
    /**
     * 
     */
    self.getVolume = function () {
        return StatsHolder.get("volume");
    };
    
    /**
     * 
     */
    self.setVolume = function (volume) {
        if (!self.getMuted()) {
            for (var i in sounds) {
                sounds[i].volume = sounds[i].volume_real * volume;
            }
        }
        
        StatsHolder.set("volume", volume);
    };
    
    /**
     * 
     */
    self.getMuted = function () {
        return StatsHolder.get("muted");
    };
    
    /**
     * 
     */
    self.setMuted = function (muted) {
        muted ? self.setMutedOn() : self.setMutedOff();
    }
    
    /**
     * 
     */
    self.setMutedOn = function () {
        for (var i in sounds) {
            if (sounds.hasOwnProperty(i)) {
                sounds[i].volume = 0;
            }
        }
        StatsHolder.set("muted", 1);
    };
    
    /**
     * 
     */
    self.setMutedOff = function () {
        var volume = self.getVolume(),
            sound, i;
        
        for (i in sounds) {
            if (sounds.hasOwnProperty(i)) {
                sound = sounds[i];
                sound.volume = sound.volume_real * volume;
            }
        }
        
        StatsHolder.set("muted", 0);
    };
    
    /**
     * 
     */
    self.toggleMuted = function () {
        self.setMuted(!self.getMuted());
    };
    
    
    /* Playback
    */
    
    /**
     * 
     */
    self.play = function (name) {
        var sound;
        
        // If the sound isn't yet being played, see if it's in the library
        if (!sounds.hasOwnProperty(name)) {
            // If the sound also isn't in the library, it's unknown
            if (!library.hasOwnProperty(name)) {
                throw new Error("Unknown name given to AudioPlayr.play: '" + name + "'."); 
            }
            sounds[name] = sound = library[name];
        } else {
            sound = sounds[name];
        }
        
        soundStop(sound);
        
        if (self.getMuted()) {
            sound.volume = 0;
        } else {
            sound.volume_real = 1;
            sound.volume = self.getVolume();
        }
        
        sound.play();
        
        // If this is the song's first play, let it know how to stop
        if (!sound.used) {
            sound.used += 1;
            sound.addEventListener("ended", soundFinish.bind(undefined, name));
        }
        
        return sound;
    };
    
    /**
     * 
     */
    self.pauseAll = function () {
        for (var i in sounds) {
            if (!sounds.hasOwnProperty(i)) {
                continue;
            }
            
            sounds[i].pause();
        }
    };
    
    /**
     * 
     */
    self.resumeAll = function () {
        for (var i in sounds) {
            if (!sounds.hasOwnProperty(i)) {
                continue;
            }
            
            sounds[i].play();
        }
    };
    
    /**
     * 
     */
    self.pauseTheme = function () {
        if (theme) {
            theme.pause();
        }
    };
    
    /**
     * 
     */
    self.resumeTheme = function () {
        if (theme) {
            theme.play();
        }
    };
    
    /**
     * 
     */
    self.clearAll = function () {
        self.pauseAll();
        self.theme = undefined;
        sounds = {};
    };
    
    /**
     * 
     */
    self.playLocal = function (name, location) {
        var sound = self.play(name);

        switch (getVolumeLocal.constructor) {
            case Function:
                sound.volume_real = getVolumeLocal(location);
                break;
            case Number:
                sound.volume_real = getVolumeLocal;
                break;
            default:
                sound.volume_real = Number(volume_real) || 1;
                break;
        }
        
        if (self.getMuted()) {
            sound.volume = 0;
        } else {
            sound.volume = sound.volume_real * self.getVolume();
        }

        return sound;
    };
    
    /**
     * 
     */
    self.playTheme = function (name, loop) {
        self.pauseTheme();
        
        // Loop defaults to true
        loop = typeof loop !== 'undefined' ? loop : true;

        // If name isn't given, use the default getter
        if (typeof(name) === "undefined") {
            switch (getThemeDefault.constructor) {
                case Function:
                    name = getThemeDefault();
                    break
                case String:
                    name = getThemeDefault;
                    break;
            }
        }
        
        sounds[name] = theme = self.play(name);
        theme.loop = loop;

        // If it's used (no repeat), add the event listener to resume theme
        if (theme.used === 1) {
            theme.addEventListener("ended", self.playTheme);
        }

        return theme;
    };
    
    /**
     * 
     */
    self.playThemePrefix = function (prefix, name, loop) {
        self.pauseTheme();
        self.play("Hurry");
        
        // If name isn't given, use the default getter
        if (typeof(name) === "undefined") {
            switch (getThemeDefault.constructor) {
                case Function:
                    name = getThemeDefault();
                    break
                case String:
                    name = getThemeDefault;
                    break;
            }
        }
        
        self.addEventListener("Hurry", "ended", self.playTheme.bind(self, "Hurry " + name, loop));
    };


    /* Public utilities
     */

    /**
     * Adds an event listener to a currently playing sound.
     * 
     * @param {String} name   The name of the sound.
     * @param {String} event   The name of the event, such as "ended".
     * @param {Function} callback   The Function to be called by the event.
     */
    self.addEventListener = function(name, event, callback) {
        if (!sounds.hasOwnProperty(name)) {
            throw new Error("Unknown name given to AudioPlayr.addEventListener: '" + name + "'.");
        }
        
        sounds[name].addEventListener(event, callback);
    };

    /**
     * Adds an event listener to a sound. If the sound doesn't exist or has 
     * finished playing, it's called immediately.
     * 
     * @param {String} name   The name of the sound.
     * @param {String} event   The name of the event, such as "onended".
     * @param {Function} callback   The Function to be called by the event.
     */
    self.addEventImmediate = function(name, event, callback) {
        if (!sounds.hasOwnProperty(name) || sounds[name].paused) {
            callback();
            return;
        }
        
        sounds[name].addEventListener(event, callback);
    };
    

    /* Private utilities
    */

    /**
     * Called when a sound has completed to get it out of sounds.
     */
    function soundFinish(name) {
        if (sounds.hasOwnProperty(name)) {
            delete sounds[name];
        }
    }

    /**
     * Carefully stops a sound. HTMLAudioElements don't natively have a .stop()
     * function, so this is the shim to do that.
     */
    function soundStop(sound) {
        sound.pause();
        if (sound.readyState) {
            sound.currentTime = 0;
        }
    }


    /* Private loading / resetting
     */

    /**
     * Loads every sound defined in the library via AJAX. Sounds are loaded
     * into <audio> elements via createAudio and stored in the library.
     */
    function libraryLoad() {
        var section, name, sectionName, j;

        // For each given section (e.g. names, themes):
        for (sectionName in library) {
            section = library[sectionName];
            // For each thing in that section:
            for (j in section) {
                name = section[j];
                // Create the sound and store it in the container
                library[name] = createAudio(name, sectionName);
            }
        }
    }

    /**
     * Creates an audio element, gives it sources, and starts preloading.
     * 
     * @param {String} name
     * @param {String} sectionName
     * @return {HTMLAudioElement}
     */
    function createAudio(name, sectionName) {
        var sound = document.createElement("audio"),
            type, child, i;

        // Create an audio source for each child
        for (i in filetypes) {
            type = filetypes[i];
            child = document.createElement("source");
            child.type = "audio/" + type;
            child.src = directory + "/" + sectionName + "/" + type + "/" + name + "." + type;
            
            sound.appendChild(child);
        }

        // This preloads the sound.
        sound.volume = 0;
        sound.volume_real = 1;
        sound.used = 0;
        sound.play();
        
        return sound;
    }
    
    
    self.reset(settings || {});
}