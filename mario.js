/* mario.js */
// Starts everything.

function startFSM() {
    var time_start = Date.now();
  
    window.Uint8ClampedArray = window.Uint8ClampedArray
       || window.Uint8Array
       || Array;
  
    window.FSM = new FullScreenMario();

    // With that all set, set the map to World11.
    FSM.gameStart();
    document.body.appendChild(FSM.canvas);
    document.body.appendChild(FSM.StatsHolder.makeContainer());
    
    FSM.proliferate(document.body, {
        "onkeydown": FSM.InputWriter.makePipe("onkeydown", "keyCode"),
        "onkeyup": FSM.InputWriter.makePipe("onkeyup", "keyCode"),
        "onmousedown": FSM.InputWriter.makePipe("onmousedown", "which"),
        "oncontextmenu": FSM.InputWriter.makePipe("oncontextmenu", null, true)
    });

    console.log("It took " + (Date.now() - time_start) + " milliseconds to start.");
}