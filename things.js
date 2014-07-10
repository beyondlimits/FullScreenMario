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
  return window.player = FSM.get("addPlayer")(xloc, yloc);
}

function unattachPlayer(me) {
  me.movement = FullScreenMario.prototype.movePlayer;
  FSM.removeClasses(me, "climbing", "animated");
  FSM.TimeHandler.clearClassCycle(me, "climbing");
  me.yvel = me.attachoff = me.nofall = me.climbing = me.attached = me.attached.attached = false;
  me.xvel = me.keys.run;
}

function gameOver() {
  gameon = false;
  pause();
  FSM.AudioPlayer.pauseTheme();
  FSM.AudioPlayer.play("Game Over");
  
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
  FSM.TimeHandler.addEvent(function() { body.style.visibility = ""; });
  FSM.StatsHolder.set("lives", 3);
}




/* Solids
 */

function detachPlayer(me) {
  if(player.resting != me) return;
  player.resting = false;
}

function FlagCollisionTop(me, detector) {
  FSM.AudioPlayer.pause();
  FSM.AudioPlayer.play("Flagpole");
  
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
  FSM.TimeHandler.addSpriteCycle(me, ["one", "two"], "climbing");
  
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
      FSM.TimeHandler.clearClassCycle(me, "climbing");
      
      // Wait a little bit to FlagOff, which will start the player walking
      thing.EightBitter.TimeHandler.addEvent(FlagOff, 21, me);
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
  FSM.TimeHandler.addEvent(function() {
    FSM.AudioPlayer.play("Stage Clear");
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
  var numfire = parseInt(getLast(String(FSM.StatsHolder.get("time"))));
  if(!(numfire == 1 || numfire == 3 || numfire == 6)) numfire = 0;
  // Count down the points (x50)
  var points = setInterval(function() {
    // 50 points for each unit of time
    FSM.StatsHolder.decrease("time");
    FSM.StatsHolder.increase("score", 50);
    // Each point(x50) plays the coin noise
    FSM.AudioPlayer.play("Coin");
    // Once it's done, move on to the fireworks.
    if(FSM.StatsHolder.get("time") <= 0)  {
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
  FSM.AudioPlayer.addEventImmediate("Stage Clear", "ended", function() { 
    FSM.TimeHandler.addEvent(nextfunc, 35);
  });
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