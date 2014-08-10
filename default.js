(function () {
    document.body.onload = function () {
        var time_start = Date.now(),
            holder = document.getElementById("game"),
            FSM = new FullScreenMario({
                "width": window.innerWidth, 
                "height": 464
            });
            
        holder.innerText = "";
        holder.appendChild(FSM.container);
        
        FSM.proliferate(document.body, {
            "onkeydown": FSM.InputWriter.makePipe("onkeydown", "keyCode"),
            "onkeyup": FSM.InputWriter.makePipe("onkeyup", "keyCode")
        });
        
        FSM.proliferate(holder, {
            "onmousedown": FSM.InputWriter.makePipe("onmousedown", "which"),
            "oncontextmenu": FSM.InputWriter.makePipe("oncontextmenu", null, true)
        });

        FSM.gameStart();
        window["FSM"] = FSM;
        console.log("It took " + (Date.now() - time_start) + " milliseconds to start.");
    };
})();