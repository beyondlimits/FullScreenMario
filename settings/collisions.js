FullScreenMario.prototype.settings.collisions = {
    "groupNames": ["Solid", "Character", "Scenery", "Text"],
    "groupTypes": "Array",
    "hit_checks": {
        "Character": {
            "Character": FullScreenMario.prototype.isCharacterTouchingCharacter,
            "Solid": FullScreenMario.prototype.isCharacterTouchingSolid
        }
    },
    "hit_functions": {
        "Character": {
            "Solid": FullScreenMario.prototype.hitCharacterSolid,
            "Character": FullScreenMario.prototype.hitCharacterCharacter
        }
    },
    "global_checks": {
        "Character": {
            "can_collide": FullScreenMario.prototype.canThingCollide,
        },
        "Solid": {
            "can_collide": FullScreenMario.prototype.canThingCollide
        }
    }
};