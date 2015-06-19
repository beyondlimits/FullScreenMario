document.onreadystatechange = function (event) {
    if (event.target.readySate !== "complete") {
        return;
    }

    var time = Date.now(),
        UserWrapper = new UserWrappr.UserWrappr(FullScreenMario.FullScreenMario.prototype.proliferate({
            "GameStartrConstructor": FullScreenMario.FullScreenMario
        }, FullScreenMario.FullScreenMario.settings.ui, true));

    console.log("It took " + (Date.now() - time) + " milliseconds to start."), UserWrapper.displayHelpMenu()
};
