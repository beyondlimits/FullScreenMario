function startFSM() {
    var time_start = Date.now();
  
    window.FSM = new FullScreenMario({
        "width": window.innerWidth, 
        "height": window.innerHeight
    });
    document.body.appendChild(FSM.container);
    
    FSM.proliferate(document.body, {
        "onkeydown": FSM.InputWriter.makePipe("onkeydown", "keyCode"),
        "onkeyup": FSM.InputWriter.makePipe("onkeyup", "keyCode"),
        "onmousedown": FSM.InputWriter.makePipe("onmousedown", "which"),
        "oncontextmenu": FSM.InputWriter.makePipe("oncontextmenu", null, true)
    });

    FSM.gameStart();
    console.log("It took " + (Date.now() - time_start) + " milliseconds to start.");
}