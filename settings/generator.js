FullScreenMario.prototype.settings.generator = {
    "possibilities": {
        
        "CertainTest": {
            "width": 24,
            "height": 24,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Goomba"
                }, {
                    "type": "Known",
                    "title": "Nothing"
                }, {
                    "type": "Known",
                    "title": "Koopa"
                }]
            }
        },

        "Test": {
            "width": 30,
            "height": 24,
            "contents": {
                "mode": "Random",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "Goomba"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "Beetle"
                }]
            }
        },

        "TestSub": {
            "width": 15,
            "height": 24,
            "contents": {
                "mode": "Random",
                "children": [{
                    "percent": 50,
                    "type": "Random",
                    "title": "Koopa"
                }, {
                    "percent": 50,
                    "type": "Random",
                    "title": "Beetle"
                }]
            }
        },

        // Enemy groups
        "EnemySmall": {
            "width": 8,
            "height": 12,
            "contents": {
                "mode": "Random",
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



        // Characters
        "Goomba": {
            "width": 80,
            "height": 8,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "type": "Known",
                    "title": "Goomba"
                }]
            }
        },
        "Koopa": {
            "width": 80,
            "height": 8,
            "contents": {
                "mode": "Random",
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
            "width": 80,
            "height": 8.5,
            "contents": {
                "mode": "Certain",
                "children": [{
                    "percent": 100,
                    "type": "Known",
                    "title": "Beetle"
                }]
            }
        },
        
        // Misc.
        "Nothing": {
            "width": 8,
            "height": 8,
            "contents": {
                "children": []
            }
        }
    }
};