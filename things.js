/* Things.js */
// Stores Thing creators, functions, and manipulators

/* To-do list:
  * Integrate visual scenery (see Piranha) as a typical thing
  * turn collide, movement, etc. into onCollide, onMovement, etc.
  * gravity vs map.gravity vs onThingMake() {...gravity...}
  * auto-generate properties based on names
  * auto-generate important names based on properties
  * use more inheritance:
    * NPCs
    * TreeTops
  * use collider/spawner for more stuff
*/

function resetThings() {
    window.ThingHitter = FSM.ThingHitter;
    window.ObjectMaker = FSM.ObjectMaker;
}


/*
 * Player
 */
function placePlayer(xloc, yloc) {
  clearOldPlayer();
  return window.player = FSM.get("addPlayer")(xloc, yloc);
}
function clearOldPlayer() {
  if(!window.player) return;
  player.alive = false;
  player.dead = true;
  nokeys = notime = false;
}

// Gives player visual running
function playerStartRunningCycle(me) {
  // setPlayerRunningCycler sets the time between cycles
  me.running = TimeHandler.addSpriteCycle(me, ["one", "two", "three", "two"], "running", setPlayerRunningCycler);
}
// Used by player's running cycle to determine how fast he should switch between sprites
function setPlayerRunningCycler(event) {
  event.timeout = 5 + ceil(player.maxspeedsave - abs(player.xvel));
}

function unattachPlayer(me) {
  me.movement = FullScreenMario.prototype.movePlayer;
  FSM.removeClasses(me, "climbing", "animated");
  TimeHandler.clearClassCycle(me, "climbing");
  me.yvel = me.attachoff = me.nofall = me.climbing = me.attached = me.attached.attached = false;
  me.xvel = me.keys.run;
}

function playerHopsOff(me, addrun) {
  FSM.removeClasses(me, "climbing running");
  FSM.addClass(me, "jumping");
  
  me.nocollide = me.nofall = me.climbing = false;
  me.gravity = map_settings.gravity / 14;
  me.xvel = 1.4;
  me.yvel = -1.4;
  TimeHandler.addEvent(function(me) {
    FSM.unflipHoriz(me);
    me.gravity = map_settings.gravity;
    me.movement = movePlayer;
    me.attached = false;
    if(addrun) {
      FSM.addClass(me, "running")
      playerStartRunningCycle(me);
    }
  }, 21, me);
  
}

function gameOver() {
  gameon = false;
  pause();
  AudioPlayer.pauseTheme();
  AudioPlayer.play("Game Over");
  
  var innerHTML = "<div style='font-size:49px;padding-top: " + (innerHeight / 2 - 28/*49*/) + "px'>GAME OVER</div>";
  // innerHTML += "<p style='font-size:14px;opacity:.49;width:490px;margin:auto;margin-top:49px;'>";
  // innerHTML += "You have run out of lives. Maybe you're not ready for playing real games...";
  innerHTML += "</p>";
  
  body.className = "Night"; // to make it black
  body.innerHTML = innerHTML;
  
  setTimeout(gameRestart, 7000);
}

function gameRestart() {
  body.style.visibility = "hidden";
  body.innerHTML = body.style.paddingTop = body.style.fontSize = "";
  body.appendChild(canvas);
  gameon = true;
  setMap([1,1]);
  TimeHandler.addEvent(function() { body.style.visibility = ""; });
  StatsHolder.set("lives", 3);
}




/* Solids
 */

function detachPlayer(me) {
  if(player.resting != me) return;
  player.resting = false;
}

function FlagCollisionTop(me, detector) {
  AudioPlayer.pause();
  AudioPlayer.play("Flagpole");
  
  // All other characters die, and the player is no longer in control
  killOtherCharacters();
  nokeys = notime = true;

  // The player also is frozen in this dropping state, on the pole
  me.xvel = me.yvel = 0;
  me.dropping = me.nofall = me.nocollidechar = 1;
  FSM.setRight(me, detector.left);
  
  // Visually, the player is now climbing, and invincible
  ++me.star;
  FSM.removeClasses(me, "running jumping skidding");
  FSM.addClass(me, "climbing animated");
  TimeHandler.addSpriteCycle(me, ["one", "two"], "climbing");
  
  // Start moving the player down, as well as the end flag
  var endflag = MapsManager.getArea().getThingByID("endflag"),
      bottom_cap = (map_settings.floor - 9) * FullScreenMario.unitsize;
  me.movement = function(me) { 
    if(me.bottom < bottom_cap)
      FSM.shiftVert(me,FullScreenMario.unitsize);
    if(endflag.bottom < bottom_cap)
      FSM.shiftVert(endflag,FullScreenMario.unitsize);
    
    // If both are at the bottom, clear climbing and allow walking
    if(me.bottom >= bottom_cap && endflag.bottom >= bottom_cap) {
      me.movement = false;
      TimeHandler.clearClassCycle(me, "climbing");
      
      // Wait a little bit to FlagOff, which will start the player walking
      TimeHandler.addEvent(FlagOff, 21, me);
    }
  }
}

function FlagOff(me, solid) {
  // Flip the player to the other side of the solid
  FSM.flipHoriz(me);
  FSM.shiftHoriz(me, (me.width + 1) * FullScreenMario.unitsize);
  
  // Prepare the player to walk to the right
  me.keys.run = 1;
  me.maxspeed = me.walkspeed;
  
  // The walking happens a little bit later as well
  TimeHandler.addEvent(function() {
    AudioPlayer.play("Stage Clear");
    playerHopsOff(me, true);
  }, 14, me);
}

// Me === Player
function endLevelPoints(me, detector) {
  if(!me || !me.player) return;
  
  // Stop the game, and get rid of player and the detectors
  notime = nokeys = true;
  FSM.killNormal(me);
  
  // Determine the number of fireballs (1, 3, and 6 become not 0)
  var numfire = parseInt(getLast(String(StatsHolder.get("time"))));
  if(!(numfire == 1 || numfire == 3 || numfire == 6)) numfire = 0;
  // Count down the points (x50)
  var points = setInterval(function() {
    // 50 points for each unit of time
    StatsHolder.decrease("time");
    StatsHolder.increase("score", 50);
    // Each point(x50) plays the coin noise
    AudioPlayer.play("Coin");
    // Once it's done, move on to the fireworks.
    if(StatsHolder.get("time") <= 0)  {
      // pause();
      clearInterval(points);
      setTimeout(function() { endLevelFireworks(me, numfire, detector); }, timer * 49);
    }
  }, timer);
}
function endLevelFireworks(me, numfire, detector) {
  var nextnum, nextfunc,
      i = 0;
  if(numfire) {
    // var castlemid = detector.castle.left + detector.castle.width * FullScreenMario.unitsize / 2;
    var castlemid = detector.left + 32 * FullScreenMario.unitsize / 2;
    while(i < numfire)
      explodeFirework(++i, castlemid); // Pre-increment since explodeFirework expects numbers starting at 1
    nextnum = timer * (i + 2) * 42;
  }
  else nextnum = 0;
  
  // The actual endLevel happens after all the fireworks are done
  nextfunc = function() { setTimeout(function() { endLevel(); }, nextnum); };
  
  // If the Stage Clear sound is still playing, wait for it to finish
  AudioPlayer.addEventImmediate("Stage Clear", "ended", function() { TimeHandler.addEvent(nextfunc, 35); });
}
function explodeFirework(num, castlemid) {
  setTimeout(function() {
    log("Not placing fireball.");
    // var fire = ObjectMaker.make("Firework");
    // addThing(fire, castlemid + fire.locs[0] -FullScreenMario.unitsize * 6,FullScreenMario.unitsize * 16 + fire.locs[1]);
    // fire.animate();
  }, timer * num * 42);
}
function Firework(me, num) {
  me.width = me.height = 8;
  me.nocollide = me.nofire = me.nofall = true;
  // Number is >0 if this is ending of level
  if(num)
    switch(num) {
      // These probably aren't the exact same as original... :(
      case 1: me.locs = [unitsize * 16,FullScreenMario.unitsize * 16]; break;
      case 2: me.locs = [-unitsize * 16,FullScreenMario.unitsize * 16]; break;
      case 3: me.locs = [unitsize * 16 * 2,FullScreenMario.unitsize * 16 * 2]; break;
      case 4: me.locs = [unitsize * 16 * -2,FullScreenMario.unitsize * 16 * 2]; break;
      case 5: me.locs = [0,unitsize * 16 * 1.5]; break;
      default: me.locs = [0,0]; break;
    }
  // Otherwise, it's just a normal explosion
  me.animate = function() {
    FSM.animateFirework(me);
    if(me.locs) {
        FSM.AudioPlayer.play("Firework");
    }
  }
  setCharacter(me, "firework");
  // score(me, 500);
  FSM.StatsHolder.increase("score", 500);
}


/* Scenery 
*/

// Scenery sizes are stored in window.scenery
// After creation, they're processed
function resetScenery() {
  // Patterns of scenery that can be placed in one call
  // Each ends with "Blank" to signify the ending width
  window.Scenery = {
    BackRegular: [
      ["HillLarge", 0, 0],
      ["Cloud1", 68, 68],
      ["Bush3", 92, 0],
      ["HillSmall", 128, 0],
      ["Cloud1", 156, 76],
      ["Bush1", 188, 0],
      ["Cloud3", 220, 68],
      ["Cloud2", 292, 76],
      ["Bush2", 332, 0],
      ["Blank", 384]
    ],
    BackCloud: [
      ["Cloud2", 28, 64],
      ["Cloud1", 76, 32],
      ["Cloud2", 148, 72],
      ["Cloud1", 228, 0],
      ["Cloud1", 284, 32],
      ["Cloud1", 308, 40],
      ["Cloud1", 372, 0],
      ["Blank", 384]
    ],
    BackCloudMin: [ // used for random map generation
      ["Cloud1", 68, 68],
      ["Cloud1", 156, 76],
      ["Cloud3", 220, 68],
      ["Cloud2", 292, 76],
      ["Blank", 384]
    ],
    BackFence: [
      ["PlantSmall", 88, 0],
      ["PlantLarge", 104, 0],
      ["Fence", 112, 0, 4],
      ["Cloud1", 148, 68],
      ["PlantLarge", 168, 0],
      ["PlantSmall", 184, 0],
      ["PlantSmall", 192, 0],
      ["Cloud1", 220, 76],
      ["Cloud2", 244, 68],
      ["Fence", 304, 0, 2],
      ["PlantSmall", 320, 0],
      ["Fence", 328, 0],
      ["PlantLarge", 344, 0],
      ["Cloud1", 364, 76],
      ["Cloud2", 388, 68],
      ["Blank", 384]
    ],
    BackFenceMin: [
      ["PlantLarge", 104, 0],
      ["Fence", 112, 0, 4],
      ["Cloud1", 148, 68],
      ["PlantLarge", 168, 0],
      ["PlantSmall", 184, 0],
      ["PlantSmall", 192, 0],
      ["Cloud1", 220, 76],
      ["Cloud2", 244, 68],
      ["Fence", 304, 0, 2],
      ["PlantSmall", 320, 0],
      ["Fence", 328, 0],
      ["Cloud1", 364, 76],
      ["Cloud2", 388, 68],
      ["Blank", 384]
    ],
    BackFenceMin2: [
      ["Cloud2", 4, 68],
      ["PlantSmall", 88, 0],
      ["PlantLarge", 104, 0],
      ["Fence", 112, 0, 1],
      ["Fence", 128, 0, 2],
      ["Cloud1", 148, 68],
      // ["PlantLarge", 168, 0],
      ["PlantSmall", 184, 0],
      ["PlantSmall", 192, 0],
      ["Cloud1", 220, 76],
      ["Cloud2", 244, 68],
      ["Fence", 304, 0, 2],
      ["PlantSmall", 320, 0],
      ["Fence", 328, 0],
      ["PlantLarge", 344, 0],
      ["Cloud1", 364, 76],
      ["Cloud2", 388, 68],
      ["Blank", 384]
    ],
    BackFenceMin3: [
      ["Cloud2", 4, 68],
      ["PlantSmall", 88, 0],
      ["PlantLarge", 104, 0],
      ["Fence", 112, 0, 4],
      ["Cloud1", 148, 68],
      ["PlantSmall", 184, 0],
      ["PlantSmall", 192, 0],
      ["Cloud1", 220, 76],
      ["Cloud2", 244, 68],
      ["Cloud1", 364, 76],
      ["Cloud2", 388, 68],
      ["Blank", 384]
    ]
  };
  
  processSceneryPatterns(Scenery);
}

// Sets the width of them and removes the blank element
function processSceneryPatterns(patterns) {
  var current, i;
  for(i in patterns) {
    current = patterns[i];
    if(!current.length) continue;
    // The last array in current should be ["blank", width]
    current.width = current[current.length - 1][1];
    current.pop();
  }
}