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
                "spacing": [{
                    "percent": 50,
                    "value": {
                        "min": 0,
                        "max": 16,
                        "units": 8
                    }
                }, {
                    "percent": 50,
                    "value": {
                        "min": 24,
                        "max": 40,
                        "units": 8
                    }
                }],
                "children": [{
                    "percent": 100, // 25,
                    "type": "Random",
                    "title": "LandObstacleGroupSingleStory"
                // }, {
                    // "percent": 25,
                    // "type": "Random",
                    // "title": "LandObstacleGroupDoubleStory"
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
                    "title": "SolidSmall"
                }]
            }
        },
        "LandObstacleGroupDoubleStory": { // !
            "width": 40,
            "height": 80,
            "contents": {
                "mode": "Certain",
                "direction": "top"
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
                    "percent": 50,
                    "type": "Random",
                    "title": "Brick"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "Block"
                }, {
                    "percent": 24,
                    "type": "Random",
                    "title": "Nothing"
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