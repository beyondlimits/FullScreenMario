/* mario.js */
// Starts everything.

function startFSM() {
    var time_start = Date.now();
  
    window.FSM = new FullScreenMario();
  
  // Thanks, Obama...
  ensureLocalStorage();
  
  console.warn("Timer is still often replaced with 16.667");

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
  FSM.gameStart();
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

// Resets the main canvas and context
function resetCanvas() {
    // The global canvas is one that fills the screen
    var canvas = FSM.getCanvas(innerWidth, innerHeight, true);
    
    FSM.PixelDrawer.setCanvas(canvas);
    document.body.appendChild(canvas);
}