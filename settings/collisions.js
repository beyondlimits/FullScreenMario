FullScreenMario.prototype.collisions = {
    "group_names": ["Solid", "Character", "Scenery", "Text"],
    "group_types": "Array",
    "hit_checks": {
        "Character": {
            "Solid": FullScreenMario.prototype.isCharacterTouchingSolid,
            "Character": FullScreenMario.prototype.isThingTouchingThing
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