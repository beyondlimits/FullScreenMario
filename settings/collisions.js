FullScreenMario.prototype.collisions = {
    "group_names": ["Solid", "Character", "Scenery", "Text"],
    "group_types": "Array",
    "hit_checks": {
        "Character": {
            "Solid": FullScreenMario.prototype.characterTouchesSolid,
            "Character": FullScreenMario.prototype.characterTouchesCharacter
        }
    },
    "hit_functions": {
        "Character": {
            "Solid": FullScreenMario.prototype.characterHitsSolid,
            "Character": FullScreenMario.prototype.characterHitsCharacter
        }
    },
    "global_checks": {
        "Character": {
            "can_collide": FullScreenMario.prototype.thingCanCollide,
        },
        "Solid": {
            "can_collide": FullScreenMario.prototype.thingCanCollide
        }
    }
};