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
  
    window.ObjectMaker = FSM.ObjectMaker = new ObjectMakr(FullScreenMario.prototype.things);
    console.log("Will have to add FSM in ObjectMaker (Thing: { EightBitter: FSM ...");
}

/* Characters (except player, who has his own .js)
 */
 

/* Items
 */

function itemJump(me) {
  FSM.get("itemJump")(me);
}

function fireDeleted() {
  --player.numballs;
}


// Assuming one is player, two is item
function collideFriendly(one, two) {
    return FSM.get("collideFriendly")(one, two);
}

/*
 * Enemies
 */
function jumpEnemy(me, enemy) {
    return FSM.get("jumpEnemy")(me, enemy);
}

// The visual representation of a piranha is visual_scenery; the collider is a character
function movePiranhaInit(me) {
  me.hidden = true;
  var scenery = me.visual_scenery = ObjectMaker.make("PiranhaScenery");
  FSM.addThing(scenery, me.left, me.top);
  TimeHandler.addSpriteCycle(scenery, ["one", "two"]);
  me.movement = movePiranhaNew;
  // Piranhas start out minimal
  movePiranhaNew(me, me.height * FullScreenMario.unitsize);
}
// Moving a piranha moves both it and its scenery
function movePiranhaNew(me, amount) {
  amount = amount || me.dir;
  me.counter += amount;
  FSM.shiftVert(me, amount);
  FSM.shiftVert(me.visual_scenery, amount);
  
  // Height is 0
  if(me.counter <= 0 || me.counter >= me.countermax) {
    me.movement = false;
    me.dir *= -1;
    TimeHandler.addEvent(movePiranhaRestart, 35, me);
  }
}
function movePiranhaRestart(me) {
  var marmid = FSM.getMidX(player);
  // If Player's too close and counter == 0, don't do anything
  if(me.counter >= me.countermax && marmid > me.left -FullScreenMario.unitsize * 8 && marmid < me.right + FullScreenMario.unitsize * 8) {
    setTimeout(movePiranhaRestart, 7, me);
    return;
  }
  // Otherwise start again
  me.movement = movePiranhaNew;
}

// Really just checks toly for piranhas.
function playerAboveEnemy(player, enemy) {
    return FSM.get("isCharacterAboveEnemy")(player, enemy);
}

// Assuming one should generally be Player/thing, two is enemy
function collideEnemy(one, two) {
    return FSM.get("collideEnemy")(one, two);
}  

function movePodobooInit(me) {
  if(!isCharacterAlive(me)) return;
  // For the sake of the editor, flip this & make it hidden on the first movement
  // flipVert(me);
  me.hidden = true;
  me.heightnorm = me.top;
  me.heightfall = me.top - me.jumpheight;
  TimeHandler.addEvent(podobooJump, me.betweentime, me);
  me.movement = false;
}
function podobooJump(me) {
  if(!isCharacterAlive(me)) return;
  FSM.unflipVert(me);
  me.yvel = me.speed + me.gravity;
  me.movement = movePodobooUp;
  me.hidden = false;
  
  // Sadly, this appears to be occasionally necessary
  PixelDrawer.setThingSprite(me);
}
function movePodobooUp(me) {
  FSM.shiftVert(me, me.speed, true);
  if(me.top - FSM.MapScreener.top > me.heightfall) return;
  me.nofall = false;
  me.movement = movePodobooSwitch;
}
function movePodobooSwitch(me) {
  if(me.yvel <= 0) return;
  FSM.flipVert(me);
  me.movement = movePodobooDown;
}
function movePodobooDown(me) {
  if(me.top < me.heightnorm) return;
  FSM.setTop(me, me.heightnorm, true);
  me.movement = false;
  me.nofall = me.hidden = true;
  me.heightfall = me.top - me.jumpheight;
  TimeHandler.addEvent(podobooJump, me.betweentime, me);
}

function moveHammerBro(me) {
  // Slide side to side
  me.xvel = Math.sin(Math.PI * (me.counter += .007)) / 2.1;
  
  // Make him turn to look at player if needed
  lookTowardPlayer(me);
  
  // If falling, don't collide with solids
  me.nocollidesolid = me.yvel < 0 || me.falling;
}
function throwHammer(me, count) {
  if(!isCharacterAlive(me) || me.nothrow || me.right < -unitsize * 32) return;
  if(count != 3) {
    FSM.switchClass(me, "thrown", "throwing");
  }
  TimeHandler.addEvent(function(me) {
    if(count != 3) {
      if(!isCharacterAlive(me)) return;
      // Throw the hammer...
      FSM.switchClass(me, "throwing", "thrown");
      FSM.addThing("Hammer", me.left -FullScreenMario.unitsize * 2, me.top -FullScreenMario.unitsize * 2);
    }
    // ...and go again
    if(count > 0) TimeHandler.addEvent(throwHammer, 7, me, --count);
    else {
      TimeHandler.addEvent(throwHammer, 70, me, 7);
      FSM.removeClass(me, "thrown");
    }
  }, 14, me);
}
function jumpHammerBro(me) {
  if(!FSM.isCharacterAlive(me)) return true; // finish
  if(!me.resting) return; // just skip
  // If it's ok, jump down
  if(map_settings.floor - (me.bottom / FullScreenMario.unitsize) >= jumplev1 - 2 && me.resting.name != "floor" && Math.floor(Math.random() * 2)) {
    me.yvel = FullScreenMario.unitsize * -.7;
    me.falling = true;
    TimeHandler.addEvent(function(me) { me.falling = false; }, 42, me);
  }
  // Otherwise, jump up
  else me.yvel = FullScreenMario.unitsize * -2.1;
  me.resting = false;
}

function moveCannonInit(me) {
  TimeHandler.addEventInterval(
    function(me) {
      if(player.right > me.left -FullScreenMario.unitsize * 8 && player.left < me.right + FullScreenMario.unitsize * 8)
        return; // don't fire if Player is too close
      var spawn = ObjectMaker.make("BulletBill");
      if(FSM.objectToLeft(player, me)) {
        FSM.addThing(spawn, me.left, me.top);
        spawn.direction = spawn.moveleft = true;
        spawn.xvel *= -1;
        FSM.flipHoriz(spawn);
      }
      else FSM.addThing(spawn, me.left + me.width, me.top);
      AudioPlayer.playLocal("Bump", me.right);
    }, 270, Infinity, me);
  me.movement = false;
}


/*
 * Player
 */
function placePlayer(xloc, yloc) {
  clearOldPlayer();
  window.player = FSM.player = ObjectMaker.make("Player", {
    gravity: map_settings.gravity,
    keys: new Keys(),
    power: StatsHolder.get("power")
  });
  FSM.InputWriter.setEventInformation(player);
  toggleLuigi(true);
  FSM.setPlayerSizeSmall(player);
  
  if(map_settings.underwater) {
    player.swimming = true;
    TimeHandler.addSpriteCycle(player, ["swim1", "swim2"], "swimming", 5);
  }

  var adder = FSM.addThing(player, xloc || FullScreenMario.unitsize * 16, yloc || (map_settings.floor - player.height) * FullScreenMario.unitsize);
  if(StatsHolder.get("power") >= 2) {
    FSM.playerGetsBig(player, true);
    if(StatsHolder.get("power") == 3)
      FSM.playerGetsFire(player, true);
  }
  return adder;
}
function clearOldPlayer() {
  if(!window.player) return;
  player.alive = false;
  player.dead = true;
  nokeys = notime = false;
}

function Keys() {
  // Run: 0 for no, 1 for right, -1 for left
  // Crouch: 0 for no, 1 for yes
  // Jump: 0 for no, jumplev = 1 through jumpmax for yes
  this.run = this.crouch = this.jump = this.jumplev = this.sprint = 0;
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

function playerStar(me, timeout) {
  if(me.star) return;
  ++me.star;
  AudioPlayer.play("Powerup");
  AudioPlayer.playTheme("Star", true);
  TimeHandler.addEvent(playerRemoveStar, timeout || 560, me);
  FSM.switchClass(me, "normal", "star");
  TimeHandler.addSpriteCycle(me, ["star1", "star2", "star3", "star4"], "star", 5);
}
function playerRemoveStar(me) {
  if(!me.star) return;
  --me.star;
  FSM.removeClasses(me, "star star1 star2 star3 star4");
  TimeHandler.clearClassCycle(me, "star");
  FSM.addClass(me, "normal");
  AudioPlayer.playTheme();
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
// See http://themushroomkingdom.net/smb_breakdown.shtml near bottom
// Stages: 8, 28, 40, 62
function scorePlayerFlag(diff) {
  var amount;
  // log(diff);
  // Cases of...
  if(diff < 28) {
    // 0 to 8
    if(diff < 8) { amount = 100; }
    // 8 to 28
    else { amount = 400; }
  }
  else {
    // 28 to 40
    if(diff < 40) { amount = 800; }
    // 40 to 62
    else if(diff < 62) { amount = 2000; }
    // 62 to infinity and beyond
    else { amount = 5000; }
  }
  // score(player, amount, true);
  FSM.scoreOn(amount, player);
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