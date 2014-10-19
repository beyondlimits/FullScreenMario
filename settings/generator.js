FullScreenMario.prototype.settings.generator = {
    "possibilities": {
        
        /* Whole areas
        */
        
        "Overworld": {
            "height": 80,
            "width": 2100,
            "contents": {
                "mode": "Certain",
                "direction": "right",
                "children": [{
                    "type": "Random",
                    "title": "OverworldStart"
                }, {
                    "type": "Random",
                    "title": "OverworldRandomization"
                }]
            }
        },
        "OverworldStart": {
            "height": 80,
            "width": 112,
            "contents": {
                "mode": "Certain",
                "direction": "top",
                "children": [{
                    "type": "Random",
                    "title": "Floor"
                }]
            }
        },
        "OverworldRandomization": {
            "height": 80,
            "width": 1988,
            "contents": {
                "mode": "Random",
                "direction": "right",
                "spacing": {
                    "min": 8,
                    "max": 32,
                    "units": 8
                },
                "children": [{
                    "percent": 100,
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
                    "percent": 30,
                    "type": "Random",
                    "title": "LandObstacleGroupSingleStory"
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "LandObstacleGroupDoubleStory"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "LandObstacleGroupPipeSmall"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "LandObstacleGroupPipeMedium"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "LandObstacleGroupDifficult"
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
                    "title": "SolidSmallSpotty"
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
                    "percent": 50,
                    "value": 4
                }, {
                    "percent": 25,
                    "value": 8
                }, {
                    "percent": 25,
                    "value": 25
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