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
        
        // The GameStarter's settings before this LevelEditr was enabled
        old_information,
        
        // The listings of things that the GUI displays
        things,
        
        // The listing of groups that Things may fall into
        thing_groups,
        
        // The complete list of Things that may be placed
        thing_keys,
        
        // The listings of macros that the GUI displays
        macros,
        
        // The default string name of the map
        map_name_default,
        
        // The default integer time of the map
        map_time_default,
        
        // The default string setting of the map's areas
        map_setting_default,
        
        // The default string entry of the map's locations
        map_entry_default,
        
        // The starting object used as a default template for new maps
        map_default,
        
        // An Object containing the display's HTML elements
        display,
        
        // The current mode of editing as a string, such as "Build" or "Play"
        current_mode,
        
        // The current mode of click as a string, such as "Thing" or "Macro"
        current_click_mode,
        
        // What size "blocks" placed Things should snap to
        blocksize,
        
        // An associative array of horizontal rulers to be placed in editing
        lines,
        
        // A function to beautify text given to the map displayer, such as js_beautify
        beautifier,
        
        // The currently selected Thing to be placed
        current_things,
        
        // The type string of the currently selected thing, such as "Koopa"
        current_type,
        
        // The current arguments for current_things, such as { "smart": true }
        current_args;
    
    /**
     * 
     */
    self.reset = function reset(settings) {
        GameStarter = settings.GameStarter;
        things = settings.things;
        thing_groups = settings.thing_groups;
        thing_keys = settings.thing_keys;
        macros = settings.macros;
        beautifier = settings.beautifier;
        map_name_default = settings.map_name_default || "New Map";
        map_time_default = settings.map_time_default || Infinity;
        map_setting_default = settings.map_setting_default || "";
        map_entry_default = settings.map_entry_default || "";
        map_default = settings.map_default || {};
        blocksize = settings.blocksize || 1;
        
        current_things = [];
        current_mode = "Build";
        current_click_mode = "Thing";
    };
    
    
    /* State resets
    */
    
    /**
     * 
     */
    self.enable = function () {
        old_information = {
            "map": GameStarter.MapsHandler.getMapName(),
        };
        
        clearAllThings();
        resetDisplay();
        
        GameStarter.InputWriter.setCanTrigger(false);
        
        setCurrentMode("Build");
        
        setTextareaValue(stringifySmart(map_default), true);
        resetDisplayMap();
        disableThing(GameStarter.player);
    };
    
    /**
     * 
     */
    self.disable = function () {
        GameStarter.container.removeChild(display["container"]);
        display = undefined;
        
        GameStarter.InputWriter.setCanTrigger(true);
        GameStarter.setMap(old_information["map"]);
    };
    
    /**
     * 
     */
    self.minimize = function () {
        display.minimizer.innerText = "+";
        display.minimizer.onclick = self.maximize;
        display.container.className += " minimized";
    };
    
    /**
     * 
     */
    self.maximize = function () {
        display.minimizer.innerText = "-";
        display.minimizer.onclick = self.minimize;
        
        if (display.container.className.indexOf("minimized") !== -1) {
            display.container.className = display.container.className.replace(/ minimized/g, '');
        }
    };
    
    /**
     * 
     */
    self.startBuilding = function () {
        beautifyTextareaValue();
        setDisplayMap(true);
        GameStarter.InputWriter.setCanTrigger(false);
        setCurrentMode("Build");
        self.maximize();
    };
    
    /**
     * 
     */
    self.startPlaying = function () {
        beautifyTextareaValue();
        setDisplayMap(false);
        GameStarter.InputWriter.setCanTrigger(true);
        setCurrentMode("Play");
        self.minimize();
    };
    
    /**
     * 
     */
    self.downloadCurrentJSON = function () {
        downloadFile(
            getMapName() + ".json",
            display.stringer.textarea.value || ""
        );
    };
    
    /**
     * 
     */
    self.loadCurrentJSON = function () {
        display.sections.inputDummy.click()
    };
    
    /**
     * 
     */
    self.handleUploadStart = function (event) {
        var file, reader;
        
        cancelEvent(event);

        if (event && event.dataTransfer) {
            file = event.dataTransfer.files[0];
        } else {
            file = display.sections.inputDummy.files[0],
            reader = new FileReader();
        }
        
        if (!file) {
            return;
        }
        
        reader = new FileReader();
        reader.onloadend = self.handleUploadCompletion;
        reader.readAsText(file);
    };
    
    function handleDragEnter(event) {
        self.setSectionJSON();
    }
    
    function handleDragOver(event) {
        cancelEvent(event);
    }
    
    function handleDragDrop(event) {
        self.handleUploadStart(event);
    }
    
    /**
     * 
     */
    self.handleUploadCompletion = function (event) {
        self.enable();
        self.setCurrentJSON(event.currentTarget.result);
        self.setSectionJSON();
    }
    
    /**
     * 
     */
    self.setCurrentJSON = function (json) {
        self.startBuilding();
        setTextareaValue(json, true);
        getMapObjectAndTry();
    };
    
    /**
     * 
     */
    function setCurrentMode(mode) {
        current_mode = mode;
    }
    
    /**
     * 
     */
    function setCurrentClickMode(mode, event) {
        current_click_mode = mode;
        
        cancelEvent(event);
    }
    
    /**
     * 
     */
    function setCurrentThing(type, args, x, y) {
        current_type = type;
        current_args = args;
        current_things = [
            {
                "x": 0,
                "y": 0,
                "thing": GameStarter.ObjectMaker.make(
                    current_type, 
                    GameStarter.proliferate({
                        "onThingMake": undefined,
                        "onThingAdd": undefined,
                        "onThingAdded": undefined,
                        "outerok": true
                    }, getNormalizedThingArguments(args))
                )
            }
        ];
        
        disableThing(current_things[0]["thing"]);
        GameStarter.addThing(current_things[0]["thing"], x || 0, y || 0);
    };
    
    function setCurrentMacroThings() {
        var current_thing, i;
        
        for (i = 0; i < current_things.length; i += 1) {
            current_thing = current_things[i];
            current_thing.outerok = true;
            
            disableThing(current_thing["thing"]);
            GameStarter.addThing(
                current_thing["thing"], 
                current_thing["xloc"] || 0,
                current_thing["yloc"] || 0
            );
        }
    }
    
    /**
     * 
     */
    function setCurrentArgs() {
        if (current_click_mode === "Thing") {
            setCurrentThing(current_type, getCurrentArgs());
        } else {
            onMacroIconClick(current_type, false, getCurrentArgs());
        }
    }
    
    /* Mouse events
    */
    
    /**
     * 
     */
    function onMouseDownScroller(direction, event) {
        var target = event.target;
        
        target.setAttribute("scrolling", 1);
        
        GameStarter.TimeHandler.addEventInterval(function () {
            if (target.getAttribute("scrolling") != 1) {
                return true;
            }
            
            if (direction < 0 && GameStarter.MapScreener.left <= 0) {
                display["scrollers"]["left"].style.opacity = 0;
                return;
            }
            
            GameStarter.scrollWindow(direction);
                display["scrollers"]["left"].style.opacity = 1;
        }, 1, Infinity);
    }
    
    /**
     * 
     */
    function onMouseUpScrolling(event) {
        event.target.setAttribute("scrolling", 0);
    }

    
    /**
     * 
     */
    function onMouseMoveEditing(event) {
        var x = event.x || event.clientX || 0,
            y = event.y || event.clientY || 0,
            current_thing, i;
        
        for (i = 0; i < current_things.length; i += 1) {
            current_thing = current_things[i];
            
            if (!current_thing["thing"]) {
                continue;
            }
            
            GameStarter.setLeft(
                current_thing["thing"], 
                roundTo(x - GameStarter.container.offsetLeft, blocksize) 
                        + (current_thing.left || 0) * GameStarter.unitsize
            );
            GameStarter.setTop(
                current_thing["thing"], 
                roundTo(y - GameStarter.container.offsetTop, blocksize) 
                        - (current_thing.top || 0) * GameStarter.unitsize
            );
        }
    }
    
    /**
     * 
     */
    function onClickEditingThing(event) {
        if (current_mode !== "Build") {
            return;
        }
        
        var x = roundTo(event.x || event.clientX || 0, blocksize),
            y = roundTo(event.y || event.clientY || 0, blocksize),
            thing;
        
        if (!current_things.length || !addMapCreationThing(x, y)) {
            return;
        }
        
        onClickEditingGenericAdd(x, y, current_type, current_args);
    }
    
    /**
     * 
     */
    function onClickEditingMacro(event) {
        if (current_mode !== "Build") {
            return;
        }
        
        var x = roundTo(event.x || event.clientX || 0, blocksize),
            y = roundTo(event.y || event.clientY || 0, blocksize),
            current_thing, i;
        
        // killCurrentThings();
        
        if (!current_things.length || !addMapCreationMacro(x, y)) {
            return;
        }
        
        for (i = 0; i < current_things.length; i += 1) {
            current_thing = current_things[i];
            // debugger;
            onClickEditingGenericAdd(
                x + (current_thing["left"] || 0) * GameStarter.unitsize,
                y - (current_thing["top"] || 0) * GameStarter.unitsize,
                current_thing["thing"].title || current_thing["title"],
                current_thing["reference"]
            );
            
        }
    }
    
    /**
     * 
     */
    function onClickEditingGenericAdd(x, y, type, args) {
        var thing = GameStarter.ObjectMaker.make(type, GameStarter.proliferate({
            "onThingMake": undefined,
            "onThingAdd": undefined,
            "onThingAdded": undefined,
            "movement": undefined
        }, getNormalizedThingArguments(args)));
        
        if (current_mode === "Build") {
            disableThing(thing, .7);
        }
        
        GameStarter.addThing(
            thing,
            roundTo(x - GameStarter.container.offsetLeft, blocksize),
            roundTo(y - GameStarter.container.offsetTop, blocksize)
        );
    }
    
    /**
     * 
     */
    function onThingIconClick(title, event) {
        var x = event.x || event.clientX || 0,
            y = event.y || event.clientY || 0,
            target = event.target.nodeName === "DIV"
                ? event.target : event.target.parentNode,
            i;
        
        killCurrentThings();
        
        setTimeout(function () {
            setCurrentThing(title, getCurrentArgs(), x, y);
        });
        
        cancelEvent(event);
        
        setVisualOptions(target.name, false, target.options);
    }
    
    /**
     * 
     */
    function onMacroIconClick(title, description, options) {
        if (description) {
            setVisualOptions(title, description, options);
        }
        
        var map = getMapObject(),
            i;
        
        if (!map) {
            return;
        }
        
        current_things = [];
        GameStarter.MapsCreator.analyzePreMacro(
            GameStarter.proliferate({
                "macro": title
            }, getCurrentArgs()),
            createPrethingsHolder(current_things),
            getCurrentAreaObject(map),
            map
        );
        
        current_type = title;
        setCurrentMacroThings();
    }
    
    /**
     * 
     */
    function createPrethingsHolder(object) {
        var output = {};
        
        thing_groups.forEach(function (group) {
            output[group] = object;
        });
        
        return output;
    }
    
    /**
     * 
     */
    function getCurrentArgs() {
        var args = {},
            container = display["sections"]["ClickToPlace"]["VisualOptions"],
            children = container.getElementsByClassName("VisualOptionsList"),
            child, labeler, valuer, i;
            
        if (children.length != 0) {
            children = children[0].children;
            
            for (i = 0; i < children.length; i += 1) {
                child = children[i];
                labeler = child.getElementsByClassName("VisualOptionLabel")[0];
                valuer = child.getElementsByClassName("VisualOptionValue")[0];
                
                switch (valuer["data:type"]) {
                    case "Boolean":
                        args[labeler.textContent] = valuer.value === "true" ? true : false;
                        break;
                    case "Number":
                        args[labeler.textContent] = (Number(valuer.value) || 0) * (Number(valuer.getAttribute("data:mod")) || 1);
                        break;
                    default:
                        args[labeler.textContent] = valuer.value;
                        break;
                }
            }
        }
        
        return args;
    }
    
    
    /* Map manipulations
    */
    
    /**
     * 
     */
    function setMapName() {
        var name = getMapName(),
            map = getMapObject();
        
        if (map && map.name != name) {
            map.name = name;
            display["namer"].value = name;
            setTextareaValue(stringifySmart(map), true);
            GameStarter.StatsHolder.set("world", name)
        }
    }
    
    /**
     * 
     * 
     * @param {Boolean} fromGui   Whether this is from the MapSettings section
     *                             of the GUI (true), or from the Raw JSON 
     *                             section (false).
     */
    function setMapTime(fromGui) {
        var map = getMapObject(),
            time;
        
        if (!map) {
            return;
        }
        
        if (fromGui) {
            time = display["sections"]["MapSettings"]["Time"].value;
            map.time = time;
        } else {
            time = map.time;
            display["sections"]["MapSettings"]["Time"].value = time;
        }
        
        setTextareaValue(stringifySmart(map), true);
        GameStarter.StatsHolder.set("time", time)
        GameStarter.TimeHandler.cancelAllEvents();
    }
    
    
    /**
     * 
     * 
     * @param {Boolean} fromGui   Whether this is from the MapSettings section
     *                             of the GUI (true), or from the Raw JSON 
     *                             section (false).
     */
    function setMapSetting(fromGui) {
        var map = getMapObject(),
            area, setting;
        
        if (!map) {
            return;
        }
        
        area = getCurrentAreaObject(map);
        if (fromGui) {
            setting = display["sections"]["MapSettings"]["Setting"]["Primary"].value;
            if (display["sections"]["MapSettings"]["Setting"]["Secondary"].value) {
                setting += " " + display["sections"]["MapSettings"]["Setting"]["Secondary"].value;
            }
            if (display["sections"]["MapSettings"]["Setting"]["Tertiary"].value) {
                setting += " " + display["sections"]["MapSettings"]["Setting"]["Tertiary"].value;
            }
            area.setting = setting;
        } else {
            setting = area.setting.split(" ");
            display["sections"]["MapSettings"]["Setting"]["Primary"].value = setting[0];
            display["sections"]["MapSettings"]["Setting"]["Secondary"].value = setting[1];
            display["sections"]["MapSettings"]["Setting"]["Tertiary"].value = setting[2];
        }
        
        setTextareaValue(stringifySmart(map), true);
        setDisplayMap(true);
    }
    
    /**
     * 
     */
    function setLocationArea() {
        var map = getMapObject();
        
        if (!map) {
            return;
        }
        
        var location = getCurrentLocationObject(map);
        
        location["area"] = getCurrentArea();
        
        setTextareaValue(stringifySmart(map), true);
        setDisplayMap(true);
    }
    
    /**
     * 
     * 
     * @param {Boolean} fromGui   Whether this is from the MapSettings section
     *                             of the GUI (true), or from the Raw JSON 
     *                             section (false).
     */
    function setMapLocation(fromGui) {
        var map = getMapObject();
        
        if (!map) {
            return;
        }
        
        setTextareaValue(stringifySmart(map), true);
        setDisplayMap(true);
    }
    
    /**
     * 
     * 
     * @param {Boolean} fromGui   Whether this is from the MapSettings section
     *                             of the GUI (true), or from the Raw JSON 
     *                             section (false).
     */
    function setMapEntry(fromGui) {
        var map = getMapObject(),
            location, entry;
        
        if (!map) {
            return;
        }
        
        location = getCurrentLocationObject(map);
        if (fromGui) {
            entry = display["sections"]["MapSettings"]["Entry"].value;
            location.entry = entry;
        } else {
            entry = area.location;
            display["sections"]["MapSettings"]["Entry"].value = entry;
        }
        
        setTextareaValue(stringifySmart(map), true);
        setDisplayMap(true);
    }
    
    /**
     * 
     * 
     * @param {Boolean} fromGui   Whether this is from the MapSettings section
     *                             of the GUI (true), or from the Raw JSON 
     *                             section (false).
     */
    function setCurrentLocation(fromGui) {
        var map = getMapObject(),
            location;
        
        if (!map) {
            return;
        }
        
        location = getCurrentLocationObject(map);
        if (fromGui) {
            display["sections"]["MapSettings"]["Area"].value = location.area || 0;
        } else {
            
        }
        
        setTextareaValue(stringifySmart(map), true);
        setDisplayMap(true);
    }
    
    /**
     * 
     */
    function addLocationToMap() {
        var name = display["sections"]["MapSettings"]["Location"].options.length,
            map = getMapObject();
        
        if (!map) {
            return;
        }
        
        map.locations[name] = {
            "entry": map_entry_default
        };
        
        resetAllVisualOptionSelects("VisualOptionLocation", Object.keys(map.locations));
        
        setTextareaValue(stringifySmart(map), true);
        setDisplayMap(true);
    }
    
    function addAreaToMap() {
        var name = display["sections"]["MapSettings"]["Area"].options.length,
            map = getMapObject();
        
        if (!map) {
            return;
        }
        
        map.areas[name] = {
            "setting": map_setting_default,
            "creation": []
        };
        
        resetAllVisualOptionSelects("VisualOptionArea", Object.keys(map.areas));
        
        setTextareaValue(stringifySmart(map), true);
        setDisplayMap(true);
    }
    
    function resetAllVisualOptionSelects(className, options) {
        var map = getMapObject(),
            elements = display.container.getElementsByClassName(className),
            attributes = {
                "children": options.map(function (option) {
                    return new Option(option, option);
                })
            },
            elements, element, value, i;
        
        if (!map) {
            return;
        }
        
        for (i = 0; i < elements.length; i += 1) {
            element = elements[i];
            value = element.value;
            
            element.textContent = "";
            GameStarter.proliferateElement(element, attributes);
            element.value = value;
        }
    }
    
    function getMapObject() {
        try {
            var map = parseSmart(display.stringer.textarea.value);
            display.stringer.messenger.textContent = "";
            display.namer.value = map.name || map_name_default;
            return map;
        }
        catch (error) {
            self.setSectionJSON();
            display.stringer.messenger.textContent = error.message;
            return undefined;
        }
    }
    
    function getMapObjectAndTry() {
        var mapName = getMapName() + "::Temporary",
            mapRaw = getMapObject();
        
        if (!mapRaw) {
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
    
    function getCurrentArea() {
        return display["sections"]["MapSettings"]["Area"].value;
    }
    
    function getCurrentAreaObject(map) {
        if (typeof(map) === "undefined") {
            map = getMapObject();
        }
        
        var location = getCurrentLocation();
        
        return map.areas[map.locations[location].area || 0];
    }
    
    function getCurrentLocation() {
        return display["sections"]["MapSettings"]["Location"].value;
    }
    
    function getCurrentLocationObject(map) {
        return map.locations[getCurrentLocation()];
    }
    
    function addMapCreationThing(x, y) {
        var mapObject = getMapObject(),
            thingRaw = GameStarter.proliferate({
                "thing": current_type,
                "x": getNormalizedX(x) + (GameStarter.MapScreener.left / GameStarter.unitsize),
                "y": getNormalizedY(y)
            }, current_args);
        
        if (!mapObject) {
            return false;
        }
        
        mapObject.areas[getCurrentArea()].creation.push(thingRaw);
        
        setTextareaValue(stringifySmart(mapObject), true);
        
        return true;
    }
    
    function addMapCreationMacro(x, y) {
        var mapObject = getMapObject(),
            macroRaw = GameStarter.proliferate({
                "macro": current_type,
                "x": getNormalizedX(x) + (GameStarter.MapScreener.left / GameStarter.unitsize),
                "y": getNormalizedY(y)
            }, getCurrentArgs());
        
        if (!mapObject) {
            return false;
        }
        
        mapObject.areas[getCurrentArea()].creation.push(macroRaw);
        
        setTextareaValue(stringifySmart(mapObject), true);
        
        return true;
    }
    
    
    /* HTML manipulations
    */
    
    function resetDisplay() {
        if (display) {
            GameStarter.container.removeChild(display.container);
        }
        
        display = {
            "container": undefined,
            "scrollers": {
                "container": undefined,
                "left": undefined,
                "right": undefined
            },
            "gui": undefined,
            "namer": undefined,
            "minimizer": undefined,
            "stringer": {
                "textarea": undefined,
                "messenger": undefined
            },
            "sections": {
                "ClickToPlace": {
                    "container": undefined,
                    "Things": undefined,
                    "Macros": undefined,
                    "VisualSummary": undefined,
                    "VisualOptions": undefined,
                },
                "MapSettings": {
                    "container": undefined,
                    "Time": undefined,
                    "Setting": {
                        "Primary": undefined,
                        "Secondary": undefined,
                        "Tertiary": undefined
                    },
                    "Location": undefined,
                    "Entry": undefined
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
            "onclick": cancelEvent,
            "ondragenter": handleDragEnter,
            "ondragover": handleDragOver,
            "ondrop": handleDragDrop,
            "children": [
                display["scrollers"]["container"] = GameStarter.createElement("div", {
                    "className": "EditorScrollers",
                    "onmousemove": onMouseMoveEditing,
                    "onclick": onClickEditingThing,
                    "children": [
                        display["scrollers"]["left"] = GameStarter.createElement("div", {
                            "className": "EditorScroller EditorScrollerLeft",
                            "onmousedown": onMouseDownScroller.bind(undefined, -GameStarter.unitsize * 2),
                            "onmouseup": onMouseUpScrolling,
                            "onmouseout": onMouseUpScrolling,
                            "onclick": cancelEvent,
                            "innerText": "<",
                            "style": {
                                "paddingTop": GameStarter.MapScreener.height / 2 - 35 + "px",
                                "fontSize": "70px",
                                "opacity": 0
                            }
                        }),
                        display["scrollers"]["right"] = GameStarter.createElement("div", {
                            "className": "EditorScroller EditorScrollerRight",
                            "onmousedown": onMouseDownScroller.bind(undefined, GameStarter.unitsize * 2),
                            "onmouseup": onMouseUpScrolling,
                            "onmouseout": onMouseUpScrolling,
                            "onclick": cancelEvent,
                            "innerText": ">",
                            "style": {
                                "paddingTop": GameStarter.MapScreener.height / 2 - 35 + "px",
                                "fontSize": "70px"
                            }
                        })
                    ]
                }),
                display["gui"] = GameStarter.createElement("div", {
                    "className": "EditorGui",
                    "children": [
                        GameStarter.createElement("div", {
                            "className": "EditorHead",
                            "children": [
                                GameStarter.createElement("div", {
                                    "className": "EditorNameContainer",
                                    "children": [
                                        display["namer"] = GameStarter.createElement("input", {
                                            "className": "EditorNameInput",
                                            "type": "text",
                                            "placeholder": map_name_default,
                                            "value": map_name_default,
                                            "onkeyup": setMapName,
                                            "onchange": setMapName
                                        })
                                    ]
                                }),
                                display["minimizer"] = GameStarter.createElement("div", {
                                    "className": "EditorHeadButton EditorMinimizer",
                                    "onclick": self.minimize,
                                    "textContent": "-"
                                }),
                                GameStarter.createElement("div", {
                                    "className": "EditorHeadButton EditorCloser",
                                    "textContent": "X",
                                    "onclick": self.disable
                                })
                            ]
                        }),
                        GameStarter.createElement("div", {
                            "className": "EditorSectionChoosers",
                            "onclick": cancelEvent,
                            "children": [
                                display["sections"]["buttons"]["ClickToPlace"]["container"] = GameStarter.createElement("div", {
                                    "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                                    "style": {
                                        "background": "white"
                                    },
                                    "textContent": "Visual",
                                    "onclick": self.setSectionClickToPlace,
                                }),
                                display["sections"]["buttons"]["MapSettings"] = GameStarter.createElement("div", {
                                    "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                                    "style": {
                                        "background": "gray"
                                    },
                                    "textContent": "Map",
                                    "onclick": self.setSectionMapSettings,
                                }),
                                display["sections"]["buttons"]["JSON"] = GameStarter.createElement("div", {
                                    "className": "EditorMenuOption EditorSectionChooser EditorMenuOptionThird",
                                    "style": {
                                        "background": "gray"
                                    },
                                    "textContent": "JSON",
                                    "onclick": self.setSectionJSON
                                })
                            ]
                        }),
                        display["sections"]["ClickToPlace"]["container"] = GameStarter.createElement("div", {
                            "className": "EditorOptionsList EditorSectionMain",
                            "onclick": cancelEvent,
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
                                            "onclick": self.setSectionClickToPlaceThings,
                                            "style": {
                                                "background": "#CCC"
                                            }
                                        }),
                                        display["sections"]["buttons"]["ClickToPlace"]["Macros"] = GameStarter.createElement("div", {
                                            "className": "EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
                                            "textContent": "Macros",
                                            "onclick": self.setSectionClickToPlaceMacros,
                                            "style": {
                                                "background": "#777"
                                            }
                                        })
                                    ]
                                }),
                                display["sections"]["ClickToPlace"]["Things"] = GameStarter.createElement("div", {
                                    "className": "EditorSectionSecondary EditorOptions EditorOptions-Things",
                                    "style": {
                                        "display": "block"
                                    },
                                    "children": (function () {
                                            var containers = Object.keys(things).map(function (key) {
                                                var children = Object.keys(things[key]).map(function (title) {
                                                    var thing = GameStarter.ObjectMaker.make(title),
                                                        container = GameStarter.createElement("div", {
                                                            "className": "EditorListOption",
                                                            "name": title,
                                                            "options": things[key][title],
                                                            "children": [thing.canvas],
                                                            "onclick": onThingIconClick.bind(
                                                                undefined,
                                                                title
                                                            )
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
                                                
                                                return GameStarter.createElement("div", {
                                                    "className": "EditorOptionContainer",
                                                    "style": {
                                                        "display": "none"
                                                    },
                                                    "children": children
                                                });
                                            }),
                                            selectedIndex = 0,
                                            switcher = createSelect(Object.keys(things), {
                                                "className": "EditorOptionContainerSwitchers",
                                                "onchange": function () {
                                                    containers[selectedIndex + 1].style.display = "none";
                                                    containers[switcher.selectedIndex + 1].style.display = "block";
                                                    selectedIndex = switcher.selectedIndex;
                                                }
                                            });
                                            
                                            containers[0].style.display = "block";
                                            containers.unshift(switcher);
                                            
                                        return containers;
                                    })()
                                }),
                                display["sections"]["ClickToPlace"]["Macros"] = GameStarter.createElement("div", {
                                    "className": "EditorSectionSecondary EditorOptions EditorOptions-Macros",
                                    "style": {
                                        "display": "none"
                                    },
                                    "children": Object.keys(macros).map(function (key) {
                                        var macro = macros[key];
                                        return GameStarter.createElement("div", {
                                            "className": "EditorOptionContainer",
                                            "children": [
                                                GameStarter.createElement("div", {
                                                    "className": "EditorOptionTitle EditorMenuOption",
                                                    "textContent": key,
                                                    "onclick": onMacroIconClick.bind(
                                                        undefined,
                                                        key,
                                                        macro["description"],
                                                        macro["options"]
                                                    )
                                                })
                                            ]
                                        })
                                    })
                                })
                            ]
                        }),
                        display["sections"]["MapSettings"]["container"] = GameStarter.createElement("div", {
                            "className": "EditorMapSettings EditorSectionMain",
                            "onclick": cancelEvent,
                            "style": {
                                "display": "none"
                            },
                            "children": [
                                GameStarter.createElement("div", {
                                    "className": "EditorMapSettingsSubGroup",
                                    "children": [
                                        GameStarter.createElement("label", {
                                            "textContent": "Current Location"
                                        }),
                                        display["sections"]["MapSettings"]["Location"] = createSelect([
                                            0
                                        ], {
                                            "className": "VisualOptionLocation",
                                            "onchange": setCurrentLocation.bind(undefined, true)
                                        })
                                    ]
                                }),
                                GameStarter.createElement("div", {
                                    "className": "EditorMapSettingsGroup",
                                    "children": [
                                        GameStarter.createElement("h4", {
                                            "textContent": "Map"
                                        }),
                                        GameStarter.createElement("div", {
                                            "className": "EditorMapSettingsSubGroup",
                                            "children": [
                                                GameStarter.createElement("label", {
                                                    "className": "EditorMapSettingsLabel",
                                                    "textContent": "Time"
                                                }),
                                                display["sections"]["MapSettings"]["Time"] = createSelect([
                                                    "100", "200", "300", "400", "500", "1000", "2000", "Infinity"
                                                ], {
                                                    "value": "Infinity",
                                                    "onchange": setMapTime.bind(undefined, true)
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                GameStarter.createElement("div", {
                                    "className": "EditorMapSettingsGroup",
                                    "children": [
                                        GameStarter.createElement("h4", {
                                            "textContent": "Location"
                                        }),
                                        GameStarter.createElement("div", {
                                            "className": "EditorMapSettingsSubGroup",
                                            "children": [
                                                GameStarter.createElement("label", {
                                                    "textContent": "Area"
                                                }),
                                                display["sections"]["MapSettings"]["Area"] = createSelect([
                                                    0
                                                ], {
                                                    "className": "VisualOptionArea",
                                                    "onchange": setLocationArea.bind(undefined, true)
                                                })
                                            ]
                                        }),
                                        GameStarter.createElement("div", {
                                            "className": "EditorMapSettingsSubGroup",
                                            "children": [
                                                GameStarter.createElement("label", {
                                                    "textContent": "Setting"
                                                }),
                                                display["sections"]["MapSettings"]["Setting"]["Primary"] = createSelect([
                                                    "Overworld", "Underworld", "Underwater", "Castle"
                                                ], {
                                                    "onchange": setMapSetting.bind(undefined, true)
                                                }),
                                                display["sections"]["MapSettings"]["Setting"]["Secondary"] = createSelect([
                                                    "", "Night", "Underwater", "Alt"
                                                ], {
                                                    "onchange": setMapSetting.bind(undefined, true)
                                                }),
                                                display["sections"]["MapSettings"]["Setting"]["Tertiary"] = createSelect([
                                                    "", "Night", "Underwater", "Alt"
                                                ], {
                                                    "onchange": setMapSetting.bind(undefined, true)
                                                })
                                            ]
                                        }),
                                        GameStarter.createElement("div", {
                                            "className": "EditorMapSettingsSubGroup",
                                            "children": [
                                                GameStarter.createElement("label", {
                                                    "textContent": "Entrance"
                                                }),
                                                display["sections"]["MapSettings"]["Entry"] = createSelect([
                                                    "Plain", "Normal", "Castle", "PipeVertical", "PipeHorizontal"
                                                ], {
                                                    "onchange": setMapEntry.bind(undefined, true)
                                                }),
                                            ]
                                        })
                                    ]
                                }),
                                GameStarter.createElement("div", {
                                    "className": "EditorMenuOption",
                                    "textContent": "+ Add Area",
                                    "onclick": addAreaToMap
                                }),
                                GameStarter.createElement("div", {
                                    "className": "EditorMenuOption",
                                    "textContent": "+ Add Location",
                                    "onclick": addLocationToMap
                                })
                            ]
                        }),
                        display["sections"]["JSON"] = GameStarter.createElement("div", {
                            "className": "EditorJSON EditorSectionMain",
                            "onclick": cancelEvent,
                            "style": {
                                "display": "none"
                            },
                            "children": [
                                display["stringer"]["textarea"] = GameStarter.createElement("textarea", {
                                    "className": "EditorJSONInput",
                                    "spellcheck": false,
                                    "onkeyup": getMapObjectAndTry,
                                    "onchange": getMapObjectAndTry
                                }),
                                display["stringer"]["messenger"] = GameStarter.createElement("div", {
                                    "className": "EditorJSONInfo"
                                })
                            ]
                        }),
                        display["sections"]["ClickToPlace"]["VisualSummary"] = GameStarter.createElement("div", {
                            "className": "EditorVisualSummary",
                            "onclick": cancelEvent,
                        }),
                        display["sections"]["ClickToPlace"]["VisualOptions"] = GameStarter.createElement("div", {
                            "className": "EditorVisualOptions",
                            "onclick": cancelEvent,
                            "textContent": "Click an icon to view options.",
                            "style": {
                                "display": "block"
                            }
                        }),
                        GameStarter.createElement("div", {
                            "className": "EditorMenu",
                            "onclick": cancelEvent,
                            "children": (function (actions) {
                                return Object.keys(actions).map(function (key) {
                                    return GameStarter.createElement("div", {
                                        "className": "EditorMenuOption EditorMenuOptionFifth EditorMenuOption-" + key,
                                        "textContent": key,
                                        "onclick": actions[key][0],
                                        "children": actions[key][1]
                                    });
                                });
                            })({
                                "Build": [self.startBuilding],
                                "Play": [self.startPlaying],
                                "Save": [self.downloadCurrentJSON],
                                "Load": [
                                    self.loadCurrentJSON,
                                    display["sections"]["inputDummy"] = GameStarter.createElement("input", {
                                        "type": "file",
                                        "style": {
                                            "display": "none"
                                        },
                                        "onchange": self.handleUploadStart
                                    })
                                ],
                                "Reset": [resetDisplayMap]
                            })
                        })
                    ]
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
    self.setSectionClickToPlace = function () {
        display.sections.ClickToPlace.VisualOptions.style.display = "block";
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
    self.setSectionMapSettings = function () {
        display.sections.ClickToPlace.VisualOptions.style.display = "none";
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
    self.setSectionJSON = function () {
        display.sections.ClickToPlace.VisualOptions.style.display = "none";
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
    self.setSectionClickToPlaceThings = function (event) {
        setCurrentClickMode("Thing", event);
        display.gui.onclick = onClickEditingThing;
        display.scrollers.container.onclick = onClickEditingThing;
        display.sections.ClickToPlace.VisualOptions.style.display = "block";
        display.sections.ClickToPlace.Things.style.display = "block";
        display.sections.ClickToPlace.Macros.style.display = "none";
        display.sections.buttons.ClickToPlace.Things.style.background = "#CCC";
        display.sections.buttons.ClickToPlace.Macros.style.background = "#777";
    }
    
    /**
     * 
     */
    self.setSectionClickToPlaceMacros = function (event) {
        setCurrentClickMode("Macro", event);
        display.gui.onclick = onClickEditingMacro;
        display.scrollers.container.onclick = onClickEditingMacro;
        display.sections.ClickToPlace.VisualOptions.style.display = "block";
        display.sections.ClickToPlace.Things.style.display = "none";
        display.sections.ClickToPlace.Macros.style.display = "block";
        display.sections.buttons.ClickToPlace.Things.style.background = "#777";
        display.sections.buttons.ClickToPlace.Macros.style.background = "#CCC";
    }
    
    /**
     * 
     */
    function setTextareaValue(value, doBeautify) {
        if (doBeautify) {
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
    function setVisualOptions(name, description, options) {
        var visual = display["sections"]["ClickToPlace"]["VisualOptions"];
        
        visual.textContent = "";
        
        visual.appendChild(GameStarter.createElement("h3", {
            "className": "VisualOptionName",
            "textContent": name
        }));
        
        if (description) {
            visual.appendChild(GameStarter.createElement("div", {
                "className": "VisualOptionDescription",
                "textContent": description
            }));
        }
        
        if (options) {
            visual.appendChild(GameStarter.createElement("div", {
                "className": "VisualOptionsList",
                "children": Object.keys(options).map(function (key) {
                    return GameStarter.createElement("div", {
                        "className": "VisualOption",
                        "children": [
                            GameStarter.createElement("div", {
                                "className": "VisualOptionLabel",
                                "textContent": key
                            }),
                            createVisualOption(options[key])
                        ]
                    });
                })
            }));
        }
        
        display["sections"]["ClickToPlace"]["VisualSummary"].textContent = name;
    }
    
    /**
     * 
     */
    function createVisualOption(option) {
        switch (option.constructor) {
            case Number:
                option = {
                    "type": "Number",
                    "mod": option
                };
                break;
            
            case String:
                option = {
                    "type": option
                };
                break;
            
            case Array:
                option = {
                    "type": "Select",
                    "options": option
                };
                break;
        }
        
        switch (option.type) {
            case "Boolean":
                return createSelect([
                    "false", "true"
                ], {
                    "className": "VisualOptionValue",
                    "data:type": "Boolean",
                    "onchange": setCurrentArgs
                });
            
            case "Number":
                return GameStarter.createElement("div", {
                    "className": "VisualOptionHolder",
                    "children": (function () {
                        var modReal = option["mod"] || 1,
                            input = GameStarter.createElement("input", {
                                "type": "Number",
                                "data:type": "Number",
                                "value": (option["value"] === undefined) ? 1 : option["value"]
                            }, {
                                "className": "VisualOptionValue modReal" + modReal,
                                "onchange": setCurrentArgs
                            }),
                            children = [input];
                        
                        input.setAttribute("data:mod", modReal);
                        
                        if (option["Infinite"]) {
                            var valueOld,
                                infinite = createSelect(["Number", "Infinite"], {
                                    "className": "VisualOptionInfiniter",
                                    "onchange": function () {
                                        if (infinite.value === "Number") {
                                            input.type = "Number";
                                            input.disabled = false;
                                            
                                            input.value = valueOld;
                                            input.onchange();
                                        } else {
                                            input.type = "Text";
                                            input.disabled = true;
                                            
                                            valueOld = input.value;
                                            input.value = Infinity;
                                            input.onchange();
                                        }
                                    }
                                });
                            
                            if (option["value"] === Infinity) {
                                infinite.value = "Infinite";
                                infinite.onchange();
                            }
                            
                            children.push(infinite);
                        }
                        
                        if (modReal > 1) {
                            children.push(GameStarter.createElement("div", {
                                "className": "VisualOptionRecommendation",
                                "textContent": "x" + option["mod"]
                            }));
                        }
                        
                        return children;
                    })()
                });
            
            case "Select":
                return createSelect(option["options"], {
                    "className": "VisualOptionValue",
                    "data:type": "Boolean",
                    "onchange": setCurrentArgs
                });
            
            case "Location":
                var map = getMapObject();
                
                if (!map) {
                    return GameStarter.createElement("div", {
                        "className": "VisualOptionValue VisualOptionLocation EditorComplaint",
                        "text": "Fix map compilation to get locations!"
                    });
                }
                
                return createSelect(Object.keys(map.locations), {
                    "className": "VisualOptionValue VisualOptionLocation",
                    "data-type": "Number"
                });
            
            case "Area":
                var map = getMapObject();
                
                if (!map) {
                    return GameStarter.createElement("div", {
                        "className": "VisualOptionValue VisualOptionArea EditorComplaint",
                        "text": "Fix map compilation to get areas!"
                    });
                }
                
                return createSelect(Object.keys(map.areas), {
                    "className": "VisualOptionValue VisualOptionArea",
                    "data-type": "Number",
                    "onchange": setCurrentArgs
                });
            
            case "Everything":
                return createSelect(thing_keys, {
                    "className": "VisualOptionValue VisualOptionEverything",
                    "data-type": "String",
                    "onchange": setCurrentArgs
                });
            
            default:
                return GameStarter.createElement("div", {
                    "className": "EditorComplaint",
                    "textContent": "Unknown type requested: " + option.type
                });
        }
    }
    
    /**
     * 
     */
    function resetDisplayMap() {
        setTextareaValue(stringifySmart(map_default), true);
        setDisplayMap(true);
        GameStarter.InputWriter.setCanTrigger(false);
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
            testObject = parseSmart(value);
            setTextareaValue(display.stringer.textarea.value);
        } catch (error) {
            self.setSectionJSON();
            display.stringer.messenger.textContent = error.message;
            return;
        }
        
        try {
            GameStarter.MapsCreator.storeMap(mapName, testObject);
            map = GameStarter.MapsCreator.getMap(mapName);
        } catch (error) {
            self.setSectionJSON();
            display.stringer.messenger.textContent = error.message;
            return;
        }
        
        display.stringer.messenger.textContent = "";
        setTextareaValue(display.stringer.textarea.value);
        GameStarter.setMap(mapName, getCurrentLocation());
        
        if (doDisableThings) {
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
    var stringifySmart = (function (replacer) {
        return function(text) {
            return JSON.stringify(text, replacer);
        }
    })(function (key, value) {
        if (value !== value) {
            return "NaN";
        } else if (value === Infinity) {
            return "Infinity";
        } else if (value === -Infinity) {
            return "-Infinity";
        } else {
            return value;
        }
    });
    
    /**
     * 
     */
    var parseSmart = (function (replacer) {
        return function(text) {
            return JSON.parse(text, replacer);
        }
    })(function (key, value) {
        if (value === "NaN") {
            return NaN;
        } else if (value === "Infinity") {
            return Infinity;
        } else if (value === "-Infinity") {
            return -Infinity;
        } else {
            return value;
        }
    });
    
    /**
     * 
     */
    function disableThing(thing, opacity) {
        thing.movement = undefined;
        thing.onThingMake = undefined;
        thing.onThingAdd = undefined;
        thing.onThingAdded = undefined;
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
        
        for (i in groups) {
            for (j in groups[i]) {
                GameStarter.killNormal(groups[i][j]);
            }
        }
    }
    
    /**
     * 
     */
    function getNormalizedX(raw) {
        return raw / GameStarter.unitsize;
    }
    
    /**
     * 
     */
    function getNormalizedY(raw) {
        return GameStarter.MapScreener.floor - (raw / GameStarter.unitsize) + GameStarter.unitsize * 3; // Why +3?
    }
    
    /**
     * 
     */
    function getNormalizedThingArguments(args) {
        var argsNormal = GameStarter.proliferate({}, args);
        
        if (argsNormal["height"] === Infinity) {
            argsNormal["height"] = GameStarter.MapScreener.height;
        }
        if (argsNormal["width"] === Infinity) {
            argsNormal["width"] = GameStarter.MapScreener.width;
        }
        
        return argsNormal;
    }
    
    /**
     * 
     */
    function createSelect(options, attributes) {
        var select = GameStarter.createElement("select", attributes),
            i;
        
        for (i = 0; i < options.length; i += 1) {
            select.appendChild(GameStarter.createElement("option", {
                "value": options[i],
                "textContent": options[i]
            }));
        }
        
        if (typeof attributes.value !== "undefined") {
            select.value = attributes.value;
        }
        
        return select;
    }
    
    /**
     * 
     */
    function downloadFile(name, content) {
        var link = document.createElement('a');
        link.setAttribute('download', name);
        link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(content));
        display.container.appendChild(link);
        link.click();
        display.container.removeChild(link);
        return link;
    }
    
    /**
     * 
     */
    function killCurrentThings() {
        for (var i = 0; i < current_things.length - 1; i += 1) {
            GameStarter.killNormal(current_things[i].thing);
        }
    }
    
    /**
     * 
     */
    function cancelEvent(event) {
        if (!event) {
            return;
        }
        
        if (typeof event.preventDefault === "function") {
            event.preventDefault();
        }
        
        if (typeof event.stopPropagation === "function") {
            event.stopPropagation();
        }
        
        event.cancelBubble = true;
    }
    
    self.reset(settings || {});
}