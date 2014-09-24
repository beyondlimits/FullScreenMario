FullScreenMario.prototype.settings.screen = {
    "variables": {
        "bottom_death_difference": function (EightBitter) {
            if(!EightBitter) { debugger; }
            return EightBitter.unitsize * 12;
        },
        "bottom_platform_max": function (EightBitter) {
            var area = EightBitter.MapsHandler.getArea(),
                diff = EightBitter.MapScreener.bottom_death_difference;
                
            if(!area) {
                console.log("hurp")
                return -1;
            }
            
            console.log("durp", area.floor, diff);
            console.log((area.floor + diff) * EightBitter.unitsize);
            return (area.floor + diff) * EightBitter.unitsize;
        }
    }
};