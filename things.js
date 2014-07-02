/* Things.js */
// Stores Thing creators, functions, and manipulators

/* To-do list:
  * Integrate visual scenery (see Pirhana) as a typical thing
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
  
    window.ObjectMaker = FSM.ObjectMaker = new ObjectMakr({
        "on_make": "onMake",
        "store_type": "title",
        "index_map": ["width", "height"],
        "inheritance": {
          "Thing": {
              "character": {
                  "Player": {},
                  "enemy": {
                      "Goomba": {},
                      "Koopa": {},
                      "Beetle": {},
                      "Pirhana": {},
                      "HammerBro": {
                          "Bowser": {}
                      }
                  },
                  "item": {
                      "Mushroom": {
                          "Mushroom1Up": {},
                          "MushroomDeathly": {}
                      },
                      "FireFlower": {},
                      "Fireball": {
                          "CastleFireball": {}
                      },
                      "Star": {},
                      "Shell": {
                          "BeetleShell": {}
                      },
                      "Vine": {}
                  },
                  "BrickShard": {},
                  "Coin": {},
                  "Firework": {},
              },
              "solid": {
                  "Block": {},
                  "BridgeBase": {},
                  "Brick": {},
                  "DeadGoomba": {},
                  "Pipe": {},
                  "PipeHorizontal": {},
                  "PipeVertical": {},
                  "Platform": {},
                  "PlatformGenerator": {},
                  "Stone": {},
                  "Floor": {},
                  "TreeTop": {},
                  "ShroomTop": {},
                  "CastleAxe": {},
                  "CastleBlock": {},
                  "CastleBridge": {},
                  "Coral": {},
                  "detector": {
                      "DetectCollision": {},
                      "DetectSpawn": {}
                  },
              },
              "scenery": {
                  "Axe": {},
                  "Blank": {},
                  "BrickHalf": {},
                  "BrickPlain": {},
                  "Bush1": {},
                  "Bush2": {},
                  "Bush3": {},
                  "Castle": {},
                  "CastleDoor": {},
                  "CastleChain": {},
                  "CastleRailing": {},
                  "CastleRailingFilled": {},
                  "CastleTop": {},
                  "CastleWall": {},
                  "Cloud": {
                      "Cloud1": {},
                      "Cloud2": {},
                      "Cloud3": {},
                  },
                  "Fence": {},
                  "Flag": {},
                  "FlagPole": {},
                  "FlagTop": {},
                  "HillSmall": {},
                  "HillLarge": {},
                  "PirhanaScenery": {},
                  "PlantSmall": {},
                  "PlantLarge": {},
                  "Railing": {},
                  "ShroomTrunk": {},
                  "String": {},
                  "TreeTrunk": {},
                  "Water": {},
                  "WaterFill": {}
              },
              "text": {
                "Text100": {},
                "Text200": {},
                "Text400": {},
                "Text500": {},
                "Text800": {},
                "Text1000": {},
                "Text2000": {},
                "Text4000": {},
                "Text5000": {},
                "Text8000": {},
                "Text1Up": {}
              }
          }
      },
      "properties": {
        "Map": {
        
        },
        "Area": {
            
        },
        "Location": {
            
        },
        Thing: {
            // This will be delegated to FullScreenMario.js
            EightBitter: FSM,
            // Sizing
            width:  8,
            height: 8,
            tolx:   0,
            toly:   FullScreenMario.unitsize / 8,
            // Velocity
            xvel:  0,
            yvel:  0,
            speed: 0,
            // Score amounts on death
            scoreStomp: 100,
            scoreFire: 200,
            scoreStar: 200,
            scoreBelow: 100,
            // Placement
            alive:    true,
            placed:   false,
            grouping: "solid",
            // Quadrants
            maxquads:  4,
            outerok:   false,
            // Sprites
            sprite:      "",
            sprite_type: "neither",
            // Triggered functions
            animate:  FullScreenMario.prototype.animateEmerge,
            onMake:   FullScreenMario.prototype.thingProcess,
            death:    FullScreenMario.prototype.killNormal,
            collide:  false,
            movement: false
          },
          character: {
              grouping: "character",
              libtype: "characters",
              grouptype: "Character",
              character: true,
              moveleft: true,
              firedeath: true,
              movement: FullScreenMario.prototype.moveSimple
          },
          Player: {
              player: 1,
              power: 1,
              canjump: 1,
              nofiredeath: 1,
              nofire: 1,
              nokillend: 1,
              numballs: 0,
              moveleft: 0,
              skidding: 0,
              star: 0,
              dying: 0,
              nofall: 0,
              maxvel: 0,
              paddling: 0,
              jumpers: 0,
              landing: 0,
              tolx: FullScreenMario.unitsize * 2,
              toly: 0,
              walkspeed: FullScreenMario.unitsize / 2,
              maxspeed: FullScreenMario.unitsize * 1.35, // Really only used for timed animations
              maxspeedsave: FullScreenMario.unitsize * 1.35,
              scrollspeed: FullScreenMario.unitsize * 1.75,
              running: '', // Evaluates to false for cycle checker
              fire: FullScreenMario.prototype.animatePlayerFire,
              movement: FullScreenMario.prototype.movePlayer,
              death: killPlayer,
              type: "character",
              name: "player normal small still"
          },
          enemy: {
              type: "enemy",
              speed: FullScreenMario.unitsize * .21,
              collide: FullScreenMario.prototype.collideEnemy,
              death: FullScreenMario.prototype.killFlip
          },
          Goomba: {
              scoreFire: 100,
              scoreStar: 100,
              spawntype: "DeadGoomba",
              toly: FullScreenMario.unitsize,
              death: FullScreenMario.prototype.killGoomba,
              spriteCycleSynched: [
                  [FullScreenMario.prototype.unflipHoriz, FullScreenMario.prototype.flipHoriz]
              ]
          },
          Koopa: {
              height: 12,
              shellspawn: true,
              spawntype: "Shell",
              shelltype: "Shell",
              toly: FullScreenMario.unitsize * 2,
              death: FullScreenMario.prototype.killToShell,
              spriteCycle: [
                  ["one", "two"]
              ],
              attributes: {
                  "smart": {
                      movement: FullScreenMario.prototype.moveSmart
                  },
                  "jumping": {
                      movement: FullScreenMario.prototype.moveJumping,
                      jumpheight: FullScreenMario.unitsize * 1.17,
                      gravity: gravity / 2.8,
                      scoreStomp: 400
                  },
                  "floating": {
                      movement: FullScreenMario.prototype.moveFloating,
                      nofall: true,
                      yvel: FullScreenMario.unitsize / 4,
                      maxvel: FullScreenMario.unitsize / 4,
                      scoreStomp: 400
                  }
              }
          },
          Beetle: {
              speed: FullScreenMario.unitsize * .21,
              xvel: FullScreenMario.unitsize * .21,
              nofire: 2,
              shellspawn: true,
              death: FullScreenMario.prototype.killToShell,
              spawntype: "BeetleShell",
              shelltype: "BeetleShell",
              spriteCycle: [
                  ["one", "two"]
              ],
          },
          Pirhana: {
              height: 12,
              counter: 0,
              countermax: 12 * FullScreenMario.unitsize,
              dir: FullScreenMario.unitsize / 8,
              toly: FullScreenMario.unitsize * 8,
              nofall: true,
              deadly: true,
              nocollidesolid: true,
              death: killPirhana,
              movement: false,
              spriteCycleSynched: [
                  ["one", "two"]
              ]
              // movement: movePirhanaInit
          },
          Bowser: {
              width: 16,
              height: 16,
              speed: FullScreenMario.unitsize * .28,
              gravity: gravity / 2.8,
              spawntype: "Goomba",
              // killonend: freezeBowser,
              // death: killBowser,
              // onadding: addBowser,
              spriteCycle: [
                  ["one", "two"]
              ]
          },
          item: {
              group: "item",
              collide: FullScreenMario.prototype.collideFriendly,
              jump: FullScreenMario.prototype.itemJump,
              nofire: true
          },
          Mushroom: {
              action: FullScreenMario.prototype.playerShroom,
              speed: .42 * FullScreenMario.unitsize
          },
          Mushroom1Up: {
              action: function (thing, other) { 
                if(thing.player) {
                  thing.EightBitter.gainLife(1);
                }
              }
          },
          MushroomDeathly: {
              action: FullScreenMario.prototype.killPlayer
          },
          FireFlower: {
              action: FullScreenMario.prototype.playerShroom,
              spriteCycle: [
                  ["one", "two", "three", "four"]
              ]
          },
          Fireball: {
              width: 4,
              height: 4,
              nofire: true,
              nostar: true,
              collide_primary: true,
              animate: emergeFire,
              collide: FullScreenMario.prototype.collideFireball,
              death: FullScreenMario.prototype.animateFireballExplode,
              spriteCycleSynched: [
                  ["one", "two", "three", "four"], "spinning", 4
              ]
          },
          CastleFireball: {
              deadly: true,
              nocollidesolid: true,
              nocollidechar: true,
              nofall: true,
              collide: collideEnemy
          },
          Firework: {
              nocollide: true,
              nofall: true,
              animate: FullScreenMario.prototype.animateFirework
          },
          Star: {
              name: "star item", // Item class so player's star isn't confused with this
              width: 7,
              speed: FullScreenMario.unitsize * .56,
              action: playerStar,
              movement: FullScreenMario.prototype.moveJumping,
              jumpheight: FullScreenMario.unitsize * 1.17,
              gravity: gravity / 2.8,
              spriteCycle: [
                  ["one", "two", "three", "four"], 0, 7
              ]
          },
          Shell: {
              height: 7,
              speed: FullScreenMario.unitsize * 2,
              collide_primary: true,
              nofire: false,
              moveleft: 0,
              xvel: 0,
              move: 0,
              shell: true,
              hitcount: 0,
              peeking: 0,
              counting: 0,
              landing: 0,
              enemyhitcount: 0,
              movement: FullScreenMario.prototype.moveShell,
              collide: FullScreenMario.prototype.collideShell,
              death: FullScreenMario.prototype.killFlip,
              spawntype: "Koopa",
              attributes: {
                  smart: {}
              }
          },
          BeetleShell: {
            height: 8,
            nofire: 2,
            spawntype: "Beetle"
          },
          Vine: {
              width: 7,
              movement: false,
              nofall: true,
              repeat: true
          },
          BrickShard: {
              width: 4,
              height: 4,
              nocollide: true,
              movement: false,
              spriteCycle: [
                  [FullScreenMario.prototype.unflipHoriz, FullScreenMario.prototype.flipHoriz]
              ]
          },
          Coin: {
              width: 5,
              height: 7,
              nofall: true,
              nocollidechar: true,
              animate: FullScreenMario.prototype.animateEmergeCoin,
              collide: FullScreenMario.prototype.collideCoin,
              spriteCycleSynched: [
                  ["one", "two", "three", "two", "one"]
              ]
          },
          solid: {
              grouping: "solid",
              type: "solid",
              libtype: "solids",
              grouptype: "Solid",
              spritewidth: 8,
              spriteheight: 8,
              repeat: true,
              solid: true,
              nocollidesolid: true,
              firedeath: 0,
              nofire: 2,
              collide: FullScreenMario.prototype.collideCharacterSolid,
          },
          Brick: {
              breakable: true,
              bottomBump: FullScreenMario.prototype.collideBottomBrick
          },
          Block: {
              unused: true,
              contents: "Coin",
              bottomBump: FullScreenMario.prototype.collideBottomBlock,
              spriteCycleSynched: [
                  ["one", "two", "three", "two", "one"]
              ]
          },
          BridgeBase: {
              height: 4,
              spritewidth: 4,
          },
          DeadGoomba: {
              height: 4,
              nocollide: true,
              onThingMake: function(thing) {
                thing.EightBitter.TimeHandler.addEvent(FullScreenMario.prototype.killNormal, 21, thing);
              }
          },
          Pipe: {
              width: 16,
              spritewidth: 16,
              actionTop: intoPipeVertical
          },
          PipeHorizontal: {
              height: 16,
              spriteheight: 16,
              width: 19.5,
              spritewidth: 19.5,
              actionLeft: intoPipeHorizontal,
              attributes: {
                  width: 8,
                  spritewidth: 8
              }
          },
          PipeVertical: {
              width: 16,
              spritewidth: 16
          },
          Platform: {
              height: 4,
              spritewidth: 4,
              fall_threshold_start: FullScreenMario.unitsize * 2.8,
              fall_threshold_end: FullScreenMario.unitsize * 2,
              acceleration: FullScreenMario.unitsize / 16,
              repeat: true,
              killonend: true,
              // maxvel: FullScreenMario.unitsize / 4 * 1.5,
              attributes: {
                  "floating": {
                      // movement: moveFloating,
                      // yvel: FullScreenMario.unitsize / 4 * 1.5
                  },
                  "sliding": {
                      // movement: moveSliding,
                      // xvel: FullScreenMario.unitsize / 4 * 1.5
                  },
                  "transport": {
                      movement: false,
                      collide: collideTransport
                  },
                  "falling": {
                      collide: function () {
                          console.log("Nope! movement should be moveFalling");
                      }
                  }
              }
          },
          Floor: {
              nofire: true // for the "Super Fireballs" mod
          },
          CastleBlock: {
              direction: -1, // Kept here because attributes override user-given settings!
              attributes: {
                  "fireballs": {
                      onadding: makeCastleBlock,
                      balls: [],
                      dt: .07,
                      angle: .25,
                      interval: 7
                  }
              }
          },
          CastleBridge: {
              spritewidth: 4
          },
          detector: {
              hidden: true
          },
          DetectCollision: {
              collide: onDetectorCollision
          },
          DetectSpawn: {
              movement: onDetectorSpawn
          },
          scenery: {
              grouping: "scenery",
              libtype: "scenery",
              grouptype: "Scenery",
              repeat: true
          },
          Axe: {
              nocollide: true,
              spriteCycle: [
                  ["one", "two", "three", "two"]
              ]
          },
          // Blank: [0, 0],
          BrickHalf: [8, 4],
          BrickPlain: [8, 8],
          Bush1: [16, 8],
          Bush2: [24, 8],
          Bush3: [32, 8],
          Castle: [75, 88],
          CastleChain: [7.5, 7.5],
          CastleDoor: [8, 20],
          CastleRailing: [8, 4],
          CastleRailingFilled: [8, 4],
          CastleTop: [12, 12],
          CastleWall: [8, 48],
          Cloud1: [16, 12],
          Cloud2: [24, 12],
          Cloud3: [32, 12],
          Flag: [8, 8],
          FlagPole: [1, 72],
          FlagTop: [4, 4],
          Fence: [8, 8],
          HillSmall: [24, 9.5],
          HillLarge: [40, 17.5],
          PirhanaScenery: [8, 12],
          PlantSmall: [7, 15],
          PlantLarge: [8, 23],
          Railing: [4, 4],
          ShroomTrunk: [8, 8],
          String: [1, 1],
          TreeTrunk: [4, 4],
          Water: {
              0: 4,
              1: 5,
              spriteCycle: [
                  ["one", "two", "three", "four"]
              ]
          },
          WaterFill: [4, 5],
          "text": {
            "grouping": "Text",
            "libtype": "Text",
            "grouptype": "Text",
          },
          "Text100": [6, 4],
          "Text200": [6, 4],
          "Text400": [6, 4],
          "Text500": [6, 4],
          "Text800": [6, 4],
          "Text1000": [8, 4],
          "Text2000": [8, 4],
          "Text4000": [8, 4],
          "Text5000": [8, 4],
          "Text8000": [8, 4],
          "Text1Up": [8, 4],
      }
    });
}

// Takes in a newly produced Thing and sets it up for gameplay
function thingProcess(thing, type, settings, defaults) {
    return FSM.thingProcess(thing, type, settings, defaults);
}
// Processes optional attributes for Things
function thingProcessAttributes(thing, attributes) {
  var attribute, i;
  
  // For each listing in the attributes...
  for(attribute in attributes) {
    // If the thing has that attribute as true:
    if(thing[attribute]) {
      // Add the extra options
      proliferate(thing, attributes[attribute]);
      // Also add a marking to the name, which will go into the className
      if(thing.name) thing.name += ' ' + attribute;
      else thing.name = thing.title + ' ' + attribute;
    }
  }
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

// The visual representation of a pirhana is visual_scenery; the collider is a character
function movePirhanaInit(me) {
  me.hidden = true;
  var scenery = me.visual_scenery = ObjectMaker.make("PirhanaScenery");
  FSM.addThing(scenery, me.left, me.top);
  TimeHandler.addSpriteCycle(scenery, ["one", "two"]);
  me.movement = movePirhanaNew;
  // Pirhanas start out minimal
  movePirhanaNew(me, me.height * FullScreenMario.unitsize);
}
// Moving a pirhana moves both it and its scenery
function movePirhanaNew(me, amount) {
  amount = amount || me.dir;
  me.counter += amount;
  FSM.shiftVert(me, amount);
  FSM.shiftVert(me.visual_scenery, amount);
  
  // Height is 0
  if(me.counter <= 0 || me.counter >= me.countermax) {
    me.movement = false;
    me.dir *= -1;
    TimeHandler.addEvent(movePirhanaRestart, 35, me);
  }
}
function movePirhanaRestart(me) {
  var marmid = FSM.getMidX(player);
  // If Player's too close and counter == 0, don't do anything
  if(me.counter >= me.countermax && marmid > me.left -FullScreenMario.unitsize * 8 && marmid < me.right + FullScreenMario.unitsize * 8) {
    setTimeout(movePirhanaRestart, 7, me);
    return;
  }
  // Otherwise start again
  me.movement = movePirhanaNew;
}
function killPirhana(me) {
  if(!me && !(me = this)) return;
  FSM.killNormal(me);
  FSM.killNormal(me.visual_scenery);
}

// Really just checks toly for pirhanas.
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


// Normally goes up at increasing rate
// Every X seconds, squeezes to go down
//// Minimum Y seconds, continues if Player is below until bottom is 8 above floor
function moveBlooper(me) {
  switch(me.counter) {
    case 56: me.squeeze = true; ++me.counter; break;
    case 63: squeezeBlooper(me); break;
    default: ++me.counter; break;
  }

  if(me.top < FullScreenMario.unitsize * 16 + 10) {
    squeezeBlooper(me);
  }

  if(me.squeeze) me.yvel = max(me.yvel + .021, .7); // going down
  else me.yvel = min(me.yvel - .035, -.7); // going up
  FSM.shiftVert(me, me.yvel, true);
  
  if(!me.squeeze) {
    if(player.left > me.right + FullScreenMario.unitsize * 8) {
      // Go to the right
      me.xvel = min(me.speed, me.xvel + FullScreenMario.unitsize / 32);
    }
    else if(player.right < me.left - FullScreenMario.unitsize * 8) {
      // Go to the left
      me.xvel = max(me.speedinv, me.xvel - FullScreenMario.unitsize / 32);
    }
  }
}
function squeezeBlooper(me) {
  if(me.squeeze != 2) {
    FSM.addClass(me, "squeeze");
    me.squeeze = 2;
  }
  // if(!me.squeeze) me.yvel = 0;
  me.xvel /= 1.17;
  FSM.setHeight(me, 10, true, true);
  // (104 (map_settings.floor) - 12 (blooper.height) - 2) * FullScreenMario.unitsize
  if(me.top > player.bottom || me.bottom > 360) {
    unsqueezeBlooper(me);
  }
}
function unsqueezeBlooper(me) {
  me.squeeze = false;
  FSM.removeClass(me, "squeeze");
  me.counter = 0;
  FSM.setHeight(me, 12, true, true);
  // me.yvel /= 3;
}

function setCheepVelocities(me) {
  if(me.red) {
    me.xvel = -unitsize / 4;
    me.yvel = FullScreenMario.unitsize / -24;
  } else {
    me.xvel = FullScreenMario.unitsize / -6;
    me.yvel = -unitsize / 32;
  }
}
function moveCheepInit(me) {
  setCheepVelocities(me);
  if(me.top < player.top) me.yvel *= -1;
  moveCheep(me);
  me.movement = moveCheep;
}
function moveCheep(me) {
  FSM.shiftVert(me, me.yvel);
}
function moveCheepJumping(me) {
  FSM.shiftVert(me, me.yvel += FullScreenMario.unitsize / 14);
}
function startCheepSpawn() {
  return map_settings.zone_cheeps = TimeHandler.addEventInterval(
    function() {
      if(!map_settings.zone_cheeps) return true;
      var spawn = ObjectMaker.make("CheepCheep", { smart: true, flying: true});
      FSM.addThing(spawn, 
        Math.random() * player.left * player.maxspeed / FullScreenMario.unitsize / 2,
        FSM.MapScreener.height * FullScreenMario.unitsize);
      spawn.xvel = Math.random() * player.maxspeed;
      spawn.yvel = FullScreenMario.unitsize * -2.33;
      FSM.flipHoriz(spawn);
      spawn.movement = function(me) {
        if(me.top < ceilmax) me.movement = moveCheepJumping; 
        else FSM.shiftVert(me, me.yvel);
      };
    }, 21, Infinity
  );
}

// The lakitu's position starts to the right of player ...
function moveLakituInit(me) {
  if(map_settings.has_lakitu && me.norepeat) return FSM.killNormal(me);
  TimeHandler.addEventInterval(function(me) {
    if(me.alive) throwSpiny(me);
    else return true;
  }, 140, Infinity, me);
  me.movement = moveLakituInit2;
  moveLakituInit2(me);
  map_settings.has_lakitu = me;
}
function moveLakituInit2(me) {
  if(me.right < player.left) {
    moveLakitu(me);
    me.movement = moveLakitu;
    map.lakitu = me;
    return true;
  }
  FSM.shiftHoriz(me, -unitsize);
}
// Then, once it's close enough, is always relative to player.
// This fluctuates between +/-32 (* FullScreenMario.unitsize)
function moveLakitu(me) {
  // If player is moving quickly to the right, move in front of him and stay there
  if(player.xvel > FullScreenMario.unitsize / 8 && player.left > FSM.MapScreener.width * FullScreenMario.unitsize / 2) {
    if(me.left < player.right + FullScreenMario.unitsize * 16) {
      // To the 'left' of player
      FSM.slideToXLoc(me, player.right + FullScreenMario.unitsize * 32 + player.xvel, player.maxspeed * 1.4);
      me.counter = 0;
    }
  }
  // Otherwise, creepily orbit around him
  else {
    // me.xvel = 0;
    me.counter += .007;
    FSM.slideToXLoc(me, player.left + player.xvel + Math.sin(Math.PI * me.counter) * 117, player.maxspeed * .7);
  }
  // log("moveLakitu after: " + (me.right - me.left) + "\n");
}
function throwSpiny(me) {
  if(!isCharacterAlive(me)) return false;
  FSM.switchClass(me, "out", "hiding");
  TimeHandler.addEvent(function(me) {
    if(me.dead) return false;
    var spawn = ObjectMaker.make("SpinyEgg");
    FSM.addThing(spawn, me.left, me.top);
    spawn.yvel = FullScreenMario.unitsize * -2.1;
    FSM.switchClass(me, "hiding", "out");
  }, 21, me);
}
function killLakitu(me) {
  delete me.noscroll;
  FSM.killFlip(me);
}

function moveSpinyEgg(me) {
  if(me.resting) createSpiny(me);
}
function createSpiny(me) {
  var spawn = ObjectMaker.make("Spiny");
  FSM.addThing(spawn, me.left, me.top);
  spawn.moveleft = objectToLeft(player, spawn);
  FSM.killNormal(me);
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

// animatePlayerPaddling because movePlayer calls playerPaddles
function playerPaddles(me) {
    return FSM.get("animatePlayerPaddling")(me);
}

function playerBubbles() {
    return FSM.get("animatePlayerBubbling")(me);
}

function movePlayerVine(me) {
  var attached = me.attached;
  if(me.bottom < attached.top) return unattachPlayer(me);
  if(me.keys.run == me.attachoff) {
    while(FSM.isThingTouchingThing(me, attached)) {
      FSM.shiftHoriz(me, me.keys.run, true);
    }
    return unattachPlayer(me);
  }
  
  // If Player is moving up, simply move up
  if(me.keys.up) {
    me.animatednow = true;
    FSM.shiftVert(me,FullScreenMario.unitsize / 4 * -1, true);
  }
  // If player is moving down, move down and check for unattachment
  else if(me.keys.crouch) {
    me.animatednow = true;
    FSM.shiftVert(me,FullScreenMario.unitsize / 2, true);
    if(me.bottom > attached.bottom -FullScreenMario.unitsize * 4) return unattachPlayer(me);
  }
  else me.animatednow = false;
  
  if(me.animatednow && !me.animated) {
    FSM.addClass(me, "animated");
  } else if(!me.animatednow && me.animated) {
    FSM.removeClass(me, "animated");
  }
  
  me.animated = me.animatednow;
  
  if(me.bottom < -16) { // ceilmax (104) - ceillev (88)
    locMovePreparations(me);
    if(!attached.locnum && map_settings.random) goToTransport(["Random", "Sky", "Vine"]);
    else shiftToLocation(attached.locnum);
  }
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

function animatePlayerShroom() {
    return FSM.get("animatePlayerFire")(player);
}
function emergeFire(me) {
  AudioPlayer.play("Fireball");
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

// Big means it must happen: 2 means no animation
function killPlayer(me, big) {
  if(!me.alive || me.flickering || me.dying) return;
  // If this is an auto kill, it's for rizzles
  if(big == 2) {
    notime = true;
    me.dead = me.dying = true;
  }
  // Otherwise it's just a regular (enemy, time, etc.) kill
  else {
    // If Player can survive this, just power down
    if(!big && me.power > 1) {
      AudioPlayer.play("Power Down");
      me.power = 1;
      return FSM.playerGetsSmall(me);
    }
    // Otherwise, if this isn't a big one, animate a death
    else if(big != 2) {
      // Make this look dead
      TimeHandler.clearAllCycles(me);
      FSM.setSize(me, 7.5, 7, true);
      FSM.updateSize(me);
      FSM.setClass(me, "character player dead");
      // Pause some things
      nokeys = notime = me.dying = true;
      FSM.thingStoreVelocity(me);
      // Make this the top of characters
      containerForefront(me, characters);
      // After a tiny bit, animate
      TimeHandler.addEvent(function(me) {
        FSM.thingRetrieveVelocity(me, true);
        me.nocollide = true;
        me.movement = me.resting = false;
        me.gravity = gravity / 2.1;
        me.yvel = FullScreenMario.unitsize * -1.4;
      }, 7, me);
    }
  }

  // Clear and reset
  AudioPlayer.pause();
  if(!window.editing) AudioPlayer.play("Player Dies");
  me.nocollide = me.nomove = nokeys = 1;
  StatsHolder.decrease("lives");
  
  // If the map is normal, or failing that a game over is reached, timeout a reset
  if(!map_settings.random || StatsHolder.get("lives") <= 0) {
    TimeHandler.addEvent(StatsHolder.get("lives") ? setMap : gameOver, 280);
  }
  // Otherwise it's random; spawn him again
  else {
      nokeys = notime = false;
      TimeHandler.addEvent(function() {
        playerDropsIn();
        AudioPlayer.playTheme();
      // }, 7 * (map.respawndist || 17));
      }, 117);
  }
}
// Used by random maps to respawn
function playerDropsIn() {
  // Clear and place Player
  clearOldPlayer();
  placePlayer(unitsize * 16,FullScreenMario.unitsize * 8 * -1 + (map.underwater * FullScreenMario.unitsize * 24));
  FSM.animateFlicker(player);
  
  // Give a Resting Stone for him to land, unless it's underwater...
  if(!map.underwater) {
    player.nocollide = true;
    
    TimeHandler.addEvent(function() {
      player.nocollide = false;
      FSM.addThing("RestingStone", player.left, player.bottom + player.yvel);
    }, map.respawndist || 17);
  }
  // ...in which case just fix his gravity
  else player.gravity = gravity / 2.8;
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

function blockBump(me, character) {
    return FSM.get("collideBottomBlock")(me, character);
}
// out is a coin by default, but can also be other things - [1] and [2] are arguments
function blockContentsEmerge(me, character) {
    return FSM.get("animateSolidContents")(me, character);
}

function vineEmerge(me, solid) {
  AudioPlayer.play("Vine Emerging");
  FSM.setHeight(me, 0);
  me.movement = vineMovement;
  TimeHandler.addEvent(vineEnable, 14, me);
  TimeHandler.addEventInterval(vineStay, 1, 14, me, solid);
}
function vineStay(me, solid) {
  FSM.setBottom(me, solid.top);
}
function vineEnable(me) {
  me.nocollide = false;
  me.collide = touchVine;
}

function vineMovement(me) {
  FSM.increaseHeightTop(me, FullScreenMario.unitsize / 4);
  if(me.attached) {
    FSM.shiftVert(me.attached, -unitsize / 4, true);
  }
}

function touchVine(me, vine) {
  if(!me.player || me.attached || me.climbing || me.bottom > vine.bottom + FullScreenMario.unitsize * 2) return;
  vine.attached = me;
  
  me.attached = vine;
  me.nofall = true;
  me.xvel = me.yvel = me.resting = me.jumping = me.jumpcount = me.running = 0;
  me.attachleft = !objectToLeft(me, vine);
  me.attachoff = me.attachleft * 2 - 1;
  me.movementsave = me.movement;
  me.movement = movePlayerVine;
  
  me.keys = new Keys();
  FSM.InputWriter.setEventInformation(me);
  
  // Reset classes to be in vine mode
  TimeHandler.clearClassCycle(me, "running");
  FSM.removeClass(me, "running skidding");
  unflipHoriz(me);
  if(me.attachleft) flipHoriz(me);
  FSM.addClass(me, "climbing");
  // setSize(me, 7, 8, true);
  me.climbing = TimeHandler.addSpriteCycle(me, ["one", "two"], "climbing");
  
  // Make sure you're looking at the vine, and from the right distance
  lookTowardThing(me, vine);
  if(!me.attachleft) {
    FSM.setRight(me, vine.left + FullScreenMario.unitsize * 4);
  } else {
    FSM.setLeft(me, vine.right -FullScreenMario.unitsize * 4);
  }
  
}

function makeCastleBlock(me, settings) {
  // The block will need to manage the balls later
  var length = me.fireballs,
      balls = me.balls = new Array(length),
      midx = FSM.getMidX(me) -FullScreenMario.unitsize * 2, // Fireballs are 4x4, so (unitsize * 4) / 2
      midy = FSM.getMidY(me) -FullScreenMario.unitsize * 2;
  
  // These start at the center and will have their positions set by castleBlockEvent
  for(i = 0; i < length; ++i)
    balls[i] = FSM.addThing("CastleFireball", midx, midy);
  
  // Start rotating the Fireballs on an interval
  TimeHandler.addEventInterval(castleBlockEvent, me.interval, Infinity, me);
}
function castleBlockEvent(me) {
  // Stop if the block is dead (moved out of the game)
  if(!isCharacterAlive(me)) return true;
  
  var left = me.left,
      top = me.top,
      angle = me.angle += me.dt * me.direction, // typically += .07 * -1
      balls = me.balls,
      len, i;
  // Each ball is an increasing distance from center, at the same angle
  // (the first is skipped because it stays at the center);
  for(i = 1, len = balls.length; i < len; ++i) {
    FSM.setMidX(balls[i], left + (i * FullScreenMario.unitsize * 4 * Math.cos(angle * Math.PI)));
    FSM.setMidY(balls[i], top + (i * FullScreenMario.unitsize * 4 * Math.sin(angle * Math.PI)));
  }
  // me.midx = me.left;// + me.width * FullScreenMario.unitsize / 2;
  // me.midy = me.top;// + me.height * FullScreenMario.unitsize / 2;
  // me.counter = 0;
  // me.angle += me.dt
  // // Skip i=0 because it doesn't move
  // for(var i = 1; i < me.balls.length; ++i) {
    // setMidX(me.balls[i], me.midx + (i) * FullScreenMario.unitsize * 4 * Math.cos(me.angle * Math.PI), true);
    // setMidY(me.balls[i], me.midy + (i) * FullScreenMario.unitsize * 4 * Math.sin(me.angle * Math.PI), true);
  // }
}
// Set to solids because they spawn with their CastleBlocks
function CastleFireBall(me, distance) {
  me.width = me.height = 4;
  me.deadly = me.nofire = me.nocollidechar = me.nocollidesolid = me.nofall = me.nostar = me.outerok = true;
  me.movement = false;
  me.collide = collideEnemy;
  setCharacter(me, "fireball castle");
  TimeHandler.addSpriteCycle(me, ["one", "two", "three", "four"], 4);
}

// Step 1 of getting to that jerkface Toad
function CastleAxeFalls(me, collider) {
  var axe = collider.axe;
  // Don't do this if Player would fall without the bridge
  if(!me.player || 
    me.right < axe.left + FullScreenMario.unitsize ||
    me.bottom > axe.bottom -FullScreenMario.unitsize) return;
  // Immediately kill the axe and collider
  FSM.killNormal(axe);
  FSM.killNormal(collider);
  // Pause Player & wipe the other characters
  notime = nokeys = true;
  FSM.thingStoreVelocity(me);
  killOtherCharacters();
  TimeHandler.addEvent(FSM.killNormal, 7, axe.chain);
  TimeHandler.addEvent(CastleAxeKillsBridge, 14, axe.bridge, axe);
  AudioPlayer.pauseTheme();
  AudioPlayer.playTheme("World Clear", false, false);
}
// Step 2 of getting to that jerkface Toad
function CastleAxeKillsBridge(bridge, axe) {
  // Decrease the size of the bridge
  bridge.width -= 2;
  bridge.right -= FullScreenMario.unitsize * 2;
  // If it's still here, go again
  if(bridge.width > 0) TimeHandler.addEvent(CastleAxeKillsBridge, 1, bridge, axe);
  // Otherwise call the next step
  else {
    bridge.width = 0;
    TimeHandler.addEvent(CastleAxeKillsBowser, 1, axe.bowser);
  }
  FSM.setWidth(bridge, bridge.width);
}
// Step 3 of getting to that jerkface Toad
function CastleAxeKillsBowser(bowser) {
  bowser.nofall = false;
  bowser.nothrow = true;
  // this is a total hack to avoid being hit by hammers after Bowser dies in 6-4, 7-4, 8-4
  ++player.star;
  TimeHandler.addEvent(CastleAxeContinues, 35, player);
}
// Step 4 of getting to that jerkface Toad
function CastleAxeContinues(player) {
  map.canscroll = true;
  startWalking(player);
}
// CollideCastleNPC is actually called by the FuncCollider
function collideCastleNPC(me, collider) {
  FSM.killNormal(collider);
  me.keys.run = 0;
  TimeHandler.addEvent(function(text) {
    var i;
    for(i = 0; i < text.length; ++i)
      TimeHandler.addEvent(proliferate, i * 70, text[i].element, {style: {visibility: "visible"}});
    TimeHandler.addEvent(endLevel, (i + 3) * 70);
  }, 21, collider.text);
}

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

function setWarpWorldInit(me) {
  // Just reduces the size 
  FSM.shiftHoriz(me, me.width * FullScreenMario.unitsize / 2);
  me.width /= 2;
  FSM.updateSize(me); 
  me.movement = false;
}

function enableWarpWorldText(me, warp) {
  var pirhanas = warp.pirhanas,
      texts = warp.texts, i;
  for(i in pirhanas) {
    pirhanas[i].death();
  }
  for(i in texts)
    texts[i].element.style.visibility = "";
  FSM.killNormal(warp);
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
function collideLocationShifter(me, shifter) {
  if(!me.player) return;
  shifter.nocollide = true;
  TimeHandler.addEvent( 
    function(me) {
      shiftToLocation(shifter.loc);
      if(map.random) entryRandom(me);
    }, 1, me );
}
// Functions used for ObjectMakr-style detectors
function onDetectorCollision(character, me) {
  if(!character.player) {
    if(me.activate_fail) me.activate_fail(character);
    return;
  }
  me.activate(character, me);
  FSM.killNormal(me);
}
function onDetectorSpawn(me) {
  me.activate(me);
  FSM.killNormal(me);
}