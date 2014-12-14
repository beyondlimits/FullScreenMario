FullScreenMario.prototype.settings.statistics = {
    "prefix": "FullScreenMario",
    "containers": [
        ["table", {
            "id": "data_display",
            "style": {
                "position": "absolute",
                "top": 0,
                "width": "100%",
                "fontSize": "21px",
                "textTransform": "uppercase"
            }
        }],
        ["tr", {
            "style": {
                "padding": "7px 14px 0 14px",
                "textAlign": "center"
            }
        }]
    ],
    "defaults": {
        "element": "td"
    },
    "separator": "<br />",
    "values": {
        "power": {
            "value_default": 1,
            "storeLocally": false
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
            "triggers": {
                100: function (EightBitter) {
                    EightBitter.AudioPlayer.playThemePrefix("Hurry");
                }
            },
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
                EightBitter.player.gainLife();
            }
        },
        "lives": {
            "value_default": 3,
            "storeLocally": true,
            "has_element": true
        },
        "luigi": {
            "value_default": 0,
            "storeLocally": true
        }
    }
};