/* mario.js */
// Starts everything.

function startFSM() {
    var time_start = Date.now();
  
    window.FSM = new FullScreenMario();
  
  // Thanks, Obama...
  ensureLocalStorage();
  
  // I keep this cute little mini-library for some handy functions
  TonedJS(true);
  
  // It's useful to keep references to the body
  window.body = document.body;
  window.bodystyle = body.style;
  
  // Know when to shut up
  window.verbosity = { Maps: false, Sounds: false };
  
  window.requestAnimationFrame = window.requestAnimationFrame
                           || window.mozRequestAnimationFrame
                           || window.webkitRequestAnimationFrame
                           || window.msRequestAnimationFrame
                           || function(func) { setTimeout(func, timer); };
  window.cancelAnimationFrame = window.cancelAnimationFrame
                           || window.webkitCancelRequestAnimationFrame
                           || window.mozCancelRequestAnimationFrame
                           || window.oCancelRequestAnimationFrame
                           || window.msCancelRequestAnimationFrame
                           || clearTimeout;

  window.Uint8ClampedArray = window.Uint8ClampedArray
                           || window.Uint8Array
                           || Array;

  // Resetting everything may take a while
  resetMeasurements();
  resetEvents();
  resetCanvas();
  resetThings();
  resetScenery();
  resetMapsManager();
  resetStatsHolder();
  resetTriggers();
  resetSounds();
  resetUpkeep();
  
  // These should be placed somewhere else eventually
  window.characters = FSM.GroupHolder.getCharacterGroup();
  window.solids = FSM.GroupHolder.getSolidGroup();
  window.scenery = FSM.GroupHolder.getSceneryGroup();
  window.text = FSM.GroupHolder.getTextGroup();

  // With that all set, set the map to World11.
  StatsHolder.set("lives", 3);
  setMap([1,1]);
  GamesRunner.upkeep();
  
  log("It took " + (Date.now() - time_start) + " milliseconds to start.");
}

// To do: add in a real polyfill
function ensureLocalStorage() {
  var ls_ok = false;
  try {
  if(!window.hasOwnProperty("localStorage"))
    window.localStorage = { crappy: true };
  
  // Some browsers (mainly IE) won't allow it on a local machine anyway
  if(window.localStorage) ls_ok = true;
 }
 catch(err) {
    ls_ok = false;
  }
  if(!ls_ok) {
    var nope = document.body.innerText = 
            "It seems your browser does not allow localStorage!";
    throw nope;
  }
}

/* Basic reset operations */
function resetMeasurements() {
  resetUnitsize(4);
  resetTimer(1000 / 60);
  
  window.jumplev1 = 32;
  window.jumplev2 = 64;
  window.ceillev  = 88; // The floor is 88 spaces (11 blocks) below the yloc = 0 level
  window.ceilmax  = 104; // The floor is 104 spaces (13 blocks) below the top of the screen (yloc = -16)
  window.castlev  = -48;
  
  if(!window.parentwindow) {
    window.parentwindow = false;
  }
}

// Unitsize is kept as a measure of how much to expand (typically 4)
function resetUnitsize(num) {
  window.unitsize = num;
  for(var i = 2; i <= 64; ++i) {
    window["unitsizet" + i] = unitsize * i;
    window["unitsized" + i] = unitsize / i;
  }
  window.scale = unitsized2; // Typically 2
  window.gravity = round(12 * unitsize) / 100; // Typically .48
}

function resetTimer(num) {
  num = roundDigit(num, .001);
  window.timer = window.timernorm = num;
  window.timert2 = num * 2;
  window.timerd2 = num / 2;
}

// Events are done with TimeHandlr.js
// This helps make timing obey pauses, and makes class cycles much easier
function resetEvents() {
    window.TimeHandler = FSM.TimeHandler;
}

// Sounds are done with AudioPlayr.js
function resetSounds() {
    window.AudioPlayer = FSM.AudioPlayer;
}

// Quadrants are done with QuadsKeepr.js
// This starts off with 7 cols and 6 rows (each has 1 on each side for padding)
function resetQuadrants() {
    window.QuadsKeeper = FSM.QuadsKeeper;
}

// Variables regarding the state of the game
// This is called in setMap to reset everything
function resetGameState(nocount) {
  // HTML is reset here
  clearAllTimeouts();
  window.nokeys = window.spawning = window.spawnon =
    window.notime = window.qcount = window.lastscroll = 0;
  window.gameon = window.speed = 1;
  // Shifting location shouldn't wipe the gamecount (for key histories)
  if(!nocount) window.gamecount = 0;
  // And quadrants
  resetQuadrants();
  // Keep a history of pressed keys
  window.gamehistory = [];
  // Clear audio
  AudioPlayer.pause();
}

function scrollWindow(x, y) {
  FSM.scrollWindow(x, y);
}

// Similar to scrollWindow, but saves the player's x-loc
function scrollPlayer(x, y, see) {
  var saveleft = player.left,
      savetop = player.top;
  y = y || 0;
  scrollWindow(x,y);
  setLeft(player, saveleft, see);
  setTop(player, savetop + y * unitsize, see);
  QuadsKeeper.updateQuadrants();
}