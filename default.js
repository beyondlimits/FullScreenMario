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
        "generator": "OptionsTable"
    },
    {
        "title": "Controls",
        "generator": "OptionsTable"
    },
    {
        "title": "Mods!",
        "generator": "OptionsTable"
    },
    {
        "title": "Editor",
        "generator": "OptionsTable"
    },
    {
        "title": "Maps",
        "generator": "MapsGrid",
        "rangeX": [1, 4],
        "rangeY": [1, 8],
        "extras": [
            "Map Generator!"
        ]
    },
], {
    "OptionsTable": function (schema) {
        var output = document.createElement("div");
        
        output.innerText = "hello";
        
        return output;
    },
    "MapsGrid": function (schema) {
        var output = document.createElement("div"),
            rangeX = schema.rangeX,
            rangeY = schema.rangeY;
        
        if(rangeX && rangeY) {
            for(var i = rangeY[0]; i <= rangeY[1]; i += 1) {
                var row = document.createElement("div");
                row.className = "maps-grid-row";
                
                for(var j = rangeX[0]; j <= rangeX[1]; j += 1) {
                    element = document.createElement("div");
                    element.className = "select-option maps-grid-option maps-grid-option-range";
                    element.innerText = i + "-" + j;
                    row.appendChild(element);
                }
                
                output.appendChild(row);
            }
        }
        
        if(schema.extras) {
            for(i = 0; i < schema.extras.length; i += 1) {
                element = document.createElement("div");
                element.className = "select-option maps-grid-option maps-grid-option-extra";
                element.innerText = schema.extras[i];
                output.appendChild(element);
            }
        }
        
        return output;
    }
});