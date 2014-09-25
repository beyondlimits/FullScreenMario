FullScreenMario.prototype.settings.screen = {
    "variables": {
        "bottom_death_difference": function (EightBitter) {
            return EightBitter.unitsize * 12;
        },
        "bottom_platform_max": function (EightBitter) {
            var area = EightBitter.MapsHandler.getArea(),
                diff = EightBitter.MapScreener.bottom_death_difference;
                
            if(!area) {
                return -1;
            }
                
            return (area.floor + diff) * EightBitter.unitsize;
        }
    }
};