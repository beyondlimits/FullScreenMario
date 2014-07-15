/* mario.js */
// Starts everything.

function startFSM() {
    var time_start = Date.now();
  
    window.FSM = new FullScreenMario();
  
  // Thanks, Obama...
  ensureLocalStorage();
  
  // Know when to shut up
  window.verbosity = { Maps: false, Sounds: false };
  
  console.warn("checks like requestAnimationFrame use 16.667 as window.timer");
  window.requestAnimationFrame = window.requestAnimationFrame
                           || window.mozRequestAnimationFrame
                           || window.webkitRequestAnimationFrame
                           || window.msRequestAnimationFrame
                           || function(func) { setTimeout(func, 16.667); };
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
  resetCanvas();
  resetTriggers();
  
  // These should be placed somewhere else eventually
  window.characters = FSM.GroupHolder.getCharacterGroup();
  window.solids = FSM.GroupHolder.getSolidGroup();
  window.scenery = FSM.GroupHolder.getSceneryGroup();
  window.texts = FSM.GroupHolder.getTextGroup();

  // With that all set, set the map to World11.
  FSM.StatsHolder.set("lives", 3);
  FSM.setMap("1-1");
  FSM.GamesRunner.upkeep();
  document.body.appendChild(FSM.StatsHolder.makeContainer());
  
  console.log("It took " + (Date.now() - time_start) + " milliseconds to start.");
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