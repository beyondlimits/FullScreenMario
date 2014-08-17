FullScreenMario.prototype.settings.collisions = {
    "group_names": ["Solid", "Character", "Scenery", "Text"],
    "group_types": "Array",
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