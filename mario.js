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
  resetCanvas();
  resetTriggers();
  
  // These should be placed somewhere else eventually
  window.characters = FSM.GroupHolder.getCharacterGroup();
  window.solids = FSM.GroupHolder.getSolidGroup();
  window.scenery = FSM.GroupHolder.getSceneryGroup();
  window.texts = FSM.GroupHolder.getTextGroup();

  // With that all set, set the map to World11.
  FSM.StatsHolder.set("lives", 3);
  setMap([1,1]);
  FSM.GamesRunner.upkeep();
  document.body.appendChild(FSM.StatsHolder.makeContainer());
  
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
  window.gravity = Math.round(12 * unitsize) / 100; // Typically .48
}

function resetTimer(num) {
  num = roundDigit(num, .001);
  window.timer = window.timernorm = num;
  window.timert2 = num * 2;
  window.timerd2 = num / 2;
}

// Variables regarding the state of the game
// This is called in setMap to reset everything
function resetGameState(nocount) {
  // HTML is reset here
  FSM.clearAllTimeouts();
  window.nokeys = window.spawning = window.spawnon =
    window.notime = window.qcount = window.lastscroll = 0;
  window.gameon = window.speed = 1;
  // Keep a history of pressed keys
  window.gamehistory = [];
  // Clear audio
  FSM.AudioPlayer.pause();
}