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