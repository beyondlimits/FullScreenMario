/* Triggers.js */
// Keeps track of triggers, which mainly consist of key presses,
// and messages, which would be from an index.html UI
function resetTriggers() {
    window.InputWriter = FSM.InputWriter;
    FSM.proliferate(document.body, {
        "onkeydown": FSM.InputWriter.makePipe("onkeydown", "keyCode"),
        "onkeyup": FSM.InputWriter.makePipe("onkeyup", "keyCode"),
        "onmousedown": FSM.InputWriter.makePipe("onmousedown", "which"),
        "oncontextmenu": FSM.InputWriter.makePipe("oncontextmenu", null, true)
    });

    // Set UI triggers
    setMessageTriggers();
}


function maxlulz() {
    // Sigh....
    // window.palette = arrayShuffle(window.palette, 1);
    // clearAllSprites(true);
    FSM.TimeHandler.addEventInterval(function (arr) {
        setAreaSetting(arr[randInt(arr.length)]);
    }, 7, Infinity, ["Overworld", "Underworld", "Underwater", "Sky", "Castle"]);
}



/* Triggers (from a UI)
 */
function setMessageTriggers() {
    // Commands will be sent in by these codes
    var command_codes = {
        setMap: triggerSetMap,
        startEditor: function () {
            loadEditor();
        },
        toggleOption: function (data) {
            var name = "toggle" + data.option;
            console.log(name, window[name]);
            if (window[name]) window[name]();
            else log("Could not toggle", name);
        }
    };

    // When a message is received, send it to the appropriate command code
    window.addEventListener("message", function (event) {
        var data = event.data,
            type = data.type;
        // If the type is known, do it
        if (command_codes[type])
            command_codes[type](data);
        // Otherwise complain
        else {
            console.log("Unknown event type received:", type, ".\n", data);
        }
    });
}

// The UI has requested a map change
function triggerSetMap(data) {
    clearPlayerStats();
    setMap.apply(this, data.map || []);
    setLives(3);
}