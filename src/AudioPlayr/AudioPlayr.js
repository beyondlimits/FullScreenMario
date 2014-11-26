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
            "Oscillator": OscillationGenerator,
            "WhiteNoise": NoiseGenerator.bind(undefined, "White"),
            "PinkNoise": NoiseGenerator.bind(undefined, "Pink"),
            "BrownianNoise": NoiseGenerator.bind(undefined, "Brownian")
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
        
        currentSounds[key] = collection;
        collection.play();
    };
    
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
        return new AudioCollection(settings);
    }
    
    
    /* Audio collections
    */
    
    /**
     * 
     */
    function AudioCollection(settings) {
        var components = this.components = {},
            i;
        
        for(i in settings.components) {
            components[i] = new AudioComponent(settings.components[i], this);
        }
        
        this.beatLength = settings.bpm / 60 * 166.6666667;
        
        this.playing = false;
    };
    
    /**
     * 
     */
    AudioCollection.prototype.play = function () {
        if(this.playing) {
            this.stop();
        } else {
            this.playing = true;
        }
        
        for(var i in this.components) {
            this.components[i].play();
        }
    };
    
    /**
     * 
     */
    AudioCollection.prototype.pause = function () {
        if(!this.playing) {
            return;
        }
        
        for(var i in this.components) {
            this.components[i].pause();
        }
        
        this.playing = false;
    };
    
    /**
     * 
     */
    AudioCollection.prototype.stop = function () {
        if(!this.playing) {
            return;
        }
        
        for(var i in this.components) {
            this.components[i].stop();
        }
        
        this.playing = false;
    };
    
    
    /* Audio components
    */
    
    /**
     * 
     */
    function AudioComponent(settings, collection) {
        this.collection = collection;
        
        this.settings = settings.settings;
        this.instructions = settings.instructions;
        
        this.timeout = 0;
        this.index = 0;
        this.playing = false;
        
        this.players = [];
        this.repeatStack = [];
        
        this.generatorConstructor = generatorNames[settings.generator];
        this.createPlayerBound = this.createPlayer.bind(this);
        this.instructionContinueBound = this.instructionContinue.bind(this);
    }
    
    /**
     * 
     */
    AudioComponent.prototype.play = function () {
        var instruction = this.instructions[this.index];
        this.actions[instruction.type].call(this, instruction);
        this.playing = true;
    };
    
    /**
     * 
     */
    AudioComponent.prototype.pause = function () {
        
    };
    
    /**
     * 
     */
    AudioComponent.prototype.stop = function () {
        
    };
    
    /**
     * 
     */
    AudioComponent.prototype.createPlayer = function (note) {
        return new this.generatorConstructor(this.settings, {
            "frequency": note.constructor === Number
                ? note
                : noteFrequencies[note]
        });
    };
    
    /**
     * 
     */
    AudioComponent.prototype.instructionContinue = function (players) {
        for(var i = 0; i < this.players.length; i += 1) {
            this.players[i].stop();
        }
        
        this.index += 1;
        
        if(this.index < this.instructions.length) {
            this.play();
        }
    };
    
    /**
     * 
     */
    AudioComponent.prototype.instructionPlay = function (instruction) {
        var length = this.getInstructionLength(instruction),
            i;
        
        this.players = instruction.notes.map(this.createPlayerBound);
        
        for(i = 0; i < this.players.length; i += 1) {
            this.players[i].play();
        }
        
        this.timeout = setTimeout(this.instructionContinueBound, length);
    };
    
    /**
     * 
     */
    AudioComponent.prototype.instructionRest = function (instruction) {
        var length = this.getInstructionLength(instruction);
        
        this.players.length = 0;
        
        this.timeout = setTimeout(this.instructionContinueBound, length);
    };
    
    /**
     * 
     */
    AudioComponent.prototype.instructionRepeat = function (instruction) {
        switch(instruction.action) {
            case "start":
                this.instructionRepeatStart(instruction);
                break;
            case "back":
                this.instructionRepeatBack(instruction);
                break;
        }
    };
    
    /**
     * 
     */
    AudioComponent.prototype.instructionRepeatStart = function (instruction) {
        this.repeatStack.push({
            "index": this.index,
            "repeated": 0
        });
        this.timeout = setTimeout(this.instructionContinueBound);
    };
    
    /**
     * 
     */
    AudioComponent.prototype.instructionRepeatBack = function (instruction) {
        var repeater = this.repeatStack[this.repeatStack.length - 1];
        
        if(repeater.repeated >= instruction.times) {
            this.repeatStack.pop();
            return;
        }
        
        this.index = repeater.index;
        repeater.repeated += 1;
        
        this.timeout = setTimeout(this.instructionContinueBound);
    };
    
    /**
     * 
     */
    AudioComponent.prototype.getInstructionLength = function (instruction) {
        return instruction.length * this.collection.beatLength;
    };
    
    AudioComponent.prototype.actions = {
        "notes": AudioComponent.prototype.instructionPlay,
        "rest": AudioComponent.prototype.instructionRest,
        "repeat": AudioComponent.prototype.instructionRepeat
    };
    
    
    /* Oscillator generator
    */
    
    /**
     * 
     */
    function OscillationGenerator() {
        var settings, i;
        
        for(i = arguments.length - 1; i >= 0; i -= 1) {
            settings = arguments[i];
            if(typeof(settings.frequency) !== "undefined") {
                this.frequency = settings.frequency;
            }
            if(typeof(settings.detune) !== "undefined") {
                this.detune = settings.detune;
            }
            if(typeof(settings.type) !== "undefined") {
                this.type = settings.type;
            }
        }
        
        this.recreate();
    }
    
    OscillationGenerator.prototype.recreate = function () {
        this.oscillator = context.createOscillator();
        this.oscillator.connect(transforms[0]);
        
        if(this.frequency) {
            this.oscillator.frequency.value = this.frequency;
        }
        if(this.settings) {
            this.oscillator.detune.value = this.detune;
        }
        if(this.type) {
            this.oscillator.type = this.type;
        }
    };
    
    /**
     * 
     */
    OscillationGenerator.prototype.play = function (time) {
        this.oscillator.start(time | 0);
    };
    
    /**
     * 
     */
    OscillationGenerator.prototype.stop = function (time) {
        this.oscillator.stop(time | 0);
        this.recreate();
    };
    
    /**
     * 
     */
    OscillationGenerator.prototype.getEngine = function () {
        return this.oscillator;
    };
    
    
    /* Noise generators
    */
    
    /**
     * 
     */
    function NoiseGenerator(type) {
        this.type = type;
        this.recreate();
    }
    
    /**
     * 
     */
    NoiseGenerator.prototype.preSetup = function (settings) {
        this.bufferSize = 2 * context.sampleRate;
        this.noiseBuffer = context.createBuffer(1, this.bufferSize, context.sampleRate);
        this.output = this.noiseBuffer.getChannelData(0);
        
        this.noise = context.createBufferSource();
        this.noise.buffer = this.noiseBuffer;
        this.noise.loop = true;
    };
    
    /**
     * 
     */
    NoiseGenerator.prototype.postSetup = function (settings) {
        this.noise.connect(transforms[0])
    };
    
    /**
     * 
     */
    NoiseGenerator.prototype.play = function () {
        this.noise.start();
    };
    
    /**
     * 
     */
    NoiseGenerator.prototype.stop = function () {
        this.noise.stop();
        this.recreate(this.type);
    };
    
    /**
     * 
     */
    NoiseGenerator.prototype.recreate = function () {
        this.preSetup();
        this.generators[this.type].call(this, settings);
        this.postSetup();
    };
    
    /**
     * 
     */
    NoiseGenerator.prototype.getEngine = function () {
        return this.noise;
    };
    
    NoiseGenerator.prototype.generators = {
        /**
         * 
         */
        "white": function () {
            for(var i = 0; i < this. output.length; i += 1) {
                this.output[i] = Math.random() * 2 - 1;
            }
        },
        
        /**
         * 
         */
        "pink": function () {
            var b0 = 0.0,
                b1 = 0.0,
                b2 = 0.0,
                b3 = 0.0,
                b4 = 0.0,
                b5 = 0.0,
                b6 = 0.0,
                white, i;
            
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
        },
        
        /**
         * 
         */
        "brownian": function () {
            var record = 0,
                i;
            
            for(i = 0; i < this.bufferSize; ++i) {
                this.output[i] = (record + (Math.random() * .04 - 1)) / 1.02;
                record = this.output[i];
                this.output[i] *= 3.5;
            }
        }
    };
    
    
    self.reset(settings || {});
}