(function (schemas, generators) {
    var LoadGame = function () {
        var section = document.getElementById("game"),
            FSM = new FullScreenMario({
                "width": window.innerWidth, 
                "height": 464
            });
            
        section.innerText = "";
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
        window["FSM"] = FSM;
    };
    
    var LoadControls = function (schemas, generators) {
        var section = document.getElementById("controls"),
            length = schemas.length,
            i;
        
        section.innerText = "";
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
        
        heading.innerText = schema.title;
        
        inner.className = "control-inner";
        inner.appendChild(generators[schema.generator](schema));

        control.appendChild(heading);
        control.appendChild(inner);
        return control;
    }
    
    // document.body.onload = function () {
    document.onreadystatechange = function (event) {
        if(event.target.readyState != "complete") {
            return;
        }
        
        var time_start = Date.now();
        
        LoadControls(schemas, generators);
        LoadGame();
        
        console.log("It took " + (Date.now() - time_start) + " milliseconds to start");
    };
})([
    {
        "title": "Options",
        "generator": "OptionsTable",
        "options": [
            {
                "title": "Mute",
                "type": "Boolean",
                "source": function () {
                    return false;
                }
            },
            {
                "title": "FastFwd",
                "type": "Boolean",
                "source": function () {
                    return false;
                }
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
                    return ["a"];
                }
            },
            {
                "title": "Right",
                "type": "Keys",
                "source": function () {
                    return ["d"];
                }
            },
            {
                "title": "Up",
                "type": "Keys",
                "source": function () {
                    return ["w"];
                }
            },
            {
                "title": "Down",
                "type": "Keys",
                "source": function () {
                    return ["s"];
                }
            }
        ]
    },
    {
        "title": "Mods!",
        "generator": "OptionsButtons",
        "options": [
            "Acid Trip",
            "High Speed",
            "Invincibility",
            "Invisible Player",
            "Luigi",
            "Parallax Clouds",
            "QCount",
            "Super Fireballs"
        ],
        "callback": function (schema, button) {
            FSM.ModAttacher.toggleMod(button.getAttribute("value") || button.innerText);
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
        "callback": function (schema, button) {
            FSM.setMap(button.getAttribute("value") || button.innerText);
        }
    },
], {
    "OptionsButtons": function (schema) {
        var output = document.createElement("div"),
            options = schema.options,
            element, i;
        
        output.className = "select-options select-options-buttons";
        
        for(i = 0; i < options.length; i += 1) {
            element = document.createElement("div");
            element.className = "select-option options-button-option";
            element.innerText = options[i];
            element.onclick = schema.callback.bind(schema, schema, element);
            output.appendChild(element);
        }
        
        return output;
    },
    "OptionsTable": (function () {
        function CreateBooleanRow(details) {
            var row = document.createElement("tr"),
                left = document.createElement("td"),
                right = document.createElement("td");
            
            left.innerText = details.title;
            
            right.className = "select-option options-button-option";
            right.innerText = "off";
            
            row.appendChild(left);
            row.appendChild(right);
            
            return row;
        }
        
        function CreateKeyRow(details) {
            var row = document.createElement("tr"),
                left = document.createElement("td"),
                right = document.createElement("td"),
                values, child,
                i;
                
            left.innerText = details.title;
            
            values = details.source();
            for(i = 0; i < values.length; i += 1) {
                child = document.createElement("td");
                child.innerText = values[i];
                right.appendChild(child);
            }
            
            row.appendChild(left);
            row.appendChild(right);
            
            return row;
        }
        
        var optionTypes = {
            "Boolean": CreateBooleanRow,
            "Keys": CreateKeyRow
        };

        return function (schema) {
            var output = document.createElement("div"),
                table = document.createElement("table"),
                generator, i;
            
            output.className = "select-options select-options-table";
            
            for(i = 0; i < schema.options.length; i += 1) {
                generator = optionTypes[schema.options[i].type];
                table.appendChild(generator(schema.options[i]));
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
        title.innerText = "Create your own custom levels:";
        
        button.className = "disabled select-option select-option-large options-button-option";
        button.innerHTML = "Start the <br /> Level Editor!";
        
        between.className = "select-option-title";
        between.innerHTML = "<em>- or -</em><br /><br />Continue your editor files:";
        
        uploader.className = "disabled select-option select-option-large select-option-inset options-button-option";
        uploader.innerText = "Click here, or drag a file";
        
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
                
            for(i = rangeY[0]; i <= rangeY[1]; i += 1) {
                row = document.createElement("tr");
                row.className = "maps-grid-row";
                
                for(j = rangeX[0]; j <= rangeX[1]; j += 1) {
                    element = document.createElement("td");
                    element.className = "select-option maps-grid-option maps-grid-option-range";
                    element.innerText = i + "-" + j;
                    element.onclick = schema.callback.bind(schema, schema, element);
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
                element.innerText = i;
                element.setAttribute("value", schema.extras[i]);
                element.onclick = schema.callback.bind(schema, schema, element);
                output.appendChild(element);
            }
        }
        
        return output;
    }
});