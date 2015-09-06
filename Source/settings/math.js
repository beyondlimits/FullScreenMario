/// <reference path="../FullScreenMario.ts" />
FullScreenMario.FullScreenMario.settings.math = {
    "equations": {
        /**
         * Decreases a player's jumping yvel based on whether it's running.
         */
        "decreasePlayerJumpingYvel": function (constants, equations, player) {
            var jumpmod = player.FSM.MapScreener.jumpmod - player.xvel * .0014, power = Math.pow(player.keys.jumplev, jumpmod), dy = player.FSM.unitsize / power;
            player.yvel = Math.max(player.yvel - dy, constants.maxyvelinv);
        },
        /**
         * Decreases a player's running xvel based on whether it's sprinting.
         * @returns {Boolean} True if the player started or stopped skidding,
         *                    or false if the skidding status was unchanged.
         */
        "decreasePlayerRunningXvel": function (constants, equations, thing) {
            // If a button is pressed, hold/increase speed
            if (thing.keys.run !== 0 && !thing.crouching) {
                var dir = thing.keys.run, 
                // No sprinting underwater
                sprinting = Number(thing.keys.sprint && !thing.FSM.MapScreener.underwater) || 0, adder = dir * (.098 * (Number(sprinting) + 1)), decel = 0, skiddingChanged = false;
                // Reduce the speed, both by subtracting and dividing a little
                thing.xvel += adder || 0;
                thing.xvel *= .98;
                decel = .0007;
                // If you're accelerating in the opposite direction from your current velocity, that's a skid
                if ((thing.keys.run > 0) === thing.moveleft) {
                    if (!thing.skidding) {
                        thing.skidding = true;
                        skiddingChanged = true;
                    }
                }
                else if (thing.skidding) {
                    // Not accelerating: make sure you're not skidding
                    thing.skidding = false;
                    skiddingChanged = true;
                }
            }
            else {
                // Otherwise slow down a bit
                thing.xvel *= .98;
                decel = .035;
            }
            if (thing.xvel > decel) {
                thing.xvel -= decel;
            }
            else if (thing.xvel < -decel) {
                thing.xvel += decel;
            }
            else if (thing.xvel !== 0) {
                thing.xvel = 0;
                if (!thing.FSM.MapScreener.nokeys && thing.keys.run === 0) {
                    if (thing.keys.leftDown) {
                        thing.keys.run = -1;
                    }
                    else if (thing.keys.rightDown) {
                        thing.keys.run = 1;
                    }
                }
            }
            return skiddingChanged;
        }
    }
};
