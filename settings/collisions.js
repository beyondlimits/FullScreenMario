FullScreenMario.prototype.settings.collisions = {
    "groupNames": ["Solid", "Character", "Scenery", "Text"],
    "groupTypes": "Array",
    "hitChecks": {
        "Character": {
            "Character": FullScreenMario.prototype.isCharacterTouchingCharacter,
            "Solid": FullScreenMario.prototype.isCharacterTouchingSolid
        }
    },
    "hitFunctions": {
        "Character": {
            "Solid": FullScreenMario.prototype.hitCharacterSolid,
            "Character": FullScreenMario.prototype.hitCharacterCharacter
        }
    },
    "globalChecks": {
        "Character": {
            "canCollide": FullScreenMario.prototype.canThingCollide,
        },
        "Solid": {
            "canCollide": FullScreenMario.prototype.canThingCollide
        }
    }
};