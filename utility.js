/* Utility.js */
// Contains all needed helper functions not in toned.js

/* General stuff */
 
// Expensive - use only on clearing
function clearAllTimeouts() {
  var id = setTimeout(function() {});
  while(id--) clearTimeout(id);
}

// Width and height are given as number of pixels (to scale; unitsize) 
function getCanvas(width, height, stylemult) {
  var canv = createElement("canvas", {
    width: width,
    height: height
  });
  
  // If necessary, make this thing's visual style
  if(stylemult) {
    // stylemult is 1 by default, but may be something else (typically unitsize)
    stylemult = stylemult || unitsize;
    proliferate(canv.style, {
      width: (width * stylemult) + "px",
      height: (height * stylemult) + "px"
    });
  }
  
  // For speed's sake, disable all image smoothing
  proliferate(canv.getContext("2d"), {
    "imageSmoothingEnabled":  false,
    "webkitImageSmoothingEnabled": false,
    "mozImageSmoothingEnabled": false,
    "msImageSmoothingEnabled": false,
    "oImageSmoothingEnabled": false
  });
  
  return canv;
}

function step(num) {
  GamesRunner.step(num);
}

function fastforward(num) {
  GamesRunner.setSpeed(num);
}

function toggleFastFWD(num) {
  if(!window.fastforwarding) {
    fastforward(2);
    window.fastforwarding = true;
  }
  else {
    fastforward(0);
    window.fastforwarding = false;
  }
}

function specifyTimer(timerin) {
  // Only use if you're not worried about losing the benefits of requestAnimationFrame
  // Also, this kills performance. Works best with smaller windows!
  timer = timerin;
  requestAnimationFrame = function(func) {
    window.setTimeout(func, timer);
  };
}

function changeUnitsize(num) {
  if(!num) return;
  resetUnitsize(num);
  
  function setter(arr) {
    for(i in arr) {
      updateSize(arr[i]);
      updatePosition(arr[i]);
    }
  }
  
  setter(solids);
  setter(characters);
}

// num = 1 by default
// 1 = floor(0->2) = 50% chance
// 2 = floor(0->3) = 67% chance
// 3 = floor(0->4) = 75% chance
function randTrue(num) {
  return floor(getSeed() * ((num || 1) + 1));
  // return floor(random() * ((num || 1) + 1));
}
function randSign(num) {
  return randTrue(num) * 2 - 1;
}
function randBoolJS(num) {
  return floor(random() * 2);
}

/*
 * Basic object positioning helper functions
 */
function updatePosition(me) {
  // if(!me.nomove) shiftHoriz(me, me.xvel * realtime);
  // if(!me.nofall) shiftVert(me, me.yvel * realtime);
  if(!me.nomove) shiftHoriz(me, me.xvel);
  if(!me.nofall) shiftVert(me, me.yvel);
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
  if(!me.noshiftx) shiftHoriz(me, dx);
  if(!me.noshifty) shiftVert(me, dy);
}
function shiftHoriz(me, dx) {
  me.left += dx;
  me.right += dx;
}
function shiftVert(me, dy) {
  me.top += dy;
  me.bottom += dy;
}
function setLeft(me, left) {
  me.left = left;
  me.right = me.left + me.width * unitsize;
}
function setRight(me, right) {
  me.right = right;
  me.left = me.right - me.width * unitsize;
}
function setTop(me, top) {
  me.top = top;
  me.bottom = me.top + me.height * unitsize;
}
function setBottom(me, bottom) {
  me.bottom = bottom;
  me.top = me.bottom - me.height * unitsize;
}
function setWidth(me, width, spriter, updater) {
  me.width = width;
  me.unitwidth = width * unitsize;
  if(spriter) {
    me.spritewidth = width;
    me.spritewidthpixels = width * unitsize;
  }
  if(updater) {
    updateSize(me);
    setThingSprite(me);
  }
}
function setHeight(me, height, spriter, updater) {
  me.height = height;
  me.unitheight = height * unitsize;
  if(spriter) {
    me.spriteheight = height;
    me.spriteheightpixels = height * unitsize;
  }
  if(updater) {
    updateSize(me);
    setThingSprite(me);
  }
}
function setSize(me, width, height, spriter, updater) {
  if(width) setWidth(me, width, spriter);
  if(height) setHeight(me, height, spriter);
  if(updater) {
    updateSize(me);
    setThingSprite(me);
  }
}
function setMidX(me, left) {
  setLeft(me, left + me.width * unitsized2);
}
function setMidY(me, top) {
  setTop(me, top + me.height * unitsized2);
}
function getMidX(me) {
  return me.left + me.width * unitsized2;
}
function getMidY(me) {
  return me.top + me.height * unitsized2;
}
function setMidXObj(me, object) {
  setLeft(me, (object.left + object.width * unitsized2) - (me.width * unitsized2));
}
function setMidXObj(me, object) {
  setLeft(me, (object.left + object.width * unitsized2) - (me.width * unitsized2));
}
function slideToXLoc(me, xloc, maxspeed) {
  maxspeed = maxspeed || Infinity;
  var midx = getMidX(me);
  if(midx < xloc) {
    // Me is the left
    shiftHoriz(me, min(maxspeed, (xloc - midx)));
  } else {
    // Me is the right
    shiftHoriz(me, max(-maxspeed, (xloc - midx)));
  }
}
function updateLeft(me, dx) {
  me.left += dx;
  me.right = me.left + me.width * unitsize;
}
function updateRight(me, dx) {
  me.right += dx;
  me.left = me.right - me.width * unitsize;
}
function updateTop(me, dy) {
  me.top += dy;
  me.bottom = me.top + me.height * unitsize;
}
function updateBottom(me, dy) {
  me.bottom += dy;
  me.top = me.bottom - me.height * unitsize;
}
// Increases the height, keeping the bottom the same
// dy comes in as factored for unitsize... e.g. increaseHeightTop(me, unitsized4)
function increaseHeightTop(me, dy, spriter) {
  me.top -= dy;
  me.height += dy / unitsize;
  me.unitheight = me.height * unitsize;
}

/*
 * Collisions
 */

// give solid a tag for overlap
// remove tag when overlaps = []
function checkOverlap(me) {
  if(me.overlapdir) {
    if((me.overlapdir < 0 && me.right <= me.ocheck.left + unitsizet2)
        || me.left >= me.ocheck.right - unitsizet2) {
      me.overlapdir = 0;
      me.overlaps = [];
    }
    else shiftHoriz(me, me.overlapdir, true);
  }
  else if(me.overlaps.length > 0) {
    // mid = me.omid is the midpoint of what is being overlapped
    var overlaps = me.overlaps,
        right = {right: -Infinity},
        left = {left: Infinity}, 
        mid = 0, over,
        i;
    me.overlapfix = true;
    
    for(i in overlaps) {
      over = overlaps[i];
      mid += getMidX(over);
      if(over.right > right.right) right = over;
      if(over.left < left.left) left = over;
    }
    mid /= overlaps.length;
    if(getMidX(me) >= mid - unitsized16) {
      // To the right of the middle: travel until past right
      me.overlapdir = unitsize;
      me.ocheck = right;
    } else {
      // To the left of the middle: travel until past left
      me.overlapdir = -unitsize;
      me.ocheck = left;
    }
  }
}


/* Object Collision Detection (new)
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
 *
 */
function characterTouchesSolid(thing, other) {
    // Hidden solids can only be touched by the player bottom-bumping them
    if(other.hidden) {
        return thing.player && solidOnCharacter(other, thing);
    }
    
    return thingTouchesThing(thing, other);
}

/**
 *
 */
function characterTouchesCharacter(thing, other) {
    
    return thingTouchesThing(thing, other);
}

/**
 * // thing = character
 * // other = solid
 */
function characterHitsSolid(thing, other) {
    // "Up" solids are special (they kill things that aren't their .up)
    if(other.up && thing !== other.up) {
        return characterTouchesUp(thing, other);
    }
    
    // Normally, call the generic ~TouchedSolid function
    (other.collide || characterTouchedSolid)(thing, other);
    
    // If the solid overlaps this thing, add it to the overlaps array
    if(!thing.skipoverlaps && !other.skipoverlaps 
            && characterOverlapsSolid(thing, other)) {
        thing.overlaps.push(other);
    }
    
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
 */
function characterOverlapsSolid(thing, other) {
  return thing.top <= other.top && thing.bottom > other.bottom;
}


/* Object Collision Detection (old)
*/

// No tolerance! Just unitsize.

// Sees whether one's midpoint is to the left of two's
function objectToLeft(one, two) {
  return (one.left + one.right) / 2 < (two.left + two.right) / 2;
}
/*
  TO DO: Revamp these
*/
function objectOnTop(one, two) {
  if(one.type == "solid" && two.yvel > 0) return false;
  if(one.yvel < two.yvel && two.type != "solid") return false;
  if(one.player && one.bottom < two.bottom && two.type == "enemy") return true;
  return(  (one.left + unitsize < two.right && one.right - unitsize > two.left) && 
  (one.bottom - two.yvel <= two.top + two.toly || one.bottom <= two.top + two.toly + abs(one.yvel - two.yvel)));
}
// Like objectOnTop, but more specifically used for characterOnSolid and characterOnResting
function objectOnSolid(one, two) {
  return(
    ( one.left + unitsize < two.right &&
      one.right - unitsize > two.left )
    && 
    ( one.bottom - one.yvel <= two.top + two.toly || 
      one.bottom <= two.top + two.toly + abs(one.yvel - two.yvel) )
  );
}
function solidOnCharacter(solid, me) {
  if(me.yvel >= 0) return false;
  me.midx = getMidX(me);
  return me.midx > solid.left && me.midx < solid.right && 
  (solid.bottom - solid.yvel <= me.top + me.toly - me.yvel);
}
// This would make the smart koopas stay on the edges more intelligently
// Can't use objectOnTop for this, else Player will walk on walls.
function characterOnSolid(me, solid) {
  return (me.resting == solid || (objectOnSolid(me, solid) && me.yvel >= 0 &&
    me.left + me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left));
    // me.left - me.xvel + unitsize != solid.right && me.right + me.xvel - unitsize != solid.left));
    // me.left - me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left));
}
function characterOnResting(me, solid) {
  return objectOnSolid(me, solid) &&
    // me.left - me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left;
    me.left + me.xvel + unitsize != solid.right && me.right - me.xvel - unitsize != solid.left;
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
  if(me.direction != me.moveleft) {
    if(me.moveleft) {
      me.xvel = -me.speed;
      if(!me.noflip) unflipHoriz(me);
    } else {
      if(!me.noflip) flipHoriz(me);
      me.xvel = me.speed; 
    }
    me.direction = me.moveleft;
  }
}

function moveSmart(me) {
  moveSimple(me);
  
  // If this is resting, it's the same as moveSimple
  if(!me.resting) return;
  
  if(me.moveleft) {
    if(me.left + unitsize > me.resting.left) return;
    else shiftHoriz(me, unitsize, true);
  }
  else {
    if(me.right - unitsize < me.resting.right) return;
    else shiftHoriz(me, -unitsize, true);
  }
  me.moveleft = !me.moveleft;
  
  // if(me.yvel == 0 && (!me.resting || (offResting(me)))) {
    // if(me.moveleft) shiftHoriz(me, unitsize, true);
    // else shiftHoriz(me, -unitsize, true);
    // me.moveleft = !me.moveleft;
  // }
}
function offResting(me) {
  if(me.moveleft) return me.right - unitsize < me.resting.left;
  else return me.left + unitsize > me.resting.right;
}

function moveJumping(me) {
  moveSimple(me);
  if(me.resting) {
    me.yvel = -abs(me.jumpheight);
    me.resting = false;
  }
}

// Floating: the vertical version
// Example usage on World 1-3
// [moveFloating, 30, 72] slides up and down between 30 and 72
function moveFloating(me) {
  setPlatformEndpoints(me);
  me.begin = map_settings.floor * unitsize - me.begin;
  me.end = map_settings.floor * unitsize - me.end;
  (me.movement = moveFloatingReal)(me);
}
function moveFloatingReal(me) {
  if(me.top < me.end)
    me.yvel = min(me.yvel + unitsized32, me.maxvel);
  else if(me.bottom > me.begin)
    me.yvel = max(me.yvel - unitsized32, -me.maxvel);
  movePlatformNorm(me);
}
// Sliding: the horizontal version
// Example usage on World 3-3
// [moveSliding, 228, 260] slides back and forth between 228 and 260
function moveSliding(me) {
  setPlatformEndpoints(me);
  (me.movement = moveSlidingReal)(me);
}
function moveSlidingReal(me) {
  if(gamescreen.left + me.left < me.begin)
    me.xvel = min(me.xvel + unitsized32, me.maxvel);
  else if(gamescreen.left + me.right > me.end)
    me.xvel = max(me.xvel - unitsized32, -me.maxvel);
  movePlatformNorm(me);
}
// Makes sure begin < end by swapping if not so
function setPlatformEndpoints(me) {
  if(me.begin > me.end) {
    var temp = me.begin;
    me.begin = me.end;
    me.end = temp;
  }
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

// To do: phase this out in favor of an addEvent-based one
function generalMovement(me, dx, dy, cleartime) {
  var move = setInterval(function() {
    shiftVert(me, dy);
    shiftHoriz(me, dx);
  }, timer);
  setTimeout(function() { clearInterval(move); }, cleartime);
}
function blockBumpMovement(me) {
  var dir = -3, dd = .5;
  // To do: addEventInterval?
  var move = setInterval(function() {
    shiftVert(me, dir);
    dir += dd;
    if(dir == 3.5) {
      clearInterval(move);
      me.up = false;
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