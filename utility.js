/* Utility.js */
// Contains all needed helper functions not in toned.js

/* General stuff */
 
// Expensive - use only on clearing
function clearAllTimeouts() {
  return FSM.get("clearAllTimeouts")();
}

// Width and height are given as number of pixels (to scale; unitsize) 
function getCanvas(width, height, multiplier) {
    return FSM.get("getCanvas")(width, height, multiplier);
}

function step(num) {
  GamesRunner.step(num);
}

function fastforward(num) {
  GamesRunner.setSpeed(num);
}

function specifyTimer(timerin) {
  // Only use if you're not worried about losing the benefits of requestAnimationFrame
  // Also, this kills performance. Works best with smaller windows!
  timer = timerin;
  requestAnimationFrame = function(func) {
    window.setTimeout(func, timer);
  };
}


/*
 * Basic object positioning helper functions
 */
function updatePosition(me) {
    FSM.get("updatePosition")(me);
}
function updateSize(me) {
    FSM.get("updateSize")(me);
}
function reduceHeight(me, dy, see) {
    FSM.get("reduceHeight")(me, dy, see);
}
function shiftBoth(me, dx, dy) {
    FSM.get("shiftBoth")(me, dx, dy);
}
function shiftHoriz(me, dx) {
    FSM.get("shiftHoriz")(me, dx);
}
function shiftVert(me, dy) {
    FSM.get("shiftVert")(me, dy);
}
function setLeft(me, left) {
    FSM.get("setLeft")(me, left);
}
function setRight(me, right) {
    FSM.get("setRight")(me, right);
}
function setTop(me, top) {
    FSM.get("setTop")(me, top);
}
function setBottom(me, bottom) {
    FSM.get("setBottom")(me, bottom);
}
function setWidth(me, width, spriter, updater) {
    FSM.get("setWidth")(me, width, spriter, updater);
}
function setHeight(me, height, spriter, updater) {
    FSM.get("setWidth")(me, height, spriter, updater);
}
function setSize(me, width, height, spriter, updater) {
    FSM.get("setSize")(me, width, height, spriter, updater);
}
function setMidX(me, x) {
    FSM.get("setMidX")(me, x);
}
function setMidY(me, y) {
    FSM.get("setMidY")(me, y);
}
function getMidX(me) {
    return FSM.get("getMidX")(me);
}
function getMidY(me) {
    return FSM.get("getMidY")(me);
}
function setMidXObj(me, object) {
    FSM.get("setMidXObj")(me, object);
}
function setMidYObj(me, object) {
    FSM.get("setMidYObj")(me, object);
}
function slideToXLoc(me, xloc, maxspeed) {
    FSM.get("slideToX")(me, xloc, maxspeed); 
}
function updateLeft(me, dx) {
    FSM.get("updateLeft")(me, dx);
}
function updateRight(me, dx) {
    FSM.get("updateRight")(me, dx);
}
function updateTop(me, dy) {
    FSM.get("updateTop")(me, dy);
}
function updateBottom(me, dy) {
    FSM.get("updateBottom")(me, dy);
}
function increaseHeightTop(me, dy) {
    FSM.get("increaseHeight")(me, dy);
}

/*
 * Collisions
 */

/* Object Collision Detection (new)
*/

function thingCanCollide(thing) {
    return FSM.get("thingCanCollide")(thing);
}

function thingTouchesThing(thing, other) {
    return FSM.get("thingTouchesThing")(thing, other);
}

function characterTouchesSolid(thing, other) {
    return FSM.get("characterTouchesSolid")(thing, other);
}

function characterTouchesCharacter(thing, other) {
    return FSM.get("characterTouchesCharacter")(thing, other);
}

function characterHitsSolid(thing, other) {
    return FSM.get("characterHitsSolid")(thing, other);
}

function characterHitsCharacter(thing, other) {
    return FSM.get("characterHitsCharacter")(thing, other);
}


// No tolerance! Just unitsize.

// Sees whether one's midpoint is to the left of two's
function objectToLeft(one, two) {
    return FSM.get("objectToLeft")(one, two);
}

function objectOnTop(one, two) {
    return FSM.get("thingOnTop")(one, two);
}
// Like objectOnTop, but more specifically used for characterOnSolid and characterOnResting
function objectOnSolid(one, two) {
    return FSM.get("thingOnSolid")(one, two);
}
function solidOnCharacter(solid, me) {
    return FSM.get("solidOnCharacter")(solid, me);
}
// Can't use objectOnTop for this, else Player will walk on walls.
function characterOnSolid(me, solid) {
    return FSM.get("characterOnSolid")(me, solid);
}
function characterOnResting(me, solid) {
    return FSM.get("characterOnResting")(me, solid);
}

function characterTouchedSolid(me, solid) {
  if(solid.up === me) return;
  
  // Me on top of the solid
  if(characterOnSolid(me, solid)) {
    if(solid.hidden) return;
    me.resting = solid;
    // Meh.
    if(me.player && map_settings.underwater) removeClass(me, "paddling");
  }
  
  // Solid on top of me
  else if(solidOnCharacter(solid, me)) {
    var mid = me.left + me.width * unitsize / 2;
    if(mid > solid.left && mid < solid.right) me.undermid = solid;
    else if(solid.hidden) return;
    if(!me.under) me.under = [solid];
    else me.under.push(solid);
    // To do: make this not so obviously hardcoded
    if(me.player) {
      setTop(me, solid.bottom - me.toly + solid.yvel, true);
    }
    me.yvel = solid.yvel;
    if(me.player) me.keys.jump = 0;
  }
  
  if(solid.hidden) return;
  
  // Character bumping into the side
  //// .midx is given by solidOnCharacter
  if(!characterNotBumping(me, solid) && !objectOnTop(me, solid) && !objectOnTop(solid, me) && !me.under && me != solid.up) {
    if(me.right <= solid.right) { // To left of solid
      me.xvel = min(me.xvel, 0);
      shiftHoriz(me, max(solid.left + unitsize - me.right, -unitsized2), true);
    } else if(me.left >= solid.left) { // To right of solid
      me.xvel = max(me.xvel, 0);
      shiftHoriz(me, min(solid.right - unitsize - me.left, unitsized2), true);
    }
    
    // Non-Players are instructed to flip
    if(!me.player) {
      me.moveleft = !me.moveleft;
      if(me.group == "item") me.collide(solid, me);
    }
    // Player uses solid.actionLeft (e.g. Pipe -> intoPipeHoriz)
    else if(solid.actionLeft)
      solid.actionLeft(me, solid, solid.transport);
  }
}
// Really just for koopas
function characterNotBumping(me, solid) {
  if(me.top + me.toly + abs(me.yvel) > solid.bottom) return true;
  return false;
}

function characterTouchesUp(me, solid) {
  switch(me.group) {
    case "item": 
      me.moveleft = getMidX(me) <= getMidX(solid) + unitsized2;
      characterHops(me);
    break;
    case "coin":
      me.animate(me);
    break;
    default:
      me.death(me, 2);
      scoreEnemyBelow(me);
    break;
  }
}

function characterHops(me) {
  me.yvel = -1.4 * unitsize;
  me.resting = false;
}

function characterIsAlive(me) {
  return !(!me || me.dead || !me.alive);
}

/*
 * Scoring on enemies
 */
function scorePlayerShell(player, shell) {
  // Star Player gets 200
  if(player.star) {
    // return score(shell, 200, true);
    FSM.scoreOn(200, shell);
  }
  // Shells in the air cause 8000 points, oh lawdy
  else if(!shell.resting) {
    // return score(shell, 8000, true);
    FSM.scoreOn(8000, shell);
  }
  // Peeking shells are also more
  else if(shell.peeking) {
    // return score(shell, 1000, true);
    FSM.scoreOn(1000, shell);
  }
  // Regular points are just 100
  // return score(shell, 100, true);
  else {
    FSM.scoreOn(100, shell);
  }
}
function scoreEnemyStomp(enemy) {
  var amount = 100;
  switch(enemy.title.split(" ")[0]) {
    case "koopa": amount = enemy.fly ? 400 : 100; break;
    case "bulletbill": amount = 200; break;
    case "cheepcheep": amount = 200; break;
    case "hammerbro": amount = 1000; break;
    case "lakitu": amount = 800; break;
    default: amount = 100; break;
  }
  // scoreEnemyFin(enemy, amount);
}
function scoreEnemyFire(enemy) {
  var amount = 200;
  switch(enemy.title.split(" ")[0]) {
    case "goomba": amount = 100; break;
    case "hammerbro": amount = 1000; break;
    case "bowser": amount = 5000; break;
    default: amount = 200; break;
  }
  scoreEnemyFin(enemy, amount);
}
function scoreEnemyStar(enemy) {
  var amount = 200;
  switch(enemy.title.split(" ")[0]) {
    case "goomba": amount = 100; break;
    case "hammerbro": amount = 1000; break;
    default: amount = 200; break;
  }
  scoreEnemyFin(enemy, amount);
  AudioPlayer.play("Kick");
}
function scoreEnemyBelow(enemy) {
  var amount = 100;
  switch(enemy.title.split(" ")[0]) {
    case "hammerbro": amount = 1000; break;
    default: amount = 100; break;
  }
  scoreEnemyFin(enemy, amount);
}
function scoreEnemyFin(enemy, amount) {
  // score(enemy, amount, true);
  FSM.scoreOn(amount, enemy);
}

/*
 * General actions
 */

// function moveSimple(me) {
    // FSM.get("moveSimple")(me);
// }

function moveSmart(me) {
    FSM.get("moveSmart")(me);
}

function moveJumping(me) {
    FSM.get("moveJumping")(me);
}

// Floating: the vertical version
// Example usage on World 1-3
// [moveFloating, 30, 72] slides up and down between 30 and 72
function moveFloating(me) {
    FSM.get("moveFloating")(me);
}
function moveFloatingReal(me) {
    FSM.get("moveFloatingReal")(me);
}
// Sliding: the horizontal version
// Example usage on World 3-3
// [moveSliding, 228, 260] slides back and forth between 228 and 260
function moveSliding(me) {
    FSM.get("moveSliding")(me);
}
function moveSlidingReal(me) {
    FSM.get("moveSlidingReal")(me);
}
// Makes sure begin < end by swapping if not so
function setPlatformEndpoints(me) {
    FSM.get("setPlatformEndpoints")(me);
}

function movePlatformSpawn(me) {
  // This is like movePlatformNorm, but also checks for whether it's out of bounds
  // Assumes it's been made with a PlatformGenerator as the parent
  // To do: make the PlatformGenerator check one at a time, not each of them.
  if(me.bottom < me.parent.top) {
    setBottom(me, me.parent.bottom);
    detachPlayer(me);
  }
  else if(me.top > me.parent.bottom) {
    setTop(me, me.parent.top);
    detachPlayer(me);
  }
  else movePlatformNorm(me);
}
function movePlatformNorm(me) {
    FSM.get("movePlatform")(me);
}

function collideTransport(me, solid) {
  characterTouchedSolid(me, solid);
  if(solid != me.resting) return;
  
  solid.movement = movePlatformNorm;
  solid.collide = characterTouchedSolid;
  solid.xvel = unitsized2;
}

// To do: make me.collide and stages w/functions
// To do: split this into .partner and whatnot
function moveFalling(me) {
    FSM.get("moveFalling")(me);
}
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
    me.collide = me.partner.collide = characterTouchedSolid;
    // Keep falling at an increasing pace
    me.movement = me.partner.movement = moveFreeFalling;
  }
}
function moveFreeFalling(me) {
    FSM.get("moveFreeFalling")(me);
}
function shiftScaleStringVert(me, string, yvel) {
  shiftVert(me, yvel);
  string.bottom = me.top;
  string.height = (string.bottom - string.top) / unitsize;
  updateSize(string);
}

function setTitle(me, strin) { 
    FSM.get("setTitle")(me, strin);
}

function setClass(me, strin) { 
    FSM.get("setClass")(me, strin);
}
function setClassInitial(me, strin) { 
    FSM.get("setClassInitial")(me, strin);
}
function addClass(me, strin) { 
    FSM.get("addClass")(me, strin);
}
function removeClass(me, strout) {  
    FSM.get("removeClass")(me, strout);
}
function switchClass(me, strout, strin) { 
    FSM.get("switchClass")(me, strout, strin);
}
function removeClasses(me) {
    FSM.get("removeClasses").apply(this, arguments);
}
function addClasses(me, strings) {
    FSM.get("addClasses").apply(this, arguments);
}


// Used in Editor
function addElementClass(element, strin) { element.className += " " + strin; }
function removeElementClass(element, strin) { element.className = element.className.replace(new RegExp(" " + strin,"gm"),''); }


function flipHoriz(me) {
    FSM.get("flipHoriz")(me);
}
function flipVert(me) { 
    FSM.get("flipVert")(me);
}
function unflipHoriz(me) {
    FSM.get("unflipHoriz")(me);
}
function unflipVert(me) {
    FSM.get("unflipVert")(me);
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
function killNormal(me) {
  FSM.get("killNormal")(me);
}
function killFlip(me, extra) {
  FSM.get("killFlip")(me, extra);
}

function flicker(me, cleartime, interval) {
  var cleartime = round(cleartime) || 49,
      interval = round(interval) || 3;
  me.flickering = true;
  TimeHandler.addEventInterval(function(me) { me.hidden = !me.hidden; }, interval, cleartime, me);
  TimeHandler.addEvent(function(me) { me.flickering = me.hidden = false; }, cleartime * interval + 1, me);
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
      unflipHoriz(me);
    }
  }
  // Player is to the right
  else if(player.left >= me.right) {
    if(me.lookleft || big) {
      me.lookleft = false;
      me.moveleft = true;
      flipHoriz(me);
    }
  }
}
function lookTowardThing(me, thing) {
  // It's to the left
  if(thing.right <= me.left) {
    me.lookleft = true;
    me.moveleft = false;
    unflipHoriz(me);
  }
  // It's to the right
  else if(thing.left >= me.right) {
    me.lookleft = false;
    me.moveleft = true;
    flipHoriz(me);
  }
}