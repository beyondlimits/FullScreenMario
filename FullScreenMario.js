var FullScreenMario = (function() {
    "use strict";
    
    // Use an EightBittr as the class parent, with FullScreenMario's constants
    var unitsize = 4,
        scale = 2,
        
        EightBitter = new EightBittr({
            "unitsize": unitsize,
            "scale": scale
        }),
        
        // Used for combining arrays from the prototype to this
        proliferateHard = EightBitter.utility.proliferateHard;
        
    
    /**
     * 
     */
    function FullScreenMario() {}
    FullScreenMario.prototype = EightBitter;
    
    /* Collision functions
    */

    /**
     * Generic checker for can_collide, used for both Solids and Characters
     * 
     * @param {Thing} thing
     * @return {Boolean}
     */
    function thingCanCollide(thing) {
        return thing.alive && !thing.nocollide;
    }

    /**
     * Generic base function to check if one thing is touching another
     * This will be called by the more specific thing touching functions
     * 
     * @param {Thing} thing
     * @param {Thing} other
     * @return {Boolean}
     * @remarks Only the horizontal checks use unitsize
     */
    function thingTouchesThing(thing, other) {
        return !thing.nocollide && !other.nocollide
                && thing.right - unitsize > other.left
                && thing.left + unitsize < other.right
                && thing.bottom >= other.top
                && thing.top <= other.bottom;
    }
    
    /**
     * Is thing on top of other?
     * 
     * 
     * @remarks This is a more specific form of thingTouchesThing
     */
    function thingOnTop(thing, other) {
        // If thing is a solid and other is falling, thing can't be above other
        if(thing.grouptype === "Solid" && other.yvel > 0) {
            return false;
        }
        
        // If other is falling faster than thing, and isn't a solid,
        // thing can't be on top (if anything, the opposite is true)
        if(thing.yvel < other.yvel && other.grouptype !== "Solid") {
            return false;
        }
        
        // If thing is the player, and it's on top of an enemy, that's true
        if(thing.player && thing.bottom < other.bottom 
                && other.type === "enemy") {
            return true;
        }
        
        // If thing is too far to the right, it can't be touching other
        if(thing.left + unitsize >= other.right) {
            return false;
        }
        
        // If thing is too far to the left, it can't be touching other
        if(thing.right - unitsize <= other.left) {
            return false;
        }
        
        // If thing's bottom is below other's top, factoring tolerance and
        // other's vertical velocity, they're touching
        if(thing.bottom <= other.top + other.toly + other.yvel) {
            return true;
        }
        
        // Same as before, but with velocity as the absolute difference between
        // their two velocities
        if(thing.bottom <= other.top + other.toly
                + Math.abs(thing.yvel - other.yvel)) {
            return true;
        }
        
        // None of the above checks passed for true, so this is false (thing's
        // bottom is above other's top
        return false;
    }
    
    /**
     * 
     * 
     * @remarks Similar to thingOnTop, but more specifically used for
     *          characterOnSolid and characterOnResting
     */
    function thingOnSolid(thing, other) {
        // If thing is too far to the right, they're not touching
        if(thing.left + unitsize > other.right) {
            return false;
        }
        
        // If thing is too far to the left, they're not touching
        if(thing.right - unitsize < other.left) {
            return false;
        }
        
        // If thing's bottom is below other's top, factoring thing's velocity
        // and other's tolerance, they're touching
        if(thing.bottom - thing.yvel <= other.top + other.toly + thing.yvel) {
            return true;
        }
        
        // Same as before, but with velocity as the absolute difference between
        // their two velocities
        if(thing.bottom <= other.top + other.toly
                + Math.abs(thing.yvel - other.yvel)) {
            return true;
        }
        
        // None of the above checks passed for true, so this is false (thing's
        // bottom is above other's top
        return false;
    }
    
    /**
     * 
     */
    function characterOnSolid(character, solid) {
        // If character is resting on solid, this is automatically true
        if(character.resting === solid) {
            return true;
        }                // If the character is jumping upwards, it's not on a solid        // (removing this check would cause Mario to have "sticky" behavior when        // jumping at the corners of solids)        if(character.yvel < 0) {            return false;        }
        
        // The character and solid must be touching appropriately
        if(!thingOnSolid(character, solid)) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the right (false)
        if(character.left + character.xvel + unitsize == solid.right) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the left (false)
        if(character.right - character.xvel - unitsize == solid.left) {
            return false;
        }
        
        // None of the above checks caught a falsity, so this must be true
        return true;
    }
    
    /**
     * 
     */
    function characterOnResting(character, solid) {
        if(!thingOnSolid(character, solid)) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the right (false)
        if(character.left + character.xvel + unitsize == solid.right) {
            return false;
        }
        
        // Corner case: when character is exactly falling off the left (false)
        if(character.right - character.xvel - unitsize == solid.left) {
            return false;
        }
        
        // None of the above checks caught a falsity, so this must be true
        return true;
    }
    
    /**
     * 
     * @param {Thing} thing
     * @param {Thing} other
     */
    function characterTouchesSolid(character, solid) {
        // Hidden solids can only be touched by the player bottom-bumping them
        if(solid.hidden) {            if(!character.player || !solidOnCharacter(solid, character)) {                return;            }
        }
        
        return thingTouchesThing(character, solid);
    }

    /**
     * 
     * @param {Thing} thing
     * @param {Thing} other
     */
    function characterTouchesCharacter(thing, other) {
        
        return thingTouchesThing(thing, other);
    }

    /**
     * // thing = character
     * // other = solid
     * 
     * @param {Thing} thing
     * @param {Thing} other
     */
    function characterHitsSolid(thing, other) {
        // "Up" solids are special (they kill things that aren't their .up)
        if(other.up && thing !== other.up) {
            return characterTouchesUp(thing, other);
        }
        
        // Normally, call the generic ~TouchedSolid function
        (other.collide || characterTouchedSolid)(thing, other);
        
        // If a character is bumping into the bottom, call that
        if(thing.undermid) {
            if(thing.undermid.bottomBump) {
                thing.undermid.bottomBump(thing.undermid, thing);
            }
        }
        else if(thing.under && thing.under.bottomBump) {
            thing.under.bottomBump(thing.under, thing);
        }
    }

    /**
     *  
     * @param {Thing} thing
     * @param {Thing} other
     */
    function characterHitsCharacter(thing, other) {
        // console.log("Character", thing.title, "hits solid", other.title);
        // The player calls the other's collide function, such as playerStar
        if(thing.player) {
            if(other.collide) {
                return other.collide(thing, other);
            }
        }
        // Otherwise just use thing's collide function
        else if(thing.collide) {
            thing.collide(other, thing);
        }
    }
    
    /**
     * 
     * 
     * @remarks Similar to thingOnTop, but more specifically used for
     *          characterTouchedSolid
     * @remarks This sets the character's .midx property
     */    // function solidOnCharacter(thing, other) {
    function solidOnCharacter(solid, character) {        // This can never be true if character is falling
        if(character.yvel >= 0) {
            return false;
        }
        
        // Horizontally, all that's required is for the character's midpoint to
        // be within the solid's left and right
        character.midx = EightBittr.prototype.physics.getMidX(character);
        if(character.midx <= solid.left || character.midx >= solid.right) {
            return false;
        }
        
        // If the solid's bottom is below the character's top, factoring
        // tolerance and velocity, that's false (this function assumes they're
        // already touching)
        if(solid.bottom - solid.yvel                > character.top + character.toly - character.yvel) {
            return false;
        }                // The above checks never caught falsities, so this must be true
        return true;
    }
    

    /* Physics functions 
    */
    
    /**
     * 
     */
    function shiftBoth(thing, dx, dy) {
        if(!thing.noshiftx) {
            shiftHoriz(thing, dx);
        }
        if(!thing.noshifty) {
            shiftVert(thing, dy);
        }
    }

    /**
     * 
     */
    function setWidth(thing, width, update_sprite, update_size) {
        thing.width = width;
        thing.unitwidth = width * unitsize;
        
        if(update_sprite) {
            thing.spritewidth = width;
            thing.spritewidthpixels = width * unitsize;
        }
        
        if(update_size) {
            updateSize(thing);
            // PixelDrawer.setThingSprite(thing);
            console.log("Should update thing canvas", thing.title);
        }
    }
    
    /**
     * 
     */
    function setHeight(thing, height, update_sprite, update_size) {
        thing.height = height;
        thing.unitheight = height * unitsize;
        
        if(update_sprite) {
            thing.spriteheight = height;
            thing.spriteheightpixels = height * unitsize;
        }
        
        if(update_size) {
            updateSize(thing);
            setThingSprite(thing);
        }
    }
    
    /**
     * 
     */
    function setSize(thing, width, height, update_sprite, update_size) {
        setWidth(thing, width, update_sprite, update_size);
        setHeight(thing, height, update_sprite, update_size);
    }
    
    /**
     * 
     */
    function updatePosition(thing, hard) {
        if(!thing.nomove || hard) {
            EightBittr.prototype.physics.shiftHoriz(thing, thing.xvel);
        }
        
        if(!thing.nofall || hard) {
            EightBittr.prototype.physics.shiftVert(thing, thing.yvel);
        }
    }
    
    /**
     * 
     */
    function increaseHeight(thing, dy) {
        thing.top -= dy;
        thing.height += dy / unitsize;
        thing.unitheight = thing.height * unitsize;
        console.log("Increasing height of", thing.title, "in a likely bad way");
    }
    
    
    /* Movement functions
    */
    
    /**
     * Base, generic movement function for simple characters. The Thing moves
     * at a constant rate in either the x or y direction, and switches direction
     * only if directed by the engine (e.g. when it hits a Solid)
     * 
     * @param {Thing} thing
     * @remarks thing.speed is the only required member attribute; .direction
     *          and .moveleft should be set by the game engine.
     *          * thing.direction - what direction it should be moving
     *          * thing.moveleft - what direction is actually is moving
     *          * thing.speed - the Thing's typical speed
     */
    function moveSimple(thing) {
        // If the thing is looking away from the intended direction, flip it
        if(thing.direction != thing.moveleft) {
            // thing.moveleft is truthy: it should now be looking to the right
            if(thing.moveleft) {
                thing.xvel = -thing.speed;
                if(!thing.noflip) {
                    unflipHoriz(thing);
                }
            }
            // thing.moveleft is falsy: it should now be looking to the left
            else {
                thing.xvel = thing.speed;
                if(!thing.noflip) {
                    flipHoriz(thing);
                }
            }
            thing.direction = thing.moveleft;
        }
    }
    
    /**
     * Extension of the moveSimple movement function for Things that shouldn't
     * fall off the edge of their resting blocks
     * @param {Thing} thing
     */
    function moveSmart(thing) {
        // Start off by calling moveSimple for normal movement
        moveSimple(thing);
        
        // If this isn't resting, it's the same as moveSimple
        if(!thing.resting) {
            return;
        }
        
        // Check for being over the edge in the direction of movement
        if(thing.moveleft) {
            if(thing.left + unitsize <= thing.resting.left) {
                shiftHoriz(thing, unitsize);
                thing.moveleft = false;
            }
        } else {
            if(thing.right - unitsize >= thing.resting.right) {
                shiftHoriz(thing, -unitsize);
                thing.moveleft = true;
            }
        }
    }
    
    /**
     * Extension of the moveSimple movement function for Things that should
     * jump whenever they hit a resting block.
     * @param {Thing} thing
     * @remarks thing.jumpheight is required to know how high to jump
     */
    function moveJumping(thing) {
        // Start off by calling moveSimple for normal movement
        moveSimple(thing);
        
        // If .resting, jump!
        if(thing.resting) {
            thing.yvel = -Math.abs(thing.jumpheight);
            thing.resting = false;
        }
    }
    
    /**
     * Initial movement function for Things that float up and down (vertically).
     * This uses map_settings - in the future, it should just be relative
     * to the starting yloc of the Thing
     * 
     * @param {Thing} thing
     * @remarks thing.begin and thing.end are used as the vertical endpoints;
     *          .begin is the bottom and .end is the top (since begin <= end)
     */
    function moveFloating(thing) {
        // Make sure thing.begin <= thing.end
        setPlatformEndpoints(thing);
        
        // Make thing.begin and thing.end relative to map_settings.floor
        console.warn("moveFloating should avoid using map_settings");
        thing.begin = map_settings.floor * unitsize - thing.begin;
        thing.end = map_settings.floor * unitsize - thing.end;
        
        // Use moveFloatingReal as the actual movement function from now on
        (thing.movement = moveFloatingReal)(thing);
    }
    
    /**
     * Actual movement function for Things that float up and down (vertically).
     * If the Thing has reached thing.begin or thing.end, it gradually switches
     * thing.yvel
     * 
     * @param {Thing} thing
     * @remarks thing.maxvel is used as the maximum absolute speed vertically
     */
    function moveFloatingReal(thing) {
        // If above the endpoint:
        if(thing.top <= thing.end) {
            thing.yvel = Math.min(thing.yvel + unitsize / 32, thing.maxvel);
        }
        // If below the endpoint:
        else if(thing.bottom >= thing.begin) {
            thing.yvel = Math.max(thing.yvel - unitsize / 32, -thing.maxvel);
        }
        
        // Deal with velocities and whether the player is resting on this
        movePlatform(thing);
    }
    
    /**
     * Initial movement function for Things that float sideways (horizontally).
     * 
     * @param {Thing} thing
     * @remarks thing.begin and thing.end are used as the horizontal endpoints;
     *          .begin is the left and .end is the right (since begin <= end)
     */
    function moveSliding(thing) {
        // Make sure thing.begin <= thing.end
        setPlatformEndpoints(thing);
        
        // Use moveSlidingReal as the actual movement function from now on
        (thing.movement = moveSlidingReal)(thing);
    }
    
    /**
     * Actual movement function for Things that float sideways (horizontally).
     * If the Thing has reached thing.begin or thing.end, it gradually switches
     * thing.xvel
     * This uses gamescreen - in the future, it should just be relative
     * to the starting yloc of the Thing
     * 
     * @param {Thing} thing
     * @remarks thing.maxvel is used as the maximum absolute speed horizontally
     */
    function moveSlidingReal(thing) {
        // If to the left of the endpoint:
        if(gamescreen.left + thing.left <= thing.begin) {
            thing.xvel = Math.min(thing.xvel + unitsize / 32, thing.maxvel);
        }
        // If to the right of the endpoint:
        else if(gamescreen.left + thing.right > thing.end) {
            thing.xvel = Math.max(thing.xvel - unitsize / 32, -thing.maxvel);
        }
        
        // Deal with velocities and whether the player is resting on this
        movePlatform(thing);
    }
    
    /**
     * Ensures thing.begin <= thing.end (so there won't be glitches pertaining
     * to them in functions like moveFloating and moveSliding
     * 
     * @param {Thing} thing
     */
    function setPlatformEndpoints(thing) {
        if(thing.begin > thing.end) {
            var temp = thing.begin;
            thing.begin = thing.end;
            thing.end = temp;
        }
    }
    
    /**
     * Moves a platform by its velocities, and checks for whether the player
     * is resting on it (if so, the player must be moved accordingly)
     * This uses gamescreen, innerWidth, and player - in the future, it should 
     * get it them in some official manner? (or relegate that check to upkeep)
     * 
     * @param {Thing} thing
     */
    function movePlatform(thing) {
        shiftHoriz(thing, thing.xvel);
        shiftVert(thing, thing.yvel);
        
        // If the player is resting on this and this is alive, move the player
        if(thing === player.resting && player.alive) {
            setBottom(player, thing.top);
            shiftHoriz(player, thing.xvel);
            
            // If the player is too far to the right or left, stop that overlap
            if(player.right > innerWidth) {
                setRight(player, innerWidth);
            } else if(player.left < 0) {
                setLeft(player, 0);
            }
        }
    }
    
    
    /* Prototype function holders
    */
    
    proliferateHard(FullScreenMario.prototype, {
        "collisions": {
            "thingCanCollide": thingCanCollide,
            "thingTouchesThing": thingTouchesThing,
            "thingOnTop": thingOnTop,
            "thingOnSolid": thingOnSolid,
            "characterTouchesSolid": characterTouchesSolid,
            "characterTouchesCharacter": characterTouchesCharacter,
            "characterHitsSolid": characterHitsSolid,
            "characterHitsCharacter": characterHitsCharacter,
            "characterOnSolid": characterOnSolid,
            "characterOnResting": characterOnResting,
            "solidOnCharacter": solidOnCharacter
        },
        "movement": {
            "moveSimple": moveSimple,
            "moveSmart": moveSmart,
            "moveJumping": moveJumping,
            "moveFloating": moveFloating,
            "moveFloatingReal": moveFloatingReal,
            "moveSliding": moveSliding,
            "moveSlidingReal": moveSlidingReal,
            "movePlatform": movePlatform
        },
        "physics": {
            "shiftBoth": shiftBoth,
            "setWidth": setWidth,
            "setHeight": setHeight,
            "setSize": setSize,
            "updatePosition": updatePosition,
            "increaseHeight": increaseHeight
        }
    });
    
    return FullScreenMario;
})();

var FSM = new FullScreenMario();