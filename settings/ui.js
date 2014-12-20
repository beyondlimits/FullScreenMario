FullScreenMario.prototype.settings.ui = {
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
                    "source": function () {
                        return Math.round(FSM.AudioPlayer.getVolume()) * 100;
                    },
                    "update": function (value) {
                        FSM.AudioPlayer.setVolume(value / 100);
                    }
                },
                {
                    "title": "Mute",
                    "type": "Boolean",
                    "source": function () {
                        return FSM.AudioPlayer.getMuted();
                    },
                    "enable": function () {
                        FSM.AudioPlayer.setMutedOn();
                    },
                    "disable": function () {
                        FSM.AudioPlayer.setMutedOff();
                    }
                },
                {
                    "title": "FastFwd",
                    "type": "Boolean",
                    "source": function () {
                        return FSM.GamesRunner.getSpeed() !== 1;
                    },
                    "enable": function () {
                        FSM.GamesRunner.setSpeed(3);
                    },
                    "disable": function () {
                        FSM.GamesRunner.setSpeed(1);
                        
                    }
                },
                {
                    "title": "View Mode",
                    "type": "ScreenSize"
                },
                {
                    "title": "Framerate",
                    "type": "Select",
                    "options": function () {
                        return ["60fps", "30fps"];
                    },
                    "source": function () {
                        return 1 / FSM.PixelDrawer.getFramerateSkip() * 60;
                    },
                    "update": function (value) {
                        var numeric = Number(value.replace("fps", ""));
                        FSM.PixelDrawer.setFramerateSkip(1 / numeric * 60);
                    }
                },
                {
                    "title": "Tilt Controls",
                    "type": "Boolean",
                    "source": function () {
                        return FSM.MapScreener.allowDeviceMotion;
                    },
                    "enable": function () {
                        FSM.MapScreener.allowDeviceMotion = true;
                    },
                    "disable": function () {
                        FSM.MapScreener.allowDeviceMotion = false;
                    }
                }
            ],
            "actions": [
                {
                    "title": "Screenshot",
                    "action": function () {
                        FSM.takeScreenshot();
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
                        "source": function () {
                            return FSM.InputWriter.getAliasAsKeyStrings(title);
                        },
                        "callback": function (valueOld, valueNew) {
                            FSM.InputWriter.switchAliasValues(
                                title,
                                [FSM.InputWriter.convertKeyStringToAlias(valueOld)],
                                [FSM.InputWriter.convertKeyStringToAlias(valueNew)]
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
            "options": function () {
                return FSM.ModAttacher.getMods();
            },
            "callback": function (schema, button) {
                FSM.ModAttacher.toggleMod(button.getAttribute("value") || button.textContent);
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
            "callback": function (schema, button, event) {
                FSM.setMap(button.getAttribute("value") || button.textContent);
            }
        }
    ]
};