/**
 * A new JSON-based audio player for Full Screen Mario. 
 * Influenced by Cody Lundquist: https://github.com/meenie/band.js
 * Pink noise measurements: http://www.firstpr.com.au/dsp/pink-noise/
 * GameBoy sound table: http://www.devrs.com/gb/files/sndtab.html
 * Note frequencies: http://www.phy.mtu.edu/~suits/notefreqs.html
 */
function AudioPlayr(settings) {
    "use strict";
    if(!this || this === window) {
        return new AudioPlayr(settings);
    }
    var self = this,
        
        // The Web Audio API AudioContext this is streaming to
        context,
        
        // ???
        library,
        
        // ???
        collections,
        
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
        soundDefaults,
        
        // Lookup table of Strings to generator Functions
        generatorNames = {
            "Oscillator": OscillatorGenerator,
            "WhiteNoise": WhiteNoiseGenerator,
            "PinkNoise": PinkNoiseGenerator,
            "BrownianNoise": BrownianNoiseGenerator
        },
        
        // Lookup table of String note names to their frequency Numbers
        // Note: the GB table is an octave lower (this standardizes to 8bit.js)
        noteFrequencies = {
            "C0": 16.35,
            "C#0": 17.32,
            "Db0": 17.32,
            "D0": 18.35,
            "D#0": 19.45,
            "Eb0": 19.45,
            "E0": 20.6,
            "F0": 21.83,
            "F#0": 23.12,
            "Gb0": 23.12,
            "G0": 24.5,
            "G#0": 25.96,
            "Ab0": 25.96,
            "A0": 27.5,
            "A#0": 29.14,
            "Bb0": 29.14,
            "B0": 30.87,
            "C1": 32.7,
            "C#1": 34.65,
            "Db1": 34.65,
            "D1": 36.71,
            "D#1": 38.89,
            "Eb1": 38.89,
            "E1": 41.2,
            "F1": 43.65,
            "F#1": 46.25,
            "Gb1": 46.25,
            "G1": 49,
            "G#1": 51.91,
            "Ab1": 51.91,
            "A1": 55,
            "A#1": 58.27,
            "Bb1": 58.27,
            "B1": 61.74,
            "C2": 65.41,
            "C#2": 69.3,
            "Db2": 69.3,
            "D2": 73.42,
            "D#2": 77.78,
            "Eb2": 77.78,
            "E2": 82.41,
            "F2": 87.31,
            "F#2": 92.5,
            "Gb2": 92.5,
            "G2": 98,
            "G#2": 103.83,
            "Ab2": 103.83,
            "A2": 110,
            "A#2": 116.54,
            "Bb2": 116.54,
            "B2": 123.47,
            "C3": 130.81,
            "C#3": 138.59,
            "Db3": 138.59,
            "D3": 146.83,
            "D#3": 155.56,
            "Eb3": 155.56,
            "E3": 164.81,
            "F3": 174.61,
            "F#3": 185,
            "Gb3": 185,
            "G3": 196,
            "G#3": 207.65,
            "Ab3": 207.65,
            "A3": 220,
            "A#3": 233.08,
            "Bb3": 233.08,
            "B3": 246.94,
            "C4": 261.63,
            "C#4": 277.18,
            "Db4": 277.18,
            "D4": 293.66,
            "D#4": 311.13,
            "Eb4": 311.13,
            "E4": 329.63,
            "F4": 349.23,
            "F#4": 369.99,
            "Gb4": 369.99,
            "G4": 392,
            "G#4": 415.3,
            "Ab4": 415.3,
            "A4": 440,
            "A#4": 466.16,
            "Bb4": 466.16,
            "B4": 493.88,
            "C5": 523.25,
            "C#5": 554.37,
            "Db5": 554.37,
            "D5": 587.33,
            "D#5": 622.25,
            "Eb5": 622.25,
            "E5": 659.25,
            "F5": 698.46,
            "F#5": 739.99,
            "Gb5": 739.99,
            "G5": 783.99,
            "G#5": 830.61,
            "Ab5": 830.61,
            "A5": 880,
            "A#5": 932.33,
            "Bb5": 932.33,
            "B5": 987.77,
            "C6": 1046.5,
            "C#6": 1108.73,
            "Db6": 1108.73,
            "D6": 1174.66,
            "D#6": 1244.51,
            "Eb6": 1244.51,
            "E6": 1318.51,
            "F6": 1396.91,
            "F#6": 1479.98,
            "Gb6": 1479.98,
            "G6": 1567.98,
            "G#6": 1661.22,
            "Ab6": 1661.22,
            "A6": 1760,
            "A#6": 1864.66,
            "Bb6": 1864.66,
            "B6": 1975.53,
            "C7": 2093,
            "C#7": 2217.45,
            "Db7": 2217.46,
            "D7": 2349.32,
            "D#7": 2489.02,
            "Eb7": 2489.02,
            "E7": 2637.02,
            "F7": 2793.83,
            "F#7": 2959.96,
            "Gb7": 2959.96,
            "G7": 3135.96,
            "G#7": 3322.44,
            "Ab7": 3322.44,
            "A7": 3520,
            "A#7": 3729.31,
            "Bb7": 3729.31,
            "B7": 3951.07,
            "C8": 4186.01,
            "C#8": 4434.92,
            "Db8": 4434.92,
            "D8": 4698.63,
            "D#8": 4978.03,
            "Eb8": 4978.03,
            "E8": 5274.04,
            "F8": 5587.65,
            "F#8": 5919.91,
            "Gb8": 5919.91,
            "G8": 6271.93,
            "G#8": 6644.88,
            "Ab8": 6644.88,
            "A8": 7040,
            "A#8": 7458.62,
            "Bb8": 7458.62,
            "B8": 7902.13
        };
    
    /**
     * 
     */
    self.reset = function (settings) {
        context = new AudioContext();
        
        localMutedKey = settings.localMutedKey || "AudioPlayerMuted";
        getVolumeLocal = settings.getVolumeLocal || 100;
        getThemeDefault = settings.getThemeDefault || "Theme";
        
        if(settings.library) {
            library = settings.library;
            collections = self.processLibrary(library);
        } else {
            library = {};
            collections = {};
        }
        
        currentSounds = {};
        currentTheme = undefined;
        
        if(localMutedKey) {
            muted = JSON.parse(localStorage[localMutedKey] || false);
        } else {
            muted = settings.muted || false;
        }
    };
    
    
    /* Storage modifiers
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
    self.getCollections = function () {
        return collections;
    };
    
    /**
     * 
     */
    self.getCollection = function (key) {
        return collections[key];
    }
    
    
    /* Playback
    */
    
    /**
     * 
     */
    self.play = function (key) {
        var collection = collections[key],
            components = collection.components,
            component, instructions, i;
        
        for(i in components) {
            component = components[i];
            instructions = component.instructions;
            playComponent(component, collection);
        }
    };
    
    /**
     * Move to core?
     * doesn't check for rest.
     */
    function playComponent(component, collection) {
        var instruction = component.instructions[component.index];
        
        switch(instruction.type) {
            case "notes":
                playComponentNotes(instruction, component, collection);
                break;
            case "rest":
                playComponentRest(instruction, component, collection);
                break;
            case "repeat":
                playComponentRepeat(instruction, component, collection);
                break;
        }
    }
    
    /**
     * 
     */
    function getBeatsPerLength(instruction, collection) {
        return instruction.length * collection.beatsPer.second * 166.6666667;
    }
    
    /**
     * 
     */
    function playComponentNotes(instruction, component, collection) {
        var length = getBeatsPerLength(instruction, collection),
            players = instruction.notes.map(createPlayer.bind(undefined, component, instruction)),
            i;
        
        for(i = 0; i < players.length; i += 1) {
            players[i].play();
        }
        
        setTimeout(function () {
            for(i = 0; i < players.length; i += 1) {
                players[i].stop();
            }
            continueComponent(component, collection);
        }, length);
    }
    
    /**
     * 
     */
    function playComponentRest(instruction, component, collection) {
        var length = getBeatsPerLength(instruction, collection);
        setTimeout(function () {
            continueComponent(component, collection);
        }, length);
    }
    
    /** 
     * 
     */
    function playComponentRepeat(instruction, component, collection) {
        switch(instruction.action) {
            case "start":
                playComponentRepeatStart(instruction, component, collection);
                break;
            case "play":
                playComponentRepeatPlay(instruction, component, collection);
                break;
        }
        
        continueComponent(component, collection);
    }
    
    /**
     * 
     */
    function playComponentRepeatStart(instruction, component, collection) {
        component.repeatStack.push({
            "index": component.index,
            "repeated": 0
        });
    }
    
    /**
     * 
     */
    function playComponentRepeatPlay(instruction, component, collection) {
        var repeater = component.repeatStack[component.repeatStack.length - 1];
        
        if(repeater.repeated >= instruction.times) {
            component.repeatStack.pop();
            return;
        }
        
        component.index = repeater.index;
        repeater.repeated += 1;
    }
    
    /** 
     * 
     */
    function continueComponent(component, collection) {
        component.index += 1;
        
        if(component.index < component.instructions.length) {
            playComponent(component, collection);
        }
    }
    
    /**
     * Move to core?
     */
    function createPlayer(component, instruction, note) {
        return new component.generatorConstructor(component.settings, {
            "frequency": noteFrequencies[note]
        });
    }
    
    /**
     * 
     */
    self.playLocal = function () {
        
    };
    
    /**
     * 
     */
    self.playTheme = function () {
        
    };
    
    /**
     * 
     */
    self.pause = function () {
        
    };
    
    /**
     * 
     */
    self.pauseTheme = function () {
        
    };
    
    /**
     * 
     */
    self.resume = function () {
        
    };
    
    /**
     * 
     */
    self.resumeTheme = function () {
        
    };
    
    
    /* Core processing
    */
    
    /**
     * 
     */
    self.processLibrary = function (library) {
        var output = {},
            key;
            
        for(key in library) {
            output[key] = self.processAudio(library[key]);
        }
        
        return output;
    }
    
    /**
     * 
     */
    self.addAudio = function (key, settings) {
        library[key] = settings;
        processed[key] = self.processAudio(settings);
    };
    
    /**
     * 
     */
    self.processAudio = function (settings) {
        return new AudioContainer(settings);
    }
    
    /**
     * 
     */
    function AudioContainer(settings) {
        var components = this.components = {},
            i;
        
        for(i in settings.components) {
            components[i] = new AudioComponent(settings.components[i]);
        }
        
        this.beatsPer = {
            "minute": settings.bpm,
            "second": (settings.bpm / 60)
        };
        
        this.playing = false;
    };
    
    /**
     * 
     */
    function AudioComponent(settings) {
        this.generatorConstructor = generatorNames[settings.generator];
        this.settings = settings.settings;
        this.instructions = settings.instructions;
        this.timeout = undefined;
        this.index = 0;
        this.repeatStack = [];
    }
    
    
    /* Oscillator generator
    */
    
    /**
     * 
     */
    function OscillatorGenerator() {
        var settings, i;
        
        this.oscillator = context.createOscillator();
        this.oscillator.connect(context.destination);
        
        for(i = arguments.length - 1; i >= 0; i -= 1) {
            settings = arguments[i];
            if(typeof(settings.frequency) !== "undefined") {
                this.oscillator.frequency.value = settings.frequency;
            }
            if(typeof(settings.detune) !== "undefined") {
                this.oscillator.detune.value = settings.detune;
            }
            if(typeof(settings.type) !== "undefined") {
                this.oscillator.type = settings.type;
            }
        }
    }
    
    /**
     * 
     */
    OscillatorGenerator.prototype.play = function (time) {
        this.oscillator.start(time | 0);
    };

    /**
     * 
     */
    OscillatorGenerator.prototype.stop = function (time) {
        this.oscillator.stop(time | 0);
    };
    
    /**
     * 
     */
    OscillatorGenerator.prototype.getEngine = function () {
        return this.oscillator;
    };
    
    
    /* Noise generators
    */
    
    /**
     * 
     */
    var AbstractNoiseGenerator = {
        "preSetup": function (settings) {
            this.bufferSize = 2 * context.sampleRate;
            this.noiseBuffer = context.createBuffer(1, this.bufferSize, context.sampleRate);
            this.output = this.noiseBuffer.getChannelData(0);
            
            this.noise = context.createBufferSource();
            this.noise.buffer = this.noiseBuffer;
            this.noise.loop = true;
        },
        "postSetup": function (settings) {
            this.noise.connect(context.destination);
        },
        "play": function (time) {
            this.noise.start(time | 0);
        },
        "stop": function (time) {
            this.noise.stop(time | 0);
        },
        "getEngine": function () {
            return this.noise;
        }
    };
    
    /**
     * 
     */
    function WhiteNoiseGenerator(settings) {
        debugger;
        this.preSetup();
        
        for(var i = 0; i < this. output.length; i += 1) {
            this.output[i] = Math.random() * 2 - 1;
        }
        
        this.postSetup();
    }
    
    WhiteNoiseGenerator.prototype = AbstractNoiseGenerator;
    
    /**
     * 
     */
    function PinkNoiseGenerator(settings) {
        var b0 = 0.0,
            b1 = 0.0, 
            b2 = 0.0, 
            b3 = 0.0, 
            b4 = 0.0, 
            b5 = 0.0,
            b6 = 0.0,
            white, i;
        
        this.preSetup();

        for(i = 0; i < this.bufferSize; ++i) {
            white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            b6 = white * 0.115926;
            this.output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * .11;
        }

        this.postSetup();
    }
    
    PinkNoiseGenerator.prototype = AbstractNoiseGenerator;
    
    /**
     * 
     */
    function BrownianNoiseGenerator(settings) {
        var record = 0,
            i;
        
        this.preSetup();
        
        for(i = 0; i < this.bufferSize; ++i) {
            this.output[i] = (record + (Math.random() * .04 - 1)) / 1.02;
            record = this.output[i];
            this.output[i] *= 3.5;
        }
        
        this.postSetup();
    }
    
    BrownianNoiseGenerator.prototype = AbstractNoiseGenerator;
    
    
    self.reset(settings || {});
}