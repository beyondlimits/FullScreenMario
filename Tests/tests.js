var FSM, Uint8ClampedArray;

describe("constructor", function () {
    it("runs with a small screen size", function () {
        FSM = new FullScreenMario.FullScreenMario({
            "width": 512,
            "height": 464
        });

        Uint8ClampedArray = FSM.PixelRender.Uint8ClampedArray;
    });

    it("runs with a large screen size", function () {
        FSM = new FullScreenMario.FullScreenMario({
            "width": 2048,
            "height": 1152
        });

        if (typeof Uint8ClampedArray === "undefined") {
            Uint8ClampedArray = FSM.PixelRender.Uint8ClampedArray;
        }
    });
});

describe("setMap", function () {
    it("loads Overworld (1-1)", function () {
        FSM.setMap("1-1");
    });

    it("loads Underworld (1-2)", function () {
        FSM.setMap("1-1", 1);
    });

    it("loads Castle (1-4)", function () {
        FSM.setMap("1-4");
    });
    
    it("loads Underwater (2-2)", function () {
        FSM.setMap("2-2", 1);
    });
});
