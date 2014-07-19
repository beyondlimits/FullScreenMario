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

/*
 * Player
 */

function unattachPlayer(me) {
  me.movement = FullScreenMario.prototype.movePlayer;
  FSM.removeClasses(me, "climbing", "animated");
  FSM.TimeHandler.clearClassCycle(me, "climbing");
  me.yvel = me.attachoff = me.nofall = me.climbing = me.attached = me.attached.attached = false;
  me.xvel = me.keys.run;
}

function gameOver() {
  pause();
  FSM.AudioPlayer.pauseTheme();
  FSM.AudioPlayer.play("Game Over");
  
  var innerHTML = "<div style='font-size:49px;padding-top: " + (innerHeight / 2 - 28/*49*/) + "px'>GAME OVER</div>";
  // innerHTML += "<p style='font-size:14px;opacity:.49;width:490px;margin:auto;margin-top:49px;'>";
  // innerHTML += "You have run out of lives. Maybe you're not ready for playing real games...";
  innerHTML += "</p>";
  
  document.body.className = "Night"; // to make it black
  document.body.innerHTML = innerHTML;
  
  setTimeout(gameRestart, 7000);
}

function gameRestart() {
  document.body.style.visibility = "hidden";
  document.body.innerHTML = document.body.style.paddingTop = document.body.style.fontSize = "";
  document.body.appendChild(canvas);
  FSM.gameStart();
}




/* Solids
 */

function endLevelFireworks(me, numfire, detector) {
  var nextnum, nextfunc,
      i = 0;
  if(numfire) {
    // var castlemid = detector.castle.left + detector.castle.width * FullScreenMario.unitsize / 2;
    var castlemid = detector.left + 32 * FullScreenMario.unitsize / 2;
    while(i < numfire)
      explodeFirework(++i, castlemid); // Pre-increment since explodeFirework expects numbers starting at 1
    nextnum = 16.667 * (i + 2) * 42;
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
    // var fire = FSM.ObjectMaker.make("Firework");
    // addThing(fire, castlemid + fire.locs[0] -FullScreenMario.unitsize * 6,FullScreenMario.unitsize * 16 + fire.locs[1]);
    // fire.animate();
  }, 16.667 * num * 42);
}
function Firework(me, num) {
  me.width = me.height = 8;
  me.nocollide = me.nofire = me.nofall = true;
  // Number is >0 if this is ending of level
  if(num)
    switch(num) {
      // These probably aren't the exact same as original... :(
      case 1: me.locs = [unitsize * 16, FullScreenMario.unitsize * 16]; break;
      case 2: me.locs = [-unitsize * 16, FullScreenMario.unitsize * 16]; break;
      case 3: me.locs = [unitsize * 16 * 2, FullScreenMario.unitsize * 16 * 2]; break;
      case 4: me.locs = [unitsize * 16 * -2, FullScreenMario.unitsize * 16 * 2]; break;
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