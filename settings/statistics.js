console.warn("settings.statistics still uses window.innerWidth");
FullScreenMario.prototype.settings.statistics = {
    "prefix": "FullScreenMario",
    "containers": [
        ["table", {
            "id": "data_display",
            "className": "display",
            "style": {
                "width": (window.innerWidth + 14) + "px"
            }
        }],
        ["tr"]
    ],
    "defaults": {
        "element": "td"
    },
    "separator": "<br />",
    "values": {
        "power": {
            "value_default": 1,
            "store_locally": false
        },
        "traveled": {
            "value_default": 0
        },
        "score": {
            "value_default": 0,
            "digits": 6,
            "has_element": true,
            "modularity": 100000,
            "on_modular": function (EightBitter) {
                EightBitter.gainLife();
            }
        },
        "time": {
            "value_default": 0,
            "digits": 3,
            "has_element": true,
            "minimum": 0,
            "on_minimum": function (EightBitter) {
                EightBitter.killPlayer(FSM.player, true);
            }
        },
        "world": {
            "value_default": 0,
            "has_element": true
        },
        "coins": {
            "value_default": 0,
            "has_element": true,
            "modularity": 100,
            "on_modular": function (EightBitter) {
                EightBitter.gainLife();
            }
        },
        "lives": {
            "value_default": 3,
            "store_locally": true,
            "has_element": true
        },
        "luigi": {
            "value_default": 0,
            "store_locally": true
        }
    }
};