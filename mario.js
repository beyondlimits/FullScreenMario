/* mario.js */
// Starts everything.

function startFSM() {
    var time_start = Date.now();
  
    window.Uint8ClampedArray = window.Uint8ClampedArray
       || window.Uint8Array
       || Array;
  
    window.OhLookFSMCanBeNamedWhateverYouWant = new FullScreenMario();

    // With that all set, set the map to World11.
    OhLookFSMCanBeNamedWhateverYouWant.gameStart();
    document.body.appendChild(OhLookFSMCanBeNamedWhateverYouWant.canvas);
    document.body.appendChild(OhLookFSMCanBeNamedWhateverYouWant.StatsHolder.getContainer());
    
    OhLookFSMCanBeNamedWhateverYouWant.proliferate(document.body, {
        "onkeydown": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("onkeydown", "keyCode"),
        "onkeyup": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("onkeyup", "keyCode"),
        "onmousedown": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("onmousedown", "which"),
        "oncontextmenu": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("oncontextmenu", null, true)
    });

    console.log("It took " + (Date.now() - time_start) + " milliseconds to start.");
}