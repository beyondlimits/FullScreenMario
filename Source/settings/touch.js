FullScreenMario.FullScreenMario.settings.touch = {
    "styles": {
        "default": {
            "element": {
                "style": {
                    "opacity": ".7"
                }
            },
            "elementInner": {
                "style": {
                    "cursor": "pointer",
                    "width": "2.1cm",
                    "height": "2.1cm",
                    "border": "4px solid rgb(238, 238, 238",
                    "borderRadius": "100%",
                    "background": "rgb(175, 175, 175)",
                    "textAlign": "center"
                }
            }
        },
        "Button": {
            "element": {
                "className": "control control-button",
            },
            "elementInner": {
                "className": "control-inner control-button",
                "style": {
                    "padding": ".385cm",
                    "width": "1.4cm",
                    "height": "1.4cm",
                    "border": "4px solid rgb(238, 238, 238)",
                    "borderRadius": "100%",
                    "background": "rgb(175, 175, 175)",
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
            },
            "tick": {
                "style": {
                    "background": "rgb(238, 238, 238)",
                    "width": ".28cm",
                    "height": "4px",
                }
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
                    "left": "1.4cm",
                    "top": "-2.8cm"
                }
            },
            "directions": [
                {
                    "name": "Up",
                    "degrees": 0,
                    "neighbors": ["UpLeft", "UpRight"]
                },
                {
                    "name": "UpRight",
                    "degrees": 45,
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
                    "degrees": 90,
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
                    "degrees": 135,
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
                    "degrees": 180,
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
                    "degrees": 225,
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
                    "degrees": 270,
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
                    "degrees": 315,
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
