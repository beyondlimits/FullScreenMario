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
        
        // The AudioContext this is streaming to
        context,
        
        // The transforms being applied to the AudioContext output
        transforms,
        
        // The final transform, which is a gainNode to control volume
        volumeControl,
        
        // ???
        library,
        
        // ???
        collections,
        
        // Currently playing sounds
        currentSounds,
        
        // Lookup table of String note names to their frequency Numbers
        noteFrequencies,
        
        // Storage container for settings like volume and muted status
        StatsHolder,
        
        // Lookup table of Strings to generator Functions
        generatorNames = {
            "Oscillator": OscillatorGenerator,
            "WhiteNoise": WhiteNoiseGenerator,
            "PinkNoise": PinkNoiseGenerator,
            "BrownianNoise": BrownianNoiseGenerator
        },
        
        // Lookup table for playComponent actions
        playComponentActions = {
            "notes": playComponentNotes,
            "rest": playComponentRest,
            "repeat": playComponentRepeat
        };
    
    /**
     * 
     */
    self.reset = function (settings) {
        context = new AudioContext();
        
        noteFrequencies = settings.noteFrequencies;
        
        resetTransforms(settings.transforms || []);
        
        if(settings.library) {
            library = settings.library;
            collections = self.processLibrary(library);
        } else {
            library = {};
            collections = {};
        }
        
        currentSounds = {};
        
        StatsHolder = new StatsHoldr(settings.statistics);
        
        self.setVolume(StatsHolder.get("volume"));
        self.setMuted(StatsHolder.get("muted"));
    };
    
    /**
     * 
     */
    function resetTransforms(transformsRaw) {
        var i;
        
        // The internal transforms are a copy of the given transforms...
        transforms = transformsRaw.slice();
        
        // ...except also with a volumeControl at the end
        volumeControl = context.createGain();
        transforms.push(volumeControl);
        
        // Each transform then points to the next one...
        for(i = 0; i < transforms.length - 1; i += 1) {
            transforms[i].connect(transforms[i + 1].destination);
        }
        
        // ...which points to the final context
        transforms[i].connect(context.destination);
    }
    
    
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
    };
    
    /**
     *
     */
    self.getCurrentSounds = function () {
        return currentSounds;
    };
    
    
    /* Playback modifiers
    */
    
    /**
     * 
     */
    self.setVolume = function (volume) {
        volumeControl.gain.value = volume;
        StatsHolder.set("volume", volume);
    };
    
    /**
     * 
     */
    self.getVolume = function () {
        return StatsHolder.get("volume");
    };
    
    /**
     * 
     */
    self.setMuted = function (muted) {
        if(muted) {
            volumeControl.gain.value = 0;
        } else {
            volumeControl.gain.value = self.getVolume();
        }
        
        StatsHolder.set("muted", muted);
    }
    
    
    /* Playback
    */
    
    /**
     * 
     */
    self.play = function (key) {
        var collection = collections[key];
        
        if(!collection) {
            throw new Error("Unknown key given to AudioPlayr.play: '" + key + "'.");
        }
        
        currentSounds[key] = playCollection(collection);
    };
    
    /**
     * 
     */
    function playCollection(collection) {
        var components = collection.components,
            component, instructions, i;
        
        for(i in components) {
            playComponent(components[i], collection);
        }
    }
    
    /**
     * Move to core?
     * doesn't check for rest.
     */
    function playComponent(component, collection) {
        var instruction = component.instructions[component.index];
        playComponentActions[instruction.type](instruction, component, collection);
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
            "frequency": note.constructor === String ? noteFrequencies[note] : note
        });
    }
    
    /**
     * 
     */
    self.pause = function () {
        
    };
    
    /**
     * 
     */
    self.resume = function () {
        
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
        this.repeatStack = [];
        this.index = 0;
        this.playing = false;
    }
    
    
    /* Oscillator generator
    */
    
    /**
     * 
     */
    function OscillatorGenerator() {
        var settings, i;
        
        this.oscillator = context.createOscillator();
        this.oscillator.connect(transforms[0])
        
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
            this.noise.connect(transforms[0])
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