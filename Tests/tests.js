var FSM;

describe("constructor", function () {
    it("runs with a small screen size", function () {
        FSM = new FullScreenMario.FullScreenMario({
            "width": 512,
            "height": 464
        });
    });

    it("runs with a large screen size", function () {
        FSM = new FullScreenMario.FullScreenMario({
            "width": 2048,
            "height": 1152
        });
    });
});