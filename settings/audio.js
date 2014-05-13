FullScreenMario.prototype.audio = {
    "directory": "Sounds",
    "getVolumeLocal": function getVolumeLocal() {
        return .49;
    },
    "getThemeDefault": function getThemeDefault() {
        console.warn("Getting theme default from window, not FSM");
        return setting.split(' ')[0];
    },
    "localStorageMuted": "muted",
    "library": {
        "Sounds": [
            "Bowser Falls",
            "Bowser Fires",
            "Break Block",
            "Bump",
            "Coin",
            "Ending",
            "Fireball",
            "Firework",
            "Flagpole",
            "Gain Life",
            "Game Over 2",
            "Game Over",
            "Hurry",
            "Into the Tunnel",
            "Jump Small",
            "Jump Super",
            "Kick",
            "Level Complete",
            "Player Dies",
            "Pause",
            "Pipe",
            "Power Down",
            "Powerup Appears",
            "Powerup",
            "Stage Clear",
            "Vine Emerging",
            "World Clear",
            "You Dead"
        ],
        "Themes": [
            "Castle",
            "Overworld",
            "Underwater",
            "Underworld",
            "Star",
            "Sky",
            "Hurry Castle",
            "Hurry Overworld",
            "Hurry Underwater",
            "Hurry Underworld",
            "Hurry Star",
            "Hurry Sky"
        ]
    }
}