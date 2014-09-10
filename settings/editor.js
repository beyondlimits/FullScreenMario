(function (things) {
	FullScreenMario.prototype.settings.editor = {
		"blocksize": FullScreenMario.unitsize * 4,
		"map_default": {
			"name": "New Map",
			"locations": [
				{ "entry": "Plain" }
			],
			"areas": [
				{
					"setting": "Overworld",
					"creation": [
						{ "location": "0" },
						{ "thing": "Floor", "x": 0, "y": 0, "width": 128 }
					]
				}
			]
		},
		"map_setting_default": "Overworld",
		"map_entry_default": "Plain",
		"things": things,
        "thing_groups": ["Character", "Solid", "Scenery"],
		"thing_keys": (function () {
			var keys = [];
			Object.keys(things).forEach(function (group) {
				keys.push.apply(keys, Object.keys(things[group]));
			});
			return keys;
		})(),
		"macros": {
			"Fill": {
				"description": "Place a bunch of Things at once, as a grid.",
				"options": {
					"thing": "Everything",
					"xnum": "Number",
					"ynum": "Number",
					"xwidth": "Number",
					"ywidth": "Number"
				}
			},
			"Pattern": {
				"description": "Fill one of the preset Scenery background patterns.",
				"options": {
					"Pattern": [
						"BackRegular", "BackCloud", "BackFence", "BackFenceMin", "BackFenceMin2", "BackFenceMin3"
					],
					"repeat": "Number"
				}
			},
			"Floor": {
				"description": "Place a floor of infinite height.",
				"options": {
					"width": 8
				}
			},
			"Pipe": {
				"description": "Add a pipe with the option for piranhas and moving to locations.",
				"options": {
					"height": 8,
					"piranha": "Boolean",
					"transport": "Location",
					"entrance": "Location"
				}
			},
			"Tree": {
				"description": "Add a tree to the map.",
				"options": {
					"width": 8
				}
			},
			"Shroom": {
				"function": "macroShroom",
				"description": "Add a mushroom tree to the map.",
				"options": {
					"width": 8
				}
			},
			"Water": {
				"function": "macroWater",
				"description": "Fill water of infinite height.",
				"options": {
					"width": 4
				}
			},
			"CastleSmall": {
				"description": "Add a one-story castle to the map."
			},
			"CastleLarge": {
				"description": "Add a two-story castle to the map."
			},
			"Ceiling": {
				"description": "Add an Underworld-style ceiling of Bricks.",
				"options": {
					"width": "Number"
				}
			},
			"Bridge": {
				"description": "Create a bridge, complete with stone columns.",
				"options": {
					"width": 8,
					"start": "Boolean",
					"end": "Boolean"
				}
			},
			"PlatformGenerator": {
				"description": "Add a columnn of infinitely generated platforms.",
				"options": {
					"width": 8
				}
			},
			"StartInsideCastle": {
				"description": "Add the castle stones similar to typical Castles.",
				"options": {
					"width": 8
				}
			},
			"EndOutsideCastle": {
				"description": "End the map off with an outdoor flag and Castle."
			},
			"EndInsideCastle": {
				"description": "End the map off with an indoor bridge, Bowser, and Toad."
			}
		}
	};
	
})({
	"Characters": {
		"Goomba": undefined,
		"Koopa": {
			"smart": "Boolean",
			"jumping": "Boolean",
			"flying": "Boolean"
		},
		"Beetle": undefined,
		"Piranha": {
			"evil": "Boolean"
		},
		"Blooper": undefined,
		"CheepCheep": {
			"smart": "Boolean"
		},
		"Podoboo": undefined,
		"Lakitu": undefined,
		"HammerBro": undefined,
		"Bowser": {
			"contents": [ 
				"Gooma", "Koopa", "HammerBro", "Bowser"
			]
		}
	},
	"Items": {
		"Mushroom": undefined,
		"Mushroom1Up": undefined,
		"MushroomDeathly": undefined,
		"FireFlower": undefined,
		"Star": undefined,
		"Shell": {
			"smart": "Boolean"
		},
		"BeetleShell": undefined,
		"Coin": undefined
	},
	"Solids": {
		"Block": {
			"contents": [
				"Coin", "Mushroom", "Star", "Mushroom1Up", "MushroomDeathly"
			],
			"hidden": "Boolean"
		},
		"Brick": {
			"contents": [
				"Coin", "Mushroom", "Star", "Mushroom1Up", "MushroomDeathly"
			]
		},
		"Pipe": {
			"height": "Number"
		},
		"PipeHorizontal": {
			"width": "Number",
		},
		"PipeVertical": {
			"height": "Number"
		},
		"Platform": {
			"width": "Number"
		},
		"Stone": {
			"Width": "Number",
			"height": "Number"
		},
		"Cannon": {
			"height": "Number"
		},
		"Springboard": {
			"height": "Number"
		},
		"Floor": {
			"width": 8,
			"height": 8
		},
		"CastleBlock": {
			"fireballs": "Number"
		},
		"CastleBridge": {
			"width": "Number"
		},
		"Coral": {
			"width": "Number",
			"height": "Number"
		}
	},
	"Scenery": {
		"Axe": undefined,
		"BrickPlain": undefined,
		"Bush1": undefined,
		"Bush2": undefined,
		"Bush3": undefined,
		"Cloud1": undefined,
		"Cloud2": undefined,
		"Cloud3": undefined,
		"Fence": undefined,
		"HillSmall": undefined,
		"HillLarge": undefined,
		"PlantSmall": undefined,
		"PlantLarge": undefined,
		"Railing": undefined,
		"Water": undefined
	}
});