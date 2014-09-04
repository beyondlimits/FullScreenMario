/**
 * LevelEditr.js 
 * An EightBitter/FullScreenMario module to let the user edit levels
 */
function LevelEditr(settings) {
    "use strict";
    if (!this || this === window) {
        return new LevelEditr(settings);
    }
    var self = this,
        
        // The container game object to store Thing and map information
        GameStarter,
        
        // The listings of things that the GUI displays
        things,
        
        // The listings of macros that the GUI displays
        macros,
        
        // The default string name of the map
        map_name_default,
        
        // The starting object used as a default template for new maps
        map_default,
        
        // An Object containing the display's HTML elements
        display,
        
        // What size "blocks" placed Things should snap to
        blocksize,
        
        // An associative array of horizontal rulers to be placed in editing
        lines,
        
        // A function to beautify text given to the map displayer, such as js_beautify
        beautifier,
        
        // The currently selected Thing to be placed
        current_thing,
        
        // The type string of the currently selected thing, such as "Koopa"
        current_type,
        
        // The current arguments for current_thing, such as { "smart": true }
        current_args;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        GameStarter = settings.GameStarter;
        things = settings.things;
        macros = settings.macros;
        beautifier = settings.beautifier;
        map_name_default = settings.map_name_default || "New Map";
        map_default = settings.map_default || {};
        
        blocksize = settings.blocksize || 1;
    };
    
    
    /* State resets
    */
    
    /**
     * 
     */
    self.enable = function () {
        GameStarter.container.onmousemove = onMouseMoveEditing;
        GameStarter.container.onclick = onClickEditing;
        
        clearAllThings();
        resetDisplay();
        setTimeout(function () {
            setTextareaValue(JSON.stringify(map_default), true);
            resetDisplayMap();
            disableThing(FSM.player);
        }, 7);
        
        FSM.InputWriter.setCanTrigger(false);
    };
    
    /**
     * 
     */
    function setCurrentThing(type, args, x, y) {
        current_type = type;
        current_args = args;
        current_thing = GameStarter.ObjectMaker.make(current_type, GameStarter.proliferate({
            "onThingMake": undefined
        }, args));
        
        disableThing(current_thing);
        GameStarter.addThing(current_thing, x || 0, y || 0);
    };
    
    
    /* Mouse events
    */
    
    /**
     * 
     */
    function onMouseMoveEditing(event) {
        var x = event.x || event.clientX || 0,
            y = event.y || event.clientY || 0;
        
        if(current_thing) {
            GameStarter.setLeft(
                current_thing, 
                roundTo(x - GameStarter.container.offsetLeft, blocksize)
            );
            GameStarter.setTop(
                current_thing, 
                roundTo(y - GameStarter.container.offsetTop, blocksize)
            );
        }
    }
    
    /**
     * 
     */
    function onClickEditing(event) {
        var x = roundTo(event.x || event.clientX || 0, blocksize),
            y = roundTo(event.y || event.clientY || 0, blocksize),
            thing;
        
        if(!current_thing || !addMapCreationObject(x, y)) {
            return;
        }
        
        if(current_thing) {
            thing = GameStarter.ObjectMaker.make(current_type, GameStarter.proliferate({
                "onThingMake": undefined
            }, current_args));
            disableThing(thing, .7);
            GameStarter.addThing(
                thing,
                roundTo(x - GameStarter.container.offsetLeft, blocksize),
                roundTo(y - GameStarter.container.offsetTop, blocksize)
            );
        }
    }
    
    /**
     * 
     */
    function onThingIconClick(title, event) {
        var x = event.x || event.clientX || 0,
            y = event.y || event.clientY || 0;
        
        setCurrentThing(title, {}, x, y);
        
        event.preventDefault();
        event.stopPropagation();
        event.cancelBubble = true;
    }
    
    
    /* Map manipulations
    */
    
    function setMapName() {
        var name = getMapName(),
            map = getMapObject();
        
        if(map && map.name != name) {
            map.name = name;
            display.namer.value = name;
            setTextareaValue(JSON.stringify(map), true);
            GameStarter.StatsHolder.set("world", name)
        }
    }
    
    function getMapObject() {
        try {
            var map = JSON.parse(display.stringer.textarea.value);
            display.stringer.messenger.textContent = "";
            display.namer.value = map.name || map_name_default;
            return map;
        }
        catch (error) {
            setSectionJSON();
            display.stringer.messenger.textContent = error.message;
            return undefined;
        }
    }
    
    function getMapObjectAndTry() {
        var mapName = getMapName() + "::Temporary",
            mapRaw = getMapObject();
        
        if(!mapRaw) {
            return false;
        }
        
        try {
            GameStarter.MapsCreator.storeMap(mapName, mapRaw);
            GameStarter.MapsCreator.getMap(mapName);
            setDisplayMap(true);
        } catch (error) {
            display.stringer.messenger.textContent = error.message;
            return false;
        }
    }
    
    function addMapCreationObject(x, y) {
        var mapObject = getMapObject(),
            thingRaw = GameStarter.proliferate({
                "thing": current_type,
                "x": getNormalizedX(x),
                "y": getNormalizedY(y)
            }, current_args);
        
        if(!mapObject) {
            return false;
        }
        
        mapObject.areas[0].creation.push(thingRaw);
        
        setTextareaValue(JSON.stringify(mapObject), true);
        
        return true;
    }
    
    
    /* HTML manipulations
    */
    
    function resetDisplay() {
        if(display) {
            GameStarter.container.removeChild(display.container);
        }
        
        display = {
            "container": undefined,
            "namer": undefined,
            "stringer": {
                "textarea": undefined,
                "messenger": undefined
            },
            "sections": {
                "ClickToPlace": {
                    "container": undefined,
                    "Things": undefined,
                    "Macros": undefined
                },
                "MapSettings": {
					"container": undefined,
					"Area": {
						"Time": undefined,
						"Setting": {
							"Primary": undefined,
							"Secondary": undefined
						}
					},
					"Locations": {
						"Current": undefined,
						"Entry": undefined,
						"Add": undefined
					}
				},
                "JSON": undefined,
                "buttons": {
                    "ClickToPlace": {
                        "container": undefined,
                        "Things": undefined,
                        "Macros": undefined
                    },
                    "MapSettings": undefined,
                    "JSON": undefined
                }
            }
        };
        
        display["container"] = GameStarter.createElement("div", {
            "className": "LevelEditor",
            "onclick": function (event) {
                event.stopPropagation();
                event.cancelBubble = true;
            },
            "children": [
                GameStarter.createElement("div", {
                    "className": "EditorHead",
                    "children": [
                        display["namer"] = GameStarter.createElement("input", {
                            "className": "EditorNameInput",
                            "type": "text",
                            "placeholder": map_name_default,
                            "value": map_name_default,
                            "onkeyup": setMapName,
                            "onchange": setMapName
                        }),
                        GameStarter.createElement("div", {
                            "className": "EditorMinimizer"
                        })
                    ]
                }),
                GameStarter.createElement("div", {
                    "className": "EditorSectionChoosers",
                    "children": [
                        display["sections"]["buttons"]["ClickToPlace"]["container"] = GameStarter.createElement("div", {
                            "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                            "style": {
                                "background": "white"
                            },
                            "textContent": "Click-to-Place",
                            "onclick": setSectionClickToPlace,
                        }),
                        display["sections"]["buttons"]["MapSettings"] = GameStarter.createElement("div", {
                            "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                            "style": {
                                "background": "gray"
                            },
                            "textContent": "Map Settings",
                            "onclick": setSectionMapSettings,
                        }),
                        display["sections"]["buttons"]["JSON"] = GameStarter.createElement("div", {
                            "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                            "style": {
                                "background": "gray"
                            },
                            "textContent": "Raw JSON",
                            "onclick": setSectionJSON
                        })
                    ]
                }),
                display["sections"]["ClickToPlace"]["container"] = GameStarter.createElement("div", {
                    "className": "EditorOptionsList EditorSectionMain",
                    "style": {
                        "display": "block"
                    },
                    "children": [
                        GameStarter.createElement("div", {
                            "className": "EditorSubOptionsListsMenu",
                            "children": [
                                display["sections"]["buttons"]["ClickToPlace"]["Things"] = GameStarter.createElement("div", {
                                    "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                                    "textContent": "Things",
                                    "onclick": setSectionClickToPlaceThings,
                                    "style": {
                                        "background": "#CCC"
                                    }
                                }),
                                display["sections"]["buttons"]["ClickToPlace"]["Macros"] = GameStarter.createElement("div", {
                                    "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                                    "textContent": "Macros",
                                    "onclick": setSectionClickToPlaceMacros,
                                    "style": {
                                        "background": "#777"
                                    }
                                })
                            ]
                        }),
                        display["sections"]["ClickToPlace"]["Things"] = GameStarter.createElement("div", {
                            "className": "EditorOptions EditorOptions-Things",
                            "style": {
                                "display": "block"
                            },
                            "children": Object.keys(things).map(function (key) {
                                var children = things[key].map(function (title) {
                                    var thing = GameStarter.ObjectMaker.make(title),
                                        container = GameStarter.createElement("div", {
                                            "className": "EditorListOption",
                                            "onclick": onThingIconClick.bind(undefined, title),
                                            "children": [thing.canvas]
                                        }),
                                        sizeMax = 70,
                                        widthThing = thing.width * GameStarter.unitsize,
                                        heightThing = thing.height * GameStarter.unitsize,
                                        widthDiff = (sizeMax - widthThing) / 2, 
                                        heightDiff = (sizeMax - heightThing) / 2;
                                    
                                    thing.canvas.style.top = heightDiff + "px";
                                    thing.canvas.style.right = widthDiff + "px";
                                     thing.canvas.style.bottom = heightDiff + "px";
                                    thing.canvas.style.left = widthDiff + "px";
                                    
                                    GameStarter.PixelDrawer.setThingSprite(thing);
                                    
                                    return container;                                        
                                });
                                
                                children.unshift(GameStarter.createElement("h4", {
                                    "className": "EditorOptionTitle",
                                    "textContent": key
                                }));
                                
                                return GameStarter.createElement("div", {
                                    "className": "EditorOptionContainer",
                                    "children": children
                                });
                            })
                        }),
                        display["sections"]["ClickToPlace"]["Macros"] = GameStarter.createElement("div", {
                            "className": "EditorOptions EditorOptions-Macros",
                            "style": {
                                "display": "none"
                            },
                            "children": Object.keys(macros).map(function (key) {
                                var macro = macros[key];
                                return GameStarter.createElement("div", {
                                    "className": "EditorOptionContainer",
                                    "children": [
                                        GameStarter.createElement("div", {
                                            "className": "EditorOptionTitle",
                                            "textContent": macro["function"]
                                        }),
                                        GameStarter.createElement("div", {
                                            "className": "EditorOptionText",
                                            "textContent": macro["description"]
                                        })
                                    ]
                                })
                            })
                        })
                    ]
                }),
                display["sections"]["MapSettings"]["container"] = GameStarter.createElement("div", {
                    "className": "EditorMapSettings EditorSectionMain",
                    "style": {
                        "display": "none"
                    },
                    "children": [
						// Time
                        display["sections"]["MapSettings"]["Time"] = GameStarter.createElement("input", {
							"type": "Number"
						}),
						// Setting
						GameStarter.createElement("div", {
							"children": [
								display["sections"]["MapSettings"]["Primary"] = createSelect(
									["Overworld", "Underworld", "Underwater", "Castle"]
								),
								display["sections"]["MapSettings"]["Secondary"] = createSelect(
									["", "Night", "Underwater"]
								)
							]
						})
                    ]
                }),
                display["sections"]["JSON"] = GameStarter.createElement("div", {
                    "className": "EditorJSON EditorSectionMain",
                    "style": {
                        "display": "none"
                    },
                    "children": [
                        display["stringer"]["textarea"] = GameStarter.createElement("textarea", {
                            "className": "EditorJSONInput",
                            "onkeyup": getMapObjectAndTry,
                            "onchange": getMapObjectAndTry
                        }),
                        display["stringer"]["messenger"] = GameStarter.createElement("div", {
                            "className": "EditorJSONInfo"
                        })
                    ]
                }),
                GameStarter.createElement("div", {
                    "className": "EditorMenu",
                    "children": (function (actions) {
                        return Object.keys(actions).map(function (key) {
                            return GameStarter.createElement("div", {
                                "className": "EditorMenuOption EditorMenuOptionFifth EditorMenuOption-" + key,
                                "textContent": key,
                                "onclick": actions[key]
                            });
                        });
                    })({
                        "Build": function () {
                            beautifyTextareaValue();
                            setDisplayMap(true);
                            FSM.InputWriter.setCanTrigger(false);
                        },
                        "Play": function () {
                            beautifyTextareaValue();
                            setDisplayMap(false);
                            FSM.InputWriter.setCanTrigger(true);
                        },
                        "Save": downloadCurrentJSON,
                        "Load": alert.bind(window, "Loading!"),
                        "Reset": resetDisplayMap
                    })
                })
            ]
        });
        
        GameStarter.container.insertBefore(
            display.container, 
            GameStarter.container.children[0]
        );
    }
    
    /**
     * 
     */
    function setSectionClickToPlace() {
        display.sections.ClickToPlace.container.style.display = "block";
        display.sections.MapSettings.container.style.display = "none";
        display.sections.JSON.style.display = "none";
        display.sections.buttons.ClickToPlace.container.style.backgroundColor = "white";
        display.sections.buttons.MapSettings.style.background = "gray";
        display.sections.buttons.JSON.style.background = "gray";
    }
    
    /**
     * 
     */
    function setSectionMapSettings() {
        display.sections.ClickToPlace.container.style.display = "none";
        display.sections.MapSettings.container.style.display = "block";
        display.sections.JSON.style.display = "none";
        display.sections.buttons.ClickToPlace.container.style.background = "gray";
        display.sections.buttons.MapSettings.style.background = "white";
        display.sections.buttons.JSON.style.background = "gray";
    }
    
    /**
     * 
     */
    function setSectionJSON(event) {
        display.sections.ClickToPlace.container.style.display = "none";
        display.sections.MapSettings.container.style.display = "none";
        display.sections.JSON.style.display = "block";
        display.sections.buttons.ClickToPlace.container.style.background = "gray";
        display.sections.buttons.MapSettings.style.background = "gray";
        display.sections.buttons.JSON.style.background = "white";
    }
    
    /**
     * 
     */
    function setSectionClickToPlaceThings(event) {
        display.sections.ClickToPlace.Things.style.display = "block";
        display.sections.ClickToPlace.Macros.style.display = "none";
        display.sections.buttons.ClickToPlace.Things.style.background = "#CCC";
        display.sections.buttons.ClickToPlace.Macros.style.background = "#777";
    }
    
    /**
     * 
     */
    function setSectionClickToPlaceMacros(event) {
        display.sections.ClickToPlace.Things.style.display = "none";
        display.sections.ClickToPlace.Macros.style.display = "block";
        display.sections.buttons.ClickToPlace.Things.style.background = "#777";
        display.sections.buttons.ClickToPlace.Macros.style.background = "#CCC";
    }
    
    /**
     * 
     */
    function setTextareaValue(value, doBeautify) {
        if(doBeautify) {
            display.stringer.textarea.value = beautifier(value);
        } else {
            display.stringer.textarea.value = value;
        }
    }
    
    /** 
     * 
     */
    function beautifyTextareaValue() {
        display.stringer.textarea.value = beautifier(display.stringer.textarea.value);
    }
    
    /**
     * 
     */
    function resetDisplayMap() {
        setTextareaValue(JSON.stringify(map_default), true);
        setDisplayMap(true);
        FSM.InputWriter.setCanTrigger(false);
    }
    
    /**
     * 
     */
    function setDisplayMap(doDisableThings) {
        var value = display.stringer.textarea.value,
            mapName = getMapName(),
            testObject, 
            testMap,
            map;
        
        try {
            testObject = JSON.parse(value);
            setTextareaValue(display.stringer.textarea.value);
        } catch (error) {
            setSectionJSON();
            display.stringer.messenger.textContent = error.message;
            return;
        }
        
        try {
            GameStarter.MapsCreator.storeMap(mapName, testObject);
            map = GameStarter.MapsCreator.getMap(mapName);
        } catch (error) {
            setSectionJSON();
            display.stringer.messenger.textContent = error.message;
            return;
        }
        
        display.stringer.messenger.textContent = "";
        setTextareaValue(display.stringer.textarea.value);
        GameStarter.setMap(mapName);
        
        if(doDisableThings) {
            disableAllThings();
        }
    }
    
    /**
     * 
     */
    function getMapName() {
        return display.namer.value || map_name_default;
    }
    
    
    /* Utility functions
    */
    
    /**
     * 
     */
    function roundTo(number, rounding) {
        return Math.round(number / rounding) * rounding;
    }
    
    /**
     * 
     */
    function disableThing(thing, opacity) {
        thing.movement = undefined;
        thing.onThingMake = undefined;
        thing.nofall = true;
        thing.nocollide = true;
        thing.xvel = 0;
        thing.yvel = 0;
        thing.opacity = typeof(opacity) === "undefined" ? .49 : opacity;
    }
    
    /**
     * 
     */
    function disableAllThings() {
        GameStarter.GroupHolder.getCharacterGroup().forEach(function (thing) {
            disableThing(thing);
        });
        GameStarter.StatsHolder.set("time", Infinity)
    }
    
    /**
     * 
     */
    function clearAllThings() {
        var groups = GameStarter.GroupHolder.getGroups(),
            group, i, j;
        
        for(i in groups) {
            for(j in groups[i]) {
                GameStarter.killNormal(groups[i][j]);
            }
        }
    }
    
    function getNormalizedX(raw) {
        return raw / GameStarter.unitsize;
    }
    
    function getNormalizedY(raw) {
        return GameStarter.MapScreener.floor - (raw / GameStarter.unitsize) + GameStarter.unitsize * 3; // Why +3?
    }
	
	function createSelect(options, attributes) {
		var select = GameStarter.createElement("select", attributes),
			i;
		
		for(i = 0; i < options.length; i += 1) {
			select.appendChild(GameStarter.createElement("option", {
				"value": options[i],
				"textContent": options[i]
			}));
		}
		
		return select;
	}
    
    function downloadCurrentJSON() {
        downloadFile(
            getMapName() + ".json",
            display.stringer.textarea.value || ""
        );
    }
    
    function downloadFile(name, content) {
        var link = document.createElement('a');
        link.setAttribute('download', name);
        link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(content));
        display.container.appendChild(link);
        link.click();
        display.container.removeChild(link);
        return link;
    }
    
    self.reset(settings || {});
}