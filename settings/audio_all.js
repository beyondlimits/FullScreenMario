(function (tracks) {
    var proto = FullScreenMario.prototype.settings.audio.library = {},
        i;
    
    for(i = 0; i < tracks.length; i += 1) {
        proto[tracks[i].name] = tracks[i];
    }
})([
    {
        "name": "Overworld",
        "bpm": 200,
        "components": {
            "RightHand": {
                "generator": "Oscillator",
                "settings": {
                    "type": "square"
                },
                "instructions": [{
                    "type": "notes",
                    "length": .25,
                    "notes": ["E5", "F#4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["E5", "F#4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["E5", "F#4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["C5", "F#4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["E5", "F#4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["G5", "B4", "G4"]
                }, {
                    "type": "rest",
                    "length": .75
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["G4"]
                }, {
                    "type": "rest",
                    "length": .75
                }, {
                   "type": "repeat",
                   "action": "start"
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["C5", "E4"]
                }, {
                    "type": "rest",
                    "length": .5
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["G4", "C4"]
                }, {
                    "type": "rest",
                    "length": .5
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["E4", "G3"]
                }, {
                    "type": "rest",
                    "length": .5
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["A4", "C4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["B4", "D4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["Bb4", "Db4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["A4", "C4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": 1 / 3,
                    "notes": ["G4", "C4"]
                }, {
                    "type": "notes",
                    "length": 1 / 3,
                    "notes": ["E5", "G4"]
                }, {
                    "type": "notes",
                    "length": 1 / 3,
                    "notes": ["G5", "B4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["A5", "C5"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["F5", "A4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["G5", "B4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["E5", "G4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["C5", "E4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["D5", "F4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["B4", "D4"]
                }, {
                    "type": "rest",
                    "length": .5
                }, {
                    "type": "repeat",
                    "action": "play",
                    "times": 1
                }, {
                    "type": "rest",
                    "length": .5
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["G5", "E5"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["Gb5", "Eb5"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["F5", "D5"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["D#5", "B4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["E5", "C5"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["G#4", "E4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["A4", "F4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["C5", "A4"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["A4", "C4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["C5", "E4"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["D5", "F4"]
                }]
            },
            "LeftHand": {
                "generator": "Oscillator",
                "settings": {
                    "type": "triangle"
                },
                "instructions": [{
                    "type": "notes",
                    "length": .25,
                    "notes": ["D3"]
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["D3"]
                }, {
                    "type": "rest",
                    "length": .25
                }, {
                    "type": "notes",
                    "length": .25,
                    "notes": ["D3"]
                }]
            },
            // "Beat": {
                // "generator": "WhiteNoise",
                // "instructions": [{
                    // "type": "rest",
                    // "length": 1
                // }, /*
                 // ...
                // */ {
                    // "type": "repeat",
                    // "instructions": [/*
                            // ...
                    // */]
                // }]
            // }
        }
    }
]);