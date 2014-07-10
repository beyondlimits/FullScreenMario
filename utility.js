/* Utility.js */
// Contains all needed helper functions not in toned.js

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