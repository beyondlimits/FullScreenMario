FullScreenMario.prototype.settings.generator = {
    "possibilities": {



        // Enemy groups
        "EnemySmall": {
            "width": "child",
            "height": "child",
            "children": {
                "spacing": 2,
                "possibilities": [{
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
        "EnemyMedium": {
            "width": "child",
            "height": "child",
            "children": {
                "spacing": 4,
                "possibilities": [{
                    "percent": 25,
                    "type": "Random",
                    "title": "Beetle"
                }, {
                    "percent": 15,
                    "type": "Random",
                    "title": "Cannon"
                }/*, {
                    // ...
                }*/]
            }
        },
        "EnemyLarge": {
            
        },
        "EnemyGeneral": {
            "width": "child",
            "height": "child",
            "children": {
                "possibilities": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "EnemySmall"
                }, {
                    "percent": 25,
                    "type": "Random",
                    "title": "EnemyMedium"
                }, {
                    "percent": 10,
                    "type": "Random",
                    "title": "EnemyLarge"
                }, {
                    "percent": 15,
                    "type": "Nothing"
                }]
            }
        },
        
        
        
        // Characters
        "Goomba": {
            "width": 8,
            "height": 8,
            "certainty": {
                "type": "Thing",
                "title": "Goomba"
            }
        },
        "Koopa": {
            "width": 8,
            "height": 8,
            "certainty": {
                "type": "Thing",
                "title": "Koopa",
                "arguments": [{
                    "percent": 30
                }, {
                    "percent": 30,
                    "values": {
                        "smart": true
                    }
                }, {
                    "percent": 20,
                    "values": {
                        "jumping": true
                    }
                }, {
                    "percent": 20,
                    "values": {
                        "smart": true,
                        "jumping": true
                    }
                }]
            }
        },
        "Beetle": {
            "width": 8,
            "height": 8.5,
            "certainty": {
                "type": "Thing",
                "title": "Beetle"
            }
        },
        
        // Solids
        "Cannon": {
            "width": 8,
            "height": "child",
            "children": {
                "snap": "bottom",
                "possibilities": [{
                    "percent": 70,
                    "type": "Thing",
                    "title": "Cannon",
                    "arguments": [{
                        "percent": 50,
                        "values": {
                            "height": 24
                        }
                    }, {
                        "percent": 30,
                        "values": {
                            "height": 16
                        }
                    }, {
                        "percent": 20,
                        "values": {
                            "height": 8
                        }
                    }]
                }, {
                    "percent": 30,
                    "type": "Random",
                    "title": "CannonStack"
                }]
            }
        },
        "CannonStack": {
            "width": 8,
            // "height": "
        }
    }
};