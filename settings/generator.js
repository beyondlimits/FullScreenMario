FullScreenMario.prototype.settings.generator = {
    "possibilities": {

        "Test": {
            "width": 30,
            "height": 24,
            "children": {
                "choices": [{
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
            "children": {
                "choices": [{
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
            "children": {
                "choices": [{
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
            "width": 8,
            "height": 8,
            "children": {
                "choices": [{
                    "percent": 100,
                    "type": "Known",
                    "title": "Goomba"
                }]
            }
        },
        "Koopa": {
            "width": 8,
            "height": 8,
            "children": {
                "choices": [{
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
            "children": {
                "choices": [{
                    "percent": 100,
                    "type": "Known",
                    "title": "Beetle"
                }]
            }
        }
    }
};