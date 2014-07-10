/* Utility.js */
// Contains all needed helper functions not in toned.js


// To do: make me.collide and stages w/functions
// To do: split this into .partner and whatnot


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