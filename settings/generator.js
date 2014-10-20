FullScreenMario.prototype.settings.generator = {
    "possibilities": {
        
        /* Whole areas
        */
        
        "Overworld": {
            "height": 80,
            "width": 2800,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "OverworldStart"
                }, {
                    "type": "Random",
                    "title": "OverworldBody"
                }]
            }
        },
        "OverworldStart": {
            "height": 80,
            "width": 112,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": -8,
                "children": [{
                    "type": "Random",
                    "title": "Floor"
                }, {
                    "type": "Random",
                    "title": "OverworldScenery"
                }]
            }
        },
        "OverworldBody": {
            "height": 80,
            "width": 2688,
            "contents": {
                "mode": "Multiple",
                "children": [{
                    "type": "Random",
                    "title": "OverworldRandomization"
                }, {
                    "type": "Random",
                    "title": "OverworldClouds"
                }]
            }
        },
        "OverworldRandomization": {
            "height": 80,
            "width": 2688,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 8,
                    "max": 32,
                    "units": 8
                },
                "children": [{
                    "percent": 60,
                    "type": "Random",
                    "title": "OverworldClump"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "OverworldBetweenSpotty"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "OverworldBetweenFloating"
                // }, {
                    // "percent": 10,
                    // "type": "Random",
                    // "title": "OverworldBetweenWateryBridge"
                }]
            }
        },
        "OverworldClump": {
            "height": 80,
            "width": 160,
            "contents": {
                "mode": "Multiple",
                "children": [{
                    "type": "Random",
                    "title": "OverworldScenery"
                }, {
                    "type": "Random",
                    "title": "OverworldLandArea"
                }]
            }
        },
        "OverworldLandArea": {
            "height": 80,
            "width": 160,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Floor"
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroup"
                }]
            }
        },
        
        
        /* Areas between floors
        */
        
        "OverworldBetweenSpotty": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "OverworldBetweenSpot",
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "OverworldBetweenSpot": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Floor"
                }, {
                    "type": "Random",
                    "title": "OverworldBetweenSpotScenery"
                }]
            }
        },
        "OverworldBetweenFloating": {
            "width": 112,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "OverworldBetweenFloat"
                }]
            }
        },
        "OverworldBetweenFloat": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Stone"
                }]
            }
        },
        "OverworldBetweenWateryBridge": {
            "width": 168,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "OverworldBetweenFloating"
                }]
            }
        },
        
        
        /* General obstacles
        */
        
        "LandObstacleGroup": {
            "width": 40,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 48,
                    "units": 8
                },
                "children": [{
                    "percent": 25,
                    "type": "Random",
                    "title": "LandObstacleGroupEnemies"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "LandObstacleGroupSingleStory"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "LandObstacleGroupDoubleStorySpotty"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "LandObstacleGroupDoubleStory"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "LandObstacleGroupPipeSmall"
                }, {
                    "percent": 5,
                    "type": "Random",
                    "title": "LandObstacleGroupPipeMedium"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "LandObstacleGroupDifficult"
                }]
            }
        },
        "LandObstacleGroupEnemies": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": 4,
                "children": [{
                    "percent": 90,
                    "type": "Random",
                    "title": "EnemySmall"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "LandObstacleGroupSingleStory": {
            "width": 40,
            "height": 40,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "EnemySmall"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "SolidSmallSpotty"
                }]
            }
        },
        "LandObstacleGroupDoubleStorySpotty": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "EnemySmall"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "SolidSmall"
                }, {
                    "type": "Random",
                    "title": "EnemySmall"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "SolidSmallSpotty"
                }]
            }
        },
        "LandObstacleGroupDoubleStory": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "EnemySmall"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "SolidSmall"
                }, {
                    "type": "Random",
                    "title": "EnemySmall"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "SolidSmall"
                }, {
                    "type": "Random",
                    "title": "EnemySmall"
                }]
            }
        },
        "LandObstacleGroupDifficult": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "percent": 500,
                    "type": "Random",
                    "title": "LandObstacleGroupCannon"
                // }, {
                    // "percent": 50,
                    // "type": "Random",
                    // "title": "HammerBroSolo"
                }]
            }
        },
        "LandObstacleGroupCannon": {
            "width": 24,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroupCannonThin"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "LandObstacleGroupCannonThin": {
            "width": 8,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Cannon"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "stretch": {
                        "height": true
                    }
                }]
            }
        },
        "LandObstacleGroupDifficultSmall": {
            "width": 48,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "padding": 8,
                "children": [{
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "type": "Random",
                    "title": "LandObstacleGroupDifficult"
                }, {
                    "type": "Random",
                    "title": "Nothing"
                }]
            }
        },
        "LandObstacleGroupPipeSmall": {
            "width": 40,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 8,
                    "units": 8
                },
                "children": [{
                    "percent": 100,
                    "type": "Random",
                    "title": "Pipe"
                }]
            }
        },
        "LandObstacleGroupPipeMedium": {
            "width": 64,
            "height": 80,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 0,
                    "max": 16,
                    "units": 8
                },
                "children": [{
                    "percent": 100,
                    "type": "Random",
                    "title": "Pipe"
                }]
            }
        },

        
        /* Enemy groups
        */
        
        "EnemySmall": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": [{
                    "percent": 75,
                    "value": 4
                }, {
                    "percent": 25,
                    "value": 8
                }],
                "children": [{
                    "percent": 45,
                    "type": "Random",
                    "title": "Goomba"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "Koopa"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Beetle"
                }]
            }
        },
        
        
        /* Solid groups
        */
        
        "SolidSmall": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 80,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Block"
                }]
            }
        },
        "SolidSmallSpotty": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "Nothing"
                }, {
                    "percent": 20,
                    "type": "Random",
                    "title": "Block"
                }]
            }
        },
        "Cannon": {
            "width": 8,
            "height": 32,
            "contents": {
                "mode": "Random",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "percent": 20,
                    "type": "Random",
                    "title": "CannonSmall"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "CannonMedium"
                }, {
                    "percent": 40,
                    "type": "Random",
                    "title": "CannonLarge"
                }]
            }
        },
        "CannonStack": {
            "width": 8,
            "height": 32,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Cannon"
                }, {
                    "type": "Random",
                    "title": "Cannon"
                }]
            }
        },
        
        /* Scenery groups
        */
        
        "OverworldScenery": {
            "height": 80,
            "width": 160,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 8
                    }
                }, {
                    "type": "Random",
                    "title": "OverworldLandScenery"
                }, {
                    "type": "Random",
                    "title": "Nothing",
                    "sizing": {
                        "height": 32
                    }
                }]
            }
        },
        "OverworldLandScenery": {
            "height": 40,
            "width": 160,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "spacing": {
                    "min": -4,
                    "max": 40,
                    "units": 4
                },
                "children": [{
                    "percent": 15,
                    "type": "Random",
                    "title": "Bush1"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Bush2"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Bush3"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "Fence"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "HillSmall"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "HillLarge"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "PlantSmall"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "PlantLarge"
                }]
            }
        },
        "OverworldClouds": {
            "height": 56,
            "width": 2688,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "top",
                "spacing": {
                    "min": 8,
                    "max": 64,
                    "units": 8
                },
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "CloudClump1"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "CloudClump2"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "CloudClump3"
                }]
            }
        },
        "CloudClump1": {
            "height": 56,
            "width": 16,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                }, {
                    "type": "Random",
                    "title": "Cloud1"
                }]
            }
        },
        "CloudClump2": {
            "height": 56,
            "width": 24,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                }, {
                    "type": "Random",
                    "title": "Cloud2"
                }]
            }
        },
        "CloudClump3": {
            "height": 56,
            "width": 32,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "spacing": {
                    "min": 16,
                    "max": 40,
                    "units": 8
                },
                "children": [{
                    "type": "Random",
                    "title": "Nothing",
                }, {
                    "type": "Random",
                    "title": "Cloud3"
                }]
            }
        },
        "Cloud": {
            "width": 32,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "limit": 1,
                "children": [{
                    "percent": 40,
                    "type": "Random",
                    "title": "Cloud1"
                }, {
                    "percent": 35,
                    "type": "Random",
                    "title": "Cloud2"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "Cloud3"
                }]
            }
        },
        "OverworldBetweenSpotScenery": {
            "width": 8,
            "height": 23,
            "contents": {
                "mode": "Random",
                "direction": "top",
                "snap": "bottom",
                "children": [{
                    "percent": 70,
                    "type": "Random",
                    "title": "Nothing",
                    "stretch": {
                        "height": true
                    }
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "PlantSmall"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "PlantLarge"
                }]
            }
        },
        
        
        /* Characters
        */
        
        "Goomba": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Goomba"
                }]
            }
        },
        "Koopa": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "percent": 30,
                    "type": "Known",
                    "title": "Koopa",
                }, {
                    "percent": 30,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "smart": true
                    }
                }, {
                    "percent": 20,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "jumping": true
                    }
                }, {
                    "percent": 20,
                    "type": "Known",
                    "title": "Koopa",
                    "arguments": {
                        "smart": true,
                        "jumping": true
                    }
                }]
            }
        },
        "Beetle": {
            "width": 8,
            "height": 8.5,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Beetle"
                }]
            }
        },
        
        
        /* Solids
        */
        
        "Brick": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "percent": 85,
                    "type": "Known",
                    "title": "Brick"
                }, {
                    "percent": 10,
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "contents": "Coin"
                    }
                }, {
                    "percent": 5,
                    "type": "Known",
                    "title": "Brick",
                    "arguments": {
                        "contents": "Star"
                    }
                }]
            }
        },
        "Block": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "percent": 90,
                    "type": "Known",
                    "title": "Block"
                }, {
                    "percent": 9,
                    "type": "Known",
                    "title": "Block",
                    "arguments": {
                        "contents": "Mushroom"
                    }
                }, {
                    "percent": 1,
                    "type": "Known",
                    "title": "Block",
                    "arguments": {
                        "contents": "Mushroom1Up",
                        "hidden": true
                    }
                }]
            }
        },
        "Pipe": {
            "width": 16,
            "height": 32,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "snap": "bottom",
                "children": [{
                    "percent": 50,
                    "type": "Known",
                    "title": "Pipe",
                    "snap": "bottom",
                    "sizing": {
                        "height": 24
                    },
                    "arguments": {
                        // "macro": "Pipe",
                        "height": 24
                    }
                }, {
                    "percent": 50,
                    "type": "Known",
                    "title": "Pipe",
                    "stretch": {
                        "height": true
                    },
                    "arguments": {
                        // "macro": "Pipe",
                        // "piranha": true
                    }
                }]
            }
        },
        "CannonSmall": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Final",
                    "source": "CannonSmall",
                    "title": "Cannon",
                }]
            }
        },
        "CannonMedium": {
            "width": 8,
            "height": 16,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Final",
                    "source": "CannonMedium",
                    "title": "Cannon",
                    "arguments": {
                        "height": 16
                    }
                }]
            }
        },
        "CannonLarge": {
            "width": 8,
            "height": 24,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Final",
                    "source": "CannonLarge",
                    "title": "Cannon",
                    "arguments": {
                        "height": 24 
                    }
                }]
            }
        },
        "Floor": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "snap": "top",
                "children": [{
                    "type": "Known",
                    "title": "Floor",
                    "stretch": {
                        "width": true,
                    },
                    "arguments": {
                        "height": "Infinity"
                    }
                }]
            }
        },
        "Stone": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Known",
                    "title": "Stone"
                }]
            }
        },
        
        
        /* Scenery
        */
        
        "Bush1": {
            "width": 16,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Bush1"
                }]
            }
        },
        "Bush2": {
            "width": 24,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Bush2"
                }]
            }
        },
        "Bush3": {
            "width": 32,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Bush3"
                }]
            }
        },
        "Cloud1": {
            "width": 16,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Cloud1"
                }]
            }
        },
        "Cloud2": {
            "width": 24,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Cloud2"
                }]
            }
        },
        "Cloud3": {
            "width": 32,
            "height": 12,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Cloud3"
                }]
            }
        },
        "Fence": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "Fence"
                }]
            }
        },
        "HillSmall": {
            "width": 24,
            "height": 9.5,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "HillSmall"
                }]
            }
        },
        "HillLarge": {
            "width": 40,
            "height": 17.5,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "HillLarge"
                }]
            }
        },
        "PlantSmall": {
            "width": 7,
            "height": 15,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "PlantSmall"
                }]
            }
        },
        "PlantLarge": {
            "width": 8,
            "height": 23,
            "contents": {
                "mode": "Certain",
                "snap": "bottom",
                "children": [{
                    "type": "Known",
                    "title": "PlantLarge"
                }]
            }
        },
        
        
        /* Misc.
        */
        
        "Nothing": {
            "width": 8,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "children": []
            }
        }
    }
};