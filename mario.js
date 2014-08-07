function startFSM() {
    var time_start = Date.now();
  
    window.OhLookFSMCanBeNamedWhateverYouWant = new FullScreenMario();
    document.body.appendChild(OhLookFSMCanBeNamedWhateverYouWant.container);
    OhLookFSMCanBeNamedWhateverYouWant.gameStart();
    
    OhLookFSMCanBeNamedWhateverYouWant.proliferate(document.body, {
        "onkeydown": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("onkeydown", "keyCode"),
        "onkeyup": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("onkeyup", "keyCode"),
        "onmousedown": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("onmousedown", "which"),
        "oncontextmenu": OhLookFSMCanBeNamedWhateverYouWant.InputWriter.makePipe("oncontextmenu", null, true)
    });

    console.log("It took " + (Date.now() - time_start) + " milliseconds to start.");
}