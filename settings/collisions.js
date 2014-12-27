FullScreenMario.prototype.settings.collisions = {
    "groupNames": ["Solid", "Character", "Scenery", "Text"],
    "groupTypes": "Array",
    "globalCheckGenerators": {
        "Character": FullScreenMario.prototype.generateCanThingCollide,
        "Solid": FullScreenMario.prototype.generateCanThingCollide
    },
    "hitCheckGenerators": {
        "Character": {
            "Character": FullScreenMario.prototype.generateIsCharacterTouchingCharacter,
            "Solid": FullScreenMario.prototype.generateIsCharacterTouchingSolid
        }
    },
    "hitFunctionGenerators": {
        "Character": {
            "Solid": FullScreenMario.prototype.generateHitCharacterSolid,
            "Character": FullScreenMario.prototype.generateHitCharacterCharacter
        }
    }
};