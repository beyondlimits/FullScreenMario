(function (schemas, generators) {
    var LoadGame = function () {
        var section = document.getElementById("game"),
            FSM = new FullScreenMario({
                "width": document.body.clientWidth, 
                "height": 464
            });
        
        window["FSM"] = FSM;
        
        section.textContent = "";
        section.appendChild(FSM.container);
        
        FSM.proliferate(document.body, {
            "onkeydown": FSM.InputWriter.makePipe("onkeydown", "keyCode"),
            "onkeyup": FSM.InputWriter.makePipe("onkeyup", "keyCode")
        });
        
        FSM.proliferate(section, {
            "onmousedown": FSM.InputWriter.makePipe("onmousedown", "which"),
            "oncontextmenu": FSM.InputWriter.makePipe("oncontextmenu", null, true)
        });

        FSM.gameStart();
    };
    
    var LoadControls = function (schemas, generators) {
        var section = document.getElementById("controls"),
            length = schemas.length,
            i;
        
        section.textContent = "";
        section.className = "length-" + length;
        
        for(i = 0; i < length; i += 1) {
            section.appendChild(LoadControlDiv(schemas[i], generators));
        }
    };
    
    var LoadControlDiv = function (schema, generators) {
        var control = document.createElement("div"),
            heading = document.createElement("h4"),
            inner = document.createElement("div");
        
        control.className = "control";
        
        heading.textContent = schema.title;
        
        inner.className = "control-inner";
        inner.appendChild(generators[schema.generator](schema));
        
        control.appendChild(heading);
        control.appendChild(inner);
        
        // Touch events often propogate to children before the control div has
        // been fully extended. Setting the "active" attribute fixes that.
        control.onmouseover = setTimeout.bind(undefined, function () {
            control.setAttribute("active", "on");
        }, 35);
        
        control.onmouseout = function () {
            control.setAttribute("active", "off");
        };
        
        return control;
    }
    
    document.onreadystatechange = function (event) {
        if(event.target.readyState != "complete") {
            return;
        }
        
        var time_start = Date.now();
        
        LoadGame();
        LoadControls(schemas, generators);
        
        console.log("It took " + (Date.now() - time_start) + " milliseconds to start");
    };
})([
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
                    return FSM.AudioPlayer.getVolume() * 100;
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
                "title": "FullScreen",
                "type": "Boolean",
                "source": function () {
                    return false;
                },
                "confirmation": true
            }
        ]
    },
    {
        "title": "Controls",
        "generator": "OptionsTable",
        "options": [
            {
                "title": "Left",
                "type": "Keys",
                "source": function () {
                    return FSM.InputWriter.getAliasAsKeyStrings("left");
                }
            },
            {
                "title": "Right",
                "type": "Keys",
                "source": function () {
                    return FSM.InputWriter.getAliasAsKeyStrings("right");
                }
            },
            {
                "title": "Up",
                "type": "Keys",
                "source": function () {
                    return FSM.InputWriter.getAliasAsKeyStrings("up");
                }
            },
            {
                "title": "Down",
                "type": "Keys",
                "source": function () {
                    return FSM.InputWriter.getAliasAsKeyStrings("down");
                }
            }
        ]
    },
    {
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
    },
    {
        "title": "Editor",
        "generator": "LevelEditor"
    },
    {
        "title": "Maps",
        "generator": "MapsGrid",
        "rangeX": [1, 4],
        "rangeY": [1, 8],
        "extras": {
            "Map Generator!": "Random"
        },
        "callback": function (schema, button, event) {
            console.log("Setting map");
            FSM.setMap(button.getAttribute("value") || button.textContent);
        }
    },
], {
    "OptionsButtons": function (schema) {
        var output = document.createElement("div"),
            options = schema.options instanceof Function ? schema.options() : schema.options,
            optionKeys = Object.keys(options),
            keyActive = schema.keyActive || "active",
            classNameStart = "select-option options-button-option",
            option, element, i;
    
        function getParentControlDiv(element) {
            if(element.className === "control") {
                return element;
            } else if(!element.parentNode) {
                return undefined;
            } 
            return getParentControlDiv(element.parentNode);
        }
        
        output.className = "select-options select-options-buttons";
        
        for(i = 0; i < optionKeys.length; i += 1) {
            option = options[optionKeys[i]];
            
            element = document.createElement("div");
            element.className = classNameStart;
            element.textContent = optionKeys[i];
            
            element.onclick = function (schema, element) {
                if(getParentControlDiv(element).getAttribute("active") !== "on") {
                    return;
                }
                schema.callback.call(schema, schema, element);
                
                if(element.getAttribute("option-enabled") == "true") {
                    element.setAttribute("option-enabled", false);
                    element.className = classNameStart + " option-disabled";
                } else {
                    element.setAttribute("option-enabled", true);
                    element.className = classNameStart + " option-enabled";
               }
            }.bind(undefined, schema, element);
            
            if(option[keyActive]) {
                element.className += " option-enabled";
                element.setAttribute("option-enabled", true);
            } else if(schema.assumeInactive) {
                element.className += " option-disabled";
                element.setAttribute("option-enabled", false);
            } else {
                element.setAttribute("option-enabled", true);
            }
            
            output.appendChild(element);
        }
        
        return output;
    },
    "OptionsTable": (function () {
        function setBooleanInput(input, details) {
            var status = details.source() ? "on" : "off",
                statusString = status === "on" ? "enabled" : "disabled";
            
            input.className = "select-option options-button-option option-" + statusString;
            input.textContent = status;
            
            input.onclick = function () {
                if(input.textContent === "on") {
                    details.disable();
                    input.textContent = "off";
                    input.className = input.className.replace("enabled", "disabled");
                } else {
                    details.enable();
                    input.textContent = "on";
                    input.className = input.className.replace("disabled", "enabled");
                }
            };
        }
        
        function setKeyInput(input, details) {
            var values = details.source(),
                child, i;
                
            for(i = 0; i < values.length; i += 1) {
                child = document.createElement("div");
                child.textContent = values[i];
                input.appendChild(child);
            }
        }
        
        function setNumberInput(input, details) {
            var child = document.createElement("input");
            
            child.type = "number";
            child.value = Number(details.source());
            child.min = details.minimum || 0;
            child.max = details.maximum || Math.max(details.minimum + 10, 10);
            
            child.onchange = child.oninput = function () {
                if(child.checkValidity()) {
                    details.update(child.value);
                }
            };
            
            input.appendChild(child);
        }
        
        var optionTypes = {
            "Boolean": setBooleanInput,
            "Keys": setKeyInput,
            "Number": setNumberInput
        };

        return function (schema) {
            var output = document.createElement("div"),
                table = document.createElement("table"),
                etails, row, label, input,
                i;
            
            output.className = "select-options select-options-table";
            
            for(i = 0; i < schema.options.length; i += 1) {
                row = document.createElement("tr");
                label = document.createElement("td");
                input = document.createElement("td");
                
                details = schema.options[i],
                
                label.textContent = details.title;
                
                row.appendChild(label);
                row.appendChild(input);
                
                optionTypes[schema.options[i].type](input, details);
                table.appendChild(row);
            }
            
            output.appendChild(table);
            
            return output;
        };
    
    })(),
    "LevelEditor": function (schema) {
        var output = document.createElement("div"),
            title = document.createElement("div"),
            button = document.createElement("div"),
            between = document.createElement("div"),
            uploader = document.createElement("div");
        
        output.className = "select-options select-options-level-editor";
        
        title.className = "select-option-title";
        title.textContent = "Create your own custom levels:";
        
        button.className = "select-option select-option-large options-button-option";
        button.innerHTML = "Start the <br /> Level Editor!";
        button.onclick = function () {
            FSM.LevelEditor.enable();
        };
        
        between.className = "select-option-title";
        between.innerHTML = "<em>- or -</em><br /><br />Continue your editor files:";
        
        uploader.className = "disabled select-option select-option-large select-option-inset options-button-option";
        uploader.textContent = "Click here, or drag a file";
        
        output.appendChild(title);
        output.appendChild(button);
        output.appendChild(between);
        output.appendChild(uploader);
        
        return output;
    },
    "MapsGrid": function (schema) {
        var output = document.createElement("div"),
            rangeX = schema.rangeX,
            rangeY = schema.rangeY;
        
        output.className = "select-options select-options-maps-grid";
        
        if(rangeX && rangeY) {
            var table = document.createElement("table"),
                row,
                i, j;
                
            function getParentControlDiv(element) {
                if(element.className === "control") {
                    return element;
                } else if(!element.parentNode) {
                    return undefined;
                } 
                return getParentControlDiv(element.parentNode);
            }    
            
            for(i = rangeY[0]; i <= rangeY[1]; i += 1) {
                row = document.createElement("tr");
                row.className = "maps-grid-row";
                
                for(j = rangeX[0]; j <= rangeX[1]; j += 1) {
                    element = document.createElement("td");
                    element.className = "select-option maps-grid-option maps-grid-option-range";
                    element.textContent = i + "-" + j;
                    element.onclick = function () {
                        if(getParentControlDiv(element).getAttribute("active") !== "on") {
                            return;
                        }
                        schema.callback.bind(schema, schema, element);
                    };
                    row.appendChild(element);
                }
                
                table.appendChild(row);
            }
            
            output.appendChild(table);
        }
        
        if(schema.extras) {
            for(var i in schema.extras) {
                element = document.createElement("div");
                element.className = "select-option maps-grid-option maps-grid-option-extra";
                element.textContent = i;
                element.setAttribute("value", schema.extras[i]);
                element.onclick = schema.callback.bind(schema, schema, element);
                output.appendChild(element);
            }
        }
        
        return output;
    }
});