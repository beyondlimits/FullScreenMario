FullScreenMario.prototype.settings.ui = {
    "sizeDefault": "Wide",
    "sizes": {
        "NES": {
            "width": 512,
            "height": 464,
            "full": false
        },
        "Wide": {
            "width": Infinity,
            "height": 464,
            "full": false
        },
        "Large": {
            "width": Infinity,
            "height": Infinity,
            "full": false
        },
        "Full!": {
            "width": Infinity,
            "height": Infinity,
            "full": true
        }
    },
    "schemas": [
        {
            "title": "Options",
            "generator": "OptionsTable",
            "options": [
                {
                    "title": "Volume",
                    "type": "Number",
                    "minimum": 0,
                    "maximum": 100,
                    "source": function (GameStarter) {
                        return Math.round(GameStarter.AudioPlayer.getVolume()) * 100;
                    },
                    "update": function (GameStarter, value) {
                        GameStarter.AudioPlayer.setVolume(value / 100);
                    }
                },
                {
                    "title": "Mute",
                    "type": "Boolean",
                    "source": function (GameStarter) {
                        return GameStarter.AudioPlayer.getMuted();
                    },
                    "enable": function (GameStarter) {
                        GameStarter.AudioPlayer.setMutedOn();
                    },
                    "disable": function (GameStarter) {
                        GameStarter.AudioPlayer.setMutedOff();
                    }
                },
                {
                    "title": "FastFwd",
                    "type": "Boolean",
                    "source": function (GameStarter) {
                        return GameStarter.GamesRunner.getSpeed() !== 1;
                    },
                    "enable": function (GameStarter) {
                        GameStarter.GamesRunner.setSpeed(3);
                    },
                    "disable": function (GameStarter) {
                        GameStarter.GamesRunner.setSpeed(1);
                        
                    }
                },
                {
                    "title": "View Mode",
                    "type": "ScreenSize"
                },
                {
                    "title": "Framerate",
                    "type": "Select",
                    "options": function (GameStarter) {
                        return ["60fps", "30fps"];
                    },
                    "source": function (GameStarter) {
                        return 1 / GameStarter.PixelDrawer.getFramerateSkip() * 60;
                    },
                    "update": function (GameStarter, value) {
                        var numeric = Number(value.replace("fps", ""));
                        GameStarter.PixelDrawer.setFramerateSkip(1 / numeric * 60);
                    }
                },
                {
                    "title": "Tilt Controls",
                    "type": "Boolean",
                    "source": function (GameStarter) {
                        return GameStarter.MapScreener.allowDeviceMotion;
                    },
                    "enable": function (GameStarter) {
                        GameStarter.MapScreener.allowDeviceMotion = true;
                    },
                    "disable": function (GameStarter) {
                        GameStarter.MapScreener.allowDeviceMotion = false;
                    }
                }
            ],
            "actions": [
                {
                    "title": "Screenshot",
                    "action": function (GameStarter) {
                        GameStarter.takeScreenshot();
                    }
                }
            ]
        }, {
            "title": "Controls",
            "generator": "OptionsTable",
            "options": (function (controls) {
                return controls.map(function (title) {
                    return {
                        "title": title[0].toUpperCase() + title.substr(1),
                        "type": "Keys",
                        "source": function (GameStarter) {
                            return GameStarter.InputWriter.getAliasAsKeyStrings(title);
                        },
                        "callback": function (GameStarter, valueOld, valueNew) {
                            GameStarter.InputWriter.switchAliasValues(
                                title,
                                [GameStarter.InputWriter.convertKeyStringToAlias(valueOld)],
                                [GameStarter.InputWriter.convertKeyStringToAlias(valueNew)]
                            );
                        }
                    };
                });
            })(["left", "right", "up", "down", "sprint", "pause"])
        }, {
            "title": "Mods!",
            "generator": "OptionsButtons",
            "keyActive": "enabled",
            "assumeInactive": true,
            "options": function (GameStarter) {
                return GameStarter.ModAttacher.getMods();
            },
            "callback": function (GameStarter, schema, button) {
                GameStarter.ModAttacher.toggleMod(button.getAttribute("value") || button.textContent);
            }
        }, {
            "title": "Editor",
            "generator": "LevelEditor"
        }, {
            "title": "Maps",
            "generator": "MapsGrid",
            "rangeX": [1, 4],
            "rangeY": [1, 8],
            "extras": {
                "Map Generator!": "Random"
            },
            "callback": function (GameStarter, schema, button, event) {
                GameStarter.setMap(button.getAttribute("value") || button.textContent);
            }
        }
    ]
};