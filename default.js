document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }
    
    var time_start = Date.now(),
        UserWrapper = new UserWrappr(FullScreenMario.prototype.proliferate({
            "GameStartrConstructor": FullScreenMario
        }, FullScreenMario.prototype.settings.ui, true));
    
    console.log("It took " + (Date.now() - time_start) + " milliseconds to start.");
    UserWrapper.displayHelpMenu();
};