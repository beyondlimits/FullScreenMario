/* Upkeep.js */
// Contains functions associated with the upkeep

/* Old stuff
*/

function resetUpkeep() {
  window.GamesRunner = FSM.GamesRunner;
}

function upkeep() {
  GamesRunner.upkeep();
}

function pause(big) {
  GamesRunner.pause();
}

function unpause() {
  GamesRunner.unpause();
}


// Solids by themselves don't really do much
function maintainSolids(update) {
  for(var i = 0, solid; i < solids.length; ++i) {
    solid = solids[i];
    if(solid.alive) {
      if(solid.movement) solid.movement(solid);
    }
    if(!solid.alive || solid.right < QuadsKeeper.getDelX())
      deleteThing(solid, solids, i);
  }
}

function maintainCharacters(update) {
  var delx = FSM.MapScreener.right + QuadsKeeper.getOutDifference(),
      character, i;
  for(i = 0; i < characters.length; ++i) {
    character = characters[i];
    // Gravity
    if(!character.resting) {
      if(!character.nofall) character.yvel += character.gravity || map_settings.gravity;
      character.yvel = min(character.yvel, map_settings.maxyvel);
    } else character.yvel = 0;
    
    // Position updating and collision detection
    updatePosition(character);
    QuadsKeeper.determineThingQuadrants(character);
    character.under = character.undermid = false;
    // determineThingCollisions(character);
    ThingHitter.getGroupHolder().setCharacterGroup(characters);
    ThingHitter.checkHitsOfOne(character);
    
    // Resting tests
    if(character.resting) {
      if(!FSM.get("isCharacterOnResting")(character, character.resting)) {
        character.resting = false; // Necessary for moving platforms :(
      } else {
        /*character.jumping = */character.yvel = false;
        setBottom(character, character.resting.top);
      }
    }
    
    // Movement or deletion
    // To do: rethink this...
    if(character.alive) {
      if(!character.player && 
          (character.numquads == 0 || character.left > delx) && !character.outerok) {
        deleteThing(character, characters, i);
      }
      else {
        if(!character.nomove && character.movement)
          character.movement(character);
      }
    }
    else deleteThing(character, characters, i);
  }
}

function maintainPlayer(update) {
  if(!player.alive) return;
  
  // Player is falling
  if(player.yvel > 0) {
    if(!map_settings.underwater) player.keys.jump = 0;
    // Jumping?
    if(!player.jumping) {
      // Paddling? (from falling off a solid)
      if(map_settings.underwater) {
        if(!player.paddling) {
          switchClass(player, "paddling", "paddling");
          player.padding = true;
        }
      }
      else {
        addClass(player, "jumping");
        player.jumping = true;
      }
    }
    // Player has fallen too far
    if(!player.piping && !player.dying && player.top > FSM.MapScreener.deathheight) {
      // If the map has an exit loc (cloud world), transport there
      if(map_settings.exitloc) {
        // Random maps will pretend he died
        if(map.random) {
          goToTransport(["Random", "Overworld", "Down"]);
          playerDropsIn();
          return;
        }
        // Otherwise just shift to the location
        return shiftToLocation(map.exitloc);
      }
      // Otherwise, since Player is below the screen, kill him dead
      killPlayer(player, 2);
    }
  }
  
  // Player is moving to the right
  if(player.xvel > 0) {
    if(player.right > FSM.MapScreener.middlex) {
      // If Player is to the right of the screen's middle, move the screen
      if(player.right > FSM.MapScreener.right - FSM.MapScreener.left)
        player.xvel = min(0, player.xvel);
    }
  }
  // Player is moving to the left
  else if(player.left < 0) {
    // Stop Player from going to the left.
    player.xvel = max(0, player.xvel);
  }
  
  // Player is hitting something (stop jumping)
  if(player.under) player.jumpcount = 0;
  
  // Scrolloffset is how far over the middle player's right is
  // It's multiplied by 0 or 1 for map.canscroll
  window.scrolloffset = (map_settings.canscroll) * (player.right - FSM.MapScreener.middlex);
  if(scrolloffset > 0) {
    scrollWindow(lastscroll = round(min(player.scrollspeed, scrolloffset)));
  }
  else lastscroll = 0;
}