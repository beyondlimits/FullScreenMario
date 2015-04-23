describe("constructor", function () {
    it("runs with a small screen size", function () {
        new FullScreenMario({
            "width": 512,
            "height": 464
        });
    });

    it("runs with a medium screen size", function () {
        new FullScreenMario({
            "width": 1024,
            "height": 768
        });
    });

    it("runs with a large screen size", function () {
        new FullScreenMario({
            "width": 2048,
            "height": 1152
        });
    });

    it("requires an arguments Object", function () {
        chai.expect(function () {
            new FullScreenMario();
        }).to.throw("No arguments Object given to FullScreenMario.");
    });

    it("requires at least a width and height", function () {
        chai.expect(function () {
            new FullScreenMario({});
        }).to.throw("FullScreenMario requires both width and height.");
    });
});