(function (schemas, generators) {
    "use strict";
    
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
                "title": "FullScreen",
                "type": "Boolean",
                "source": function () {
                    return false;
                },
                "confirmation": true
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
            }
        ]
    },
    {
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
        
        var allPossibleKeys = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'up', 'right', 'bottom', 'left', 'space', 'shift', 'ctrl'
        ];
        
        function setKeyInput(input, details) {
            var values = details.source(),
                child, i, j;
            
            for(i = 0; i < values.length; i += 1) {
                child = document.createElement("select");
                child.className = "options-key-option";
                
                for(j = 0; j < allPossibleKeys.length; j += 1) {
                    child.appendChild(new Option(allPossibleKeys[j]));
                }
                child.value = child.valueOld = values[i].toLowerCase();
                
                child.onchange = (function (child) {
                    details.callback(child.valueOld, child.value);
                }).bind(undefined, child);
                
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
        
        function setSelectInput(input, details) {
            var child = document.createElement("select"),
                options = details.options(),
                i;
            
            for(i = 0; i < options.length; i += 1) {
                child.appendChild(new Option(options[i]));
            }
            
            child.value = details.source();
            
            child.onchange = function () {
                details.update(child.value);
            };
            
            input.appendChild(child);
        }
        
        var optionTypes = {
            "Boolean": setBooleanInput,
            "Keys": setKeyInput,
            "Number": setNumberInput,
            "Select": setSelectInput
        };

        return function (schema) {
            var output = document.createElement("div"),
                table = document.createElement("table"),
                details, row, label, input,
                i;
            
            output.className = "select-options select-options-table";
            
            for(i = 0; i < schema.options.length; i += 1) {
                row = document.createElement("tr");
                label = document.createElement("td");
                input = document.createElement("td");
                
                details = schema.options[i],
                
                label.className = "options-label-" + details.type;
                label.textContent = details.title;
                
                input.className = "options-cell-" + details.type;
                
                row.appendChild(label);
                row.appendChild(input);
                
                optionTypes[schema.options[i].type](input, details);
                table.appendChild(row);
            }
            
            output.appendChild(table);
            
            return output;
        };
    
    })(),
    "LevelEditor": (function () {
        function createUploaderDiv() {
            var uploader = document.createElement("div"),
                input = document.createElement("input");
            
            uploader.className = "select-option select-option-large options-button-option";
            uploader.textContent = "Click to upload and continue your editor files!";
            uploader.setAttribute("textOld", uploader.textContent);
            
            input.type = "file";
            input.className = "select-upload-input";
            input.onchange = handleFileDrop.bind(undefined, input, uploader);
            
            uploader.ondragenter = handleFileDragEnter.bind(undefined, uploader);
            uploader.ondragover = handleFileDragOver.bind(undefined, uploader);
            uploader.ondragleave = input.ondragend = handleFileDragLeave.bind(undefined, uploader);
            uploader.ondrop = handleFileDrop.bind(undefined, input, uploader);
            uploader.onclick = input.click.bind(input);
            
            uploader.appendChild(input);
            
            return uploader;
        };
        
        function handleFileDragEnter(uploader, event) {
            if(event.dataTransfer) {
                event.dataTransfer.dropEFfect = "copy";
            }
            uploader.className += " hovering";
        }
        
        function handleFileDragOver(uploader, event) {
            event.preventDefault();
            return false;
        }
        
        function handleFileDragLeave(uploader, event) {
            if(event.dataTransfer) {
                event.dataTransfer.dropEffect = "none"
            }
            uploader.className = uploader.className.replace(" hovering", "");
        }
        
        function handleFileDrop(input, uploader, event) {
            var files = input.files || event.dataTransfer.files,
                file = files[0],
                reader = new FileReader();
            
            handleFileDragLeave(input, event);
            event.preventDefault();
            event.stopPropagation();
            
            reader.onprogress = handleFileUploadProgress.bind(undefined, file, uploader);
            reader.onloadend = handleFileUploadCompletion.bind(undefined, file, uploader);
            
            reader.readAsText(file);
        }
        
        function handleFileUploadProgress(file, uploader, event) {
            var percent;
            
            if(!event.lengthComputable) {
                return;
            }
            
            percent = Math.round((event.loaded / event.total) * 100);
            
            if(percent > 100) {
                percent = 100;
            }
            
            uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
        }
        
        function handleFileUploadCompletion(file, uploader, event) {
            FSM.LevelEditor.handleUploadCompletion(event);
            uploader.innerText = uploader.getAttribute("textOld");
        }
        
        return function (schema) {
            var output = document.createElement("div"),
                title = document.createElement("div"),
                button = document.createElement("div"),
                between = document.createElement("div"),
                uploader = createUploaderDiv();
            
            output.className = "select-options select-options-level-editor";
            
            title.className = "select-option-title";
            title.textContent = "Create your own custom levels:";
            
            button.className = "select-option select-option-large options-button-option";
            button.innerHTML = "Start the <br /> Level Editor!";
            button.onclick = function () {
                FSM.LevelEditor.enable();
            };
            
            between.className = "select-option-title";
            between.innerHTML = "<em>- or -</em><br />";
            
            output.appendChild(title);
            output.appendChild(button);
            output.appendChild(between);
            output.appendChild(uploader);
            
            return output;
        }
    })(),
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
                    element.onclick = (function (callback) {
                        if(getParentControlDiv(element).getAttribute("active") !== "on") {
                            return;
                        }
                        callback();
                    }).bind(undefined, schema.callback.bind(schema, schema, element));
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