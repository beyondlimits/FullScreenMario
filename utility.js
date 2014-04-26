/* Utility.js */
// Contains all needed helper functions not in toned.js

/* General stuff */
 
// Expensive - use only on clearing
function clearAllTimeouts() {
  return FSM.utility.clearAllTimeouts();
}

// Width and height are given as number of pixels (to scale; unitsize) 
function getCanvas(width, height, multiplier) {
    return FSM.html.getCanvas(width, height, multiplier);
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
    FSM.physics.updatePosition(me);
}
function updateSize(me) {
  me.unitwidth = me.width * unitsize;
  me.unitheight = me.height * unitsize;
  me.spritewidthpixels = me.spritewidth * unitsize;
  me.spriteheightpixels = me.spriteheight * unitsize;
  var canvas;
  if(canvas = me.canvas) {
    canvas.width = me.spritewidthpixels;
    canvas.height = me.spriteheightpixels;
    // me.context = canvas.getContext("2d");
    // refillThingCanvas(me);
    PixelDrawer.setThingSprite(me);
  }
}
function reduceHeight(me, dy, see) {
  me.top += dy;
  me.height -= dy / unitsize;
  
  if(see) {
    updateSize(me);
  }
}
function shiftBoth(me, dx, dy) {
    FSM.physics.shiftBoth(me, dx, dy);
}
function shiftHoriz(me, dx) {
    FSM.physics.shiftHoriz(me, dx);
}
function shiftVert(me, dy) {
    FSM.physics.shiftVert(me, dy);
}
function setLeft(me, left) {
    FSM.physics.setLeft(me, left);
}
function setRight(me, right) {
    FSM.physics.setRight(me, right);
}
function setTop(me, top) {
    FSM.physics.setTop(me, top);
}
function setBottom(me, bottom) {
    FSM.physics.setBottom(me, bottom);
}
function setWidth(me, width, spriter, updater) {
    FSM.physics.setWidth(me, width, spriter, updater);
}
function setHeight(me, height, spriter, updater) {
    FSM.physics.setWidth(me, height, spriter, updater);
}
function setSize(me, width, height, spriter, updater) {
    FSM.physics.setSize(me, width, height, spriter, updater);
}
function setMidX(me, x) {
    FSM.physics.setMidX(me, x);
}
function setMidY(me, y) {
    FSM.physics.setMidY(me, y);
}
function getMidX(me) {
    return FSM.physics.getMidX(me);
}
function getMidY(me) {
    return FSM.physics.getMidY(me);
}
function setMidXObj(me, object) {
    FSM.physics.setMidXObj(me, object);
}
function setMidYObj(me, object) {
    FSM.physics.setMidYObj(me, object);
}
function slideToXLoc(me, xloc, maxspeed) {
    FSM.physics.slideToX(me, xloc, maxspeed); 
}
function updateLeft(me, dx) {
    FSM.physics.updateLeft(me, dx);
}
function updateRight(me, dx) {
    FSM.physics.updateRight(me, dx);
}
function updateTop(me, dy) {
    FSM.physics.updateTop(me, dy);
}
function updateBottom(me, dy) {
    FSM.physics.updateBottom(me, dy);
}
function increaseHeightTop(me, dy) {
    FSM.physics.increaseHeight(me, dy);
}

/*
 * Collisions
 */

/* Object Collision Detection (new)
*/

function thingCanCollide(thing) {
    return FSM.collisions.thingCanCollide(thing);
}

function thingTouchesThing(thing, other) {
    return FSM.collisions.thingTouchesThing(thing, other);
}

function characterTouchesSolid(thing, other) {
    return FSM.collisions.characterTouchesSolid(thing, other);
}

function characterTouchesCharacter(thing, other) {
    return FSM.collisions.characterTouchesCharacter(thing, other);
}

function characterHitsSolid(thing, other) {
    return FSM.collisions.characterHitsSolid(thing, other);
}

function characterHitsCharacter(thing, other) {
    return FSM.collisions.characterHitsCharacter(thing, other);
}


// No tolerance! Just unitsize.

// Sees whether one's midpoint is to the left of two's
function objectToLeft(one, two) {
    return FSM.physics.objectToLeft(one, two);
}

function objectOnTop(one, two) {
    return FSM.collisions.thingOnTop(one, two);
}
// Like objectOnTop, but more specifically used for characterOnSolid and characterOnResting
function objectOnSolid(one, two) {
    return FSM.collisions.thingOnSolid(one, two);
}
function solidOnCharacter(solid, me) {
    return FSM.collisions.solidOnCharacter(solid, me);
}
// Can't use objectOnTop for this, else Player will walk on walls.
function characterOnSolid(me, solid) {
    return FSM.collisions.characterOnSolid(me, solid);
}
function characterOnResting(me, solid) {
    return FSM.collisions.characterOnResting(me, solid);
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
  if(player.star) return score(shell, 200, true);
  // Shells in the air cause 8000 points, oh lawdy
  if(!shell.resting) return score(shell, 8000, true);
  // Peeking shells are also more
  if(shell.peeking) return score(shell, 1000, true);
  // Regular points are just 100
  return score(shell, 100, true);
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
  score(enemy, amount, true);
}

/*
 * General actions
 */

function moveSimple(me) {
    FSM.movement.moveSimple(me);
}

function moveSmart(me) {
    FSM.movement.moveSmart(me);
}

function moveJumping(me) {
    FSM.movement.moveJumping(me);
}

// Floating: the vertical version
// Example usage on World 1-3
// [moveFloating, 30, 72] slides up and down between 30 and 72
function moveFloating(me) {
    FSM.movement.moveFloating(me);
}
function moveFloatingReal(me) {
    FSM.movement.moveFloatingReal(me);
}
// Sliding: the horizontal version
// Example usage on World 3-3
// [moveSliding, 228, 260] slides back and forth between 228 and 260
function moveSliding(me) {
    FSM.movement.moveSliding(me);
}
function moveSlidingReal(me) {
    FSM.movement.moveSlidingReal(me);
}
// Makes sure begin < end by swapping if not so
function setPlatformEndpoints(me) {
    FSM.movement.setPlatformEndpoints(me);
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
    FSM.movement.movePlatform(me);
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
  if(me != player.resting) return me.yvel = 0;
  
  // Since Player is on me, fall
  shiftVert(me, me.yvel += unitsized8);
  setBottom(player, me.top);
  
  // After a velocity threshold, always fall
  if(me.yvel >= unitsize * 2.8) {
    me.freefall = true;
    me.movement = moveFreeFalling;
  }
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
  shiftVert(me, me.yvel += unitsized16);
  if(me.yvel > unitsizet2)
    me.movement = function(me) { shiftVert(me, me.yvel); }
}
function shiftScaleStringVert(me, string, yvel) {
  shiftVert(me, yvel);
  string.bottom = me.top;
  string.height = (string.bottom - string.top) / unitsize;
  updateSize(string);
}

function setTitle(me, strin) { me.title = strin; PixelDrawer.setThingSprite(me); }
function setClass(me, strin) { me.className = strin; PixelDrawer.setThingSprite(me); }
function setClassInitial(me, strin) { me.className = strin; }
function addClass(me, strin) { me.className += " " + strin; PixelDrawer.setThingSprite(me); }
function removeClass(me, strout) { 
    me.className = me.className.replace(new RegExp(" " + strout,"gm"),''); 
    PixelDrawer.setThingSprite(me);
}
function switchClass(me, strout, strin) { removeClass(me, strout); addClass(me, strin); }
function removeClasses(me) {
  var strings, arr, i, j;
  for(i = 1; i < arguments.length; ++i) {
    arr = arguments[i];
    if(!(arr instanceof Array)) arr = arr.split(" ");
    for(j = arr.length - 1; j >= 0; --j)
      removeClass(me, arr[j]);
  }
}
function addClasses(me, strings) {
  var arr = strings instanceof Array ? strings : strings.split(" ");
  for(var i = arr.length - 1; i >= 0; --i)
    addClass(me, arr[i]);
}
// Used in Editor
function addElementClass(element, strin) { element.className += " " + strin; }
function removeElementClass(element, strin) { element.className = element.className.replace(new RegExp(" " + strin,"gm"),''); }

function flipHoriz(me) { addClass(me, "flipped"); }
function flipVert(me) { addClass(me, "flip-vert"); }
function unflipHoriz(me) { removeClass(me, "flipped"); }
function unflipVert(me) { removeClass(me, "flip-vert"); }

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
  if(!me) return;
  me.hidden = me.dead = true;
  me.alive = me.resting = me.movement = false;
  TimeHandler.clearAllCycles(me);
}
function killFlip(me, extra) {
  flipVert(me);
  me.bottomBump = function() {};
  me.nocollide = me.dead = true;
  me.resting = me.movement = me.speed = me.xvel = me.nofall = false;
  me.yvel = -unitsize;
  TimeHandler.addEvent(function(me) { killNormal(me); }, 70 + (extra || 0));
}

function blockBumpMovement(me) {
  var dir = -3,
      dd = .5;
  // To do: addEventInterval?
  var move = setInterval(function() {
    shiftVert(me, dir);
    dir += dd;
    if(dir == 3.5) {
      me.up = false;
      clearTimeout(move);
    }
  }, timer);
}

function emergeUp(me, solid) {
  AudioPlayer.play("Powerup Appears");
  flipHoriz(me);
  me.nomove = me.nocollide = me.alive = me.nofall = me.emerging = true;
  switchContainers(me, characters, scenery);
  // Start moving up
  var move = setInterval(function() {
    shiftVert(me, -unitsized8);
    // Stop once the bottom is high enough
    if(me.bottom <= solid.top) {
      clearInterval(move);
      switchContainers(me, scenery, characters);
      me.nocollide = me.nomove = me.moveleft = me.nofall = me.emerging = false;
      // If it has a function to call after being completely out (vines), do it
      if(me.emergeOut) me.emergeOut(me, solid);
      // If there's movement, don't do it at first
      if(me.movement) {
        me.movementsave = me.movement;
        me.movement = moveSimple;
        // Wait until it's off the solid
        me.moving = TimeHandler.addEventInterval(function(me, solid) {
          if(me.resting != solid) {
            TimeHandler.addEvent(function(me) { me.movement = me.movementsave; }, 1, me);
            return true;
          }
        }, 1, Infinity, me, solid);
      }
    }
  }, timer);
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