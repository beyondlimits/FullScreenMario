FullScreenMario.FullScreenMario.settings.touch = {
    "styles": {
        "default": {
            "elementInner": {
                "style": {
                    "cursor": "pointer"
                }
            }
        },
        "Button": {
            "element": {
                "className": "control control-button"
            },
            "elementInner": {
                "className": "control-inner control-button",
                "style": {
                    "padding": ".35cm",
                    "width": "50px",
                    "height": "50px",
                    "border": "4px solid rgba(238, 238, 238, .7)",
                    "borderRadius": "100%",
                    "background": "rgba(175, 175, 175, .7)",
                    "textAlign": "center"
                }
            }
        },
        "Joystick": {
            "element": {
                "className": "control control-button"
            },
            "elementInner": {
                "className": "control-inner control-button"
            }
        }
    },
    "controls": [
        {
            "name": "Joystick",
            "control": "Joystick",
            "position": {
                "vertical": "bottom",
                "horizontal": "left",
                "offset": {
                    "left": 35,
                    "top": -35
                }
            },
            "directions": [
                {
                    "name": "Up",
                    "neighbors": ["UpLeft", "UpRight"]
                },
                {
                    "name": "UpRight",
                    "neighbors": ["Up", "Right"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["right"]
                        },
                        "deactivated": {
                            "onkeyup": ["right"]
                        }
                    }
                },
                {
                    "name": "Right",
                    "neighbors": ["UpRight", "DownRight"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["right"]
                        },
                        "deactivated": {
                            "onkeyup": ["right"]
                        }
                    }
                },
                {
                    "name": "DownRight",
                    "neighbors": ["Right", "Down"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["down", "right"]
                        },
                        "deactivated": {
                            "onkeyup": ["down", "right"]
                        }
                    }
                },
                {
                    "name": "Down",
                    "neighbors": ["DownRight", "DownLeft"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["down"]
                        },
                        "deactivated": {
                            "onkeyup": ["down"]
                        }
                    }
                },
                {
                    "name": "DownLeft",
                    "neighbors": ["Down", "left"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["down", "left"]
                        },
                        "deactivated": {
                            "onkeyup": ["down", "left"]
                        }
                    }
                },
                {
                    "name": "Left",
                    "neighbors": ["DownLeft", "UpLeft"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["left"]
                        },
                        "deactivated": {
                            "onkeyup": ["left"]
                        }
                    }
                },
                {
                    "name": "UpLeft",
                    "neighbors": ["Left", "Up"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["left"]
                        },
                        "deactivated": {
                            "onkeyup": ["left"]
                        }
                    }
                }
            ]
        },
        {
            "name": "A",
            "control": "Button",
            "label": "A",
            "position": {
                "vertical": "bottom",
                "horizontal": "right",
                "offset": {
                    "left": "-1.56cm",
                    "top": "-2.8cm"
                }
            },
            "pipes": {
                "activated": {
                    "onkeydown": ["up"]
                },
                "deactivated": {
                    "onkeydown": ["up"]
                }
            }
        },
        {
            "name": "B",
            "control": "Button",
            "label": "B",
            "position": {
                "vertical": "bottom",
                "horizontal": "right",
                "offset": {
                    "left": "-2.8cm",
                    "top": "-1.56cm"
                }
            },
            "pipes": {
                "activated": {
                    "onkeydown": ["sprint"]
                },
                "deactivated": {
                    "onkeydown": ["sprint"]
                }
            }
        },
        {
            "name": "Start",
            "control": "Button",
            "label": "Start",
            "styles": {
                "elementInner": {
                    "style": {
                        "width": "7em",
                        "padding": ".21cm",
                        "borderRadius": "7px",
                        "fontSize": "77%"
                    }
                }
            },
            "position": {
                "vertical": "bottom",
                "horizontal": "center",
                "offset": {
                    "top": "-.84cm"
                }
            },
            "pipes": {
                "activated": {
                    "onkeydown": ["pause"]
                },
                "deactivated": {
                    "onkeydown": ["pause"]
                }
            }
        }
    ]
};
