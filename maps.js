/* Maps.js */
// Contains functions for creating, populating, and using maps

/* Map Transitions */

function setMap(name) {
  if(!name) {
    name = FSM.MapsHandler.getMapName();
  }
  
  // For now...
  FSM.MapsHandler.setMap(name);
  
  // From shiftToLocation
  FSM.TimeHandler.clearAllEvents();
  FSM.TimeHandler.addEventInterval(function () {
    if(!notime) {
      FSM.StatsHolder.decrease("time", 1);
    }
  }, 25, Infinity);
  
  resetGameState();
  
  // 1 game second is about 25 * 16.667 = 416.675ms
  FSM.StatsHolder.set("time", FSM.MapsHandler.getArea().time);
  FSM.StatsHolder.set("world", name);
  
  FSM.InputWriter.restartHistory();
  
  FSM.MapsHandler.spawnMap(FSM.MapScreener.width / FSM.unitsize);
  FSM.MapsHandler.getArea().entry(FSM);
  
  FSM.ModAttacher.fireEvent("onLocationSet");
}

/* Misc. Helpers */

function endLevel() {
    var currentmap = FSM.MapsHandler.getMapName();
    if(currentmap[1]++ == 4) {
        ++currentmap[0];
        currentmap[1] = 1;
    }
    setMap(currentmap);
}


/* Macro functions for analyzePreThing
*/

function makeEndCastleOutside(reference) {
  var x = reference.x || 0,
      y = reference.y || 0,
      output;
  
  // Output starts off with the general flag & collision detection
  output = [
    // Initial collision detector
    { thing: "DetectCollision", x: x + 8, y: y + 108, height: 108, activate: FlagCollisionTop, activate_fail: FSM.killNormal },
    // Flag (scenery)
    { thing: "Flag", x: x + .5, y: y + 79.5, "id": "endflag" },
    { thing: "FlagTop", x: x + 6.5, y: y + 84 },
    { thing: "FlagPole", x: x + 8, y: y + 80 },
    // Bottom stone
    { thing: "Stone", x: x + 4, y: y + 8 },
  ];
  
  // If this is a big castle (*-3), a large ending castle is used
  // if(reference.big) {
  //    
  // }
  // else
    output.push({ thing: "DetectCollision", x: x + 60, y: y + 16, height: 16, activate: endLevelPoints });
  
  return output;
}

function makeEndCastleInside(reference) {
  var x = reference.x || 0,
      y = reference.y || 0;
  
  return [
    { "thing": "Stone", "x": x, "y": y + 88, "width": 256 },
    { "macro": "Water", "x": x, "y": y, "width": 104 },
    // Bridge & Bowser area
    { "thing": "CastleBridge", "x": x, "y": y + 24, "width": 104 },
    { "thing": "Bowser", "x": x + 69, "y": y + 42, "hard": reference.hard },
    { "thing": "CastleChain", "x": x + 96, "y": y + 32 },
    // Axe area
    { "thing": "Axe", "x": x + 104, "y": y + 40 },
    { "macro": "Floor", "x": x + 104, "y": y, "width": 152 },
    { "thing": "Stone", "x": x + 104, "y": y + 32, "width": 24, "height": 32 },
    { "thing": "Stone", "x": x + 112, "y": y + 80, "width": 16, "height": 24 },
    // Peach's Magical Happy Chamber of Fantastic Love
    { "thing": "ScrollBlocker", "x": 112 }
  ];
}

function makePlatformGenerator(reference) {
  return {
    thing: "PlatformGenerator",
    x: reference.x || 0,
    y: reference.y || 120, // ceilmax (104) + 16
    width: reference.width || 4,
    dir: reference.dir || 1
  }
}

function makeTree(reference) {
  // Although the tree trunks in later trees overlap earlier ones, it's ok because
  // the pattern is indistinguishible when placed correctly.
  var x = reference.x || 0,
      y = reference.y || 0,
      dtb = DtB(y),
      width = reference.width || 24;
  return [
    { "thing": "TreeTop", "x": x, "y": y, "width": width },
    { "thing": "TreeTrunk", "x": x + 8, "y": y - 8, "width": width - 16, "height": dtb - 8 }
  ];
}

function makeShroom(reference) {
  var x = reference.x || 0,
      y = reference.y || 0,
      dtb = DtB(y),
      width = reference.width || 24;
  return [
    { "thing": "ShroomTop", "x": x, "y": y, "width": width },
    { "thing": "ShroomTrunk", "x": x + (width - 8) / 2, "y": y - 8, "height": dtb - 8 }
  ];
}

function makeWater(reference) {
  var x = reference.x || 0,
      y = (reference.y || 0) + 2, // water is 3.5 x 5.5
      output = proliferate({
        "thing": "Water",
        "x": x,
        "y": y,
        height: DtB(y)
      }, reference, true);
  delete output.macro;
  return output;
}

function makeBridge(reference) {
  var x = reference.x || 0,
      y = reference.y || 0,
      width = max(reference.width || 0, 16),
      output = [];
  
  // A beginning column reduces the width and pushes it forward
  if(reference.begin) {
    width -= 8;
    output.push({ "thing": "Stone", "x": x, "y": y, "height": DtB(y) });
    x += 8;
  }
  
  // An ending column just reduces the width 
  if(reference.end) {
    width -= 8;
    output.push({ "thing": "Stone", "x": x + width, "y": y, "height": DtB(y) });
  }
  
  // Between any columns is a BridgeBase with a Railing on top
  output.push({ "thing": "BridgeBase", "x": x, "y": y, "width": width });
  output.push({ "thing": "Railing", "x": x, "y": y + 4, "width": width });
  
  return output;
}

function makeStartCastleInside(reference) {
  var x = reference.x || 0,
      y = reference.y || 0,
      width = (reference.width || 0) - 40,
      output = [
        { "thing": "Stone", "x": x, "y": y + 48, "width": 24, "height": DtB(48) },
        { "thing": "Stone", "x": x + 24, "y": y + 40, "width": 8, "height": DtB(40) },
        { "thing": "Stone", "x": x + 32, "y": y + 32, "width": 8, "height": DtB(32) }
      ];
  if(width > 0)
    output.push({ "macro": "Floor", "x": x + 40, "y": y + 24, "width": width });
  return output;
}