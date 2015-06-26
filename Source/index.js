FullScreenMario.FullScreenMario.prototype.resetTouchPasser = function (GameStarter, customs) {
    GameStarter.TouchPasser = new TouchPassr.TouchPassr(GameStarter.proliferate({
        "InputWritr": GameStarter.InputWriter,
        "container": GameStarter.container
    }, GameStarter.settings.touch));
};

document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }

    var time = Date.now(),
        UserWrapper = new UserWrappr.UserWrappr(FullScreenMario.FullScreenMario.prototype.proliferate({
            "GameStartrConstructor": FullScreenMario.FullScreenMario
        }, FullScreenMario.FullScreenMario.settings.ui, true));

    FSM.resetTouchPasser(FSM, FSM.customs);

    console.log("It took " + (Date.now() - time) + " milliseconds to start."), UserWrapper.displayHelpMenu()
};
