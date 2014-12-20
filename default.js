document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }
    
    var time_start = Date.now(),
        UserWrapper = new UserWrappr({
            "GameStartrConstructor": FullScreenMario
        });
    
    window["FSM"] = UserWrapper.getGameStarter();
    
    console.log("It took " + (Date.now() - time_start) + " milliseconds to start");
};