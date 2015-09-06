/// <reference path="../FullScreenMario.ts" />

FullScreenMario.FullScreenMario.settings.math = {
    "equations": {
        /**
         * Decreases a player's jumping yvel based on whether it's running.
         */
        "decreasePlayerJumpingYvel": function (
            constants: FullScreenMario.IMapScreenr,
            equations: any, player: FullScreenMario.IPlayer): void {
            var jumpmod: number = player.FSM.MapScreener.jumpmod - player.xvel * .0014,
                power: number = Math.pow(player.keys.jumplev, jumpmod),
                dy: number = player.FSM.unitsize / power;

            player.yvel = Math.max(player.yvel - dy, constants.maxyvelinv);
        }
    }
};
