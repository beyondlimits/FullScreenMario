/* Utility.js */
// Contains all needed helper functions not in toned.js

function movePlatformSpawn(me) {
  // This is like movePlatformNorm, but also checks for whether it's out of bounds
  // Assumes it's been made with a PlatformGenerator as the parent
  // To do: make the PlatformGenerator check one at a time, not each of them.
  if(me.bottom < me.parent.top) {
    FSM.setBottom(me, me.parent.bottom);
    detachPlayer(me);
  }
  else if(me.top > me.parent.bottom) {
    FSM.setTop(me, me.parent.top);
    detachPlayer(me);
  }
  else FSM.movePlatformNorm(me);
}

function collideTransport(me, solid) {
  FSM.collideCharacterSolid(me, solid);
  if(solid != me.resting) return;
  
  solid.movement = FSM.movePlatformNorm;
  solid.collide = FSM.collideCharacterSolid;
  solid.xvel = unitsized2;
}

// To do: make me.collide and stages w/functions
// To do: split this into .partner and whatnot

function moveFallingScale(me) {
  // If Player is resting on me, fall
  if(player.resting == me) {
    shiftScaleStringVert(me, me.string, me.yvel += unitsized16);
    shiftScaleStringVert(me.partner, me.partner.string, -me.yvel);
    me.tension += me.yvel;
    me.partner.tension -= me.yvel;
  }
  // Otherwise, if me or partner has a positive yvel, slow it down
  else if(me.yvel > 0) {
    shiftScaleStringVert(me, me.string, me.yvel -= unitsized32);
    shiftScaleStringVert(me.partner, me.partner.string, -me.yvel);
    me.tension -= me.yvel;
    me.partner.tension += me.yvel;
  }
  // If the platform falls off
  if(me.partner.tension <= 0) {
    me.collide = me.partner.collide = FSM.collideCharacterSolid;
    // Keep falling at an increasing pace
    me.movement = me.partner.movement = FSM.moveFreeFalling;
  }
}
function shiftScaleStringVert(me, string, yvel) {
  string.bottom = me.top;
  string.height = (string.bottom - string.top) / unitsize;
  FSM.updateSize(string);
  FSM.shiftVert(me, yvel);
}


/*
 * Deaths & removing
 */

// Javascript memory management, you are bad and should feel bad.
function deleteThing(me, array, arrayloc) {
  array.splice(arrayloc, 1);
  if(me.ondelete) me.ondelete();
}
function switchContainers(me, outer, inner) {
  outer.splice(outer.indexOf(me), 1);
  inner.push(me);
}
function containerForefront(me, container) {
  container.splice(container.indexOf(me), 1);
  container.unshift(me);
}

// Kills all characters other than the player
// Used in endCastleOutside/Inside
// Also kills all moving solids
function killOtherCharacters() {
  var thing, i;
  if(window.characters) {
    for(i = characters.length - 1; i >= 0; --i) {
      thing = characters[i];
      if(!thing.nokillend) deleteThing(thing, characters, i);
      else if(thing.killonend) thing.killonend(thing);
    }
  }
  if(window.solids) {
    for(i = solids.length - 1; i >= 0; --i)
      if(solids[i].killonend)
        deleteThing(solids[i], solids, i);
  }
}

function lookTowardPlayer(me, big) {
  // Player is to the left
  if(player.right <= me.left) {
    if(!me.lookleft || big) {
      me.lookleft = true;
      me.moveleft = false;
      me.EightBitter.unflipHoriz(me);
    }
  }
  // Player is to the right
  else if(player.left >= me.right) {
    if(me.lookleft || big) {
      me.lookleft = false;
      me.moveleft = true;
      me.EightBitter.flipHoriz(me);
    }
  }
}
function lookTowardThing(me, thing) {
  // It's to the left
  if(thing.right <= me.left) {
    me.lookleft = true;
    me.moveleft = false;
    me.EightBitter.unflipHoriz(me);
  }
  // It's to the right
  else if(thing.left >= me.right) {
    me.lookleft = false;
    me.moveleft = true;
    me.EightBitter.flipHoriz(me);
  }
}